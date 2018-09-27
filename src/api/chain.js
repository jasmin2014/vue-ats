import http from '../lib/http_chain';

export const getOrgPublicKey = function () {
  return http.common.get('/v1/org_info')
};

export const editPublicKey = function (publicKey) {
  return http.common.post('/v1/org_info/secret_key/modify', { publicKey })
};

export const resetPublicKey = function () {
  return http.common.post('/v1/org_info/secret_key/reset', {})
};

export const getAccountInfo = function () {
  return http.common.get('/v1/org_info/balance')
};

export const getTransactions = function () {
  return http.common.get('/v1/org_info/token-flow')
};
