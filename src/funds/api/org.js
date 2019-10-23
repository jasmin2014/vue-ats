import http from '../../lib/http';

export const getLoginOrg = () => {
  return http.funds.get('/v2/party/org')
};

export const editOrg = (data) => {
  return http.funds.put('/v2/party/org', data)
};

export const getOrgRelList = (params) => {
  return http.funds.get('/v2/party/org/relation/page', {
    params
  })
};
