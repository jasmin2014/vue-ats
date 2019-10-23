// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '../pages/index.css'
import './style.scss'
import '../lib/polyfill'
import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import App from './App.vue'
import routes from './router'

const isDebugMode = NODE_ENV !== 'production';
Vue.config.devtools = isDebugMode;
Vue.config.productionTip = isDebugMode;
Vue.use(Router);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router: new Router(routes),
  template: '<App/>',
  components: { App }
});
