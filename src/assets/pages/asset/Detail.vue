<template>
  <asset :loan-customer="loanCustomer"
         :loan-application="loanApplication"
         :proof-materials="proofMaterials"
         :fee="fee"
         :mode="mode"></asset>
</template>

<script>
  import Asset from '../../../modules/assets/Asset.vue'
  import {
    getLoanApplication,
    getFinishedLoanApplication,
    getLoanRemark,
    getProofMaterialList,
    getFeeList,
    getProtectionConfig,
    getServiceFeeRateByIntentionFund
  } from '../../api/asset'
  import {
    getIndividualDetail,
    getEnterpriseDetail
  } from '../../api/customer';

  export default {
    data() {
      return {
        mode: 'VIEW',
        id: this.$route.params.id,
        loanCustomer: {
          applicantPerson: {},
          propCarDTO: {},
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
          originals: [],
          pdfs: []
        },
        fee: {}
      }
    },

    mounted() {
      this.getData(this.id)
    },

    methods: {
      getData(id) {
        this.getLoanDetail(id);
        this.getFeeList(id);
      },
      getLoanDetail(loanId) {
        this.getLoanApplication(loanId).then(({ data }) => {
          if (data.code === 200) {
            if (!data.body.fundProfitRateService) {
              this.getServiceFeeRate(data.body.projectType, data.body.intentionFund, data.body.kind, true).then(fee => {
                data.body.fundProfitRateService = fee;
                this.loanApplication = data.body;
                if (data.body.planId) {
                  this.getProtectionPlan(data.body.planId);
                }
              }).catch(() => {
                this.loanApplication = data.body;
                if (data.body.planId) {
                  this.getProtectionPlan(data.body.planId);
                }
              });
            } else {
              if (data.body.planId) {
                this.getProtectionPlan(data.body.planId);
              }
              this.loanApplication = data.body;
            }
            this.getRemarkList(loanId);
            this.getCustomerDetail(loanId, data.body.loanPartyKind);
          } else if (data.code === 204) {
            this.$message({
              message: '借贷申请不存在',
              type: 'error'
            });
            this.$router.go(-1)
          } else {
            this.$message({
              message: data.message,
              type: 'error'
            });
          }
        }, () => {});
      },
      getLoanApplication(loanId) {
        if (this.$route.query.type === 'performance') {
          return getFinishedLoanApplication(loanId)
        } else {
          return getLoanApplication(loanId)
        }
      },
      getCustomerDetail(loanId, type) {
        let promise = {};
        switch (type) {
          case this.$enum.SUBJECT_PROP_PERSON:
            promise = getIndividualDetail(loanId);
            break;
          case this.$enum.SUBJECT_PROP_ORGANIZE:
            promise = getEnterpriseDetail(loanId);
            break;
        }
        promise.then(({ data }) => {
          if (data.code === 200) {
            data.body.personDebtInformationList = null;
            data.body.creditDataDTO = null;
            data.body.involvedAppealDTO = null;
            this.loanCustomer = data.body;
            this.getMaterialList(loanId, type);
          } else {
            this.$message.error(data.message);
          }
        }).catch(() => {});
      },
      getMaterialList(loanId, type) {
        getProofMaterialList(loanId).then(({ data }) => {
          if (data.code === 200) {
            const materials = data.body && data.body.loanMaterials;
            if (materials) {
              this.proofMaterials.originals = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP] || [];
              this.proofMaterials.pdfs = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF] || [];

              switch (type) {
                case this.$enum.SUBJECT_PROP_PERSON:
                  if (materials[this.$enum.PROOF_MATERIAL_P_ID_CARD]) {
                    this.$set(this.loanCustomer, 'materials', materials[this.$enum.PROOF_MATERIAL_P_ID_CARD] || []);
                  }
                  break;
                case this.$enum.SUBJECT_PROP_ORGANIZE:
                  let list = [];
                  if (materials[this.$enum.PROOF_MATERIAL_O_LICENSE]) {
                    list = list.concat(materials[this.$enum.PROOF_MATERIAL_O_LICENSE])
                  }
                  if (materials[this.$enum.PROOF_MATERIAL_O_OTHER]) {
                    list = list.concat(materials[this.$enum.PROOF_MATERIAL_O_OTHER])
                  }
                  this.$set(this.loanCustomer, 'materials', list);
                  break;
              }

              if (this.loanCustomer.propCarDTO && materials[this.$enum.CUSTOMER_PROP_CAR]) {
                this.$set(this.loanCustomer.propCarDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_CAR] || []);
              }

              if (this.loanCustomer.propHouseDTO && materials[this.$enum.CUSTOMER_PROP_HOUSE]) {
                this.$set(this.loanCustomer.propHouseDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_HOUSE] || []);
              }

              if (this.loanCustomer.propDeviceDTO && materials[this.$enum.CUSTOMER_PROP_DEVICE]) {
                this.$set(this.loanCustomer.propDeviceDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_DEVICE] || []);
              }

              if (this.loanCustomer.propShopDTO && materials[this.$enum.CUSTOMER_PROP_SHOP]) {
                this.$set(this.loanCustomer.propShopDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_SHOP] || []);
              }

              if (this.loanCustomer.propElectronicCommerceDTO && materials[this.$enum.CUSTOMER_PROP_ESHOP]) {
                this.$set(this.loanCustomer.propElectronicCommerceDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_ESHOP] || []);
              }
            }
          }
        }, () => {})
      },
      getRemarkList(loanId) {
        getLoanRemark(loanId).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.loanApplication, 'remarkList', data.body)
          }
        }, () => {});
      },
      getFeeList(loanId) {
        getFeeList(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$set(this.fee, 'allList', res.body);
          }
        }, () => {})
      },
      getProtectionPlan(planId) {
        getProtectionConfig(planId).then(({ data }) => {
          if (data.code === 200 && data.body) {
            const list = [];
            list.push(data.body);
            this.$store.commit('application/updateProtectionPlanList', list);
          }
        })
      },
      getServiceFeeRate(projectType, intentionFund, loanProp, init = false) {
        return new Promise((resolve, reject) => {
          if (!projectType || !intentionFund) {
            if (init) {
              reject();
            } else {
              this.$store.commit('application/updateServiceFeeRate', undefined);
            }
            return;
          }
          getServiceFeeRateByIntentionFund({
            assetOrg: this.assetOrg,
            loanProp,
            projectType,
            ownerOrg: intentionFund
          }).then(({ data }) => {
            if (data.code === 200) {
              if (init) {
                resolve(data.body);
              } else {
                this.$store.commit('application/updateServiceFeeRate', data.body)
              }
            } else {
              reject();
            }
          }).catch(() => {
            reject();
          })
        })
      },
    },
    components: {
      Asset
    }
  }
</script>
