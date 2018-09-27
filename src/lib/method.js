import {MessageBox} from 'element-ui'

/**
 * 深拷贝
 * @param {Object | Array} obj
 * @returns {Object | Array}
 */
const $deepcopy = function (obj) {
  return JSON.parse(JSON.stringify(obj))
};

/**
 * 对象过滤(原理同数组filter)
 * @param {Object} obj
 * @param {Function} predicate 是否过滤回调
 * @returns {Object}
 */
const $objFilter = function (obj, predicate) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key]
    }
  }
  return result;
};
/**
 * 对象过滤(原理同数组filter)
 * @param {Object} obj
 * @param {Function} predicate 是否过滤回调
 * @returns {Object}
 */
const $objClean = function (obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] === null || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj;
};

/**
 * 以JSON字符串存储value到LocalStorage
 * @param {String} key
 * @param {Object | String | Number | Boolean} value
 */
const $setLocalStorage = function (key, value) {
  const event = new Event('setLocalStorageEvent');
  event.key = key;
  event.newValue = value;
  window.dispatchEvent(event);

  window.localStorage[key] = JSON.stringify(value)
};

/**
 * 读取LocalStorage，setLocalStorage镜像方法
 * @param {String} key
 * @returns {Object | String | Number | Boolean}
 */
const $getLocalStorage = function (key) {
  return JSON.parse(window.localStorage[key] || null)
};

/**
 * 移除LocalStorage中的某项
 * @param {String} key
 */
const $removeLocalStorage = function (key) {
  window.localStorage.removeItem(key)
};

/**
 * 浮点数加法
 * @param {Number} num1 加数
 * @param {Number} num2 被加数
 * @returns {Number}
 */
const $floatPlus = function (num1, num2) {
  const splits1 = String(num1).split('.');
  const splits2 = String(num2).split('.');
  const bits = Math.max(splits1.length > 1 ? splits1[1].length : 0, splits2.length > 1 ? splits2[1].length : 0)
  const scale = Math.pow(10, bits);
  return ($floatMultiply(num1, scale) + $floatMultiply(num2, scale)) / scale
};

/**
 * 浮点数减法
 * @param {Number} num1 减数
 * @param {Number} num2 被减数
 * @returns {Number}
 */
const $floatMinus = function (num1, num2) {
  return $floatPlus(num1, -num2)
};

/**
 * 浮点数乘法
 * @param {Number} num 乘数(浮点数)
 * @param {Number} multiplier 被乘数
 * @returns {Number}
 */
const $floatMultiply = function (num, multiplier) {
  const splits = String(num).split('.');
  const integer = Number(splits.join(''));
  const scale = Math.pow(10, splits.length > 1 ? splits[1].length : 0);
  return integer * multiplier / scale
};

/**
 * 浮点数除法
 * @param {Number} num 除数(浮点数)
 * @param {Number} divider 被除数
 * @returns {Number}
 */
const $floatDivide = function (num, divider) {
  const splits = String(num).split('.');
  const integer = Number(splits.join(''));
  const scale = Math.pow(10, splits.length > 1 ? splits[1].length : 0);
  return integer / (scale * divider)
};

/**
 * 浮点数转换为百分比
 * @param {Number} val
 * @returns {String} 包含%的百分比
 */
const $floatToPercentage = function (val) {
  if (val !== null && typeof Number(val) === 'number') {
    return isNaN(val) ? val : $floatMultiply(Number(val), 100) + '%';
  } else if (val) {
    return val + '%';
  }
  return val;
};

/**
 * 加密显示身份证号(5-14位)
 * @param {String} str 身份证号
 * @returns {String}
 */
const $encodeIdNo = function (str) {
  if (typeof str === 'string') {
    return str.replace(/^.{4}(.+).{4}$/, (match, p1, offset, string) => {
      return string.replace(p1, '**********')
    })
  } else {
    return str;
  }
};

