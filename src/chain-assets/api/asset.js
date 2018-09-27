import http from '../../lib/http_chain';

export const getApplyList = (params) => {
  return http.assets.get('/v1/loan-application/page', {
    params
  })
};
export const getFinishList = (params) => {
  return http.assets.get('/v1/performance-loan-application/page', {
    params
  })
};

export const createLoanApplication = (data) => {
  return http.assets.post('/v1/loan-application', data)
};
export const getLoanApplication = (assetId) => {
  return http.assets.get(`/v1/loan-application/${assetId}`)
};
export const editLoanApplication = (assetId, data) => {
  return http.assets.put(`/v1/loan-application/${assetId}`, data)
};
export const deleteLoanApplication = (assetId) => {
  return http.assets.delete(`/v1/loan-application/${assetId}`)
};
export const revokeLoanApplication = (idList) => {
  return http.assets.post('/v1/loan-application/revoke', idList)
};
export const getFinishDetail = (assetId) => {
  return http.assets.get(`/v1/performance-loan-application/${assetId}`)
};
export const getReportHash = (data) => {
  return http.assets.post('/v1/report/importdata', data)
};

// 上链
export const checkUpChain = (idList) => {
  return http.assets.post('/v1/loan-application/can-upper-chain', idList)
};
export const upChain = (idList) => {
  return http.assets.post('/v1/loan-application/upper-chain', idList)
};
export const previewLoanApplication = (assetId) => {
  return http.assets.get(`/v1/loan-application/upper-chain-show/${assetId}`)
};

