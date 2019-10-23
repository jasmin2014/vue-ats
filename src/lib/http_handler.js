import Utils from './method';
import {Notification, Message} from 'element-ui';

function requestSuccessHandler(config) {
  if (Utils.$getLocalStorage('token')) {
    config.headers['Authorization'] = Utils.$getLocalStorage('token');
  }
  return config;
}
function requestErrorHandler() {
  Notification.error({
    title: '错误',
    message: '加载超时',
    offset: 80
  });
  return Promise.reject();
}

function responseSuccessHandler(response) {
  const {config, data} = response;
  if (data && data.code == 404) {
    console.error(`${config.method.toUpperCase()} ${location.protocol}//${location.host}${config.url} 404 (Not Found)`)
  }
  return response;
}
function responseErrorHandler(error) {
  //  判断请求超时
  if (error.message.indexOf('timeout') !== -1) {
    Message({
      message: '请求超时',
      type: 'error'
    });
    return false;
  }

  const response = error.response;
  if (response) {
    if (response.data instanceof Blob) {
      const fr = new FileReader();
      fr.onload = function() {
        if (typeof this.result === 'string') {
          response.data = JSON.parse(this.result);
        }
        errorHandler(response)
      };
      fr.readAsText(response.data);
    } else {
      errorHandler(response)
    }
  }
  return Promise.reject(response);
}

function errorHandler(response) {
  switch (response.status) {
    case 401:
      if (response.data.code !== 4001003) {
        Utils.$removeLocalStorage('type');
        Utils.$logout(() => {
          location.href = '/account/?redirect=' + encodeURIComponent(location.href);
        });
      } else {
        Utils.$getRouterInstance().replace({name: 'ErrorUnauthorized'})
      }
      break;
    case 400:
      if (response.data && response.data.type === 'object') {
        const message = [];
        for (const k in response.data.body) {
          message.push(`<p>${response.data.body[k]}</p>`)
        }
        Message({
          message: message.join('\n'),
          type: 'error',
          dangerouslyUseHTMLString: true
        })
      } else if (response.data && response.data.message) {
        Message({
          message: response.data.message,
          type: 'error'
        });
      }
      break;
    case 404:
      break;
    case 409:
      if (response.data && response.data.message) {
        Message({
          message: response.data.message,
          type: 'error'
        });
      }
      break;
    case 500:
      Notification.error({
        title: '错误',
        message: '服务器错误',
        offset: 80
      });
      break;
    default:
      if (response.data && response.data.message) {
        Message({
          message: response.data.message,
          type: 'error'
        });
      }
      break;
  }
}

export default {
  requestSuccessHandler,
  requestErrorHandler,
  responseSuccessHandler,
  responseErrorHandler
}
