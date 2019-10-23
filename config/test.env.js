var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"testing"',
  'process.env': {
    NODE_ENV: '"testing"'
  },
  APP_ID: '"uccc652d2d13a2e131"', // 用户中心appId
  APP_SECRET: '"c1a063637da44929bde662a7f91c1e78"', // 用户中心appSecret
  U_CENTER_BASE_URL: '"http://ucenter.fengdai.org/gateway/foundation-user"',
  U_CENTER_TENANT_URL: '"http://ucenter.fengdai.org/gateway/foundation-tenant"',
  QINIU_UPLOAD_URL: '"http://upload.qiniu.com"'
});
