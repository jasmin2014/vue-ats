import http from '../../lib/http'

export const getEnumList = (params) => {
  return http.center.get('/v2/sys/enum', {
    params
  })
};
export const createEnum = (data) => {
  return http.center.post('/v2/sys/enum', data)
};
export const editEnum = (data) => {
  return http.center.put('/v2/sys/enum', data)
};

export const getConstantList = (params) => {
  return http.center.get('/v2/sys/dict', {
    params
  })
};
export const createConstant = (data) => {
  return http.center.post('/v2/sys/dict', data)
};
export const editConstant = (data) => {
  return http.center.put('/v2/sys/dict', data)
};

export const addOrgKeyConfig = (data) => {
  return http.common.post('/v2/sys/admin/_save-party-org-key', data);
};
export const editOrgKeyConfig = (data) => {
  return http.common.put('/v2/sys/admin/_update-party-org-key', data);
};
export const getOrgKeyList = () => {
  return http.common.get('/v2/sys/admin/org/key/list')
};

export const getTaskList = (params) => {
  return http.schedule.get('/scheduled/admin/log/page', { params })
};
