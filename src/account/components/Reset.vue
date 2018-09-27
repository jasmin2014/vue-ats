<!-- 重置密码 -->
<template>
  <div :class="this.$route.meta.type">
    <div class="wrapper">
      <h2>{{ this.$route.meta.type === 'active' ? '账号激活' : '重置密码' }}</h2>
      <section class="phone">
        <el-input v-model.trim="reset.phone"
                  ref="phone"
                  placeholder="请输入手机号"
                  autofocus
                  @input="handlePhoneChange"
                  @keyup.native.enter="handleConfirm"></el-input>
      </section>
      <section>
        <el-input v-model.trim="reset.code"
                  ref="code"
                  placeholder="请输入验证码"
                  @input="handleCodeChange"
                  @keyup.native.enter="handleConfirm"></el-input>
        <button class="btn-code"
                :disabled="disabledCode"
                tabindex="-1"
                @click="handleCode">{{ btnCountDown || '获取验证码' }}
        </button>
      </section>
      <section>
        <el-input v-model="reset.password"
                  ref="password"
                  type="password"
                  placeholder="请输入6-20位密码，包含数字、字母或符号"
                  @input="handlePasswordChange"
                  @keyup.native.enter="handleConfirm"></el-input>
      </section>
      <section>
        <el-input v-model="repeatPassword"
                  ref="repeatPassword"
                  type="password"
                  placeholder="再次输入密码"
                  @input="handlePasswordChange"
                  @keyup.native.enter="handleConfirm"></el-input>
      </section>
      <section class="action">
        <el-button type="primary"
                   :loading="loading"
                   @click="handleConfirm">确定
        </el-button>
      </section>
    </div>
  </div>
