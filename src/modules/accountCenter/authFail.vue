<template>
<div>
  <el-dialog title="信息提示"
             :visible.sync="VisibleFail"
             width="30%">
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-row>
          <el-col :span="4" class="mywarningicon"><i class="el-icon-warning"></i></el-col>
          <el-col :span="20" class="errormsg">
            <p class="big-font">抱歉，实名认证失败！</p>
            <p class="grey">{{ErrorMsg}}请返回修改并重新提交</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
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
      VisibleFail: Boolean,
      ErrorMsg: String
    },
    methods: {
      handleOk() {
        this.$emit('close');
      }
    }
  }
</script>
<style>
  .mywarningicon{
    font-size: 300%;
    color: #e6a23c;
  }
  .errormsg p {
    margin: 0;
    padding: 0;
  }
  .errormsg p.big-font {
    font-size: 130%;
  }
  .errormsg p.grey {
    color: #999999;
  }
</style>
