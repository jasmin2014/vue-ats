<template>
  <div class="send-email">
    <div class="wrapper">
      <h2 v-if="obj.emailType === 'ACTIVE_USER'">账号激活</h2>
      <h2 v-else-if="obj.emailType === 'RESET_PASSWORD'">重置密码</h2>
      <section class="email">
        <el-input v-model.trim="obj.email"
                  ref="email"
                  placeholder="请输入邮箱地址"
                  autofocus
                  name="email"
                  type="email"
                  readonly></el-input>
      </section>
      <section class="hint">
        <p v-if="obj.emailType === 'ACTIVE_USER'">您的账号还未激活，请点击下方按钮发送邮件，根据邮件提示完成账号激活。</p>
        <p v-else-if="obj.emailType === 'RESET_PASSWORD'">您正在重置密码，请点击下方按钮发送邮件，根据邮件提示完成密码重置。</p>
      </section>
      <section class="action">
        <el-button type="primary"
                   :loading="loading"
                   @click="handleSend">发送邮件
        </el-button>
      </section>
    </div>
  </div>
</template>

<script>
  import {sendEmail} from '../api';

  export default {
    data() {
      return {
        obj: {
          email: decodeURIComponent(this.$route.query.email),
          emailType: this.$route.meta.type
        },
        loading: false
      }
    },
    watch: {
      '$route.meta.type'(val, oldVal) {
        this.obj.emailType = val;
      }
    },

    methods: {
      handleSend() {
        this.loading = true;
        sendEmail(this.obj.email, this.obj.emailType).then(({ data }) => {
          this.loading = false;
          if (data.code == 200) {
            this.$alert(`邮件已发送至 [${data.body.sendEmail}] 邮箱,请在${data.body.activeMinutes}分钟内完成相关操作`, '提示').then(() => {
              this.$router.push({
                name: 'Login',
                params: {
                  email: this.obj.email
                }
              })
            });
          } else {
            this.$message.error(data.message);
          }
        }).catch(({response}) => {
          this.loading = false;
          if (response) {
            const {data} = response;
            this.$message(data && data.message ? data.message : '您的网络有问题，请稍后再试')
          } else {
            this.$message.error('您的网络有问题，请稍后再试')
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .send-email {
    section {
      &.hint {
        p {
          padding-left: 23px;
          font-size: 14px;
          line-height: 1.5;
          background: url("../../pages/img/icon-warning.png") left 3px no-repeat;
          color: #ff5555;
        }
      }
    }
  }
</style>
