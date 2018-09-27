<template>
<div>
  <el-dialog title="信息提示" :visible.sync="VisibleSuccess" width="30%" @close="handleCancel">
    <div align="center">
      <span class="success-text"><i class="el-icon-success"></i>认证成功！</span>
    </div>
    <span slot="footer">
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="handleOk">知道了</el-button>
      </el-row>
    </span>
  </el-dialog>
</div>


</template>

<script>
  export default {
    props: {
      VisibleSuccess: Boolean
    },
    data() {
      return {
        currentValue: {
          password: '',
          comPassword: ''
        }
      }
    },
    methods: {
      handleCancel(){
        this.$emit('cancel');
      },
      handleOk(){
        this.$emit('ok');
      }
    }
  }
</script>
<style>
  .success-text {
    font-size: 150%;
    line-height: 3em;
    color: #67c23a;
    text-align: center;
  }
  .success-text i {
    margin-right: 10px;
  }
  .myform {
    margin-top: 20px;
  }
</style>
