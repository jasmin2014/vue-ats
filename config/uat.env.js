var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"pre-release"',
  'process.env': {
    NODE_ENV: '"pre-release"'
  },
  APP_ID: '"ucad3c030bf810d3d0"', // 用户中心appId
  APP_SECRET: '"a310e03a9d244c7f8ecd11732a1d5bc5"', // 用户中心appSecret
  U_CENTER_BASE_URL: '"https://uat-ucenter.trc.com/gateway/foundation-user"',
  U_CENTER_TENANT_URL: '"https://uat-ucenter.trc.com/gateway/foundation-tenant"',
  QINIU_UPLOAD_URL: '"https://up.qbox.me"'
});
