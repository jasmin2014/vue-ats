<template>
  <upload-asset class="upload-edit"
                :loan-customer="loanCustomer"
                :loan-application="loanApplication"
                :proof-materials="proofMaterials"
                :fee="fee"
                :mode="mode"
                :error-msg="errorMsg"
                is-upload
                @save="handleSave"></upload-asset>
</template>

<script>
  import {
    getUploadAssetDetail,
    editUploadPersonLoan,
    editUploadOrgLoan,
    getProtectionPlanListByModel,
    getProjectNameOptions,
    getServiceFeeRateByIntentionFund
  } from '../../../api/asset';
  import { getCollectionCardList } from '../../../api/finance';
  import UploadAsset from '../../../../modules/assets/Asset';
  import {mapState} from 'vuex';
  let uploadNo;

  export default {
    data() {
      return {
        mode: 'CREATE',
        id: this.$route.params.id,
        errorMsg: [],
        loanCustomer: {
          applicantPerson: {},
          propCarDTO: {},
          propHouseDTO: {},
          propDeviceDTO: {},
          propShopDTO: {},
          propElectronicCommerceDTO: {},
          propPublicReserveFunds: [],
          relationships: [],
          friendships: [],
          materials: []
        },
        loanApplication: {
          loanPartyKind: this.$enum.SUBJECT_PROP_PERSON,
          assetKind: '',
          projectName: '',
          repayWay: '',
          loanModel: '',
          repayModel: ''
        },
        proofMaterials: {
          pdfs: [],
          originals: []
        },
        fee: {}
      }
    },
    computed: {
      ...mapState({
        intentionFund: state => state.application.intentionFund,
        projectType: state => state.application.projectType,
        protectionModel: state => state.application.protectionModel,
        assetOrg: state => state.user.orgId
      })
    },
    watch: {
      intentionFund(val, oldVal) {
        if (val !== oldVal) {
          this.getCollectionCardList(val);
          this.getServiceFeeRate(this.projectType, val, this.loanApplication.kind);
          this.getProtectionPlanList(this.protectionModel, val);
        }
      },
      projectType(val, oldVal) {
        if (val !== oldVal) {
          this.getServiceFeeRate(val, this.intentionFund, this.loanApplication.kind);
        }
      },
      protectionModel(val, oldVal) {
        if (val !== oldVal) {
          this.getProtectionPlanList(val, this.intentionFund);
        }
      }
    },

    created() {
      this.getProjectNameOptions();
    },
    mounted() {
      this.getData(this.id)
    },

    methods: {
      handleSave(val) {
        this.$confirm('上传成功后，客户姓名、证件号码、手机号码、所在省份和所在城市将不能修改，确定保存上传?', '提示', {
          type: 'warning',
          confirmButtonText: '保存并上传'
        }).then(() => {
          console.log(val);

          val.loanCustomer = val.loanOrgCustomer || val.loanPersonCustomer || {};

          // 筛选收费信息
          // const initialFeeList = val.feeList.filter(_ => _.phase === this.$enum.FEE_PHASE_INITIAL);
          const midtermFeeList = val.feeList.filter(_ => _.phase === this.$enum.FEE_PHASE_MIDTERM);
          const terminalFeeList = val.feeList.filter(_ => _.phase === this.$enum.FEE_PHASE_TERMINAL);

          // 图片信息
          const pics = val.proofMaterials.reduce((prev, curr, index) => {
            if (prev[curr.kind] instanceof Array) {
              prev[curr.kind].push(curr)
            } else {
              prev[curr.kind] = [curr]
            }
            return prev;
          }, {});

          const detail = {
            loanPartyKind: val.loanApplication.loanPartyKind,
            pics
          };

          let modelName = '';
          if (detail.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
            modelName = 'customerAssetImportModel';
            detail[modelName] = {};
            detail[modelName].loanPersonCustomerBaseDTO = val.loanCustomer;
            detail[modelName].propPublicReserveFundsDTO = val.loanCustomer.propPublicReserveFunds && val.loanCustomer.propPublicReserveFunds.length ? val.loanCustomer.propPublicReserveFunds[0] : null;
            detail[modelName].partyPersonWorkHisDTO = val.loanCustomer.loanPersonCustomerWorkHisDTO;
            detail[modelName].relationship = val.loanCustomer.relationships && val.loanCustomer.relationships.length ? val.loanCustomer.relationships[0] : null;
            detail[modelName].friendship = val.loanCustomer.friendships && val.loanCustomer.friendships.length ? val.loanCustomer.friendships[0] : null;
          } else if (detail.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
            modelName = 'orgCustomerAssetImportModel';
            detail[modelName] = {};
            detail[modelName].loanOrgCustomerBase = val.loanOrgCustomer;
            detail[modelName].applicantPerson = val.loanOrgCustomer.applicantPerson;
            detail[modelName].legalPerson = val.loanOrgCustomer.legal;
            detail[modelName].propStocks = val.loanOrgCustomer.stocks || null;
          }

          detail[modelName] = {
            loanApplicationDTO: val.loanApplication,
            propCarDTO: val.loanCustomer.propCarDTO,
            propHouseDTO: val.loanCustomer.propHouseDTO,
            propDeviceDTO: val.loanCustomer.propDeviceDTO,
            propElectronicCommerceDTO: val.loanCustomer.propElectronicCommerceDTO,
            propShopDTO: val.loanCustomer.propShopDTO,
            // initialFee: initialFeeList.length ? initialFeeList[0] : null,
            midtermFee: midtermFeeList.length ? midtermFeeList[0] : null,
            terminalFee: terminalFeeList.length ? terminalFeeList[0] : null,
            ...detail[modelName]
          };

          this.saveInfo(detail);
        }, () => {})
      },
      saveInfo(detail) {
        this.errorMsg = [];
        let promise = {};
        if (detail.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
          promise = editUploadPersonLoan(this.id, uploadNo, detail)
        } else if (detail.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
          promise = editUploadOrgLoan(this.id, uploadNo, detail)
        }
        promise.then(({data}) => {
          if (data.code === 200) {
            this.$message({
              message: '上传成功',
              type: 'success'
            });
            this.$router.back();
          } else {
            this.$message.error(data.message);
          }
        }).catch(({data, status}) => {
          if (status === 400) {
            getUploadAssetDetail(this.id).then((res) => {
              if (res.data.code === 200) {
                this.errorMsg = res.data.body.errorInfo;
              }
            })
          }
        })
      },

      getData(id) {
        getUploadAssetDetail(id).then(({data}) => {
          if (data.code === 200) {
            this.errorMsg = data.body.errorInfo;
            const pics = data.body.pics || {};
            const model = data.body.assetImportModel;
            uploadNo = data.body.uploadNo;

            // 申请信息
            model.loanApplicationDTO = {
              ...model.loanApplicationDTO,
              ...model.loanApplicationDTO.loanApplicationRate
            };

            this.loanApplication = model.loanApplicationDTO;

            // 客户信息
            let customer = {};
            if (model.loanApplicationDTO.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
              customer = model.loanPersonCustomerBaseDTO;
              customer.relationships = model.relationship ? [model.relationship] : [];
              customer.friendships = model.friendship ? [model.friendship] : [];
              customer.loanPersonCustomerWorkHisDTO = model.partyPersonWorkHisDTO || {};
              customer.materials = pics[this.$enum.PROOF_MATERIAL_P_ID_CARD] || [];
              this.loanCustomer = customer;
            } else if (model.loanApplicationDTO.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
              customer = model.loanOrgCustomerBase;
              customer.applicantPerson = model.applicantPerson;
              customer.stocks = model.propStocks;
              customer.legal = model.legalPerson;
              this.loanCustomer = customer;
              this.$nextTick(() => { // 蜜汁问题，不set展示不出证明材料
                this.$set(this.loanCustomer, 'materials', pics[this.$enum.PROOF_MATERIAL_O_OTHER]);
              })
            }

            // 资产信息
            if (model.propCarDTO) {
              model.propCarDTO.materials = pics[this.$enum.CUSTOMER_PROP_CAR] || [];
              this.$set(this.loanCustomer, 'propCarDTO', model.propCarDTO);
            }
            if (model.propHouseDTO) {
              model.propHouseDTO.materials = pics[this.$enum.CUSTOMER_PROP_HOUSE] || [];
              this.$set(this.loanCustomer, 'propHouseDTO', model.propHouseDTO);
            }
            if (model.propDeviceDTO) {
              model.propDeviceDTO.materials = pics[this.$enum.CUSTOMER_PROP_DEVICE] || [];
              this.$set(this.loanCustomer, 'propDeviceDTO', model.propDeviceDTO);
            }
            if (model.propShopDTO) {
              model.propShopDTO.materials = pics[this.$enum.CUSTOMER_PROP_SHOP] || [];
              this.$set(this.loanCustomer, 'propShopDTO', model.propShopDTO);
            }
            if (model.propElectronicCommerceDTO) {
              model.propElectronicCommerceDTO.materials = pics[this.$enum.CUSTOMER_PROP_ESHOP] || [];
              this.$set(this.loanCustomer, 'propElectronicCommerceDTO', model.propElectronicCommerceDTO);
            }
            if (model.propPublicReserveFundsDTO) {
              this.$set(this.loanCustomer, 'propPublicReserveFunds', model.propPublicReserveFundsDTO ? [model.propPublicReserveFundsDTO] : []);
            }

            // 证明材料
            this.proofMaterials.pdfs = pics[this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF] || [];
            this.proofMaterials.originals = pics[this.$enum.PROOF_MATERIAL_P_LOAN_APP] || [];

            // 收费信息
            const feeList = [];
            // if (model.initialFee) {
            //   feeList.push(model.initialFee)
            // }
            if (model.midtermFee) {
              feeList.push(model.midtermFee)
            }
            if (model.terminalFee) {
              feeList.push(model.terminalFee)
            }
            this.$set(this.fee, 'allList', feeList);
          }
        })
      },
      getProjectNameOptions() {
        getProjectNameOptions().then(({ data }) => {
          if (data.code === 200) {
            const list = data.body ? data.body.map(_ => ({
              text: _.projectName,
              value: _.id,
              extraData: {
                assetKind: _.assetKind,
                projectType: _.projectType,
                riskSwitch: _.riskSwitch
              }
            })) : [];
            this.$store.commit('application/updateProjectNameList', list);
          }
        })
      },
      getCollectionCardList(intentionFund) {
        if (!intentionFund) {
          this.$store.commit('application/updateCollectionCardList', []);
          return;
        }
        getCollectionCardList(intentionFund, this.$enum.BANK_USE_TYPE_COLLECTION).then(({ data }) => {
          if (data.code === 200 && data.body) {
            const list = data.body.map(_ => ({
              text: `${_.bankCard}（${_.name}）`,
              value: _.bankCard,
              extraData: {
                collectionAccount: _.name,
                collectionAccountId: _.bankUserId
              }
            }));
            this.$store.commit('application/updateCollectionCardList', list)
          }
        })
      },
      getServiceFeeRate(projectType, intentionFund, loanProp) {
        if (!projectType || !intentionFund) {
          this.$store.commit('application/updateServiceFeeRate', undefined);
          return;
        }
        getServiceFeeRateByIntentionFund({
          assetOrg: this.assetOrg,
          loanProp,
          projectType,
          ownerOrg: intentionFund
        }).then(({ data }) => {
          if (data.code === 200) {
            this.$store.commit('application/updateServiceFeeRate', data.body)
          }
        })
      },
      getProtectionPlanList(protectionModel, fundOrg) {
        if (!protectionModel || !fundOrg) {
          this.$store.commit('application/updateProtectionPlanList', []);
          return;
        }
        getProtectionPlanListByModel({
          protectionModel,
          fundOrg
        }).then(({ data }) => {
          if (data.code === 200) {
            this.$store.commit('application/updateProtectionPlanList', data.body || [])
          }
        })
      }
    },
    components: {
      UploadAsset
    }
  }
</script>

<style lang="scss">
  .upload-edit {
    .individual {
      .el-card {
        box-shadow: none;
        border: none;

        .el-card__body {
          padding: 0;
        }
      }
    }
  }
</style>
