<!-- 重置密码 -->
<template>
  <el-form class="reset"
           ref="form"
           :model="reset"
           :rules="rules"
           label-width="120px"
           style="width: 90%;">
    <el-form-item v-show="false" label="邮箱">
      <el-input v-model="email"
                type="email" disabled></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model="reset.password"
                ref="password"
                type="password"
                placeholder="请输入6-20位密码，包含数字、字母或符号"
                @keyup.native.enter="handleConfirm"></el-input>
    </el-form-item>
    <el-form-item label="重复新密码" prop="repeatPassword">
      <el-input v-model="reset.repeatPassword"
                ref="repeatPassword"
                type="password"
                placeholder="再次输入密码"
                @keyup.native.enter="handleConfirm"></el-input>
    </el-form-item>
    <el-row style="margin-left: 120px;">
      <el-button type="primary"
                 :loading="loading"
                 @click="handleConfirm">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </el-row>
  </el-form>
</template>
<script>
  import {changePassword} from '../../api/account'

  const ILLEGAL_PASSWORD = 'ILLEGAL_PASSWORD';
  const ILLEGAL_PASSWORD_NO_SPACE = 'ILLEGAL_PASSWORD_NO_SPACE';
  const NULL_PASSWORD = 'NULL_PASSWORD';
  const INCONSISTENT_PASSWORD = 'INCONSISTENT_PASSWORD';
  const NO_AUTHORITY = 'NO_AUTHORITY';
  const NETWORK_ERROR = 'NETWORK_ERROR';

  export default {
    data() {
      return {
        email: this.$store.state.user.email,
        reset: {
          password: '',
          repeatPassword: ''
        },
        loading: false,
        rules: {
          password: [
            { required: true, message: this.getMessageByIllegalType(NULL_PASSWORD), trigger: 'blur' },
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

    mounted() {
      this.$refs.password.focus();
    },
    methods: {
      resetFields() {
        this.$refs.form.resetFields();
      },
      handleConfirm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            changePassword(this.reset.password).then(({ data }) => {
              if (data.code === 200) {
                this.$message.success('修改成功');
                this.$emit('done');
              } else {
                this.$message.error(data.message);
              }
            })
          }
        })
      },
      handleCancel() {
        this.$emit('cancel');
      },

      getMessageByIllegalType(type) {
        let msg = '';
        switch (type) {
          case ILLEGAL_PASSWORD:
            msg = '密码为6-20位数字、字母或符号';
            break;
          case ILLEGAL_PASSWORD_NO_SPACE:
            msg = '密码不能包含空格';
            break;
          case NULL_PASSWORD:
            msg = '请输入密码';
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
