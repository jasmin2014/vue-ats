import http from '../../lib/http';

/** ========== LOAN LIST =============== **/
export const getLoanApplicationList = (params) => {
  return http.assets.get('v1/loan-application/page', {
    params
  })
};
export const getFinishedLoanApplicationList = (params) => {
  return http.assets.get('v1/performance-loan-application/page', {
    params
  })
};
export const downloadFinishedLoanList = (params) => {
  return http.assets.get('v1/performance-loan-application/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['AssetFinishDownload']
    }
  })
};
/** 提交 **/
export const batchSubmit = (ids) => {
  return http.assets.put('v1/loan-application/_submit', ids)
};
/** 撤贷 **/
export const batchRevoke = (ids) => {
  return http.assets.put('v1/loan-application/_undo', ids)
};
/** 备注 **/
export const getLoanRemark = (loanId) => {
  return http.assets.get(`v1/assets-audit/audit-remarks/${loanId}`)
};
/** 提前结清 **/
export const earlySettle = (loanApplication) => {
  return http.assets.post(`/v1/loan-application/_early-settlement/${loanApplication}`)
};
/** 续贷 **/
export const renewLoan = (oldContract, data) => {
  return http.assets.post(`v1/performance-loan-application/${oldContract}`, data)
};

/** ========== LOAN DETAIL =============== **/
export const getLoanApplication = (loanId) => {
  return http.assets.get(`v1/loan-application/${loanId}`)
};
export const getFinishedLoanApplication = (loanId) => {
  return http.assets.get(`v1/performance-loan-application/${loanId}`)
};
/** 证明材料 **/
export const getProofMaterialList = (loanId) => {
  return http.assets.get(`v1/proof-material/list/${loanId}`)
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
export const createLoan = (data) => {
  return http.assets.post('v1/loan-application/', data)
};
/** ========== EDIT =============== **/
export const editLoan = (id, data) => {
  return http.assets.put(`v1/loan-application/${id}`, data)
};
/** 保障方案 **/
export const createProtectionPlan = (loanApplicationId, data) => {
  data.loanApplicationId = loanApplicationId;
  return http.assets.post('v1/protection-plan', data)
};
export const editProtectionPlan = (loanApplicationId, id, data) => {
  data.loanApplicationId = loanApplicationId;
  return http.assets.put(`v1/protection-plan/${id}`, data)
};
export const deleteProtectionPlan = (id) => {
  return http.assets.delete(`v1/protection-plan/${id}`)
};
/** 证明材料 **/
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
  return http.assets.get('v1/loan-application/repay/enum', {
    params: {
      loanAttribute,
      assetKind,
      loanKind,
      repayWay
    }
  })
};
export const getModelEnums = () => {
  return http.assets.get('v1/loan-application/enum')
};
/** ========== DELETE =============== **/
export const deleteLoan = (id) => {
  return http.assets.delete(`v1/loan-application/${id}`)
};

/** ========== UPLOAD =============== **/
// 压缩包
export const getUploadedZipList = () => {
  return http.assets.get('v1/application/import/zip/list')
};
export const deleteUploadedZip = (id) => {
  return http.assets.delete(`v1/application/import/${id}`)
};
export const uploadZipList = (uploadNo) => {
  return http.assets.get(`v1/application/import/upload/${uploadNo}`)
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
export const editUploadAssetDetail = (_id, data) => {
  return http.assets.put(`v1/application/import/${_id}`, data)
};
export const editUploadAssetPics = (contract, data) => {
  return http.assets.put(`v1/application/import/pics/${contract}`, data)
};
