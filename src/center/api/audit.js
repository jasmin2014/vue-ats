// 资产审核
import http from '../../lib/http'

/** =========== 风控审核 ========== **/
export const getRiskLst = (params) => {
  return http.center.get('/v1/risk/audit/page', {
    params
  })
};
export const generateData = (loanId) => {
  return http.center.post(`/v1/risk/audit/${loanId}/_execute`)
};

// 详情
export const getRiskDetail = (loanId) => {
  return http.center.get(`/v1/risk/audit/${loanId}`)
};
// 审核详情列表
export const getReportList = (loanApplicationNo, auditKind) => {
  return http.center.get('/v1/app/asset-data/report', {
    params: {
      loanApplicationNo,
      auditKind
    }
  })
};
