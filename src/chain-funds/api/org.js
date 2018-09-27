import http from '../../lib/http';

export const getLoginOrg = () => {
  return http.chainFunds.get('v1/party/login/user/org/manager/detail')
};
export const getOrgExtRel = (partyId, kinds) => {
  return http.chainFunds.get(`v1/party/rel/ext/list/${partyId}`, {
    params: {
      kinds
    }
  })
};
export const getMaterialList = (partyId, kinds) => {
  return http.chainFunds.get(`v1/party/material/list/${partyId}`, {
    params: {
      kinds
    }
  })
};
export const getOrgChainDetail = () => {
  return http.chainFunds.get('v1/party/attrs')
};
