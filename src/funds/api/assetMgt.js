import http from '../../lib/http';

/** =============== 借贷申请 =============== **/
export const getAssetList = (params) => {
  return http.funds.get('v2/loan-application/page', {
    params
  })
};
export const downloadLoanApplicationList = (params) => {
  return http.funds.get('/v2/loan-application/_download', {
    params
  })
};
// 查询备注
export const getLoanRemark = (loanId) => {
  return http.funds.get(`/v1/assets-audit/audit-remarks/${loanId}`)
};
// 收纳
export const storeAsset = (loanIds) => {
  return http.funds.put('/v2/loan-application/_storage', loanIds)
};
/** 统计 **/
export const getAssetTotal = params => {
  return http.funds.get('/v2/loan-application/count/loan-amount', {
    params
  })
};
/** 详情 **/
export const getLoanApplication = (loanId) => {
  return http.funds.get(`/v2/loan-application/${loanId}`)
};
export const getProofMaterialList = (loanId) => {
  return http.funds.get(`v2/proof-material/${loanId}`)
};
export const getFeeList = (loanApplication, phase) => {
  return http.funds.get('/v1/fee', {
    params: {
      loanApplication,
      phase
    }
  });
};
// 保障方案
export const getProtection = (planId) => {
  return http.funds.get(`/v2/protection-plan/${planId}`)
};

/** =============== 收纳列表 =============== **/
export const getStoreList = (params) => {
  return http.funds.get('/v1/storage-manager/page', {
    params
  })
};
// 详情
export const getStoreDetail = (id) => {
  return http.funds.get('/v1/storage-manager/' + id)
};
// 反馈
export const feedback = (loanId, reason) => {
  return http.funds.post('/v2/loan-application/_feed-back', {
    loanId,
    reason
  })
};
/** 统计 **/
export const getStoreTotal = params => {
  return http.funds.get('/v1/storage-manager/count/loan-amount', {
    params
  })
};
/** 查询开户状态 **/
export const queryOpenStatus = (loanId) => {
  return http.funds.get(`/v2/loan-application/_query/${loanId}`)
};

/** =============== 已收纳列表 =============== **/
export const getStoredList = (params) => {
  return http.funds.get('/v2/accepted-asset', {
    params
  })
};

/** =============== 推送 =============== **/
export const batchPushLoan = (loanIds, personalInfo) => {
  return http.funds.put('/v2/loan-application/_push', {
    loanIds,
    personalInfo
  })
};
export const getPicDetail = (loanId) => {
  return http.funds.get(`/v2/proof-material/mosaic/${loanId}`)
};
export const cutPdfToPic = (id) => {
  return http.funds.post(`/v2/proof-material/_cut/pdf/${id}`)
};
export const saveMosaicPic = (loanId, originalId, file) => {
  return http.funds.post(`/v2/proof-material/${loanId}/${originalId}`, file)
};
export const deleteMosaicPic = (id) => {
  return http.funds.delete(`/v2/proof-material/${id}`)
};
export const getCustomizedFieldByParty = (loanId, projectName, loanPartyKind) => {
  return http.funds.get('/v2/channel/individuation/_find-required-column', {
    params: {
      loanId,
      projectName,
      loanPartyKind
    }
  })
};
export const getPushLoanDetail = (loanId) => {
  return http.funds.get(`/v2/channel/individuation/loan/${loanId}`)
};

/** =============== 资产准入设置 =============== **/
export const getLoanConfig = () => {
  return http.funds.get('/v1/loan/config/detail')
};
export const saveLoanConfig = (data) => {
  return http.funds.post('/v1/loan/config', data)
};

/** =============== 产品验证配置 =============== **/
export const getCustomizedParams = () => {
  return http.funds.get('/v2/channel/individuation')
};
export const getCustomizedParamsByProjectName = (projectName) => {
  return http.funds.get('/v2/channel/individuation/_find-list-by-project-name', {
    params: { projectName }
  })
};
export const createCustomizedParams = (data) => {
  return http.funds.post('/v2/channel/individuation', data)
};
export const deleteCustomizedParam = (id) => {
  return http.funds.delete(`/v2/channel/individuation/${id}`)
};

/** =============== 服务费用配置 =============== **/
export const getRateConfig = () => {
  return http.funds.get('/v2/service/fee/rate')
};
export const editRateConfig = (id, feeRate) => {
  return http.funds.put('/v2/service/fee/rate', {
    id,
    feeRate
  })
};
export const createRateConfig = (data) => {
  return http.funds.post('/v2/service/fee/rate', data)
};
export const deleteRateConfig = (id) => {
  return http.funds.delete(`/v2/service/fee/rate/${id}`)
};
