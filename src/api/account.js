import http from '../lib/http'

/** ======================= 用户 ===================== **/
export const getLoginUser = () => {
  return http.common.get('v1/login/user/info')
};
export const logout = () => {
  return http.common.post('v1/login/user/logout')
};
export const checkRoleBinded = (roleId) => {
  return http.common.get(`v1/login/user/check/${roleId}`)
};
export const changePassword = (password) => {
  return http.common.put('v1/login/user/reset/pwd', null, {
    params: {
      password
    }
  })
};
