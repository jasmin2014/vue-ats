import http from '../../lib/http'

/** ========== 还款明细 =============== **/
export const getRepayList = (params) => {
  return http.assets.get('v1/ppvt/repay', {
    params
  })
};
export const downloadRepayList = (params) => {
  return http.assets.get('v1/ppvt/repay/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['FinanceRepayDownload']
    }
  })
};

/** ========== 收益明细 =============== **/
export const getProfitList = (params) => {
  return http.assets.get('v1/ppvt/settlement', {
    params
  })
};
export const downloadProfitList = (params) => {
  return http.assets.get('v1/ppvt/settlement/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['FinanceProfitDownload']
    }
  })
};

/** ========== 账户中心 =============== **/
/** 账户信息 **/
export const getAccountList = () => {
  return http.assets.get('v1/account');
};
/** 交易记录 **/
export const getTransactionList = (params) => {
  return http.assets.get('/v1/account/_query-account-flows', {
    params
  })
};

/** 开户 **/
export const openAccount = (acTitle) => {
  return http.assets.post('/v1/account/_create-account', { acTitle });
};

/** 绑卡 **/
export const getCardInfo = (bankCard) => {
  return http.assets.get('/v1/account/_query-card-bin', {
    params: { bankCard }
  })
};
export const authPrivateCard = (data) => {
  return http.assets.post('/v1/account/_auth-private-bank-card', data)
};
export const authPublicCard = (data) => {
  return http.assets.post('/v1/account/_auth-public-bank-card', data);
};

/** 充值 **/
export const recharge = (data) => {
  return http.assets.post('/v1/account/_recharge', data);
};

/** 提现 **/
export const withdraw = (data) => {
  return http.assets.post('/v1/account/_withdraw', data);
};
