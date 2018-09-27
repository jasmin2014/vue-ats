import http from '../../lib/http';

/** ========== 还款计划 =============== **/
export const getRepayList = (params) => {
  return http.chainFunds.get('v1/repay-plan/page', {
    params
  })
};
export const downloadRepayList = (params) => {
  return http.chainFunds.get('v1/repay-plan/_download', {
    params
  })
};
export const getRepayDetail = (loanApplication) => {
  return http.chainFunds.get('v1/ppvt/repay/_find-repay-plan', {
    params: {
      loanApplication
    }
  })
};
/** ========== 应还账单 =============== **/
export const getShouldRepayBillList = (params) => {
  return http.chainFunds.get('v1/ppvt/bill/_search-receivable-bill', {
    params
  })
};
export const downloadPlannedBillList = (params) => {
  return http.chainFunds.get('v1/ppvt/bill/_download-receivable-bill', {
    params
  })
};

/** ========== 实还账单 =============== **/
export const getActualBillList = (params) => {
  return http.chainFunds.get('v1/ppvt/bill/_search-account-bill', {
    params
  })
};
export const downloadActualBillList = (params) => {
  return http.chainFunds.get('v1/ppvt/bill/_download-account-bill', {
    params
  })
};
