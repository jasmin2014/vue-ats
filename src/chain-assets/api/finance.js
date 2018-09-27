import http from '../../lib/http'

/** ========== 还款明细 =============== **/
export const getRepayList = (params) => {
  return http.chainAssets.get('v1/ppvt/repay', {
    params
  })
};
export const downloadRepayList = (params) => {
  return http.chainAssets.get('v1/ppvt/repay/_download', {
    params
  })
};

/** ========== 账户中心 =============== **/
/** 账户信息 **/
export const getAccountList = () => {
  return http.chainAssets.get('v1/account');
};
/** 交易记录 **/
export const getTransactionList = (params) => {
  return http.chainAssets.get('/v1/account/_query-account-flows', {
    params
  })
};

/** 开户 **/
export const openAccount = (acTitle) => {
  return http.chainAssets.post('/v1/account/_create-account', { acTitle });
};

/** 绑卡 **/
export const getCardInfo = (bankCard) => {
  return http.chainAssets.get('/v1/account/_query-card-bin', {
    params: { bankCard }
  })
};
export const authPrivateCard = (data) => {
  return http.chainAssets.post('/v1/account/_auth-private-bank-card', data)
};
export const authPublicCard = (data) => {
  return http.chainAssets.post('/v1/account/_auth-public-bank-card', data);
};

/** 充值 **/
export const recharge = (data) => {
  return http.chainAssets.post('/v1/account/_recharge', data);
};

/** 提现 **/
export const withdraw = (data) => {
  return http.chainAssets.post('/v1/account/_withdraw', data);
};

/** 代币充值 **/
export const chainRecharge = (amount) => {
  return http.chainAssets.post('/v1/token/manager/_recharge', null, {
    params: {
      amount
    }
  })
};
