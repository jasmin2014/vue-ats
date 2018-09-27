import http from '../../lib/http'
/*
 * 机构列表
 * */
export const getOrgList = (params) => {
  return http.center.get('/v1/org/manager/list/page', {
    params
  })
};
// 开启关闭
export const switchOrgStatus = (partyId, val) => {
  return http.center.put(`/v1/org/manager/status/${partyId}/${val}`, null, {
    headers: {
      'X-Action-Code': window.__buttons['OrgEnableOrDisabled']
    }
  })
};
// 删除
export const orgDelete = (partyId) => {
  return http.center.delete(`/v1/org/manager/${partyId}`, {
    headers: {
      'X-Action-Code': window.__buttons['OrgDelete']
    }
  })
};

// 新增机构
export const createOrg = (data) => {
  return http.center.post('/v1/org/manager', data)
};
// 检查机构名称是否存在
export const checkOrgExisted = (params) => {
  return http.center.get('v1/org/manager/check/existed', {
    params
  })
};
// 编辑机构
export const editOrg = (data) => {
  return http.center.put('/v1/org/manager', data)
};
/* ----------机构详情-------- */
// 机构基本信息(基本信息/工商信息)
export const getOrg = (partyId) => {
  return http.center.get(`v1/party/org/manager/detail/${partyId}`)
};
// 机构联系人/企业法人代表信息
export const getOrgExtRel = (partyId, kinds) => {
  return http.center.get(`v1/party/rel/ext/list/${partyId}`, {
    params: {
      kinds
    }
  })
};
// 相关证件
export const getMaterialList = (partyId, kindList = []) => {
  return http.center.get(`v1/party/material/list/${partyId}`, {
    params: {
      kinds: kindList.join(',')
    }
  })
};

/*
 * 机构企业关系
 * */
// 机构关系列表
export const getOrgRelList = (params) => {
  return http.center.get('/v1/party/org/rel/list/page', {
    params
  })
};
// 新增机构关系
export const createOrgRel = (serviceType, val) => {
  delete val.partyRelDTO.serviceType;
  return http.center.post(`/v1/party/org/rel/${serviceType}`, val, {
    headers: {
      'X-Action-Code': window.__buttons['OrgRelCreate']
    }
  })
};
// 获取详情
export const orgRelDetail = (relId) => {
  return http.center.get(`/v1/party/org/rel/detail/${relId}`, {
    headers: {
      'X-Action-Code': window.__buttons['OrgRelDetail']
    }
  })
};
// 编辑机构关系
export const editOrgRel = (relId, fromParty, kind, toParty, uri, serviceType) => {
  return http.center.put(`/v1/party/org/rel/${relId}?serviceType=${serviceType}`, {
    partyRelDTO: {
      fromParty,
      kind,
      toParty
    },
    agrees: [{
      uri,
      kind
    }]
  })
};

// 开启关闭
export const switchOrgRelStatus = (relId, val) => {
  return http.center.put(`/v1/party/rel/status/${relId}/${val}`, null, {
    headers: {
      'X-Action-Code': window.__buttons['OrgRelEnableOrDisabled']
    }
  })
};
// 删除
export const deleteOrgRel = (relId) => {
  return http.center.delete(`/v1/party/rel/${relId}`, {
    headers: {
      'X-Action-Code': window.__buttons['OrgRelDelete']
    }
  })
};
// 相关协议
export const getOrgRelContract = (relId) => {
  return http.center.get(`/v1/party/org/rel/agree/${relId}`, {
    headers: {
      'X-Action-Code': window.__buttons['OrgRelDetail']
    }
  })
};
