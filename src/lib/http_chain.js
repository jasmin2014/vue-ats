import axios from 'axios';
import {Loading} from 'element-ui';
import Utils from './method';
import Handler from './http_handler';

function createHttpInstance(baseURL) {
  const http = axios.create({
    baseURL,
    timeout: 30000
  });

  // http请求拦截器
  let loadingInstance;

  http.interceptors.request.use(config => {
    // element ui Loading方法
    if (!loadingInstance || !document.querySelector('.el-loading-mask')) {
      loadingInstance = window.loadingInstance = Loading.service({
        fullscreen: true,
        background: 'rgba(255,255,255,.4)'
      });
    }
    return Handler.requestSuccessHandler(config);
  }, () => {
    setTimeout(() => {
      loadingInstance.close();
    });
    return Handler.requestErrorHandler();
  });
  // http响应拦截器
  http.interceptors.response.use(response => { // 响应成功关闭loading
    setTimeout(() => {
      loadingInstance.close();
    });
    return Handler.responseSuccessHandler(response);
  }, error => {
    setTimeout(() => {
      loadingInstance.close();
    });
    return Handler.responseErrorHandler(error);
  });
  return http;
}

// export default {
//   common: createHttpInstance('common/'),
//   assets: createHttpInstance('assets/'),
//   funds: createHttpInstance('funds/')
// }

function getBaseURL(nodeUrl, route) {
  return `${nodeUrl}/api/${route}`
}

function HTTP(nodeUrl) {
  this.httpCommon = createHttpInstance(getBaseURL(nodeUrl, 'common/'));
  this.httpAssets = createHttpInstance(getBaseURL(nodeUrl, 'assets/'));
  this.httpFunds = createHttpInstance(getBaseURL(nodeUrl, 'funds/'));

  window.addEventListener('setLocalStorageEvent', (e) => {
    if (e.key === 'node' && this.node !== e.newValue) {
      const url = e.newValue;
      this.httpCommon.defaults.baseURL = getBaseURL(url, 'common/');
      this.httpAssets.defaults.baseURL = getBaseURL(url, 'assets/');
      this.httpFunds.defaults.baseURL = getBaseURL(url, 'funds/');
    }
  });
}

const nodeUrl = Utils.$getLocalStorage('node');
const http = new HTTP(nodeUrl);

export default {
  common: http.httpCommon,
  assets: http.httpAssets,
  funds: http.httpFunds
}