</template>
<script>
  import {checkPhone, sendCode, doActivate, doResetPassword} from '../api'

  const ILLEGAL_PHONE = 'ILLEGAL_PHONE';
  const ILLEGAL_PASSWORD = 'ILLEGAL_PASSWORD';
  const ILLEGAL_PASSWORD_NO_SPACE = 'ILLEGAL_PASSWORD_NO_SPACE';
  const NULL_CODE = 'NULL_CODE';
  const NULL_PASSWORD = 'NULL_PASSWORD';
  const INCONSISTENT_PASSWORD = 'INCONSISTENT_PASSWORD';
  const NO_AUTHORITY = 'NO_AUTHORITY';
  const NETWORK_ERROR = 'NETWORK_ERROR';
  const SEND_CODE_SUCCESS = 'SEND_CODE_SUCCESS';
  const SEND_CODE_FAILED = 'SEND_CODE_FAILED';
  const USAGE_ACTIVATE = 'REGISTER';
  const USAGE_RESET = 'RESET_PASSWORD';
  const phoneRegexp = /^1[34578]\d{9}$/;

  export default {
    data() {
      return {
        reset: {
          phone: this.$route.params.phone,
          password: ''
        },
        repeatPassword: '',
        loading: false,
        disabledCode: true,
        btnCountDown: ''
      }
    },
    mounted() {
      this.$refs.phone.$emit('input', this.reset.phone);
      this.$refs.phone.$refs.input.focus();
    },
    methods: {
      handlePhoneChange(phone) {
        this.disabledCode = !phoneRegexp.test(phone);
        this.$refs.phone.$refs.input.classList.remove('error');
      },
      handleCode() {
        const phone = this.reset.phone;
        this.checkPhone(phone).then((res) => {
          const { usage, user } = res;
          this.sendCode(usage, phone, user.partyId)
        }, (type) => {
          this.$message({
            message: this.getMessageByIllegalType(type),
            type: 'error'
          })
        })
      },
      handleCodeChange(code) {
        if (code) {
          this.$refs.code.$refs.input.classList.remove('error');
        }
      },
      handlePasswordChange(password) {
        if (password) {
          this.$refs.password.$refs.input.classList.remove('error');
          this.$refs.repeatPassword.$refs.input.classList.remove('error');
        }
      },
      handleConfirm() {
        const phone = this.reset.phone;
        const code = this.reset.code;
        const password = this.reset.password;
        const repeatPassword = this.repeatPassword;

        if (!phoneRegexp.test(phone)) { // 非法手机号
          this.$refs.phone.$refs.input.focus();
          this.$refs.phone.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(ILLEGAL_PHONE),
            type: 'error'
          });
        } else if (!code) { // 空验证码
          this.$refs.code.$refs.input.focus();
          this.$refs.code.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(NULL_CODE),
            type: 'error'
          });
        } else if (!password) { // 空密码
          this.$refs.password.$refs.input.focus();
          this.$refs.password.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(NULL_PASSWORD),
            type: 'error'
          });
        } else if (repeatPassword !== password) { // 密码不一致
          this.$refs.password.$refs.input.focus();
          this.$refs.password.$refs.input.classList.add('error');
          this.$refs.repeatPassword.$refs.input.classList.add('error');
          this.$message({
            message: this.getMessageByIllegalType(INCONSISTENT_PASSWORD),
            type: 'error'
          });
        } else if (!password.match(new RegExp('(?!^[0-9]+$)(?!^[a-zA-Z]+$)(?!^[^a-zA-Z0-9]+$)^.{6,20}$')) ||
          password.indexOf(' ') > -1) { // 密码不合规
          this.$refs.password.$refs.input.focus();
          this.$refs.password.$refs.input.classList.add('error');
          this.$refs.repeatPassword.$refs.input.classList.add('error');
          if (password.indexOf(' ') > -1) {
            this.$message({
              message: this.getMessageByIllegalType(ILLEGAL_PASSWORD_NO_SPACE),
              type: 'error'
            });
          } else {
            this.$message({
              message: this.getMessageByIllegalType(ILLEGAL_PASSWORD),
              type: 'error'
            });
          }
        } else {
          this.loading = true;
          this.checkPhone(phone).then((res) => {
            const { usage, user } = res;
            this.doConfirm(usage, phone, code, password, user).then((msg) => {
              this.loading = false;
              this.$alert(msg, '提示', {
                confirmButtonText: '去登录',
                type: 'success',
                callback: () => {
                  this.$router.push({ name: 'Login', params: { phone } })
                }
              });
            }, (type) => {
              this.loading = false;
              this.$message({
                message: this.getMessageByIllegalType(type),
                type: 'error'
              })
            });
          }, (type) => {
            this.loading = false;
            this.$message({
              message: this.getMessageByIllegalType(type),
              type: 'error'
            });
          })
        }
      },
      checkPhone(phone) {
        return new Promise((resolve, reject) => {
          checkPhone(phone).then(response => {
            const res = response.data;
            if (res.code === 200) {
              if (res.body.isActivate) {
                resolve({ usage: USAGE_RESET, user: res.body })
              } else {
                resolve({ usage: USAGE_ACTIVATE, user: res.body })
              }
            } else if (res.code === 40004) {
              reject(NO_AUTHORITY)
            } else {
              reject(res.message)
            }
          }, (error) => {
            const response = error.response;
            if (response && response.status === 400) {
              reject(response.data && response.data.message ? response.data.message : NETWORK_ERROR)
            } else {
              reject(NETWORK_ERROR)
            }
          })
        })
      },
      sendCode(usage, phone, partyId) {
        sendCode(usage, phone, partyId).then((response) => {
          const res = response.data;
          if (res.code == 200) {
            this.countDown(60);
            this.$message({
              message: this.getMessageByIllegalType(SEND_CODE_SUCCESS),
              type: 'success'
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            message: this.getMessageByIllegalType(NETWORK_ERROR),
            type: 'error'
          })
        })
      },
      doConfirm(usage, phone, code, password, user) {
        return new Promise((resolve, reject) => {
          if (usage === USAGE_ACTIVATE) {
            doActivate(phone, code, password, user.realName).then(response => {
              const res = response.data;
              if (res.code == 200) {
                resolve('激活成功')
              } else if (res.code == '201002') {
                if (res.message.indexOf('手机') > -1) {
                  this.$refs.phone.$refs.input.focus();
                  this.$refs.phone.$refs.input.classList.add('error');
                } else if (res.message.indexOf('验证码') > -1) {
                  this.$refs.code.$refs.input.focus();
                  this.$refs.code.$refs.input.classList.add('error');
                } else if (res.message.indexOf('密码') > -1) {
                  this.$refs.password.$refs.input.focus();
                  this.$refs.password.$refs.input.classList.add('error');
                  this.$refs.repeatPassword.$refs.input.classList.add('error');
                }
                reject(res.message)
              } else if (res.code == '202002') {
                this.$refs.code.$refs.input.focus();
                this.$refs.code.$refs.input.classList.add('error');
                reject(res.message)
              } else {
                reject(res.message)
              }
            }, () => {
              reject(NETWORK_ERROR)
            })
          } else if (usage === USAGE_RESET) {
            doResetPassword(phone, code, password).then(response => {
              const res = response.data;
              if (res.code == 200) {
                resolve('重置成功')
              } else if (res.code == '201002') {
                if (res.message.indexOf('手机') > -1) {
                  this.$refs.phone.$refs.input.focus();
                  this.$refs.phone.$refs.input.classList.add('error');
                } else if (res.message.indexOf('验证码') > -1) {
                  this.$refs.code.$refs.input.focus();
                  this.$refs.code.$refs.input.classList.add('error');
                } else if (res.message.indexOf('密码') > -1) {
                  this.$refs.password.$refs.input.focus();
                  this.$refs.password.$refs.input.classList.add('error');
                  this.$refs.repeatPassword.$refs.input.classList.add('error');
                }
                reject(res.message)
              } else if (res.code == '202002') {
                this.$refs.code.$refs.input.focus();
                this.$refs.code.$refs.input.classList.add('error');
                reject(res.message)
              } else {
                reject(res.message)
              }
            }, () => {
              reject(NETWORK_ERROR)
            })
          }
        })
      },
      countDown(sec) {
        if (sec >= 0) {
          this.disabledCode = true;
          this.btnCountDown = `剩余${sec}s`;
          setTimeout(() => {
            this.countDown(--sec);
          }, 1000)
        } else {
          this.disabledCode = false;
          this.btnCountDown = '';
        }
      },
      getMessageByIllegalType(type) {
        let msg = '';
        switch (type) {
          case ILLEGAL_PHONE:
            msg = '请输入正确的手机号';
            break;
          case ILLEGAL_PASSWORD:
            msg = '密码为6-20位数字、字母或符号';
            break;
          case ILLEGAL_PASSWORD_NO_SPACE:
            msg = '密码不能包含空格';
            break;
          case NULL_PASSWORD:
            msg = '请输入密码';
            break;
          case NULL_CODE:
            msg = '请输入验证码';
            break;
          case INCONSISTENT_PASSWORD:
            msg = '两次密码不一致';
            break;
          case NO_AUTHORITY:
            msg = '没有系统权限';
            break;
          case NETWORK_ERROR:
            msg = '您的网络有问题，请稍后再试';
            break;
          case SEND_CODE_FAILED:
            msg = '发送验证码失败';
            break;
          case SEND_CODE_SUCCESS:
            msg = '发送成功';
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
  .reset, .active {
    .btn-code {
      position: absolute;
      right: 18px;
      top: 8px;
      width: 90px;
      height: 28px;
      font-size: 12px;
      border: none;
      outline: none;
      background: #fbf2f2;
      color: #ff5555;
      cursor: pointer;
      border-radius: 14px;
      &:disabled {
        background: none;
        color: #cccccc;
        border: 1px solid #e5e5e5;
        cursor: not-allowed;
      }
    }

    .remember-password {
      overflow: hidden;
      min-height: 40px !important;

      a {
        float: right;
      }
    }

    .action {
      margin-top: 8px;
    }
  }
</style>