/**
 * 过滤布尔值或01为文字
 * @param {Boolean | Number} val
 * @param {String} trueText val为true或1时的文字
 * @param {String} falseText val为false或0时的文字
 * @returns {String | *} 过滤后文字
 */
const $filterBoolean = function(val, trueText, falseText) {
  const num = Number(val);
  return num === 1 ? trueText : (num === 0 ? falseText : val)
};

/**
 * 数组转换为十进制数字
 * e.g. [0,2,5] -> 100101 -> 37
 * @param {Array} array
 * @returns {Number}
 */
const $arrayToBinary = function (array) {
  let binary = 0;
  for (const i of array) {
    binary += Math.pow(2, i)
  }
  return binary
};

/**
 * 十进制数字转换为数组，arrayToBinary镜像方法
 * e.g. 37 -> 100101 -> [0,2,5]
 * @param {Number} binary
 * @returns {Array}
 */
const $binaryToArray = function (binary) {
  const array = [];
  let bit = 0;
  while (binary !== 0) {
    const flag = binary - (binary >> 1 << 1);
    if (flag) {
      array.push(bit);
    }
    binary = binary >> 1;
    bit++;
  }
  return array
};

const IS_URL = /^http(s)?:/;
/**
 * str是否是链接
 * @param {String} str 需要判断的字符串
 * @returns {Boolean}
 */
const $isUrl = function (str) {
  return IS_URL.test(str)
};

/**
 * 预览一组图片
 * @param {Array} files 图片列表, {name: <图片名称>, url: <图片地址>}
 * @param {Number} index 预览从第几张图片开始
 * @returns {*}
 */
const $preview = function (files, index = 0) {
  const h = this.$createElement;
  const message = [];
  for (let i = 0; i < files.length; i++) {
    if (index === i) {
      message.push(h('img', {
        attrs: {src: files[i].url, alt: files[i].name}
      }))
    } else {
      message.push(h('img', {
        attrs: {src: files[i].url, alt: files[i].name},
        style: {display: 'none'}
      }))
    }
  }
  const previewPrev = function () {
    if (index > 0) {
      document.querySelectorAll('.message-preview .img-list img')[index].style.display = 'none';
      document.querySelectorAll('.message-preview .img-list img')[--index].style.display = 'block'
    }
  };
  const previewNext = function () {
    if (index < files.length - 1) {
      document.querySelectorAll('.message-preview .img-list img')[index].style.display = 'none';
      document.querySelectorAll('.message-preview .img-list img')[++index].style.display = 'block'
    }
  };
  const cancelPreview = function () {
    document.querySelector('.message-preview .el-button.el-button--default.el-button--small').click()
  };
  const previewClickHandler = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.clientX === 0) return;
    const ratio = e.clientX / document.body.clientWidth;
    if (ratio <= 0.4 && index > 0) {
      previewPrev()
    } else if (ratio >= 0.6 && index < files.length - 1) {
      previewNext()
    } else {
      cancelPreview()
    }
  };
  const cursorHandler = function (e) {
    window.requestAnimationFrame(() => {
      const ratio = e.clientX / document.body.clientWidth;
      if (ratio <= 0.4 && index !== 0) {
        this.classList.remove('next');
        this.classList.remove('zoom-out');
        this.classList.add('prev')
      } else if (ratio >= 0.6 && index !== files.length - 1) {
        this.classList.remove('prev');
        this.classList.remove('zoom-out');
        this.classList.add('next')
      } else {
        this.classList.remove('prev');
        this.classList.remove('next');
        this.classList.add('zoom-out')
      }
    })
  };
  const bindEvent = function () {
    if (document.querySelector('.message-preview')) {
      document.querySelector('.message-preview').onmousemove = cursorHandler;
      document.querySelector('.message-preview').onclick = previewClickHandler;
    } else {
      setTimeout(bindEvent, 200)
    }
  };
  setTimeout(bindEvent);
  const defaultOptions = {
    customClass: 'message-preview',
    message: h('div', {class: 'img-list'}, message),
    dangerouslyUseHTMLString: true,
    showCancelButton: false,
    showConfirmButton: false,
    beforeClose: (action, instance, done) => {
      document.querySelector('.message-preview').onmousemove = null;
      document.querySelector('.message-preview').onclick = null;
      done();
    },
    callback: (action, instance) => {
      instance.message = '';
    }
  };
  return MessageBox(defaultOptions);
};

