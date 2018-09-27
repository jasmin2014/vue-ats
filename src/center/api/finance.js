// 财务管理
import http from '../../lib/http'

/** ========== 还款明细 =============== **/
// 还款明细列表
export const getRepayList = (params) => {
  return http.center.get('/v1/ppvt/repay', { params })
};
// 还款明细下载
export const downloadRepayList = (params) => {
  return http.center.get('/v1/ppvt/repay/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['FinanceRepayDownload']
    }
  })
};

/** ========== 收益明细 =============== **/
// 收益明细列表
export const getProfitList = (params) => {
  return http.center.get('/v1/ppvt/settlement', { params })
};
// 收益明细下载
export const downloadProfitList = (params) => {
  return http.center.get('/v1/ppvt/settlement/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['FinanceProfitDownload']
    }
  })
};

