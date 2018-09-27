// 运营管理
import http from '../../lib/http'

/** ========== 放款记录 =============== **/
// 放款记录列表
export const getLoanList = (params) => {
  return http.center.get('v1/ppvt/payment', {
    params
  })
};
// 放款记录下载
export const downloadLoanList = (params) => {
  return http.center.get('v1/ppvt/payment/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationLoanDownload']
    }
  })
};
/** ========== 还款计划 =============== **/
// 还款计划列表
export const getRepayList = (params) => {
  return http.center.get('/v1/repay-plan/page', {
    params
  })
};
// 还款详情
export const repayDetail = (loanApplication) => {
  return http.center.get(`/v1/ppvt/repay/_find-repay-plan?loanApplication=${loanApplication}`)
};
// 还款下载
export const downloadRepayList = (params) => {
  return http.center.get('/v1/repay-plan/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationPlanDownload']
    }
  })
};
/** ========== 实还账单 =============== **/
// 列表
export const getActualBillList = (params) => {
  return http.center.get('/v1/ppvt/bill/_search-account-bill', { params })
};
// 实还账单下载
export const downloadActualBillList = (params) => {
  return http.center.get('/v1/ppvt/bill/_download-account-bill', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationActualBillDownload']
    }
  })
};
/** ========== 应还账单 =============== **/
// 列表
export const getShouldRepayBillList = (params) => {
  return http.center.get('/v1/ppvt/bill/_search-receivable-bill', { params })
};
// 应还账单下载
export const downloadShouldRepayBillList = (params) => {
  return http.center.get('/v1/ppvt/bill/_download-receivable-bill', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationPlannedBillDownload']
    }
  })
};