window.URL = window.URL || window.webkitURL || window.mozURL;
/**
 * 创建文件blob地址
 * @param {Blob} file
 * @returns {String}
 */
const $createObjectURL = function (file) {
  return window.URL.createObjectURL(file)
};
/**
 * 回收blob地址
 * @param {String} url
 */
const $revokeObjectURL = function (url) {
  window.URL.revokeObjectURL(url)
};

/**
 * DataURL转换为Blob文件
 * @param dataUrl
 * @returns {Blob}
 */
const $dataURL2Blob = function (dataUrl) {
  const mime = dataUrl.split(',')[0].match(/:(.*?);/)[1];
  let url = dataUrl.split(',')[1];
  url = window.atob(url);
  const u8arr = new Uint8Array(url.length);
  for (let i = 0; i < url.length; i++) {
    u8arr[i] = url.charCodeAt(i);
  }
  return new Blob([u8arr], {type: mime});
};

const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const utf8Encode = function (str) {
  str = str.replace(/\r\n/g, '\n');
  let utftext = '';
  for (let n = 0; n < str.length; n++) {
    let c = str.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if ((c > 127) && (c < 2048)) {
      utftext += String.fromCharCode((c >> 6) | 192);
      utftext += String.fromCharCode((c & 63) | 128);
    } else {
      utftext += String.fromCharCode((c >> 12) | 224);
      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
      utftext += String.fromCharCode((c & 63) | 128);
    }

  }
  return utftext;
};
const utf8Decode = function (text) {
  let string = '', i = 0, c = 0, c1 = 0, c2 = 0, c3 = 0;
  while (i < text.length) {
    c = text.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c2 = text.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = text.charCodeAt(i + 1);
      c3 = text.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return string;
};
const $encode = function (str) {
  let output = '';
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
  str = utf8Encode(str);
  while (i < str.length) {
    chr1 = str.charCodeAt(i++);
    chr2 = str.charCodeAt(i++);
    chr3 = str.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output +
      keyStr.charAt(enc1) + keyStr.charAt(enc2) +
      keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }
  return output;
};
const $decode = function (text) {
  let output = '';
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
  text = text.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  while (i < text.length) {
    enc1 = keyStr.indexOf(text.charAt(i++));
    enc2 = keyStr.indexOf(text.charAt(i++));
    enc3 = keyStr.indexOf(text.charAt(i++));
    enc4 = keyStr.indexOf(text.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  output = utf8Decode(output);
  return output;
};

/**
 * 将接口数据转换为vue路由
 * @param {Array} data 处理过的menu接口数据
 * @param {Object} map vue组件name到组件的映射
 * @returns {Array} 路由数组
 */
const $menuTransformer = function (data, map) {
  if (typeof data === 'object' && data instanceof Array) {
    const ret = data.filter(_ => _.structureType !== 'BUTTON' && map[_.name]);
    ret.forEach((_, index) => {
      const children = _.children ? _.children.filter(__ => __.auth) : [];
      ret[index] = {
        path: _.url || '',
        name: _.name,
        component: map[_.name],
        redirect: _.auth ? (children.length > 0 && !_.noRedirect ? (`${_.url ? _.url + '/' : ''}${children[0].url}`) : undefined) : '/error/401',
        meta: {
          title: _.tname,
          show: _.auth && _.structureType === 'MENU',
          action: _.actionCode === undefined ? 'undefined' : _.actionCode
        },
        children: _.children ? $menuTransformer(_.children, map) : null
      };
    });
    return ret;
  } else {
    return []
  }
};

/**
 * 按钮权限
 * @param {Object} data menu接口数据
 * @returns {Object} 对应有权限的name
 */
const $buttonAuths = function (data) {
  const ret = {};
  if (typeof data === 'object' && data instanceof Array) {
    $dfs(data, _ => {
      if (_.auth && (_.structureType === 'BUTTON' || _.structureType === 'PAGE')) {
        ret[_.name] = _.actionCode;
      }
    });
  }
  return ret;
};

import {getFileList} from '../api/common';
/**
 * 公共下载方法
 * @param {Promise} promise 调用下载接口的返回promise
 * @param store vuex状态
 */
const $download = function (promise = {}, store) {
  promise.then((response) => {
    if (response.status === 200) {
      this.$message({
        message: '已添加到下载队列',
        type: 'success'
      });
      if (store) {
        const params = {
          pageSize: 10,
          pageNumber: 1
        };
        store.commit('updateDownloadLoadStatus', true);
        getFileList(params).then(({data}) => {
          if (data.code === 200 && data.body) {
            data.body.pageSize = params.pageSize;
            store.commit('updateDownloads', data.body);
            store.commit('updateDownloadLoadStatus', false);
          }
        })
      }
    }
  }).catch(() => {})
};

/**
 * 深度优先遍历
 * @param {Array} parent 父节点的所有children
 * @param callback 对children的回调函数
 */
const $dfs = function (parent, callback = null) {
  parent && parent.forEach((item) => {
    typeof callback === 'function' && callback(item);
    if (item.children && item.children.length) {
      $dfs(item.children, callback)
    }
  })
};

/**
 * 日期格式化为yyyy-MM-dd字符串
 * @param {Date} date
 * @return {String} yyyy-MM-dd
 */
const $dateStringify = function (date) {
  const yyyy = date.getFullYear();
  const MM = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const dd = date.getDate();
  return `${yyyy}-${MM}-${dd}`;
};

const $lastNMonth = function (date, n = 1) {
  return new Date(date.getTime() - 3600 * 1000 * 24 * 30 * n)
};

/**
 * 返回date所在月第一天的日期yyyy-MM-dd字符串
 * @param {Date} date
 * @return {String} yyyy-MM-01
 */
const $firstDayOfMonth = function (date) {
  const yyyy = date.getFullYear();
  const MM = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const dd = '01';
  return `${yyyy}-${MM}-${dd}`;
};

let $router = null;
const $saveRouterInstance = function (router) {
  $router = router;
};
const $getRouterInstance = function () {
  return $router
};

let $store = null;
const $saveStoreInstance = function (store) {
  $store = store;
};
const $getStoreInstance = function () {
  return $store
};

import {logout} from '../api/account';
const $logout = function (onComplete = null) {
  logout().then(() => {
    this.$removeLocalStorage('token');
    this.$removeLocalStorage('type');
    if (typeof onComplete === 'function') {
      onComplete()
    }
  }).catch(() => {
    this.$removeLocalStorage('token');
    this.$removeLocalStorage('type');
    if (typeof onComplete === 'function') {
      onComplete()
    }
  })
};

export default {
  $deepcopy,
  $objFilter,
  $objClean,
  $setLocalStorage,
  $getLocalStorage,
  $removeLocalStorage,
  $floatPlus,
  $floatMinus,
  $floatMultiply,
  $floatDivide,
  $floatToPercentage,
  $encodeIdNo,
  $filterBoolean,
  $arrayToBinary,
  $binaryToArray,
  $isUrl,
  $preview,
  $createObjectURL,
  $revokeObjectURL,
  $dataURL2Blob,
  $encode,
  $decode,
  $menuTransformer,
  $buttonAuths,
  $download,
  $dfs,
  $dateStringify,
  $lastNMonth,
  $firstDayOfMonth,
  $saveRouterInstance,
  $getRouterInstance,
  $saveStoreInstance,
  $getStoreInstance,
  $logout
}
