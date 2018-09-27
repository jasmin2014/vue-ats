import http from '../../lib/http';

// 放款记录接口列表
export const getLoanList = (params) => {
  return http.funds.get('/v1/ppvt/payment', {
    params
  })
};

// 还款计划列表接口
export const getRepayList = (params) => {
  return http.funds.get('/v1/repay-plan/page', {
    params
  })
};

// 还款计划表详情接口
export const getRepayDetail = (loanApplication) => {
  return http.funds.get('/v1/ppvt/repay/_find-repay-plan', {
    params: {
      loanApplication
    }
  })
};

// 查询预生成的还款计划
export const getPreRepayDetail = (loanApplication) => {
  return http.funds.get('/v1/ppvt/repay/_pre', {
    params: {
      loanApplication
    }
  })
};
// 异常放款列表
export const getLoanExceptionList = (params) => {
  return http.funds.get('/v1/ppvt/payment/mistake', {
    params
  })
};
// 重新放款
export const mistakeReloan = (paymentId) => {
  return http.funds.post(`/v1/ppvt/payment/mistake/${paymentId}`)
};
// 信息问题反馈
export const mistakeFeedback = (paymentId) => {
  return http.funds.put(`/v1/ppvt/payment/mistake/${paymentId}`)
};

// 生成还款计划 接口
export const postRepayPlan = (params) => {
  return http.funds.post('/v1/ppvt/repay', params)
};

// 应收账单列表接口
export const getReceivableBill = (params) => {
  return http.funds.get('/v1/ppvt/bill/_search-receivable-bill', { params });
};

// 实收账单列表接口
export const getAccountBill = (params) => {
  return http.funds.get('/v1/ppvt/bill/_search-account-bill', { params });
};

// 实收账单下载接口
export const downloadAccountBillList = (params) => {
  return http.funds.get('/v1/ppvt/bill/_download-account-bill', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationActualBillDownload']
    }
  })
};
// 应收账单下载接口
export const downloadReceivableBillList = (params) => {
  return http.funds.get('/v1/ppvt/bill/_download-receivable-bill', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationPlannedBillDownload']
    }
  })
};

// 放款列表下载接口
export const downloadPaymentList = (params) => {
  return http.funds.get('/v1/ppvt/payment/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationLoanDownload']
    }
  })
};

// 还款计划下载接口
export const downloadRepayPlanList = (params) => {
  return http.funds.get('/v1/repay-plan/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['OperationPlanDownload']
    }
  })
};
