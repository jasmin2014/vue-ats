// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '../pages/index.css'
import '../pages/style.scss'
import '../lib/polyfill'
import Vue from 'vue'
import Vuex from 'vuex';
import Router from 'vue-router'
import ElementUI from 'element-ui'
import App from './App.vue'
import Global from '../lib/global'
import states from '../vuex/store'
import routes from './router';
import {getOrgChainDetail} from './api/org';
import Utils from '../lib/method';

const isDebugMode = NODE_ENV === 'development';
Vue.config.devtools = isDebugMode;
Vue.config.productionTip = isDebugMode;
console.log(NODE_ENV);
console.log(process.env.NODE_ENV);
Vue.use(Vuex);
Vue.use(Router);
Vue.use(ElementUI);
Vue.use(Global);

getOrgChainDetail().then(({ data }) => {
  if (!data.body || !data.body.nodeUrl) {
    routes[0].children = routes[0].children.slice(0, 2)
  } else {
    Utils.$setLocalStorage('node', data.body.nodeUrl);
  }
  const router = new Router({ routes });
  const store = new Vuex.Store(states);

  store.commit('saveRoute', {
    routes: routes[0].children
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
}).catch(() => {
});
