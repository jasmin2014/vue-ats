import http from '../lib/http'

export const getMenuDetail = (id) => {
  return http.common.get(`v1/menu/get/${id}`)
};
export const insertMenuBefore = (id, data) => {
  data.id = id;
  data.actionName = data.tname;
  delete data.tname;
  return http.common.post('v1/menu/brother/before/add', data)
};
export const insertMenuAfter = (id, data) => {
  data.id = id;
  data.actionName = data.tname;
  delete data.tname;
  return http.common.post('v1/menu/brother/after/add', data)
};
export const appendChildMenu = (id, data) => {
  data.id = id;
  data.actionName = data.tname;
  delete data.tname;
  return http.common.post('v1/menu/sub/add', data)
};
export const editMenu = (data) => {
  data.actionName = data.tname;
  delete data.tname;
  return http.common.put('v1/menu', data)
};
export const deleteMenu = (appId, id) => {
  return http.common.delete(`v1/menu/${appId}/${id}`)
};
