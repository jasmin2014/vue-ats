import http from '../../lib/http_chain';

/** ========= 资产准入设置 =============== **/
// 获取资产准入设置数据接口
export const getLoanConfig = () => {
  return http.funds.get('/v1/loan/config/detail')
};
// 保存设置资产准入接口
export const postLoanConfig = (data) => {
  return http.funds.post('/v1/loan/config/detail', data)
};

export const getStorageList = (params) => {
  return http.funds.get('/v1/storage-manager/page', {
    params
  })
};
export const getOrderLoanDetail = (assetId) => {
  return http.funds.get(`/v1/storage-manager/${assetId}`)
};
export const orderLoan = (data) => {
  return http.funds.post('/v1/storage-manager/confirm', data)
};
export const outputAsset = (assetId) => {
  return http.funds.post('/v1/storage-manager/asset-output', { assetId })
};

export const getLoanList = (params) => {
  return http.funds.get('/v1/loan-assets/page', {
    params
  })
};
export const getLoanDetail = (assetId) => {
  return http.funds.get(`/v1/loan-assets/${assetId}`)
};
