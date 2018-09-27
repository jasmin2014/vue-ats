import http from '../../lib/http';

/** =============== 借贷申请 =============== **/
export const getBorrowList = (params) => {
  return http.funds.get('v1/loan-application/page', {
    params
  })
};
export const downloadLoanApplicationList = (params) => {
  return http.funds.get('/v1/loan-application/_download', {
    params
  })
};
export const getLoanRemark = (loanId) => {
  return http.funds.get(`/v1/assets-audit/audit-remarks/${loanId}`)
};
export const putBorrowAcceptList = (loanIds) => {
  return http.funds.put('/v1/loan-application/_storage', loanIds)
};
// 详情
export const getLoanApplication = (loanId) => {
  return http.funds.get(`/v1/loan-application/${loanId}`)
};
export const getProofMaterialList = (loanId) => {
  return http.funds.get(`v1/proof-material/${loanId}`)
};
export const getFeeList = (loanApplication, phase) => {
  return http.funds.get('/v1/fee', {
    params: {
      loanApplication,
      phase
    }
  });
};

/** =============== 收纳列表 =============== **/
export const getAcceptList = (params) => {
  return http.funds.get('/v1/storage-manager/page', {
    params
  })
};
export const postPayment = (params) => {
  return http.funds.post('/v1/ppvt/payment', params);
};
// 详情
export const getStoredDetail = (id) => {
  return http.funds.get('/v1/storage-manager/' + id)
};
// 推送
export const pushLoanApplication = (loanId, personalInfo) => {
  return http.funds.put(`/v1/loan-application/${loanId}/_push`, personalInfo)
};
export const getPicDetail = (loanId) => {
  return http.funds.get(`/v1/proof-material/mosaic/${loanId}`)
};
export const saveMosaicPic = (loanId, originalId, file) => {
  return http.funds.post(`/v1/proof-material/${loanId}/${originalId}`, file)
};
export const deleteMosaicPic = (id) => {
  return http.funds.delete(`/v1/proof-material/${id}`)
};
export const getCustomizedFieldByParty = (loanPartyId, projectName) => {
  return http.funds.get('/v1/channel/individuation/_find-required-column', {
    params: {
      loanPartyId,
      projectName
    }
  })
};

/** =============== 资产标的 =============== **/
export const getAssetList = (params) => {
  return http.funds.get('/v1/ppvt/candidate', {
    params
  })
};

/** =============== 资产准入设置 =============== **/
export const getCitiesByRegions = (regins) => {
  return http.common.get('/v1/enums/region/names?regions=' + regins)
};
export const getLoanConfig = () => {
  return http.funds.get('/v1/loan/config/detail')
};
export const postLoanConfig = (params) => {
  return http.funds.post('/v1/loan/config', params)
};

/** =============== 产品验证配置 =============== **/
export const getCustomizedParams = () => {
  return http.funds.get('/v1/channel/individuation')
};
export const getCustomizedParamsByProjectName = (projectName) => {
  return http.funds.get('/v1/channel/individuation/_find-list-by-project-name', {
    params: { projectName }
  })
};
export const createCustomizedParams = (data) => {
  return http.funds.post('/v1/channel/individuation', data)
};
export const deleteCustomizedParam = (id) => {
  return http.funds.delete(`/v1/channel/individuation/${id}`)
};
