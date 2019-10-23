// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '../pages/index.css'
import '../pages/style.scss'
import '../lib/polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import App from './App.vue'
import Global from '../lib/global'
import states from '../vuex/store'
import {getMenu} from './api/account'

const isDebugMode = NODE_ENV !== 'production';
Vue.config.devtools = isDebugMode;
Vue.config.productionTip = isDebugMode;
Vue.use(Vuex);
Vue.use(Router);
Vue.use(ElementUI);
Vue.use(Global);

getMenu().then(({data}) => {
  const routes = data.body.routes;
  const router = new Router({ routes });
  const store = new Vuex.Store(states);

  store.commit('saveRoute', {
    routes: data.body.routes[0].children,
    buttons: data.body.buttons
  });

  router.beforeEach((to, from, next) => {
    if (from.meta.exit) {
      if (confirm(from.meta.exit)) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  });

  router.afterEach((to, from) => {
    if (document.querySelector('.layout')) {
      document.querySelector('.layout').scrollTop = 0;
      document.querySelector('.layout').scrollLeft = 0;
    }
    if (to.meta.exit) {
      window.onbeforeunload = () => {
        return to.meta.exit;
      }
    } else {
      window.onbeforeunload = null;
    }
  });

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {
      App
    }
  });
}, () => {});
