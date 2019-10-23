<template>
  <div class="involved">
    <el-row>
      <h4><span>涉诉信息</span></h4>
    </el-row>
    <el-form label-width="200px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="借款人涉诉或行政处罚情况">
            <ats-input v-model="currentValue.appealCount"
                       type="text"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      value: Object
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value || {})
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.currentValue = this.$deepcopy(this.value)
        }
      }
    }
  }
</script>
