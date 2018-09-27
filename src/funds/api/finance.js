import http from '../../lib/http';

/** ========== 收款明细 =============== **/
export const getRepayDetailList = (params) => {
  return http.funds.get('/v1/ppvt/repay', {
    params
  })
};
// 批量添加收款明细列表
export const postBatchRepay = (params) => {
  return http.funds.put('/v1/ppvt/repay/_batch-repay', params)
};
// 添加收款明细
export const postUploadExcel = (params) => {
  return http.funds.post('/v1/ppvt/repay/_parse-excel', params)
};
// 编辑上传后的收款明细信息
export const postUploadExcelData = (params) => {
  return http.funds.post('/v1/ppvt/repay/_update-repay-detail', params)
};
// 收款明细下载接口
export const downloadRepayList = (params) => {
  return http.funds.get('/v1/ppvt/repay/_download', {
    params
  })
};

/** ========== 收益明细 =============== **/
export const getEarningsDetailList = (params) => {
  return http.funds.get('/v1/ppvt/settlement', {
    params
  })
};
// 收益明细列表下载接口
export const downloadSettlementList = (params) => {
  return http.funds.get('/v1/ppvt/settlement/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['FinanceProfitDownload']
    }
  })
};

/** ========== 账户中心 =============== **/
/** 账户信息 **/
export const getAccountList = () => {
  return http.funds.get('v1/account');
};
/** 交易记录 **/
export const getTransactionList = (params) => {
  return http.funds.get('/v1/account/_query-account-flows', {
    params
  })
};

/** 开户 **/
export const openAccount = (acTitle) => {
  return http.funds.post('/v1/account/_create-account', { acTitle });
};

/** 绑卡 **/
export const getCardInfo = (bankCard) => {
  return http.funds.get('/v1/account/_query-card-bin', {
    params: { bankCard }
  })
};
export const authPrivateCard = (data) => {
  return http.funds.post('/v1/account/_auth-private-bank-card', data)
};
export const authPublicCard = (data) => {
  return http.funds.post('/v1/account/_auth-public-bank-card', data);
};

/** 充值 **/
export const recharge = (data) => {
  return http.funds.post('/v1/account/_recharge', data);
};

/** 提现 **/
export const withdraw = (data) => {
  return http.funds.post('/v1/account/_withdraw', data);
};
