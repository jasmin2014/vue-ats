import http from '../lib/http'

export const getAllSysEnum = () => {
  return http.common.get('v1/enums/sys/all')
};
export const getSysEnum = (kind, group, enumKey, visible, binarySequence) => {
  return http.common.get('v1/enums/sys', {
    params: {
      kind,
      group,
      enumKey,
      visible,
      binarySequence
    }
  })
};
export const getRegionEnum = (region) => {
  return http.common.get('v1/enums/region', {
    params: {
      region
    }
  })
};
// 根据区域的区号链接字符串获取城市接口
export const getCitiesByRegions = (regions) => {
  return http.common.get('/v1/enums/region/names', {
    params: {
      regions
    }
  })
};
export const getAssetKindEnum = () => {
  return http.common.get('v1/enums/business/assets/type')
};
export const getLoanKindEnum = (assetKind) => {
  return http.common.get('v1/enums/business/loan/type', {
    params: {
      assetKind
    }
  })
};
export const getOrgList = (orgType, statusEnable) => {
  return http.common.get(`v1/enums/business/org/${orgType}`, {
    params: {statusEnable}
  })
};
export const getBankNameByCard = (bankCard) => {
  return http.common.get(`v1/enums/bank/name/${bankCard}`)
};
export const getProtectionPlanByLoanId = (loanId) => {
  return http.common.get(`v1/protection-plan/${loanId}`)
};
