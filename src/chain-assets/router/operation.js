import Public from '../../components/layout/Public'
import OperationPlanList from '../pages/operation/PlanList'
import OperationPlanDetail from '../pages/operation/PlanDetail'
import OperationPlannedBillList from '../pages/operation/PlannedBillList'
import OperationActualBillList from '../pages/operation/ActualBillList'

export default {
  path: 'operation',
  name: 'Operation',
  redirect: 'operation/plan',
  component: Public,
  meta: {
    title: '运营管理',
    show: true
  },
  children: [
    {
      path: 'plan',
      name: 'OperationPlan',
      redirect: 'plan/list',
      component: Public,
      meta: {
        title: '还款计划',
        show: true
      },
      children: [
        {
          path: 'list',
          name: 'OperationPlanList',
          component: OperationPlanList,
          meta: {
            title: '列表',
            show: true
          }
        },
        {
          path: 'detail/:id',
          name: 'OperationPlanDetail',
          component: OperationPlanDetail,
          meta: {
            title: '详情',
            show: true
          }
        }
      ]
    },
    {
      path: 'planned-bill',
      name: 'OperationPlannedBill',
      redirect: 'planned-bill/list',
      component: Public,
      meta: {
        title: '应还账单',
        show: true
      },
      children: [
        {
          path: 'list',
          name: 'OperationPlannedBillList',
          component: OperationPlannedBillList,
          meta: {
            title: '列表',
            show: true
          }
        }
      ]
    },
    {
      path: 'actual-bill',
      name: 'OperationActualBill',
      redirect: 'actual-bill/list',
      component: Public,
      meta: {
        title: '实还账单',
        show: true
      },
      children: [
        {
          path: 'list',
          name: 'OperationActualBillList',
          component: OperationActualBillList,
          meta: {
            title: '列表',
            show: true
          }
        }
      ]
    }
  ]
}
