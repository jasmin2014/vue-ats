import http from '../lib/http'

export const getAllSysEnum = () => {
  return http.common.get('v1/enums/sys/all')
};
export const getSysEnum = (kind, group, enumKey, visible = 0, binarySequence) => {
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
export const getRegionEnum = (region = '86') => {
  return http.common.get('v1/enums/region', {
    params: {
      region
    }
  })
};
// 根据区域的区号链接字符串获取城市接口
export const getRegionsByCode = (regions) => {
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
  return http.common.get('/v2/gaia/card/_query-card-bin', {
    params: { bankCard }
  })
};
export const getProtectionPlanByLoanId = (loanId) => {
  return http.common.get(`v1/protection-plan/${loanId}`)
};

/** ========== 机构下拉 =============== **/
export const getOrgListFromCenter = (appType, useFlag) => {
  return http.common.get('/v1/enums/business/org/center/list', {
    params: {
      appType,
      useFlag
    }
  })
};
// 资金端机构
export const getFundListFromAsset = (assetOrgId) => {
  return http.common.get(`/v1/enums/business/org/asset/list/${assetOrgId}`)
};
// 资产端机构
export const getAssetListFromFund = (fundOrgId) => {
  return http.common.get(`/v1/enums/business/org/fund/list/${fundOrgId}`)
};

// 意向资金端
export const getIntentionFundListFromAsset = (assetOrgId) => {
  return http.common.get(`/v1/enums/business/org/asset_fund_list/${assetOrgId}`)
};
// 关联资产端
export const getRelAssetListFromFund = (fundOrgId) => {
  return http.common.get(`/v1/enums/business/org/asset-org-list/${fundOrgId}`)
};
