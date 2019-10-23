var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  'process.env': {
    NODE_ENV: '"development"'
  },
  APP_ID: '"uc2730c65f6139544e"', // 用户中心appId
  APP_SECRET: '"5644d16b0daa4871ba1d114d6023f0e2"', // 用户中心appSecret
  U_CENTER_BASE_URL: '"http://ucenter.fengdai.org/gateway/foundation-user"',
  U_CENTER_TENANT_URL: '"http://ucenter.fengdai.org/gateway/foundation-tenant"',
  QINIU_UPLOAD_URL: '"http://upload.qiniu.com"'
});
