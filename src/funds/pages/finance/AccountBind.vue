<template>
  <div class="bind">
    <h4><span>{{ $filter(acTitle, $enum.ACCOUNT_TYPE, business) }}</span></h4>
    <card-bind ref="bind"
               @bind="handleCardBind"
               @card-info="handleQueryCardBin"></card-bind>
  </div>
</template>

<script>
  import CardBind from '../../../modules/finance/CardBind';
  import { getCardInfo, authPrivateCard, authPublicCard } from '../../api/finance';

  export default {
    data() {
      return {
        acTitle: this.$route.params.type,
        business: this.$enum.BUSINESS_FUND
      }
    },
    methods: {
      handleCardBind({ accountType, val }) {
        val.acTitle = this.acTitle;
        let promise = {};
        if (accountType === 'private') {
          promise = authPrivateCard(val)
        } else if (accountType === 'public') {
          promise = authPublicCard(val)
        }
        promise.then(({ data }) => {
          if (data.code === 200) {
            this.$alert('认证成功', '信息提示', {
              type: 'success'
            }).then(() => {
              this.$router.replace({
                name: 'FinanceAccountInfo'
              });
            })
          }
        }).catch(({ data }) => {
          this.$alert(`<p>抱歉，实名认证失败！</p><p>${data.message}，请返回修改并重新提交</p>`, '信息提示', {
            type: 'error',
            dangerouslyUseHTMLString: true
          })
        })
      },
      handleQueryCardBin({ accountType, bankCard }) {
        getCardInfo(bankCard).then(({ data }) => {
          if (data.code === 200 && data.body) {
            if (accountType === 'private') {
              this.$refs['bind'].updatePrivateCardBin(data.body);
            } else if (accountType === 'public') {
              this.$refs.bind.updatePublicCardBin(data.body);
            }
          }
        }).catch(() => {})
      }
    },
    components: {
      CardBind
    }
  }
</script>
