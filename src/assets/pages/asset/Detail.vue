<template>
  <asset :info="detail"
         :material="material"
         :fee="fee"
         :mode="mode"
         :type="this.$enum.BUSINESS_ASSET"></asset>
</template>

<script>
  import Asset from '../../../modules/assets/Asset.vue'
  import {
    getLoanApplication,
    getFinishedLoanApplication,
    getLoanRemark,
    getProofMaterialList,
    getFeeList
  } from '../../api/asset'
  import {getCustomerBindCardList} from '../../api/customer'
  import {getProtectionPlanByLoanId} from '../../../api/enum'

  export default {
    data() {
      return {
        mode: 'VIEW',
        id: this.$route.params.id,
        detail: {},
        material: [],
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
        this.getMaterialList(id);
      },
      getLoanDetail(loanId) {
        this.getLoanApplication(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            res.body.loanIdent = this.$encodeIdNo(res.body.loanIdent);
            this.detail = res.body;
            getLoanRemark(loanId).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'remarkList', data.body)
              }
            }, () => {});
            getCustomerBindCardList(res.body.loanParty).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'cardList', data.body);
              }
            }, () => {});
            getProtectionPlanByLoanId(loanId).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'protectionList', data.body)
              }
            }, () => {});
          } else if (res.code === 204) {
            this.$message({
              message: '借贷申请不存在',
              type: 'error'
            });
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.message,
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
      getFeeList(loanId) {
        getFeeList(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$set(this.fee, 'allList', res.body);
          }
        }, () => {})
      },
      getMaterialList(loanId) {
        getProofMaterialList(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.material = res.body;
          }
        }, () => {})
      }
    },
    components: {
      Asset
    }
  }
</script>
