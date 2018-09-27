import Public from '../../components/layout/Public'
import OrgDetail from '../pages/org/Detail'

export default {
  path: 'org',
  name: 'Org',
  redirect: 'org/',
  component: Public,
  meta: {
    title: '机构管理',
    show: true
  },
  children: [
    {
      path: '',
      name: 'OrgInfo',
      redirect: 'detail',
      component: Public,
      meta: {
        title: '机构信息',
        show: true
      },
      children: [
        {
          path: 'detail',
          name: 'OrgDetail',
          component: OrgDetail,
          meta: {
            title: '查看',
            show: true
          }
        }
      ]
    }
  ]
}
