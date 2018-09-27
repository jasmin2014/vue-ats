import Public from '../../components/layout/Public'
import AssetApplyList from '../pages/asset/ApplyList'
import AssetApplyCreate from '../pages/asset/ApplyCreate'
import AssetApplyEdit from '../pages/asset/ApplyEdit'
import AssetApplyDetail from '../pages/asset/ApplyDetail'
import AssetApplyPreview from '../pages/asset/ApplyPreview'
import AssetFinishList from '../pages/asset/FinishList'
import AssetFinishDetail from '../pages/asset/FinishDetail'

export default {
  path: 'asset',
  name: 'Asset',
  redirect: 'asset/apply',
  component: Public,
  meta: {
    title: '资产信息',
    show: true
  },
  children: [
    {
      path: 'apply',
      name: 'AssetApply',
      redirect: 'apply/list',
      component: Public,
      meta: {
        title: '借贷申请信息',
        show: true
      },
      children: [
        {
          path: 'list',
          name: 'AssetApplyList',
          component: AssetApplyList,
          meta: {
            title: '列表',
            show: true
          }
        },
        {
          path: 'create',
          name: 'AssetApplyCreate',
          component: AssetApplyCreate,
          meta: {
            title: '新增',
            show: true
          }
        },
        {
          path: 'edit/:id',
          name: 'AssetApplyEdit',
          component: AssetApplyEdit,
          meta: {
            title: '编辑',
            show: true
          }
        },
        {
          path: 'detail/:id',
          name: 'AssetApplyDetail',
          component: AssetApplyDetail,
          meta: {
            title: '详情',
            show: true
          }
        },
        {
          path: 'preview/:id',
          name: 'AssetApplyPreview',
          component: AssetApplyPreview,
          meta: {
            title: '详情',
            show: true
          }
        }
      ]
    },
    {
      path: 'finish',
      name: 'AssetFinish',
      redirect: 'finish/list',
      component: Public,
      meta: {
        title: '履约资产信息',
        show: true
      },
      children: [
        {
          path: 'list',
          name: 'AssetFinishList',
          component: AssetFinishList,
          meta: {
            title: '列表',
            show: true
          }
        },
        {
          path: 'detail/:id',
          name: 'AssetFinishDetail',
          component: AssetFinishDetail,
          meta: {
            title: '详情',
            show: true
          }
        }
      ]
    }
  ]
}
