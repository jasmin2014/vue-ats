<template>
  <upload-asset class="upload-detail"
                :loan-customer="loanCustomer"
                :loan-application="loanApplication"
                :proof-materials="proofMaterials"
                :fee="fee"
                :mode="mode"
                :error-msg="errorMsg"
                is-upload></upload-asset>
</template>

<script>
  import {
    getUploadAssetDetail,
    getProtectionConfig,
    getProjectNameOptions,
    getServiceFeeRateByIntentionFund
  } from '../../../api/asset';
  import UploadAsset from '../../../../modules/assets/Asset';
  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        mode: 'VIEW',
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
          // this.getCollectionCardList(val);
          this.getServiceFeeRate(this.projectType, val, this.loanApplication.kind);
        }
      },
      projectType(val, oldVal) {
        if (val !== oldVal) {
          this.getServiceFeeRate(val, this.intentionFund, this.loanApplication.kind);
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
      getData(id) {
        getUploadAssetDetail(id).then(({data}) => {
          if (data.code === 200) {
            this.errorMsg = data.body.errorInfo;
            const pics = data.body.pics || {};
            const model = data.body.assetImportModel;

            // 申请信息
            model.loanApplicationDTO = {
              ...model.loanApplicationDTO,
              ...model.loanApplicationDTO.loanApplicationRate
            };

            if (model.loanApplicationDTO.planId) {
              this.getProtectionPlan(model.loanApplicationDTO.planId).then((plan) => {
                model.loanApplicationDTO.protectionModel = plan.protectionModel;
                this.loanApplication = model.loanApplicationDTO;
              }).catch(() => {
                this.loanApplication = model.loanApplicationDTO;
              });
            } else {
              this.loanApplication = model.loanApplicationDTO;
            }

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
              setTimeout(() => { // 蜜汁问题
                this.$set(this.loanCustomer, 'materials', pics[this.$enum.PROOF_MATERIAL_O_OTHER]);
              }, 200)
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
      getProtectionPlan(planId) {
        return new Promise((resolve, reject) => {
          getProtectionConfig(planId).then(({ data }) => {
            if (data.code === 200 && data.body) {
              const list = [];
              list.push(data.body);
              this.$store.commit('application/updateProtectionPlanList', list);
              resolve(data.body)
            } else {
              reject();
            }
          }).catch(() => {
            reject()
          })
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
      }
    },
    components: {
      UploadAsset
    }
  }
</script>

<style lang="scss">
  .upload-detail {
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
