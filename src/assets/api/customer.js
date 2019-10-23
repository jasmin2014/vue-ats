import http from '../../lib/http';

/** ================ LIST ======================= **/
export const getIndividualCustomerList = (params) => {
  return http.assets.get('/v2/loan-party/person-customer/page', {
    params
  })
};
export const getEnterpriseCustomerList = (params) => {
  return http.assets.get('/v2/loan-party/org-customer/page', {
    params
  })
};

/** ================ DETAIL ======================= **/
export const getCustomerLoanList = (partyId) => {
  return http.assets.get(`/v2/loan-party/loan-application/${partyId}`)
};
export const getPerson = (id) => {
  return http.assets.get(`/v2/loan-party/person-customer/${id}`)
};
export const getOrg = (id) => {
  return http.assets.get(`/v2/loan-party/org-customer/${id}`)
};
export const getIndividualDetail = (loanId) => {
  return http.assets.get(`/v2/loan-application-customer/person-customer/${loanId}`)
};
export const getEnterpriseDetail = (loanId) => {
  return http.assets.get(`/v2/loan-application-customer/org-customer/${loanId}`)
};
export const getEnterpriseLegalDetail = (partyId) => {
  return http.assets.get('v1/party/enterprise/_find-enterprise-legal-person', {
    params: {
      partyId
    }
  })
};

/** ================ CREATE ======================= **/
export const createIndividualCustomer = (data) => {
  return http.assets.post('v1/person/customer/base', data)
};
export const createEnterpriseCustomer = (data) => {
  return http.assets.post('v1/party/enterprise', data)
};

/** ================ EDIT(BASE/CONTACT/BUSINESS/LEGAL) ======================= **/
export const editIndividualCustomer = (loanId, data) => {
  return http.assets.post(`/v2/loan-application-customer/person-customer/${loanId}`, data)
};
export const editEnterpriseCustomer = (loanId, data) => {
  return http.assets.post(`/v2/loan-application-customer/org-customer/${loanId}`, data)
};
export const editCustomerContact = (partyId, data) => {
  // data.partyId = partyId;
  return http.assets.put(`v1/person/customer/contact/info/${partyId}`, data)
};
export const editCustomerBusiness = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.put('v1/party/enterprise/_add-business-info', data)
};
export const createCustomerLegal = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post('v1/party/enterprise/_add-enterprise-legal-person', data)
};
export const editCustomerLegal = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.put('v1/party/enterprise/_update-enterprise-legal-person', data)
};

/** ================ PROP ======================= **/
export const getCustomerPropList = (partyId, propTypes) => {
  return http.assets.get(`v1/party/prop/list/${partyId}`, {
    params: {
      propTypes
    }
  })
};
export const getCustomerBindCardList = (partyId) => {
  return http.assets.get(`v1/prop/bank/list/${partyId}`)
};
export const createCustomerProp = (type, partyId, data) => {
  data.partyId = partyId;
  return http.assets.post(`v1/prop/${type}`, data)
};
export const editCustomerProp = (type, partyId, propId, data) => {
  data.partyId = partyId;
  return http.assets.put(`v1/prop/${type}/${propId}`, data)
};
export const deleteCustomerProp = (type, propId) => {
  return http.assets.delete(`v1/prop/${type}/${propId}`)
};
export const bindCustomerCard = (partyId, propId) => {
  return http.assets.put(`v1/prop/bank/binding/${propId}`, {}, {
    params: {
      partyId
    }
  })
};

/** ================ DEVICE ======================= **/
export const getCustomerEquipmentList = (partyId) => {
  return http.assets.get(`v1/prop/device/${partyId}`)
};
export const createCustomerEquipment = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post('v1/prop/device', data)
};
export const editCustomerEquipment = (partyId, propId, data) => {
  data.partyId = partyId;
  data.propId = propId;
  return http.assets.put('v1/prop/device', data)
};
export const deleteCustomerEquipment = (propId) => {
  return http.assets.delete(`v1/prop/device/${propId}`)
};

