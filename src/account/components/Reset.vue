<!-- 重置密码 -->
<template>
  <div class="reset">
    <div class="wrapper">
      <h2 v-if="emailType === 'ACTIVE_USER'">账号激活</h2>
      <h2 v-else-if="emailType === 'RESET_PASSWORD'">重置密码</h2>
      <el-form v-if="!checking && codeValid"
               ref="form"
               :model="reset"
               :rules="rules">
        <section class="hint">
          <p v-if="emailType === 'ACTIVE_USER'">您正在激活 {{ reset.email }} 的账号，请按照提示完成操作。</p>
          <p v-else-if="emailType === 'RESET_PASSWORD'">您正在重置 {{ reset.email }} 的密码，请按照提示完成操作。</p>
        </section>
        <section>
          <el-form-item prop="password" :error="passwordError">
            <el-input v-model="reset.password"
                      ref="password"
                      type="password"
                      placeholder="请输入6-20位密码，包含数字、字母或符号"
                      @input="handlePasswordChange"
                      @keyup.native.enter="handleConfirm"></el-input>
          </el-form-item>
        </section>
        <section>
          <el-form-item prop="repeatPassword">
            <el-input v-model="reset.repeatPassword"
                      ref="repeatPassword"
                      type="password"
                      placeholder="再次输入密码"
                      @input="handlePasswordChange"
                      @keyup.native.enter="handleConfirm"></el-input>
          </el-form-item>
        </section>
        <section class="action">
          <el-button type="primary"
                     :loading="loading"
                     @click="handleConfirm">确定
          </el-button>
        </section>
      </el-form>
      <div v-else>
        <section class="hint">
          <p v-if="checking">正在检验...</p>
          <p v-else>{{ errorMsg }}</p>
        </section>
        <section class="action">
          <el-button v-if="serverError"
                     type="primary"
                     :loading="checking"
                     @click="checkCode(code)">重试
          </el-button>
          <el-button v-else
                     type="primary"
                     :loading="checking"
                     @click="handleLogin">去登录
          </el-button>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
  import {JSEncrypt} from 'js-encrypt';
  import {
    checkCode,
    doActivate,
    doResetPassword,
    getPublicKey
  } from '../api'
  import Valid from '../../lib/validation'

  const ILLEGAL_PHONE = 'ILLEGAL_PHONE';
  const ILLEGAL_EMAIL = 'ILLEGAL_EMAIL';
  const ILLEGAL_PASSWORD = 'ILLEGAL_PASSWORD';
  const ILLEGAL_PASSWORD_NO_SPACE = 'ILLEGAL_PASSWORD_NO_SPACE';
  const NULL_CODE = 'NULL_CODE';
  const NULL_PASSWORD = 'NULL_PASSWORD';
  const INCONSISTENT_PASSWORD = 'INCONSISTENT_PASSWORD';
  const NO_AUTHORITY = 'NO_AUTHORITY';
  const NETWORK_ERROR = 'NETWORK_ERROR';
  const SEND_CODE_SUCCESS = 'SEND_CODE_SUCCESS';
  const SEND_CODE_FAILED = 'SEND_CODE_FAILED';
  const USAGE_ACTIVATE = 'ACTIVE_USER';
  const USAGE_RESET = 'RESET_PASSWORD';
  const emailRegexp = Valid.email;

  const CODE_CHECK_CODE_EXPIRED = '204c8473d1c477f215b';
  const CODE_CHECK_CODE_NULL = '2060125bac776a31f7e';
  const CODE_ILLEGA_PASSWORD_NO_SPACE = '202f2a8bf47d8e7668c';
  const CODE_PASSWORD_WRONG = '20289dcf71090e7c8ef';
  const CODE_ILLEGAL_PASSWORD = '20289dcf71090e7c8ef';

  const encrypt = new JSEncrypt();

  export default {
    data() {
      return {
        reset: {
          email: '',
          password: '',
          repeatPassword: '',
          code: ''
        },
        passwordError: '',
        emailType: this.$route.meta.type,
        loading: false,
        checking: false,
        serverError: false,
        errorMsg: '',
        code: this.$route.query.code,
        codeValid: false,
        hasPubKey: false,
        rules: {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (value.indexOf(' ') > -1) {
                  callback(this.getMessageByIllegalType(ILLEGAL_PASSWORD_NO_SPACE))
                } else if (!value.match(new RegExp('(?!^[0-9]+$)(?!^[a-zA-Z]+$)(?!^[^a-zA-Z0-9]+$)^.{6,20}$'))) {
                  callback(this.getMessageByIllegalType(ILLEGAL_PASSWORD))
                } else {
                  callback();
                }
              }
            }
          ],
          repeatPassword: [
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (value !== this.reset.password) {
                  callback(this.getMessageByIllegalType(INCONSISTENT_PASSWORD));
                } else {
                  callback();
                }
              }
            }
          ]
        }
      }
    },

    destroyed() {
      this.$off('load-pub-key');
    },
    created() {
      this.checkCode(this.code);
      this.getPublicKey().then(() => {
        this.hasPubKey = true;
        this.$emit('load-pub-key');
      }).catch(() => {
        this.hasPubKey = false;
      })
    },
    mounted() {
      if (this.$refs.password) {
        this.$refs.password.$refs.input.focus();
      }
    },

    methods: {
      handleLogin() {
        this.$router.replace({
          name: 'Login'
        })
      },
      handlePasswordChange(password) {
        this.passwordError = '';
      },
      handleConfirm() {
        const email = this.reset.email;
        const code = this.reset.code;
        const password = this.reset.password;

        this.$refs.form.validate(valid => {
          console.log(valid);
          if (valid) {
            this.loading = true;
            this.doConfirm(this.emailType, email, code, password).then((msg) => {
              this.loading = false;
              this.$alert(msg, '提示', {
                confirmButtonText: '去登录',
                type: 'success',
                callback: () => {
                  this.$router.push({ name: 'Login', params: { email } })
                }
              });
            }, (type) => {
              this.loading = false;
              this.$message({
                message: this.getMessageByIllegalType(type),
                type: 'error'
              })
            });
          }
        })
      },
      checkCode(code) {
        this.checking = true;
        this.serverError = false;
        this.errorMsg = '';
        checkCode(code).then(({ data }) => {
          this.checking = false;
          if (data.code == 200) {
            this.codeValid = true;
            this.reset.email = data.body.email;
            this.reset.code = data.body.code;
            this.emailType = data.body.emailType;
          } else {
            this.codeValid = false;
            this.errorMsg = data.message;
          }
        }).catch((error) => {
          this.checking = false;
          this.serverError = true;
          if (error) {
            const { response } = error;
            if (error.message && error.message.indexOf('timeout') !== -1) {
              this.errorMsg = '请求超时';
            } else {
              this.errorMsg = response && response.data && response.data.message ? response.data.message : '服务器错误';
            }
          } else {
            this.errorMsg = '服务器错误';
          }
        })
      },
      doConfirm(emailType, email, code, password) {
        return new Promise((resolve, reject) => {
          this.guaranteePubKey(() => {
            let promise;
            const encrypted = encrypt.encrypt(password);

            if (emailType === USAGE_ACTIVATE) {
              promise = doActivate(email, code, encrypted, true)
            } else if (emailType === USAGE_RESET) {
              promise = doResetPassword(email, code, encrypted, true)
            }

            promise.then(({ data }) => {
              if (data.code == 200) {
                resolve('操作成功');
              } else if (data.code === CODE_CHECK_CODE_EXPIRED) { // 邮件已失效
                this.codeValid = false;
                reject(data.message)
              } else {
                switch (data.code) {
                  case CODE_ILLEGA_PASSWORD_NO_SPACE:
                  case CODE_ILLEGAL_PASSWORD:
                  case CODE_PASSWORD_WRONG:
                    this.passwordError = data.message;
                    break;
                  default:
                    reject(data.message);
                    break;
                }
              }
            }, () => {
              reject(NETWORK_ERROR)
            })
          })
        })
      },
      guaranteePubKey(done) {
        if (this.hasPubKey) {
          done();
        } else {
          this.$once('load-pub-key', () => {
            done();
          })
        }
      },
      getPublicKey() {
        return new Promise((resolve, reject) => {
          getPublicKey().then(({ data }) => {
            if (data.code == 200) {
              encrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----\n${data.body.publicKey}\n-----END PUBLIC KEY-----`);
              resolve(data.body.publicKey);
            } else {
              reject();
            }
          }).catch((e) => {
            reject();
          })
        })
      },
      getMessageByIllegalType(type) {
        let msg = '';
        switch (type) {
          case ILLEGAL_PHONE:
            msg = '请输入正确的手机号';
            break;
          case ILLEGAL_EMAIL:
            msg = '请输入正确的邮箱地址';
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
            msg = '重置链接有误';
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
<style lang="scss" scoped>
  .reset {
    section {
      &.hint {
        height: 22px !important;

        p {
          padding-left: 23px;
          font-size: 14px;
          line-height: 1.5;
          background: url("../../pages/img/icon-warning.png") left 3px no-repeat;
          color: #ff5555;
        }
      }
    }

    .action {
      margin-top: 8px;
    }
  }
</style>
