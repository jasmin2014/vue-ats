import http from '../../lib/http'
/*
 * 机构列表
 * */
export const getOrgList = (params) => {
  return http.center.get('/v2/party/org/page', {
    params
  })
};
// 开启关闭
export const switchOrgStatus = (id, status) => {
  return http.center.put('/v2/party/org/status', null, {
    params: {
      id,
      status
    }
  })
};

// 新增机构
export const createOrg = (data) => {
  return http.center.post('/v2/party/org', data)
};
// 检查机构名称是否存在
export const checkOrgExisted = (params) => {
  return http.center.get('/v2/party/org/check/existed', {
    params
  })
};
// 编辑机构
export const editOrg = (data) => {
  return http.center.put('/v2/party/org', data)
};
/* ----------机构详情-------- */
// 机构基本信息(基本信息/工商信息)
export const getOrg = (id) => {
  return http.center.get(`/v2/party/org/${id}`)
};

/*
 * 机构企业关系
 * */
// 机构关系列表
export const getOrgRelList = (params) => {
  return http.center.get('/v2/party/org/relation/page', {
    params
  })
};
// 新增机构关系
export const createOrgRel = (val) => {
  return http.center.post('/v2/party/org/relation', val)
};

// 开启关闭
export const switchOrgRelStatus = (id, status) => {
  return http.center.put('/v2/party/org/relation', null, {
    params: {
      id,
      status
    }
  })
};
// 相关协议
export const getOrgRelContract = (fileOwner) => {
  return http.center.get(`/v2/party/org/material/${fileOwner}`)
};
