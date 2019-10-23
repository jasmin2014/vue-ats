import axios from 'axios';
import {Loading} from 'element-ui';
import Handler from './http_handler';

// http请求拦截器
let loadingInstance;
// 多个请求loading计数器避免请求时间不同导致加载提示提前结束
let ajaxCount = 0;

function createHttpInstance(baseURL) {
  const http = axios.create({
    baseURL: '/api/' + baseURL,
    timeout: 60000
  });

  http.interceptors.request.use(config => {
    ajaxCount++;
    // element ui Loading方法
    if (!loadingInstance || !document.querySelector('.el-loading-mask')) {
      loadingInstance = window.loadingInstance = Loading.service({
        fullscreen: true,
        background: 'rgba(255,255,255,.4)'
      });
    }
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        ...{ _t: new Date().getTime() }
      }
    }
    return Handler.requestSuccessHandler(config);
  }, () => {
    if (--ajaxCount === 0) {
      setTimeout(() => {
        loadingInstance.close();
      });
    }
    return Handler.requestErrorHandler();
  });
  // http响应拦截器
  // http响应拦截器
  http.interceptors.response.use(response => { // 响应成功关闭loading
    if (--ajaxCount === 0) {
      setTimeout(() => {
        loadingInstance.close();
      });
    }
    return Handler.responseSuccessHandler(response);
  }, error => {
    if (--ajaxCount === 0) {
      setTimeout(() => {
        loadingInstance.close();
      });
    }
    return Handler.responseErrorHandler(error);
  });
  return http;
}

export default {
  common: createHttpInstance('common/'),
  center: createHttpInstance('center/'),
  assets: createHttpInstance('assets/'),
  funds: createHttpInstance('funds/'),
  schedule: createHttpInstance('schedule/')
}
