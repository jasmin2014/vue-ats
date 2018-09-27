<template>
  <asset :info="detail"
         :material="material"
         :fee="fee"
         :mode="mode"
         :risk="risk"
         @fee-phase-change="handleFeePhaseChange"></asset>
</template>

<script>
  import Asset from '../../../../modules/assets/Asset.vue';
  import {getLoanApplication, getLoanRemark, getProofMaterialList, getFeeList} from '../../../api/assetMgt';  // getFinishedLoanApplication
  import {getCustomerPropList} from '../../../api/customer';

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
      this.$set(this.fee, 'phase', this.$enum.FEE_PHASE_INITIAL);
      this.getData(this.id);
      this.risk = {
        riskLevel: this.$route.query.level,
        reportUrl: ''
      }
    },
    methods: {
      handleFeePhaseChange(phase) {
        if (phase !== this.fee.phase) {
          this.fee.phase = phase;
          this.getFeeList(this.id, phase)
        }
      },
      getData(id) {
        this.getLoanDetail(id);
        this.getFeeList(id, this.fee.phase);
        this.getMaterialList(id);
      },
      getLoanDetail(loanId) {
        this.getLoanApplication(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.detail = res.body;
            getLoanRemark(loanId).then(({ data }) => {
              if (data.code === 200) {
                this.$set(this.detail, 'remarkList', data.body)
              }
            }, () => {
            });
            getCustomerPropList(res.body.loanParty, this.$enum.CUSTOMER_PROP_CARD).then(({ data }) => {
              if (data.code === 200) {
                this.$set(this.detail, 'cardList', data.body);
              }
            }, () => {
            });
          } else if (res.code === 204) {
            this.$message.error('借贷申请不存在');
            this.$router.go(-1)
          } else {
            this.$message.error(res.message);
          }
        }, () => {
        });
      },
      getLoanApplication(loanId) {
        return getLoanApplication(loanId)
        /*if (this.$route.query.type === 'performance') {
         return getFinishedLoanApplication(loanId)
         } else {
         return getLoanApplication(loanId)
         }*/
      },
      getFeeList(loanId, phase) {
        getFeeList(loanId, phase).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$set(this.fee, 'list', res.body);
          }
        }, () => {
        })
      },
      getMaterialList(loanId) {
        getProofMaterialList(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.material = res.body;
          }
        }, () => {
        })
      }
    },
    components: {
      Asset
    }
  }
</script>
