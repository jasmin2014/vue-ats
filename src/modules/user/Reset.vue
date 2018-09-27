<!-- 重置密码 -->
<template>
  <el-form class="reset"
           ref="form"
           :model="this.reset"
           label-width="120px"
           style="width: 90%;">
    <el-form-item label="手机号">
      <el-input v-model.trim="reset.phone"
                ref="phone"
                placeholder="请输入手机号"
                readonly
                @input="handlePhoneChange"
                @keyup.native.enter="handleConfirm"></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code">
      <el-input v-model.trim="reset.code"
                ref="code"
                autofocus
                placeholder="请输入验证码"
                @input="handleCodeChange"
                @keyup.native.enter="handleConfirm"></el-input>
      <button class="btn-code"
              :disabled="disabledCode"
              tabindex="-1"
              type="button"
              @click="handleCode">{{ btnCountDown || '获取验证码' }}
      </button>
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model="reset.password"
                ref="password"
                type="password"
                placeholder="请输入6-20位密码，包含数字、字母或符号"
                @input="handlePasswordChange"
                @keyup.native.enter="handleConfirm"></el-input>
    </el-form-item>
    <el-form-item label="重复新密码" prop="repeatPassword">
      <el-input v-model="reset.repeatPassword"
                ref="repeatPassword"
                type="password"
                placeholder="再次输入密码"
                @input="handlePasswordChange"
                @keyup.native.enter="handleConfirm"></el-input>
    </el-form-item>
    <el-row type="flex" justify="end">
      <el-button type="primary"
                 :loading="loading"
                 @click="handleConfirm">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </el-row>
  </el-form>
</template>
<script>
  import {sendCode, doResetPassword} from '../../account/api'

  const ILLEGAL_PHONE = 'ILLEGAL_PHONE';
  const ILLEGAL_PASSWORD = 'ILLEGAL_PASSWORD';
  const ILLEGAL_PASSWORD_NO_SPACE = 'ILLEGAL_PASSWORD_NO_SPACE';
  const NULL_CODE = 'NULL_CODE';
  const NULL_PASSWORD = 'NULL_PASSWORD';
  const INCONSISTENT_PASSWORD = 'INCONSISTENT_PASSWORD';
  const NETWORK_ERROR = 'NETWORK_ERROR';
  const SEND_CODE_SUCCESS = 'SEND_CODE_SUCCESS';
  const SEND_CODE_FAILED = 'SEND_CODE_FAILED';
  const USAGE_RESET = 'RESET_PASSWORD';
  const phoneRegexp = /^1[34578]\d{9}$/;

  export default {
    data() {
      return {
        reset: {
          phone: '',
          password: '',
          repeatPassword: ''
        },
        loading: false,
        disabledCode: true,
        btnCountDown: '',
        countDownTimer: null
      }
    },
    mounted() {
      if (this.$getLocalStorage('user') && this.$getLocalStorage('user').phone) {
        this.reset.phone = this.$getLocalStorage('user').phone;
      }
      this.$refs.phone.$emit('input', this.reset.phone);
      this.$refs.code.$refs.input.focus();
    },
    methods: {
      resetFields() {
        this.$refs.form.resetFields();
      },
      handlePhoneChange(phone) {
        this.disabledCode = !phoneRegexp.test(phone);
        this.$refs.phone.$refs.input.classList.remove('error');
      },
      handleCode() {
        const phone = this.reset.phone;
        const partyId = this.$getLocalStorage('user').partyId;
        this.sendCode(USAGE_RESET, phone, partyId)
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
      handleCancel() {
        this.$emit('cancel');
      },
      handleConfirm() {
        const phone = this.reset.phone;
        const code = this.reset.code;
        const password = this.reset.password;
        const repeatPassword = this.reset.repeatPassword;

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
          this.doConfirm(phone, code, password).then((msg) => {
            this.loading = false;
            this.disabledCode = false;
            this.btnCountDown = '';
            clearTimeout(this.countDownTimer);
            this.$message({
              message: msg,
              type: 'success'
            });
            this.$emit('done');
          }, (type) => {
            this.loading = false;
            this.$message({
              message: this.getMessageByIllegalType(type),
              type: 'error'
            })
          });
        }
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
      doConfirm(phone, code, password) {
        return new Promise((resolve, reject) => {
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
        })
      },
      countDown(sec) {
        if (sec >= 0) {
          this.disabledCode = true;
          this.btnCountDown = `剩余${sec}s`;
          this.countDownTimer = setTimeout(() => {
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
    .btn-code {
      position: absolute;
      right: 18px;
      top: 6px;
      width: 90px;
      height: 28px;
      line-height: 28px;
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

    .action {
      margin-top: 8px;
    }
  }
</style>
