<!-- 登录 -->
<template>
  <div class="login">
    <div class="wrapper">
      <h2>登录</h2>
      <p class="hint" v-if="!isActive">
        您的账号未激活，
        <router-link :to="{name: 'ActivateEmail', query: {email: encodeURIComponent(email)}}">立即去激活</router-link>
      </p>
      <el-form ref="form"
               :model="login"
               :rules="rules">
        <section class="email">
          <el-row>
            <el-col :span="12">
              <el-form-item ref="emailName"
                            prop="emailName" :error="emailError">
                <el-input v-model.trim="login.emailName"
                          ref="email"
                          placeholder="请输入邮箱"
                          name="email"
                          type="text"
                          autofocus
                          clearable
                          @keyup.native.enter="handleLogin"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item ref="emailSuffix"
                            prop="emailSuffix">
                <el-select v-model="login.emailSuffix"
                           ref="suffix"
                           placeholder="@"
                           clearable>
                  <el-option v-for="suffix in emailSuffixList"
                             :label="`@${suffix}`"
                             :value="suffix"
                             :key="suffix"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </section>
        <section class="password">
          <el-form-item prop="password" :error="passwordError">
            <el-input v-model="login.password"
                      ref="password"
                      placeholder="请输入密码"
                      type="password"
                      @input="handlePasswordChange"
                      @keyup.native.enter="handleLogin"></el-input>
          </el-form-item>
        </section>
        <section class="forget-password">
          <button title="忘记密码，去重置"
                  type="button"
                  @click="handleForget">忘记密码</button>
        </section>
        <section class="action">
          <el-button type="primary"
                     :loading="loading"
                     @click="handleLogin">立即登录
          </el-button>
        </section>
      </el-form>
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
  import {JSEncrypt} from 'js-encrypt';
  import {
    checkEmail,
    doLogin,
    getUserBusiness,
    getPublicKey
  } from '../api'
  import Utils from '../../lib/method'
  import Valid from '../../lib/validation'
  import EMAIL_SUFFIX from '../../lib/email-suffix'

  const ILLEGAL_PHONE = 'ILLEGAL_PHONE';
  const ILLEGAL_EMAIL = 'ILLEGAL_EMAIL';
  const ILLEGAL_SUFFIX_NULL = 'ILLEGAL_SUFFIX_NULL';
  const NULL_PASSWORD = 'NULL_PASSWORD';

  const IS_CHECKING = 'IS_CHECKING';
  const NO_AUTHORITY = 'NO_AUTHORITY';
  const NOT_ACTIVATED = 'NOT_ACTIVATED';
  const NETWORK_ERROR = 'NETWORK_ERROR';

  const PASSWORD_ERROR = 'PASSWORD_ERROR';
  const emailRegexp = Valid.email;
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
    }
  ];

  const encrypt = new JSEncrypt();

  export default {
    data() {
      return {
        emailSuffixList: EMAIL_SUFFIX,
        login: {
          emailName: '',
          emailSuffix: '',
          password: ''
        },
        isActive: true,
        loading: false,
        showDialog: false,
        authList: [],
        path: '',
        rules: {
          emailName: [
            { required: true, message: '请输入邮箱名', trigger: 'change' },
            { pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))$/, message: '请输入正确的邮箱名', trigger: 'change' }
          ],
          emailSuffix: [
            { required: true, message: '请选择邮箱后缀', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
        },
        emailError: '',
        passwordError: '',
        emailValid: false,
        hasPubKey: false
      }
    },
    computed: {
      email: {
        get() {
          if (this.login.emailName && this.login.emailSuffix) {
            return `${this.login.emailName}@${this.login.emailSuffix}`;
          } else {
            return '';
          }
        },
        set(val) {
          const list = val.split('@');
          if (list.length > 1) {
            this.login.emailName = list.slice(0, list.length - 1).join('@');
            this.login.emailSuffix = list[list.length - 1];
          }
        }
      }
    },
    watch: {
      '$route.params.email'(val, oldVal) {
        this.email = val;
      },
      email(val, oldVal) {
        this.handleEmailChange(val)
      }
    },

    destroyed() {
      this.$off('load-pub-key');
    },
    created() {
      this.getPublicKey().then(() => {
        this.hasPubKey = true;
        this.$emit('load-pub-key');
      }).catch(() => {
        this.hasPubKey = false;
      })
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
      this.$refs.email.focus();
      if (this.$route.params.email) {
        this.email = this.$route.params.email;
      } else if (Utils.$getLocalStorage('user')) {
        const email = Utils.$getLocalStorage('user').email;
        if (email) {
          this.email = email;
        }
      }
    },

    methods: {
      handleEmailChange(email) {
        // 邮箱有变化
        this.emailError = ''; // 去掉错误标识
        this.isActive = true; // 默认激活
        if (emailRegexp.test(email)) {
          this.emailValid = true;
          this.checkEmail(email).then(() => {}).catch(() => {});
        } else {
          this.emailValid = false;
        }
      },
      handlePasswordChange(val) {
        this.passwordError = '';
      },
      handleLogin() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true;
            this.emailError = ''; // 去掉错误标识
            this.checkEmail(this.email).then(() => {
              this.doLogin(this.email, this.login.password);
            }, (type) => {
              this.loading = false;
              if (type === NO_AUTHORITY) {
                this.emailError = this.getMessageByIllegalType(type);
              } else {
                this.$message({
                  message: this.getMessageByIllegalType(type),
                  type: 'error'
                });
              }
            });
          }
        })
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
      handleForget() {
        if (this.emailValid) {
          this.emailError = ''; // 去掉错误标识
          this.checkEmail(this.email).then(() => {
            this.$router.push({
              name: 'ResetEmail',
              query: {
                email: encodeURIComponent(this.email)
              }
            })
          }, (type) => {
            if (type === NO_AUTHORITY) {
              this.emailError = this.getMessageByIllegalType(type);
            } else {
              this.$message({
                message: this.getMessageByIllegalType(type),
                type: 'error'
              });
            }
          })
        } else {
          this.$refs.form.validateField('emailName');
          this.$refs.form.validateField('emailSuffix');
        }
      },

      checkEmail(email) {
        return new Promise((resolve, reject) => {
          checkEmail(email).then(({ data }) => {
            if (data.code === 200) {
              switch (data.body.status) {
                case 'INACTIVE':
                  this.loading = false;
                  this.isActive = false;
                  break;
                case 'NORMAL':
                  resolve(data.body);
                  break;
                case 'DISABLED':
                  reject(NO_AUTHORITY);
                  break;
              }
            } else {
              reject(data.message)
            }
          }).catch(({ response }) => {
            if (response && response.status === 400) {
              if (response.data && (response.data.code === 4001119 || response.data.code === 4001004)) {
                reject(NO_AUTHORITY)
              } else {
                reject(response.data && response.data.message ? response.data.message : NETWORK_ERROR);
              }
            } else {
              reject(NETWORK_ERROR)
            }
          })
        })
      },
      doLogin(email, password) {
        this.guaranteePubKey(() => {
          const encrypted = encrypt.encrypt(password);
          doLogin(email, encrypted, true).then(response => {
            this.loading = false;
            const res = response.data;
            if (res.code === '200') {
              this.loading = true;
              const token = res.body.token;
              this.doChoose(token);
              Utils.$setLocalStorage('token', token);
            } else if (res.code === '2052626875d59d9679c') { // 密码错误
              this.passwordError = this.getMessageByIllegalType(PASSWORD_ERROR);
              this.$message({
                message: res.message,
                type: 'error'
              })
            } else if (res.code === '20576cca99bb242ce7f') { // 未激活
              this.isActive = false;
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          }, (error) => {
            this.loading = false;
            if (error) {
              const { response } = error;
              this.$message({
                message: response && response.data && response.data.message || this.getMessageByIllegalType(NETWORK_ERROR),
                type: 'error'
              })
            }
          });
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
      doChoose(token) {
        getUserBusiness(token).then(response => {
          this.loading = false;
          const res = response.data;
          if (res.code === 200) {
            const authList = Utils.$binaryToArray(res.body.orgType);
            if (authList.length === 1) {
              location.href = BUSINESS_END_LIST[authList[0]].path;
            } else if (authList.length > 1) {
              this.authList = authList.map(_ => BUSINESS_END_LIST[_] || {});
              this.showDialog = true;
            }
          }
        }).catch(({ response }) => {
          this.loading = false;
          if (response) {
            const { data, status } = response;
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
          case ILLEGAL_EMAIL:
            msg = '请输入正确的邮箱地址';
            break;
          case ILLEGAL_SUFFIX_NULL:
            msg = '请选择邮箱后缀';
            break;
          case NULL_PASSWORD:
            msg = '请输入密码';
            break;
          case IS_CHECKING:
            msg = '正在检测账号安全';
            break;
          case NO_AUTHORITY:
            msg = '账号不存在';
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
<style lang="scss" scoped>
  .login {
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

    .forget-password {
      overflow: hidden;
      height: 22px !important;
      text-align: right;

      button {
        padding: 0;
        margin: 0;
        border: none;
        background: none;
        color: inherit;
        font: inherit;
        font-size: 14px;
        cursor: pointer;

        &:disabled {
          cursor: not-allowed;
        }
      }
    }
  }
</style>
