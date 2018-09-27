import http from '../../lib/http';

/** ================ LIST ======================= **/
export const getIndividualCustomerList = (params) => {
  params.currentPage = params.pageNumber;
  delete params.pageNumber;
  return http.funds.get('v1/person/customer/list/page', {
    params
  })
};
export const getEnterpriseCustomerList = (params) => {
  params.searchKeyword = params.searchKey || '';
  delete params.searchKey;
  return http.funds.get('v1/party/enterprise/page', {
    params
  })
};

/** ================ DETAIL ======================= **/
export const getIndividualDetail = (id) => {
  return http.funds.get(`v1/person/customer/detail/${id}`)
};
export const getEnterpriseDetail = (id) => {
  return http.funds.get(`v1/party/enterprise/${id}`)
};
export const getEnterpriseLegalDetail = (partyId) => {
  return http.funds.get('v1/party/enterprise/_find-enterprise-legal-person', {
    params: {
      partyId
    }
  })
};
/** ================ DATA-REPORT ======================= **/
export const getPersonalDataReport = (id, kinds) => {
  return http.funds.get(`/v1/customer/report/list/${id}`, {
    params: {
      kinds
    }
  })
};
/** ================ STATIS ======================= **/
export const getStatistics = (partyId) => {
  return http.funds.get(`/v1/party-person/accumulates/_cumulative/${partyId}`)
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
  return http.funds.get(`v1/party/prop/list/${partyId}`, {
    params: {
      propTypes
    }
  })
};
/** ================ DEVICE ======================= **/
export const getCustomerEquipmentList = (partyId) => {
  return http.funds.get(`v1/prop/device/${partyId}`)
};
/** ================ SHOP & E-SHOP ======================= **/
export const getCustomerShopList = (partyId) => {
  return http.funds.get(`v1/prop/shop/${partyId}`)
};
export const getCustomerEshopList = (partyId) => {
  return http.funds.get(`v1/prop/electronic-commerce/${partyId}`)
};
/** ================ STOCK ======================= **/
export const getCustomerStockList = (partyId) => {
  return http.funds.get(`v1/prop/stock/${partyId}`)
};
/** ================ DEBT ======================= **/
export const getCustomerDebtList = (partyId) => {
  return http.funds.get(`v1/debt/information/person/${partyId}`)
};
/** ================ INSURANCE ======================= **/
export const getCustomerInsuranceList = (partyId) => {
  return http.funds.get(`v1/prop/social-security/${partyId}`)
};
/** ================ WORK ======================= **/
export const getCustomerOrgList = (partyId) => {
  return http.funds.get(`v1/person/work/list/${partyId}`)
};
/** ================ RELATION ======================= **/
export const getCustomerRelList = (partyId) => {
  return http.funds.get(`v1/party/rel/ext/intimate/list/${partyId}`)
};
/** ================ MATERIAL ======================= **/
export const getCustomerMaterialList = (partyId, kindList = []) => {
  return http.funds.get(`v1/party/material/list/${partyId}`, {
    params: {
      kinds: kindList.join(',')
    }
  })
};
