import axios from 'axios';

const http = axios.create({
  baseURL: '/api/common/',
  timeout: 30000
});

const appId = APP_ID;// 用户中心appId
const appSecret = APP_SECRET;// 用户中心appSecret
const uCenterBaseURL = U_CENTER_BASE_URL;

// 验证是否本系统用户
export const checkPhone = (phone) => {
  return http.get(`v1/login/user/detail/by/mobile/${phone}`)
};

/** =====================登录================== **/
// 登录
export const doLogin = (phone, password) => {
  return http.post(`${uCenterBaseURL}/login/phone`, {
    appId,
    appSecret,
    password,
    phone
  })
};

// 获取用户业务端
export const getUserBusiness = (token) => {
  return http.get('v1/login/user/info', {
    headers: {
      Authorization: token
    }
  })
};
/** =====================激活/重置================== **/
// 发送激活/重置手机验证码
export const sendCode = (usage, phone, partyId) => {
  return http.post(`${uCenterBaseURL}/mock/send_code`, {
    appId,
    appSecret,
    phone,
    partyId,
    usage
  })
};

// 激活
export const doActivate = (phone, phoneCode, password, fullName) => {
  return http.post(`${uCenterBaseURL}/register/phone`, {
    appId,
    appSecret,
    password,
    phone,
    phoneCode,
    fullName
  })
};

// 重置密码
export const doResetPassword = (phone, phoneCode, newPassword) => {
  return http.put(`${uCenterBaseURL}/password/reset`, {
    appId,
    appSecret,
    phone,
    phoneCode,
    newPassword,
    encryptFlag: false
  })
};

