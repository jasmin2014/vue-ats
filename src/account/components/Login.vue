<!-- 登录 -->
<template>
  <div class="login">
    <div class="wrapper">
      <h2>登录</h2>
      <section class="phone">
        <el-input v-model.trim="login.phone"
                  ref="phone"
                  placeholder="请输入手机号"
                  autofocus
                  @input="handlePhoneChange"
                  @keyup.native.enter="handleLogin"></el-input>
        <p class="hint" v-if="!isActive">
          您的账号未激活，
          <router-link :to="{name: 'Active', params: {phone: login.phone}}">立即去激活</router-link>
        </p>
      </section>
      <section class="password">
        <el-input v-model="login.password"
                  ref="password"
                  placeholder="请输入密码"
                  type="password"
                  @input="handlePasswordChange"
                  @keyup.native.enter="handleLogin"></el-input>
      </section>
      <section class="forget-password">
        <router-link :to="{name: 'Reset', params: {phone: login.phone}}" title="忘记密码，去重置">忘记密码</router-link>
      </section>
      <section class="action">
        <el-button type="primary"
                   :loading="loading"
                   @click="handleLogin">立即登录
        </el-button>
      </section>
    </div>
    <el-dialog title="选择业务端" :visible.sync="showDialog" width="400px" center>
      <el-row type="flex" justify="center">
        <el-select v-model="path">
          <el-option v-for="end in authList" :label="end.name" :value="end.path" :key="end.path"></el-option>
        </el-select>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="handleConfirmChoose">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {checkPhone, doLogin, getUserBusiness} from '../api'
  import Utils from '../../lib/method'

  const ILLEGAL_PHONE = 'ILLEGAL_PHONE';
  const NULL_PASSWORD = 'NULL_PASSWORD';

  const IS_CHECKING = 'IS_CHECKING';
  const NO_AUTHORITY = 'NO_AUTHORITY';
  const NOT_ACTIVATED = 'NOT_ACTIVATED';
  const NETWORK_ERROR = 'NETWORK_ERROR';

  const PASSWORD_ERROR = 'PASSWORD_ERROR';
  const phoneRegexp = /^1[34578]\d{9}$/;
  const BUSINESS_END_LIST = [
    {
      path: '/funds.html',
      name: '资金端'
    },
    {
      path: '/assets.html',
      name: '资产端'
    },
    {
      path: '/center.html',
      name: '资产中心'
    },
    {
      path: '/chain-funds.html',
      name: '链上资金端'
    },
    {
      path: '/chain-assets.html',
      name: '链上资产端'
    }
  ];

  export default {
    data() {
      return {
        login: {
          phone: this.$route.params.phone,
          password: ''
        },
        isActive: true,
        loading: false,
        showDialog: false,
        authList: [],
        path: ''
      }
    },
    mounted() {
      if (this.$route.query.redirect) {
        this.$alert('登录会话过期，请重新登录', '提示');
      } else if (this.$route.query.role) {
        if (BUSINESS_END_LIST[this.$route.query.role] && BUSINESS_END_LIST[this.$route.query.role].name) {
          this.$alert(`您没有${BUSINESS_END_LIST[this.$route.query.role].name}的权限`, '提示');
        } else {
          this.$alert('您没有权限', '提示');
        }
      } else {
        const partyType = Utils.$getLocalStorage('type');
        if (partyType !== null && !isNaN(partyType)) {
          location.href = BUSINESS_END_LIST[partyType].path;
        }
      }
      this.$refs.phone.$refs.input.focus();
      if (!this.login.phone && Utils.$getLocalStorage('user')) {
        const phone = Utils.$getLocalStorage('user').phone;
        if (phone) {
          this.login.phone = phone;
        }
      }
    },
    methods: {
      handlePhoneChange(phone) {
        this.$refs.phone.$refs.input.classList.remove('error');
        this.isActive = true;
        if (phoneRegexp.test(phone)) {
          this.checkPhone(phone).then(() => {
          }, () => {
          });
        }
      },
      handlePasswordChange(password) {
        if (password) {
          this.$refs.password.$refs.input.classList.remove('error');
        }
      },
      handleLogin() {
        const phone = this.login.phone;
        if (!phoneRegexp.test(phone)) { // 非法手机号
          this.$refs.phone.$refs.input.focus();
          this.$refs.phone.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(ILLEGAL_PHONE),
            type: 'error'
          });
        } else if (!this.login.password) { // 空密码
          this.$refs.password.$refs.input.focus();
          this.$refs.password.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(NULL_PASSWORD),
            type: 'error'
          });
        } else { // 验证手机号
          this.loading = true;
          this.checkPhone(phone).then(() => {
            this.doLogin(this.login.phone, this.login.password);
          }, (type) => {
            this.loading = false;
            if (type === NO_AUTHORITY) {
              this.$refs.phone.$refs.input.focus();
              this.$refs.phone.$refs.input.classList.add('error');
            }
            this.$message({
              message: this.getMessageByIllegalType(type),
              type: 'error'
            });
          });
        }
      },
      handleConfirmChoose() {
        if (!this.path) {
          this.$message({
            message: '请先选择业务端',
            type: 'warning'
          });
          return;
        }
        location.href = this.path;
      },
      checkPhone(phone) {
        return new Promise((resolve, reject) => {
          checkPhone(phone).then(response => {
            const res = response.data;
            if (res.code === 200) {
              if (res.body.isActivate) {
                resolve(res.body);
              } else {
                this.loading = false;
                this.isActive = false;
              }
            } else if (res.code === 40004) {
              reject(NO_AUTHORITY)
            } else {
              reject(res.message)
            }
          }, ({response}) => {
            if (response && response.status === 400) {
              reject(response.data && response.data.message ? response.data.message : NETWORK_ERROR)
            } else {
              reject(NETWORK_ERROR)
            }
          })
        })
      },
      doLogin(phone, password) {
        doLogin(phone, password).then(response => {
          this.loading = false;
          const res = response.data;
          if (res.code === '200') {
            this.loading = true;
            const token = res.body.token;
            this.doChoose(token);
            Utils.$setLocalStorage('token', token);
          } else if (res.code === '202002') { // 密码错误
            this.$refs.password.$refs.input.focus();
            this.$refs.password.$refs.input.classList.add('error');
            this.$message({
              message: this.getMessageByIllegalType(PASSWORD_ERROR),
              type: 'error'
            })
          } else if (res.code === '202001') { // 未激活
            this.isActive = false;
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }, () => {
          this.loading = false;
          this.$message({
            message: this.getMessageByIllegalType(NETWORK_ERROR),
            type: 'error'
          })
        })
      },
      doChoose(token) {
        getUserBusiness(token).then(response => {
          this.loading = false;
          const res = response.data;
          if (res.code === 200) {
            const authList = Utils.$binaryToArray(res.body.orgMgrPartyType);
            if (authList.length === 1) {
              location.href = BUSINESS_END_LIST[authList[0]].path;
            } else if (authList.length > 1) {
              this.authList = authList.map(_ => BUSINESS_END_LIST[_] || {});
              this.showDialog = true;
            }
          }
        }).catch(({response}) => {
          if (response) {
            const {data, status} = response;
            this.loading = false;
            this.$message({
              message: status === 401 ? data.message : this.getMessageByIllegalType(NETWORK_ERROR),
              type: 'error'
            })
          } else {
            this.$message.error(this.getMessageByIllegalType(NETWORK_ERROR))
          }
        });
      },
      getMessageByIllegalType(type) {
        let msg = '';
        switch (type) {
          case ILLEGAL_PHONE:
            msg = '请输入正确的手机号';
            break;
          case NULL_PASSWORD:
            msg = '请输入密码';
            break;
          case IS_CHECKING:
            msg = '正在检测账号安全';
            break;
          case NO_AUTHORITY:
            msg = '没有系统权限';
            break;
          case NOT_ACTIVATED:
            msg = '尚未激活';
            break;
          case NETWORK_ERROR:
            msg = '您的网络有问题，请稍后再试';
            break;
          case PASSWORD_ERROR:
            msg = '密码错误';
            break;
          default:
            msg = type;
            break;
        }
        return msg;
      }
    }
  }
</script>
<style lang="scss">
  .login {
    .phone {
      .hint {
        padding-left: 23px;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        background: url("../../pages/img/icon-warning.png") left no-repeat;
        color: #ff5555;

        a {
          color: #0066f6;
        }
      }
    }

    .forget-password {
      overflow: hidden;
      min-height: 40px !important;

      a {
        float: right;
      }
    }
  }
</style>
