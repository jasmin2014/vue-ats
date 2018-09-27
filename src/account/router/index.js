import Login from '../components/Login.vue'
import User from '../components/User.vue'
import Reset from '../components/Reset.vue'
import Modify from '../components/Modify.vue'

export default {
  base: '/account/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/reset',
      name: 'Reset',
      component: Reset,
      meta: {
        type: 'reset'
      }
    },
    {
      path: '/active',
      name: 'Active',
      component: Reset,
      meta: {
        type: 'active'
      }
    },
    // {
    //   path: '/user',
    //   name: 'User',
    //   component: User
    // },
    // {
    //   path: '/modify',
    //   name: 'Modify',
    //   component: Modify
    // },
    {
      path: '**',
      redirect: '/'
    }
  ]
}
