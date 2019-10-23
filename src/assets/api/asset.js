import http from '../../lib/http';

/** ========== LOAN LIST =============== **/
export const getLoanApplicationList = (params) => {
  return http.assets.get('v2/loan-application/page', {
    params
  })
};
export const getFinishedLoanApplicationList = (params) => {
  return http.assets.post('v2/performance-loan-application/page', params)
};
export const downloadLoanApplicationList = (params) => {
  return http.assets.get('/v2/loan-application/_download', {
    params
  })
};
export const downloadFinishedLoanList = (params) => {
  return http.assets.post('v2/performance-loan-application/_download', params)
};
/** 续借查询 */
export const getRelatedAssets = (params) => {
  return http.assets.get(`v2/related/assets/${params.contract}`)
};
/** 统计 **/
export const getLoanApplicationTotal = (params) => {
  return http.assets.get('/v2/loan-application/count/loan-amount', {
    params
  })
};
export const getFinishedLoanTotal = (params) => {
  return http.assets.get('/v2/performance-loan-application/count/loan-amount', {
    params
  })
};
/** 提交 **/
export const batchSubmit = (ids) => {
  return http.assets.put('/v2/loan-application/_submit', ids)
};
/** 撤贷 **/
export const batchRevoke = (ids) => {
  return http.assets.put('/v2/loan-application/_undo', ids)
};
/** 备注 **/
export const getLoanRemark = (loanId) => {
  return http.assets.get(`/v2/assets-audit/audit-remarks/${loanId}`)
};
/** 提前结清 **/
export const batchEarlySettle = (loanApplications) => {
  return http.assets.post('/v2/loan-application/_early-settlement', loanApplications)
};
/** 续借 **/
export const renewLoan = (oldContract, data) => {
  return http.assets.post(`v2/performance-loan-application/${oldContract}`, data)
};

/** ========== LOAN DETAIL =============== **/
export const getLoanApplication = (loanId) => {
  return http.assets.get(`v2/loan-application/${loanId}`)
};
export const getFinishedLoanApplication = (loanId) => {
  return http.assets.get(`v2/performance-loan-application/${loanId}`)
};
/** 证明材料 **/
export const getProofMaterialList = (loanId) => {
  return http.assets.get(`v2/proof-material/list/${loanId}`)
};
/** 收费信息 **/
export const getFeeList = (loanApplication, phase) => {
  return http.assets.get('v1/fee', {
    params: {
      loanApplication,
      phase
    }
  })
};
/** ========== CREATE =============== **/
export const createPersonLoan = (data) => {
  return http.assets.post('/v2/loan-application/person/', data)
};
export const createOrgLoan = (data) => {
  return http.assets.post('/v2/loan-application/org/', data)
};
/** ========== EDIT =============== **/
export const editLoan = (id, data) => {
  return http.assets.put(`v2/loan-application/${id}`, data)
};
/** 证明材料 **/
export const batchUploadMaterial = (loanId, data) => {
  return http.assets.post(`/v2/proof-material/${loanId}/batch`, data);
};
export const batchDeleteMaterial = (ids) => {
  return http.assets.delete('/v2/proof-material/ids', {
    data: ids
  });
};
export const batchDeletePdfMaterial = (ids) => {
  return http.assets.delete('/v2/proof-material/other/ids', {
    data: ids
  });
};
export const uploadProofMaterial = (id, file) => {
  return http.assets.post(`v1/proof-material/${id}`, file)
};
export const removeProofMaterial = (id) => {
  return http.assets.delete(`v1/proof-material/${id}`)
};
/** 收费信息 **/
export const createFee = (data) => {
  return http.assets.post('v1/fee', data)
};
export const editFee = (id, data) => {
  return http.assets.put(`v1/fee/${id}`, data)
};
export const deleteFee = (idList) => {
  return http.assets.delete('v1/fee', {
    params: {
      ids: idList.join(',')
    }
  })
};
/** ========== ENUM =============== **/
export const getEnumsByLoanAttr = (loanAttribute, assetKind, loanKind, repayWay) => {
  return http.assets.get('v2/loan-application/repay/enum', {
    params: {
      loanAttribute,
      assetKind,
      loanKind,
      repayWay
    }
  })
};
// 获取可用放款模式
export const getModelEnums = () => {
  return http.assets.get('v2/loan-application/enum')
};
/** ========== DELETE =============== **/
export const deleteLoan = (id) => {
  return http.assets.delete(`v2/loan-application/${id}`)
};

