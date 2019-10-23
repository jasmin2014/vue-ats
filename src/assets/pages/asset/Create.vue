<template>
  <div class="create">
    <asset :loan-customer="loanCustomer"
           :loan-application="loanApplication"
           :proof-materials="proofMaterials"
           :mode="mode"
           :error="error"
           @save="handleSave"></asset>
  </div>
</template>

<script>
  import Asset from '../../../modules/assets/Asset.vue'
  import {mapState} from 'vuex'
  import {
    createPersonLoan,
    createOrgLoan,
    getProjectNameOptions,
    getServiceFeeRateByIntentionFund,
    getProtectionPlanListByModel
  } from '../../api/asset'
  import { getCollectionCardList } from '../../api/finance';
  import {getPicUrls} from '../../../api/common';

  export default {
    data() {
      return {
        mode: 'CREATE',
        showDialog: false,
        loanCustomer: {
          name: '',
          ident: '',
          identType: this.$enum.IDENT_TYPE_IDENTITY,
          applicantPerson: {},
          propCarDTO: {},
          propHouseDTO: {},
          propDeviceDTO: {},
          propShopDTO: {},
          propElectronicCommerceDTO: {},
          propPublicReserveFunds: [],
          relationships: [],
          friendships: [],
          materials: [],
          legal: {
            identKind: this.$enum.IDENT_TYPE_IDENTITY
          },
          stocks: []
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
        error: {}
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
          this.getServiceFeeRate(this.projectType, val);
          this.getProtectionPlanList(this.protectionModel, val);
        }
      },
      projectType(val, oldVal) {
        if (val !== oldVal) {
          this.getServiceFeeRate(val, this.intentionFund);
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
      this.$set(this.loanApplication, 'kind', this.$enum.LOAN_PROP_NEW);
      this.$set(this.loanApplication, 'newLoanKind', this.$enum.LOAN_PROP_SUB_NEW);
    },

    methods: {
      handleSave(val) {
        let promise = {};
        if (val.loanApplication && val.loanApplication.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
          promise = createPersonLoan(val);
        } else if (val.loanApplication && val.loanApplication.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
          promise = createOrgLoan(val);
        }
        promise.then(({ data }) => {
          if (data.code === 201) {
            const id = data.message;
            this.$router.replace({
              name: 'AssetApplyEdit',
              params: { id, from: 'create' }
            })
          } else {
            this.$message.error(data.message);
          }
        }).catch(({status, data}) => {
          if (status === 400 && data.type === 'object') {
            this.error = data.body
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
      getServiceFeeRate(projectType, intentionFund) {
        if (!projectType || !intentionFund) {
          this.$store.commit('application/updateServiceFeeRate', undefined);
          return;
        }
        getServiceFeeRateByIntentionFund({
          assetOrg: this.assetOrg,
          loanProp: this.$enum.LOAN_PROP_NEW,
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
            data.body = data.body || [];
            const keys = data.body.map(_ => _.fileUrl);
            this.getFiles(keys).then(() => {
              data.body.forEach((item, i) => {
                if (item.fileUrl) {
                  item.fileUri = data.body[i];
                }
              });
              this.$store.commit('application/updateProtectionPlanList', data.body || [])
            });
          }
        })
      },
      getFiles(keys) {
        return new Promise((resolve) => {
          getPicUrls(keys).then(({ data }) => {
            if (data.code === 200) {
              resolve(data.body);
            }
          })
        })
      }
    },
    components: {
      Asset
    }
  }
</script>
