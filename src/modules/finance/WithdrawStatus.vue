<!-- 添加还款明细 -->
<template>
  <div :class="`withdraw-status withdraw-status--${status}`">
    <el-row type="flex" justify="center" v-if="status==='success'">
      <el-col :span="12" align="center">
        <div :class="`status-icon el-icon-${status}`"></div>
        <p class="status-text">提现处理{{ statusMap[status] }}</p>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="12" align="center">
        <p><span class="count-down">{{seconds}}s</span>后自动跳转</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const STATUS_TEXT = {
    success: '成功',
    error: '失败'
  };

  export default {
    data() {
      return {
        status: this.$route.params.status,
        seconds: 3,
        timer: null,
        statusMap: STATUS_TEXT
      }
    },
    created() {
      this.countDown();
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      countDown() {
        this.timer = setInterval(() => {
          this.seconds--;
          if (this.seconds <= 0) {
            clearInterval(this.timer);
            this.$router.replace({ name: 'FinanceAccountInfo' })
          }
        }, 1000)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .withdraw-status {
    padding-top: 50px;

    .status-icon {
      font-size: 40px;
    }
    .el-icon-error {
      color: #f56c6c;
    }
    .el-icon-success {
      color: #67c23a;
    }

    .status-text {
      font-size: 24px;
    }

    .count-down {
      color: #e6a23c;
    }
  }

</style>
