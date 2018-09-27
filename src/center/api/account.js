import http from '../../lib/http'
import routeMap from '../router';
import Utils from '../../lib/method'

export const getMenu = () => {
  return new Promise((resolve, reject) => {
    http.center.get('v1/menu/action/login/list').then((response) => {
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
        if (NODE_ENV === 'development') {
          routes[0].children.push({
            url: 'menu-setting',
            name: 'MenuSetting',
            tname: '菜单设置',
            structureType: 'PAGE',
            auth: true
          });
        }
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
          location.href = '/account/?role=2';
        });
        Utils.$removeLocalStorage('type');
      }
    }, (response) => {
      reject(response)
    })
  })
};

/** ======================= 角色 ===================== **/
export const getAuthList = (appId) => {
  return http.center.get(`/v1/menu/action/list/by/app_id/${appId}`)
};

export const getRoleList = (params) => {
  return http.center.get('v1/role/list/page', {
    params
  })
};
export const getRoleDetail = (roleId, code) => {
  return http.center.get(`v1/role/detail/${roleId}`, {
    headers: {
      'X-Action-Code': code
    }
  })
};
export const createRole = (data) => {
  return http.center.post('v1/role', data, {
    headers: {
      'X-Action-Code': window.__buttons['AccountRoleCreate']
    }
  })
};
export const editRole = (roleId, data) => {
  data.roleId = roleId;
  return http.center.put('v1/role', data, {
    headers: {
      'X-Action-Code': window.__buttons['AccountRoleEdit']
    }
  })
};
export const deleteRole = (roleId) => {
  return http.center.delete(`v1/role/${roleId}`, {
    headers: {
      'X-Action-Code': window.__buttons['AccountRoleDelete']
    }
  })
};

/** ======================= 用户 ===================== **/
export const getUserList = (params) => {
  return http.center.get('v1/login/user/list/page', {
    params
  })
};
export const getUserDetail = (id, code) => {
  return http.center.get(`v1/login/user/detail/${id}`, {
    headers: {
      'X-Action-Code': code
    }
  })
};
export const createUser = (data) => {
  return http.center.post('v1/login/user', data, {
    headers: {
      'X-Action-Code': window.__buttons['AccountUserCreate']
    }
  })
};
export const editUser = (id, data) => {
  data.partyId = id;
  return http.center.put('v1/login/user', data, {
    headers: {
      'X-Action-Code': window.__buttons['AccountUserEdit']
    }
  })
};
export const deleteUser = (partyId) => {
  return http.center.delete(`v1/login/user/${partyId}`, {
    headers: {
      'X-Action-Code': window.__buttons['AccountUserDelete']
    }
  })
};
export const getRoleListByOrg = (orgManagerId, appId) => {
  return http.center.get(`v1/role/list/by/org/${orgManagerId}`, {
    params: {
      appId
    }
  })
};
export const getRoleListByUser = (partyId, code) => {
  return http.center.get(`v1/user/role/list/${partyId}`, {
    headers: {
      'X-Action-Code': code
    }
  })
};
export const saveUserRole = (partyId, roleIdList, code) => {
  return http.center.post('v1/user/role', roleIdList, {
    params: {
      partyId
    },
    headers: {
      'X-Action-Code': code
    }
  })
};
