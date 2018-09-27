import Public from '../../components/layout/Public.vue'
import ErrorNotFound from '../../components/error/NotFound';
import ErrorUnauthorized from '../../components/error/Unauthorized.vue';

export default {
  path: 'error',
  name: 'Error',
  component: Public,
  meta: {
    title: '错误'
  },
  children: [
    {
      path: '404',
      name: 'ErrorNotFund',
      component: ErrorNotFound,
      meta: {
        title: '404'
      }
    },
    {
      path: '401',
      name: 'ErrorUnauthorized',
      component: ErrorUnauthorized,
      meta: {
        title: '401'
      }
    }
  ]
}
