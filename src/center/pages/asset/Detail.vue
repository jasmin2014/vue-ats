<!-- 借贷列表详情 -->
<template>
  <asset :mode="mode"
         :info="detail"
         :material="material"
         :fee="fee"
         :risk="risk"
         :type="this.$enum.BUSINESS_CENTER"></asset>
</template>
<script>
  import Asset from '../../../modules/assets/Asset.vue';
  import {getLoanApplication, getProofMaterialList, getFeeList, getRemarkList} from '../../api/asset';
  import {getCustomerPropList} from '../../api/customer'
  import {getProtectionPlanByLoanId} from '../../../api/enum'

  export default {
    data() {
      return {
        mode: 'VIEW', // 识别查看详情
        id: this.$route.params.id,
        detail: {}, // 基本信息
        material: {}, // 证明材料
        fee: {}, // 收费信息
        risk: {} // 风险等级
      }
    },
    mounted() {
      this.getData(this.id);
    },
    created() {
    },
    methods: {
      getData() {
        this.getLoanApplication();
        this.getProofMaterialList();
        this.getFeeList();
      },
      // 基本信息
      getLoanApplication() {
        getLoanApplication(this.id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            res.body.loanIdent = this.$encodeIdNo(res.body.loanIdent);
            this.detail = res.body;
            this.risk = {
              assetRiskLevel: res.body.assetRiskLevel,
              riskAssessmentUrl: res.body.riskAssessmentUrl
            };
            // 备注信息
            getRemarkList(this.id).then(({ data }) => {
              if (data.code === 200) {
                this.$set(this.detail, 'remarkList', data.body);
              }
            });
            // 银行卡信息
            getCustomerPropList(res.body.loanParty, this.$enum.CUSTOMER_PROP_CARD).then(({ data }) => {
              if (data.code === 200) {
                this.$set(this.detail, 'cardList', data.body);
              }
            });
            getProtectionPlanByLoanId(this.id).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'protectionList', data.body)
              }
            }, () => {});
          } else if (res.code === 204) {
            this.$message({
              message: '借贷申请不存在',
              type: 'error'
            });
            this.$router.go(-1);
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
        }, () => {
        })
      },
      // 证明材料
      getProofMaterialList() {
        getProofMaterialList(this.id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$set(this.material, 'originals', res.body.originals || []);
            this.$set(this.material, 'mosaics', res.body.mosaics || []);
          }
        })
      },
      // 收费信息
      getFeeList() {
        getFeeList(this.id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$set(this.fee, 'allList', res.body);
          }
        })
      }
    },
    components: {
      Asset
    }
  }
</script>
