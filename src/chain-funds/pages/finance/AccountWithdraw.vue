<template>
  <div class="withdraw">
    <h4><span>{{ $filter(type, $enum.ACCOUNT_TYPE, business) }}</span></h4>
    <el-card>
      <withdraw v-model="formData"
                :balance="balance"
                :error="error"
                @withdraw="handleWithdraw"></withdraw>
    </el-card>
  </div>
</template>

<script>
  import Withdraw from '../../../modules/finance/Withdraw';
  import { withdraw } from '../../api/finance';

  export default {
    data() {
      return {
        type: this.$route.params.type,
        business: this.$enum.BUSINESS_FUND,
        balance: Number(decodeURIComponent(this.$route.query.b)),
        formData: {
          bankCard: decodeURIComponent(this.$route.query.c)
        },
        error: {}
      }
    },
    methods: {
      handleWithdraw(formData) {
        formData.acTitle = this.type;
        this.withdraw(formData)
      },
      withdraw(val) {
        withdraw(val).then(({ data }) => {
          if (data.code === 200) {
            this.$router.replace({
              name: 'FinanceAccountWithdrawStatus',
              params: {
                status: 'success'
              }
            })
          }
        }).catch(({ status, data }) => {
          if (status !== 401) {
            if (data.code === 400 && data.type === 'object') {
              this.error = data.body;
            }
          }
        })
      }
    },
    components: {
      Withdraw
    }
  }
</script>
