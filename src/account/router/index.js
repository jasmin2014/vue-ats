import Login from '../components/Login.vue'
import User from '../components/User.vue'
import Reset from '../components/Reset.vue'
import Modify from '../components/Modify.vue'
import SendEmail from '../components/SendEmail.vue'

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
        type: 'RESET_PASSWORD'
      }
    },
    {
      path: '/active',
      name: 'Activate',
      component: Reset,
      meta: {
        type: 'ACTIVE_USER'
      }
    },
    {
      path: '/send-email/active',
      name: 'ActivateEmail',
      component: SendEmail,
      meta: {
        type: 'ACTIVE_USER'
      }
    },
    {
      path: '/send-email/reset',
      name: 'ResetEmail',
      component: SendEmail,
      meta: {
        type: 'RESET_PASSWORD'
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
