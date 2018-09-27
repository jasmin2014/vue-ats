<!--借贷统计-->
<template>
  <div class="report">
    <el-form label-width="150px">
      <el-row v-if="type === this.$enum.BUSINESS_CENTER" class="report-sta">
        <h4>
          <span>平台借款总计:</span>
        </h4>
        <el-row class="report-inr">
          <el-col :span="11">
            <el-form-item label="平台借款总额(元)：">
              <ats-input v-model="currentValue.totalAmount" :mode="'VIEW'"></ats-input>
            </el-form-item>
            <el-form-item label="平台借款次数：">
              <ats-input v-model="currentValue.loanNumber" :mode="'VIEW'"></ats-input>
            </el-form-item>
            <el-form-item label="平台逾期次数：">
              <ats-input v-model="currentValue.overdueNumber" :mode="'VIEW'"></ats-input>
            </el-form-item>
            <el-form-item label="平台逾期金额(元)：">
              <ats-input v-model="currentValue.overdueTotalAmount" :mode="'VIEW'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <div v-if="currentValue.partyPlatformBorrowings==0">暂无数据</div>
      <el-row v-for="item in currentValue.partyPlatformBorrowings" :key="item.id">
        <h4><span>{{item.loanPartyOrgName}}:</span>
        </h4>
        <el-row class="report-inr">
          <el-col :span="11">
            <el-form-item label="借款总额(元)：">
              <ats-input v-model="item.totalAmount" :mode="'VIEW'"></ats-input>
            </el-form-item>
            <el-form-item label="借款次数：">
              <ats-input v-model="item.loanNumber" :mode="'VIEW'"></ats-input>
            </el-form-item>
            <el-form-item label="逾期次数：">
              <ats-input v-model="item.overdueNumber" :mode="'VIEW'"></ats-input>
            </el-form-item>
            <el-form-item label="逾期金额(元)：">
              <ats-input v-model="item.overdueTotalAmount" :mode="'VIEW'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "statistics",
    props: {
      value: Object,
      type: String
    },
    data() {
      return {
        currentValue: {}
      }
    },
    watch: {
      value(val) {
        if (val){
          this.currentValue = this.$deepcopy(val);
        }
      }
    }
  }
</script>

<style scoped>
  .report-sta {
    box-shadow: 2px 5px 15px #e4e4e4;
  }
</style>
