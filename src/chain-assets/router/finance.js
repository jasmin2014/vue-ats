import Public from '../../components/layout/Public'
import FinanceRepayList from '../pages/finance/RepayList'
import FinanceAccount from '../pages/finance/Account'
import FinanceAccountBind from '../pages/finance/AccountBind'
import FinanceAccountWithdraw from '../pages/finance/AccountWithdraw'
import FinanceAccountWithdrawStatus from '../../modules/finance/WithdrawStatus'

export default {
  path: 'finance',
  name: 'Finance',
  redirect: 'finance/repay',
  component: Public,
  meta: {
    title: '财务管理',
    show: true
  },
  children: [
    {
      path: 'repay',
      name: 'FinanceRepay',
      redirect: 'repay/list',
      component: Public,
      meta: {
        title: '还款明细',
        show: true
      },
      children: [
        {
          path: 'list',
          name: 'FinanceRepayList',
          component: FinanceRepayList,
          meta: {
            title: '列表',
            show: true
          }
        }
      ]
    },
    {
      path: 'account',
      name: 'FinanceAccount',
      redirect: 'account/info',
      component: Public,
      meta: {
        title: '账户中心',
        show: true
      },
      children: [
        {
          path: 'info',
          name: 'FinanceAccountInfo',
          component: FinanceAccount,
          meta: {
            title: '查看',
            show: true
          }
        },
        {
          path: 'bind/:type',
          name: 'FinanceAccountBind',
          component: FinanceAccountBind,
          meta: {
            title: '绑卡',
            show: true
          }
        },
        {
          path: 'withdraw/:type',
          name: 'FinanceAccountWithdraw',
          component: FinanceAccountWithdraw,
          meta: {
            title: '提现',
            show: true
          }
        },
        {
          path: 'withdraw-:status',
          name: 'FinanceAccountWithdrawStatus',
          component: FinanceAccountWithdrawStatus,
          meta: {
            title: '提现',
            show: true
          }
        }
      ]
    }
  ]
}
