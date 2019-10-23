// 客户管理
import http from '../../lib/http';

/** ================ LIST ======================= **/
export const getIndividualCustomerList = (params, orgId) => {
  return http.center.get(`/v2/loan-party/person-customer/${orgId}/page`, {
    params
  })
};
export const getEnterpriseCustomerList = (params, orgId) => {
  return http.center.get(`/v2/loan-party/org-customer/${orgId}/page`, {
    params
  })
};

/** ================ DETAIL ======================= **/
export const getCustomerLoanList = (partyId, params) => {
  return http.center.get(`/v2/loan-party/loan-application/${partyId}`, {
    params
  })
};
export const getPerson = (id) => {
  return http.center.get(`/v2/loan-party/person-customer/${id}`)
};
export const getOrg = (id) => {
  return http.center.get(`/v2/loan-party/org-customer/${id}`)
};
export const getIndividualDetail = (loanId) => {
  return http.center.get(`/v2/loan-application-customer/person-customer/${loanId}`)
};
export const getEnterpriseDetail = (loanId) => {
  return http.center.get(`/v2/loan-application-customer/org-customer/${loanId}`)
};
export const getEnterpriseLegalDetail = (partyId) => {
  return http.center.get('v1/party/enterprise/_find-enterprise-legal-person', {
    params: {
      partyId
    }
  })
};
/** ================ DATA-REPORT ======================= **/
export const getPersonalDataReport = (id, kinds) => {
  return http.center.get(`/v1/customer/report/list/${id}`, {
    params: {
      kinds
    }
  })
};
/** ================ STATIS ======================= **/
export const getLoanStat = (assetOrgId, partyId) => {
  return http.center.get(`/v2/loan-party/loan-statistics/${assetOrgId}/${partyId}`)
};
export const getStatistics = (partyId) => {
  return http.center.get(`/v1/party-person/accumulates/_cumulative/${partyId}`)
};

/** ================ PROP ======================= **/
/**
 * propTypes备注：
 * "H" 指的是企业法人的房产信息 对应返回的json对象名称是“propHouseDTO”
 * "B" 指的是企业法人的银行信息 对应返回的json对象名称是“propBankDTO”
 * "C" 指的是企业法人的车辆信息 对应返回的json对象名称是“propCarDTO”
 * "G" 指的是企业法人的公积金信息 对应返回的json对象名称是“propPublicReserveFundsDTO”
 **/
export const getCustomerPropList = (partyId, propTypes) => {
  return http.center.get(`v1/party/prop/list/${partyId}`, {
    params: {
      propTypes
    }
  })
};
/** ================ DEVICE ======================= **/
export const getCustomerEquipmentList = (partyId) => {
  return http.center.get(`v1/prop/device/${partyId}`)
};
/** ================ SHOP & E-SHOP ======================= **/
export const getCustomerShopList = (partyId) => {
  return http.center.get(`v1/prop/shop/${partyId}`)
};
export const getCustomerEshopList = (partyId) => {
  return http.center.get(`v1/prop/electronic-commerce/${partyId}`)
};
/** ================ STOCK ======================= **/
export const getCustomerStockList = (partyId) => {
  return http.center.get(`v1/prop/stock/${partyId}`)
};
/** ================ DEBT ======================= **/
export const getCustomerDebtList = (partyId) => {
  return http.center.get(`v1/debt/information/person/${partyId}`)
};
/** ================ INSURANCE ======================= **/
export const getCustomerInsuranceList = (partyId) => {
  return http.center.get(`v1/prop/social-security/${partyId}`)
};
/** ================ WORK ======================= **/
export const getCustomerOrgList = (partyId) => {
  return http.center.get(`v1/person/work/list/${partyId}`)
};
/** ================ RELATION ======================= **/
export const getCustomerRelList = (partyId) => {
  return http.center.get(`v1/party/rel/ext/intimate/list/${partyId}`)
};
/** ================ MATERIAL ======================= **/
export const getCustomerMaterialList = (partyId, kindList = []) => {
  return http.center.get(`v1/party/material/list/${partyId}`, {
    params: {
      kinds: kindList.join(',')
    }
  })
};
