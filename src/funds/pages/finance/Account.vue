<template>
  <div class="account">
    <h4><span>账户信息</span></h4>
    <account-info v-for="(account, index) in accountList" :key="index"
                  v-model="account.data"
                  :type="account.acTitle"
                  :is-open="account.isOpenAccount"
                  @open="handleOpenAccount"
                  @bind="handleBind"
                  @recharge="handleRecharge"
                  @withdraw="handleWithdraw"
                  :business="business"></account-info>
    <h4><span>交易记录</span></h4>
    <transaction :list="transactionList"
                 :params="transactionParams"
                 @current-change="getTransactionData"></transaction>
  </div>
</template>

<script>
  import AccountInfo from '../../../modules/finance/AccountInfo.vue';
  import Transaction from '../../../modules/finance/Transaction';
  import {getAccountList, getTransactionList, openAccount, recharge} from '../../api/finance';

  export default {
    components: {
      AccountInfo,
      Transaction
    },
    data() {
      return {
        business: this.$enum.BUSINESS_FUND,
        accountList: [],
        transactionList: [],
        transactionParams: {
          pageSize: 20,
          pageNumber: 1,
          pageTotal: 0
        }
      }
    },
    created() {
      this.getAccountData();
      this.getTransactionData(1);
    },
    methods: {
      handleOpenAccount(acTitle) {
        openAccount(acTitle).then(({ data }) => {
          if (data.code === 201) {
            this.getAccountData();
          }
        }, () => {})
      },
      handleBind(acTitle) {
        this.$router.push({
          name: 'FinanceAccountBind',
          params: {
            type: acTitle
          }
        })
      },
      handleRecharge({ type: acTitle, amount }) {
        recharge({ acTitle, amount }).then(({ data }) => {
          if (data.code === 200) {
            this.baofooRecharge(data.body.execType, data.body.execData);
          }
        }).catch(() => {})
      },
      handleWithdraw({ balance, acTitle, bankCard }) {
        this.$router.push({
          name: 'FinanceAccountWithdraw',
          params: {
            type: acTitle
          },
          query: {
            b: encodeURIComponent(balance),
            c: encodeURIComponent(bankCard)
          }
        });
      },
      handleChangePage(index) {
        this.getTransactionData(index);
      },
      getAccountData() {
        getAccountList().then(({data}) => {
          if (data.code === 200) {
            if (data.body.length > 0) {
              this.accountList = data.body;
            }
          }
        }).catch(() => {})
      },
      getTransactionData(pageNumber) {
        const params = { pageNumber, pageSize: this.transactionParams.pageSize };
        getTransactionList(params).then(({data}) => {
          if (data.code === 200 && data.body) {
            this.transactionList = data.body.list || [];
            const tParams = this.transactionParams;
            tParams.pageNumber = pageNumber;
            tParams.pageTotal = data.body.totalRecord;
          } else {
            this.transactionList = [];
            this.transactionParams.pageTotal = 0;
          }
        }).catch(() => {
          this.transactionList = [];
          this.transactionParams.pageTotal = 0;
        })
      },
      baofooRecharge(type, url) {
        if (type === 'url') {
          window.open(url);
          const h = this.$createElement;
          this.$alert(h('div', null, [
            h('p', {style: 'text-align: center; font-size: 18px; line-height: 40px; border-bottom: 1px solid #ebeef5'}, '请您在新打开的支付页面上完成付款'),
            h('ol', {style: 'color: #888; line-height: 1.8'}, [
              h('li', null, '若未看到新窗口，请检查是否为浏览器拦截造成；'),
              h('li', null, '不同银行到账时间不同，请耐心等待。若银行提示成功后 15 分钟仍未到账，请联系在线客服或电话客服 0571-96056')
            ])
          ]), '充值提示', {
            confirmButtonText: '已完成充值'
          }).then(() => {
            location.reload();
          });
        }
      }
    }
  }
</script>