/** ========== UPLOAD =============== **/
/** 新借 **/
// 压缩包
export const getUploadedZipList = (params) => {
  return http.assets.get('v1/application/import/zip/list', {
    params
  })
};
export const deleteUploadedZip = (id) => {
  return http.assets.delete(`v1/application/import/${id}`)
};
export const uploadZipList = (id) => {
  return http.assets.post(`v1/application/import/upload/${id}`)
};
// 列表
export const getUploadAssetList = (params) => {
  return http.assets.get('v1/application/import/mongodb/list/page', {
    params
  })
};
export const uploadSingleAsset = (_id) => {
  return http.assets.get(`v1/application/import/upload/single/${_id}`)
};
// 详情
export const getUploadAssetDetail = (_id) => {
  return http.assets.get(`v1/application/import/mongodb/detail/${_id}`)
};
export const getUploadAssetPics = (uploadNo, contract) => {
  return http.assets.get('v1/application/import/mongodb/pics', {
    params: {
      contract,
      uploadNo
    }
  })
};
// 删除
export const deleteUploadAsset = (_id) => {
  return http.assets.delete(`v1/application/import/mongodb/${_id}`)
};
// 修改
export const editUploadPersonLoan = (mongodbId, uploadNo, data) => {
  return http.assets.put(`/v1/application/import/person/${mongodbId}/${uploadNo}`, data)
};
export const editUploadOrgLoan = (mongodbId, uploadNo, data) => {
  return http.assets.put(`/v1/application/import/org/${mongodbId}/${uploadNo}`, data)
};
/** 续借 **/
export const uploadRenewZip = (id) => {
  return http.assets.post(`v1/application/import/upload/continue/${id}`)
};
export const deleteRenewZip = (id) => {
  return http.assets.delete(`/v1/application/import/continue/${id}`)
};
export const getRenewList = (params) => {
  return http.assets.get('/v1/application/import/mongodb/continue-list/page', {
    params
  })
};
export const deleteRenew = (id) => {
  return http.assets.delete(`/v1/application/import/mongodb/continue/${id}`)
};
export const getRenewDetail = (mongodbId) => {
  return http.assets.get(`/v1/application/import/mongodb/continue-detail/${mongodbId}`)
};
export const saveRenew = (mongodbId, uploadNo, data) => {
  return http.assets.put(`/v1/application/import/continue/${mongodbId}/${uploadNo}`, data)
};

/** ========== 项目配置申请 =============== **/
export const getProjectConfigList = (params) => {
  return http.assets.get('/v2/project-config/page', {
    params
  })
};
export const getProjectConfigDetail = (id) => {
  return http.assets.get(`/v2/project-config/details/${id}`)
};
export const createProjectConfig = (data) => {
  return http.assets.post('/v2/project-config', data)
};
export const applyProjectConfig = (id, data) => {
  data.id = id;
  return http.assets.post('/v2/project-config', data)
};
export const deleteProjectConfig = (id) => {
  return http.assets.delete(`/v2/project-config/${id}`)
};
export const checkProjectNameExisted = (projectName, id) => {
  return http.assets.post('/v2/project-config/_check-project-name', {
    projectName,
    id
  })
};
export const updateProjectConfigAutoSubmit = (data) => {
  return http.assets.put('/v2/project-config/_update-auto-submit', null, {
    params: data
  })
};

/** ========== 保障方案配置 =============== **/
export const getProtectionConfigList = () => {
  return http.assets.get('/v2/protection-plan/list')
};
export const getProtectionConfig = (planId) => {
  return http.assets.get(`/v2/protection-plan/${planId}`)
};
export const createProtectionConfig = (data) => {
  return http.assets.post('/v2/protection-plan', data)
};
export const editProtectionConfig = (planId, data) => {
  data.planId = planId;
  return http.assets.put('/v2/protection-plan', data)
};
export const deleteProtectionConfig = (planId) => {
  return http.assets.delete(`/v2/protection-plan/${planId}`)
};

// 项目名称下拉列表
export const getProjectNameList = () => {
  return http.assets.get('/v2/project-config/_pull-down-list')
};
export const getProjectNameOptions = () => {
  return http.assets.get('/v2/project-config/_pull-down-ganged-list')
};

// 查询服务费率
export const getServiceFeeRateByIntentionFund = (data) => {
  return http.assets.post('/v2/performance-loan-application/service-rate', data)
};

// 查询保障方案
export const getProtectionPlanListByModel = (params) => {
  return http.assets.get('/v2/protection-plan/list/model', {
    params
  })
};
