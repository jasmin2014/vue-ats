// 资产审核
import http from '../../lib/http'

/** =========== 风控审核 ========== **/
export const getRiskLst = (params) => {
  return http.center.get('/v2/audit/record/_auditing-page', {
    params
  })
};
// 重新获取风控
export const generateData = (id) => {
  return http.center.post(`/v2/audit/record/${id}/_execute`)
};
export const executeRisk = (id) => {
  return http.center.post(`/v2/audit/record/shikra/risk/${id}`)
};
// 审核通过
export const pass = (auditId, loanId) => {
  return http.center.post('/v2/audit/record/_manual-audit', {
    id: auditId,
    loanId
  })
};
// 反馈
export const feedback = (auditId, loanId, reason) => {
  return http.center.post('/v2/audit/record/_feed-back', {
    id: auditId,
    loanId,
    reason
  })
};
// 详情
export const getRiskDetail = (loanId) => {
  return http.center.get(`/v2/audit/record/detail/${loanId}`)
};

/** =========== 审核记录 ========== **/
export const getAuditRecordList = (params) => {
  return http.center.get('/v2/audit/record/_audit-record-page', {
    params
  })
};
export const downloadAuditRecord = (params) => {
  return http.center.get('/v2/audit/record/_download-audit-pass-record', {
    params
  })
};

// 详情
export const getRecordDetail = (loanId) => {
  return http.center.get(`/v2/audit/record/detail/snapshot/${loanId}`)
};

/** =========== 资产审核记录 ========== **/
export const getAuditAssetList = (params) => {
  return http.center.get('/v2/examine/record/_audit-pass-page', {
    params
  })
};

/** =========== 审核设置 ========== **/
export const getAuditSetting = () => {
  return http.center.get('/v2/audit/setting/_find-audit-setting-list')
};
export const createAuditOrg = (data) => {
  return http.center.post('/v2/audit/setting/_add-audit-setting', data)
};
export const deleteAuditOrg = (id) => {
  return http.center.delete(`/v2/audit/setting/${id}`)
};

/** =========== 风控统计 ========== **/
export const getRiskPie = (params) => {
  return http.center.post('/v2/center-statistics/level', params)
};
export const getRiskLine = (params) => {
  return http.center.post('/v2/center-statistics/broken-line', params)
};
