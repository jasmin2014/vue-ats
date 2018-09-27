import axios from 'axios';
import {Loading} from 'element-ui';
import Handler from './http_handler';

function createHttpInstance(baseURL) {
  const http = axios.create({
    baseURL: '/api/' + baseURL,
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
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        ...{ _t: new Date().getTime() }
      }
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

export default {
  common: createHttpInstance('common/'),
  center: createHttpInstance('center/'),
  assets: createHttpInstance('assets/'),
  funds: createHttpInstance('funds/'),
  chain: createHttpInstance('chain/'),
  chainAssets: createHttpInstance('chain-assets/'),
  chainFunds: createHttpInstance('chain-funds/')
}
