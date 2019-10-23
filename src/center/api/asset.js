// 资产信息
import http from '../../lib/http'

/** ============ 资产信息 ============ **/
// 列表
export const getAssetInfoList = (params) => {
  return http.center.get('/v1/assets-audit/loan-list/page', { params })
};
// 资产信息列表下载
export const downloadAssetInfoList = (params) => {
  return http.center.get('/v1/assets-audit/loan-list/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['AssetDownload']
    }
  })
};
// 备注
export const getRemarkList = (loanId) => {
  return http.center.get(`/v1/assets-audit/loan-list/audit-record/${loanId}`);
};

// 借贷申请详情-基本信息接口
export const getLoanApplication = (loanId) => {
  return http.center.get(`/v1/assets-audit/loan-list/${loanId}`);
};

// 借贷申请详情-证明材料接口
export const getProofMaterialList = (loanId) => {
  return http.center.get(`/v2/proof-material/list/${loanId}`)
};

// 借贷申请详情-收费记录接口
export const getFeeList = (loanApplication, phase) => {
  return http.center.get('/v1/fee', {
    params: {
      loanApplication,
      phase
    }
  });
};
// 保障方案
export const getProtection = (planId) => {
  return http.center.get(`/v2/protection-plan/${planId}`)
};

/** ============ 风控配置 ============ **/
// 风控配置下拉
export const getConfigures = () => {
  return http.center.get('/v1/category/risk/configure/strategy')
};
export const getRiskConfigList = () => {
  return http.center.get('/v1/category/risk/configure/shikra/strategy')
};

/** 项目配置申请 **/
export const getProjectConfigList = (params) => {
  return http.center.get('/v2/project-config/page', {
    params
  })
};
export const getProjectConfigDetail = (id) => {
  return http.center.get(`/v2/project-config/details/${id}`)
};
export const passProjectConfig = (id, data) => {
  data.id = id;
  return http.center.post('/v2/project-config/_audit-success', data)
};
export const rejectProjectConfig = (id) => {
  return http.center.post('/v2/project-config/_audit-failure', {
    id
  })
};
/** 修改风控配置 **/
export const editProjectConfigRisk = (id, data) => {
  data.id = id;
  return http.center.put('/v2/project-config/_update-project-config-risk', data)
};
