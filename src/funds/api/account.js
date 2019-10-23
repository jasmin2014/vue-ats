import http from '../../lib/http'
import routeMap from '../router';
import Utils from '../../lib/method'

export const getMenu = () => {
  return new Promise((resolve, reject) => {
    http.funds.get('v1/menu/action/login/list').then((response) => {
      const {data} = response;
      if (data.body && data.body.auth) {
        let routes = [data.body];
        routes[0].children = routes[0].children || [];
        if (routes[0].children.filter(_ => _.auth).length === 0) {
          routes[0].noRedirect = true;
        }
        routes[0].children.push({
          url: 'error',
          name: 'Error',
          tname: '错误',
          structureType: 'PAGE',
          auth: true,
          children: [{
            url: '404',
            name: 'ErrorNotFound',
            tname: '404',
            structureType: 'PAGE',
            auth: true
          }, {
            url: '401',
            name: 'ErrorUnauthorized',
            tname: '401',
            structureType: 'PAGE',
            auth: true
          }]
        });
        routes = Utils.$menuTransformer(routes, routeMap);
        routes.push({
          path: '*',
          redirect: '/error/404'
        });
        const buttons = Utils.$buttonAuths([data.body]);
        data.body = {
          routes,
          buttons
        };
        resolve(response)
      } else {
        Utils.$logout(() => {
          location.href = '/account/?role=0';
        });
        Utils.$removeLocalStorage('type');
      }
    }, (response) => {
      reject(response)
    })
  })
};

/** ======================= 角色 ===================== **/
export const getAuthList = () => {
  return http.funds.get('v1/menu/action/list')
};

export const getRoleList = (params) => {
  return http.funds.get('v1/role/list/page', {
    params
  })
};
export const getRoleDetail = (roleId) => {
  return http.funds.get(`v1/role/detail/${roleId}`)
};
export const createRole = (data) => {
  return http.funds.post('v1/role', data)
};
export const editRole = (roleId, data) => {
  data.roleId = roleId;
  return http.funds.put('v1/role', data)
};
export const deleteRole = (roleId) => {
  return http.funds.delete(`v1/role/${roleId}`)
};

/** ======================= 用户 ===================== **/
export const getUserList = (params) => {
  return http.funds.get('v1/login/user/list/page', {
    params
  })
};
export const getUserDetail = (id) => {
  return http.funds.get(`v1/login/user/detail/${id}`)
};
export const createUser = (data) => {
  return http.funds.post('v1/login/user', data)
};
export const editUser = (id, data) => {
  data.partyId = id;
  return http.funds.put('v1/login/user', data)
};
export const deleteUser = (partyId) => {
  return http.funds.delete(`v1/login/user/${partyId}`)
};
export const getRoleListByOrg = () => {
  return http.funds.get('v1/role/list/by/org')
};
export const getRoleListByUser = (partyId) => {
  return http.funds.get(`v1/user/role/list/${partyId}`)
};
export const saveUserRole = (partyId, roleIdList) => {
  return http.funds.post('v1/user/role', roleIdList, {
    params: {
      partyId
    }
  })
};
