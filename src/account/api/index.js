import axios from 'axios';

const http = axios.create({
  baseURL: '/api/common/',
  timeout: 30000
});

const appId = APP_ID;// 用户中心appId
const appSecret = APP_SECRET;// 用户中心appSecret
const uCenterBaseURL = U_CENTER_BASE_URL;
const uCenterTenantURL = U_CENTER_TENANT_URL;

// 验证是否本系统用户
export const checkPhone = (phone) => {
  return http.get(`v1/login/user/detail/by/mobile/${phone}`)
};

/** =====================登录================== **/
// 登录
export const doLogin = (email, password, encryptFlag = false) => {
  return http.post(`${uCenterBaseURL}/login/email`, {
    appId,
    email,
    password,
    encryptFlag
  })
};
// 检查账号状态
export const checkEmail = (email) => {
  return http.get('/v1/login/user/find/user/status', {
    params: {
      email
    }
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
// 发送激活/重置邮件
export const sendEmail = (email, emailType) => {
  let url = '';
  if (emailType === 'ACTIVE_USER') {
    url = '/account/active';
  } else if (emailType === 'RESET_PASSWORD') {
    url = '/account/reset';
  }
  return http.put(`${uCenterBaseURL}/email`, {
    appId,
    email,
    emailType,
    url: location.origin + url
  })
};
// 校验设置密码的code
export const checkCode = (code) => {
  return http.get(`${uCenterBaseURL}/email`, {
    params: {
      code
    }
  })
};

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
export const doActivate = (email, code, password, encryptFlag = false) => {
  return http.post(`${uCenterBaseURL}/register/active`, {
    appId,
    code,
    email,
    password,
    encryptFlag
  })
};

// 重置密码
export const doResetPassword = (email, code, newPassword, encryptFlag = false) => {
  return http.put(`${uCenterBaseURL}/password/email_reset`, {
    appId,
    email,
    code,
    newPassword,
    encryptFlag
  })
};

export const getPublicKey = () => {
  return http.get(`${uCenterTenantURL}/app/app_id_ucenter/pub_key`)
};
