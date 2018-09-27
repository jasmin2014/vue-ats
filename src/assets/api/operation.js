import http from '../../lib/http';

/** ========== 还款计划 =============== **/
export const getRepayList = (params) => {
  return http.assets.get('v1/repay-plan/page', {
    params
  })
};
export const getRepayDetail = (loanApplication) => {
  return http.assets.get('v1/ppvt/repay/_find-repay-plan', {
    params: {
      loanApplication
    }
  })
};
export const downloadRepayList = (params) => {
  return http.assets.get('v1/repay-plan/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationPlanDownload']
    }
  })
};

/** ========== 放款记录 =============== **/
export const getLoanList = (params) => {
  return http.assets.get('v1/ppvt/payment', {
    params
  })
};
export const downloadLoanList = (params) => {
  return http.assets.get('v1/ppvt/payment/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationLoanDownload']
    }
  })
};

/** ========== 应还账单 =============== **/
export const getShouldRepayBillList = (params) => {
  return http.assets.get('v1/ppvt/bill/_search-receivable-bill', {
    params
  })
};
export const downloadPlannedBillList = (params) => {
  return http.assets.get('v1/ppvt/bill/_download-receivable-bill', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationPlannedBillDownload']
    }
  })
};

/** ========== 实还账单 =============== **/
export const getActualBillList = (params) => {
  return http.assets.get('v1/ppvt/bill/_search-account-bill', {
    params
  })
};
export const downloadActualBillList = (params) => {
  return http.assets.get('v1/ppvt/bill/_download-account-bill', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationActualBillDownload']
    }
  })
};
/** ========== 异常放款 =============== **/
// 异常放款列表
export const getLoanExceptionList = (params) => {
  return http.assets.get('/v1/ppvt/payment/mistake', {
    params
  })
};
export const getLoanExceptionCardList = (paymentId) => {
  return http.assets.get(`v1/ppvt/payment/mistake/list/abnormal/${paymentId}`)
};
export const changeBindCard = (paymentId, bankCard) => {
  return http.assets.post('v1/ppvt/payment/mistake', {
    paymentId,
    bankCard
  })
};
