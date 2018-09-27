<template>
  <asset :info="detail"
         :material="material"
         :fee="fee"
         :mode="mode"
         :risk="risk"
         :type="this.$enum.BUSINESS_FUND"></asset>
</template>

<script>
  import Asset from '../../../../modules/assets/Asset.vue';
  import {getLoanApplication, getLoanRemark, getProofMaterialList, getFeeList} from '../../../api/assetMgt';
  import {getCustomerPropList} from '../../../api/customer';
  import {getProtectionPlanByLoanId} from '../../../../api/enum';

  export default {
    data() {
      return {
        mode: 'VIEW',
        id: this.$route.params.id,
        detail: {},
        material: [],
        fee: {},
        risk: {}
      }
    },
    mounted() {
      this.getData(this.id);
    },
    methods: {
      getData(id) {
        this.getLoanDetail(id);
        this.getFeeList(id);
        this.getMaterialList(id);
      },
      getLoanDetail(loanId) {
        getLoanApplication(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.detail = res.body;
            this.risk = {
              assetRiskLevel: res.body.assetRiskLevel,
              riskAssessmentUrl: res.body.riskAssessmentUrl
            };
            getLoanRemark(loanId).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'remarkList', data.body)
              }
            }, () => {});
            getCustomerPropList(res.body.loanParty, this.$enum.CUSTOMER_PROP_CARD).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'cardList', data.body);
              }
            }, () => {});
            getProtectionPlanByLoanId(loanId).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'protectionList', data.body)
              }
            }, () => {})
          } else if (res.code === 204) {
            this.$message.error('借贷申请不存在');
            this.$router.go(-1)
          } else {
            this.$message.error(res.message);
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
