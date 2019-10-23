import http from '../../lib/http'

/** ========== 账户中心 =============== **/
export const getBankCardList = () => {
  return http.assets.get('/v2/finance-center-bank')
};
export const createBankCard = (data) => {
  return http.assets.post('/v2/finance-center-bank', data)
};
export const deleteBankCard = (bankId) => {
  return http.assets.delete(`/v2/finance-center-bank/${bankId}`)
};
export const editBankCard = (data) => {
  return http.assets.put('/v2/finance-center-bank', data)
};
export const authBankCard = (data) => {
  return http.assets.post('/v2/finance-center-bank/_auth-bank-card', data)
};
export const getCollectionCardList = (fundOrg, useType) => {
  return http.assets.get('/v2/finance-center-bank/_find-bank-spinner', {
    params: {
      useType,
      fundOrg
    }
  })
};

//
// /** ========== 还款明细 =============== **/
// export const getRepayList = (params) => {
//   return http.assets.get('v1/ppvt/repay', {
//     params
//   })
// };
// export const downloadRepayList = (params) => {
//   return http.assets.get('v1/ppvt/repay/_download', {
//     params,
//     headers: {
//       'X-Action-Code': window.__buttons['FinanceRepayDownload']
//     }
//   })
// };
//
// /** ========== 收益明细 =============== **/
// export const getProfitList = (params) => {
//   return http.assets.get('v1/ppvt/settlement', {
//     params
//   })
// };
// export const downloadProfitList = (params) => {
//   return http.assets.get('v1/ppvt/settlement/_download', {
//     params,
//     headers: {
//       'X-Action-Code': window.__buttons['FinanceProfitDownload']
//     }
//   })
// };
//
// /** ========== 账户中心 =============== **/
// /** 账户信息 **/
// export const getAccountList = () => {
//   return http.assets.get('v1/account');
// };
// /** 交易记录 **/
// export const getTransactionList = (params) => {
//   return http.assets.get('/v1/account/_query-account-flows', {
//     params
//   })
// };
//
// /** 开户 **/
// export const openAccount = (acTitle) => {
//   return http.assets.post('/v1/account/_create-account', { acTitle });
// };
//
// /** 绑卡 **/
// export const getCardInfo = (bankCard) => {
//   return http.assets.get('/v1/account/_query-card-bin', {
//     params: { bankCard }
//   })
// };
// export const authPrivateCard = (data) => {
//   return http.assets.post('/v1/account/_auth-private-bank-card', data)
// };
// export const authPublicCard = (data) => {
//   return http.assets.post('/v1/account/_auth-public-bank-card', data);
// };
//
// /** 充值 **/
// export const recharge = (data) => {
//   return http.assets.post('/v1/account/_recharge', data);
// };
//
// /** 提现 **/
// export const withdraw = (data) => {
//   return http.assets.post('/v1/account/_withdraw', data);
// };
