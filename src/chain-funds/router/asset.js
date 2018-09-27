import Public from '../../components/layout/Public'
import AssetAccessSetting from '../pages/asset/AccessSetting'
import AssetOrderSetting from '../pages/asset/OrderSetting'
import AssetOrderList from '../pages/asset/OrderList'
import AssetOrderDetail from '../pages/asset/OrderDetail'
import AssetLoanList from '../pages/asset/LoanList'
import AssetLoanDetail from '../pages/asset/LoanDetail'

export default {
  path: 'asset',
  name: 'Asset',
  redirect: 'access-setting',
  component: Public,
  meta: {
    title: '资产信息',
    show: true
  },
  children: [
    {
      path: 'access-setting',
      name: 'AssetAccessSetting',
      redirect: 'access-setting/edit',
      component: Public,
      meta: {
        title: '资产准入设置',
        show: true
      },
      children: [
        {
          path: 'edit',
          name: 'AssetAccessSettingEdit',
          component: AssetAccessSetting,
          meta: {
            title: '编辑',
            show: true
          }
        }
      ]
    },
    // {
    //   path: 'order-setting',
    //   name: 'AssetOrderSetting',
    //   redirect: 'order-setting/edit',
    //   component: Public,
    //   meta: {
    //     title: '资产下单设置',
    //     show: true
    //   },
    //   children: [
    //     {
    //       path: 'edit',
    //       name: 'AssetOrderSettingEdit',
    //       component: AssetOrderSetting,
    //       meta: {
    //         title: '编辑',
    //         show: true
    //       }
    //     }
    //   ]
    // },
    {
      path: 'order',
      name: 'AssetOrder',
      redirect: 'order/list',
      component: Public,
      meta: {
        title: '下单资产管理',
        show: true
      },
      children: [
        {
          path: 'list',
          name: 'AssetOrderList',
          component: AssetOrderList,
          meta: {
            title: '列表',
            show: true
          }
        },
        {
          path: 'detail/:id',
          name: 'AssetOrderDetail',
          component: AssetOrderDetail,
          meta: {
            title: '详情',
            show: true
          }
        }
      ]
    },
    {
      path: 'loan',
      name: 'AssetLoan',
      redirect: 'loan/list',
      component: Public,
      meta: {
        title: '放款资产管理',
        show: true
      },
      children: [
        {
          path: 'list',
          name: 'AssetLoanList',
          component: AssetLoanList,
          meta: {
            title: '列表',
            show: true
          }
        },
        {
          path: 'detail/:id',
          name: 'AssetLoanDetail',
          component: AssetLoanDetail,
          meta: {
            title: '详情',
            show: true
          }
        }
      ]
    }
  ]
}
