var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"testing"',
  'process.env': {
    NODE_ENV: '"production"'
  },
  APP_ID: '"uc2e821082bd68b33c"', // 用户中心appId
  APP_SECRET: '"c46f2facff8341319a74f4055efef151"', // 用户中心appSecret
  U_CENTER_BASE_URL: '"http://ucenter.trc.com/gateway/foundation-user"'
});