/** ================ SHOP & E-SHOP ======================= **/
export const getCustomerShopList = (partyId) => {
  return http.assets.get(`v1/prop/shop/${partyId}`)
};
export const getCustomerEshopList = (partyId) => {
  return http.assets.get(`v1/prop/electronic-commerce/${partyId}`)
};
export const createCustomereShop = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post('v1/prop/shop', data);
};
export const createCustomereEshop = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post('v1/prop/electronic-commerce', data);
};
export const editCustomerShop = (partyId, propId, data) => {
  data.partyId = partyId;
  data.propId = propId;
  return http.assets.put('v1/prop/shop', data)
};
export const editCustomerEshop = (partyId, propId, data) => {
  data.partyId = partyId;
  data.propId = propId;
  return http.assets.put('v1/prop/electronic-commerce', data)
};
export const deleteCustomerShop = (propId) => {
  return http.assets.delete(`v1/prop/shop/${propId}`)
};
export const deleteCustomerEshop = (propId) => {
  return http.assets.delete(`v1/prop/electronic-commerce/${propId}`)
};

/** ================ STOCK ======================= **/
export const getCustomerStockList = (partyId) => {
  return http.assets.get(`v1/prop/stock/${partyId}`)
};
export const createCustomerStock = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post('v1/prop/stock', data)
};
export const editCustomerStock = (partyId, propId, data) => {
  data.partyId = partyId;
  data.propId = propId;
  return http.assets.put('v1/prop/stock', data)
};
export const deleteCustomerStock = (propId) => {
  return http.assets.delete(`v1/prop/stock/${propId}`)
};

/** ================ DEBT ======================= **/
export const getCustomerDebtList = (partyId) => {
  return http.assets.get(`v1/debt/information/person/${partyId}`)
};
export const createCustomerDebt = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post('v1/debt/information', data)
};
export const editCustomerDebt = (partyId, debtId, data) => {
  data.partyId = partyId;
  data.id = debtId;
  return http.assets.put(`v1/debt/information/${debtId}`, data)
};
export const deleteCustomerDebt = (debtId) => {
  return http.assets.delete(`v1/debt/information/${debtId}`)
};

/** ================ INSURANCE ======================= **/
export const getCustomerInsuranceList = (partyId) => {
  return http.assets.get(`v1/prop/social-security/${partyId}`)
};
export const createCustomerInsurance = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post('v1/prop/social-security', data)
};
export const editCustomerInsurance = (partyId, propId, data) => {
  data.partyId = partyId;
  data.propId = propId;
  return http.assets.put('v1/prop/social-security', data)
};
export const deleteCustomerInsurance = (propId) => {
  return http.assets.delete(`v1/prop/social-security/${propId}`)
};

/** ================ WORK ======================= **/
export const getCustomerOrgList = (partyId) => {
  return http.assets.get(`v1/person/work/list/${partyId}`)
};
export const createCustomerWork = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post('v1/person/work', data)
};
export const editCustomerWork = (partyId, workId, data) => {
  data.partyId = partyId;
  return http.assets.put(`v1/person/work/${workId}`, data)
};
export const deleteCustomerWork = (workId) => {
  return http.assets.delete(`v1/person/work/${workId}`)
};

/** ================ RELATION ======================= **/
export const getCustomerRelList = (partyId) => {
  return http.assets.get(`v1/party/rel/ext/intimate/list/${partyId}`)
};
export const createCustomerRelation = (partyId, data) => {
  data.partyId = partyId;
  return http.assets.post(`v1/person/customer/relation/${partyId}`, data)
};
export const editCustomerRelation = (partyId, relId, data) => {
  data.partyId = partyId;
  return http.assets.put(`v1/person/customer/relation/${relId}/${partyId}`, data)
};
export const deleteCustomerRelation = (partyId, relId) => {
  return http.assets.delete(`v1/person/customer/relation/${relId}/${partyId}`)
};

/** ================ MATERIAL ======================= **/
export const getCustomerMaterialList = (partyId, kindList = []) => {
  return http.assets.get(`v1/party/material/list/${partyId}`, {
    params: {
      kinds: kindList.join(',')
    }
  })
};
export const saveCustomerMaterialList = (partyId, list) => {
  if (typeof list === 'object') {
    list = [list];
  }
  return http.assets.post(`v1/person/customer/proof/${partyId}`, list)
};
export const deleteCustomerMaterial = (proofId) => {
  return http.assets.delete(`v1/person/customer/proof/${proofId}`)
};
