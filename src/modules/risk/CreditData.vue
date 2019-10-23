<template>
  <div class="credit-data">
    <el-row>
      <h4><span>征信数据信息</span></h4>
    </el-row>
    <el-form label-width="200px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="征信报告中5年内逾期次数">
            <ats-input v-model="currentValue.overdueTime5Year"
                       type="text"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="征信报告中当前逾期金额">
            <ats-input v-model="currentValue.overdueAmount"
                       mode="VIEW"
                       unit="元"></ats-input>
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
