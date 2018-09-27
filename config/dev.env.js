var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  'process.env': {
    NODE_ENV: '"development"'
  },
  APP_ID: '"uc3f9ebb0c36a43284"', // 用户中心appId
  APP_SECRET: '"45a62fd2c438431fabd806c56bec3948"', // 用户中心appSecret
  U_CENTER_BASE_URL: '"http://uat-ucenter.tairancloud.com/gateway/foundation-user"'
});
