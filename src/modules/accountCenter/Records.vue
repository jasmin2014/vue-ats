<template>
  <div class="records">
    <el-table :data="myRecords" border>
      <el-table-column align="center" label="流水号" prop="flowId"></el-table-column>
      <el-table-column align="center" label="费用类型" prop="feeTypeName"></el-table-column>
      <el-table-column align="center" label="交易类型" prop="busiTypeName"></el-table-column>
      <el-table-column align="center" label="账户类型" prop="acTitleName"></el-table-column>
      <el-table-column align="center" label="交易金额" prop="transAmount">
        <template slot-scope="Scope">
          <span v-if="Scope.row.flowType === 1" :class="{'warning-row': Scope.row.flowType === 1}">+ {{Scope.row.transAmount}}</span>
          <span v-else-if="Scope.row.flowType === 0" :class="{'success-row': Scope.row.flowType === 0}"> - {{Scope.row.transAmount}}</span>
          <span v-else>{{Scope.row.transAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="可用余额" prop="availableBalance"></el-table-column>
      <el-table-column align="center" label="冻结余额" prop="freezeBalance"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="transTime"></el-table-column>
      <el-table-column align="center" label="完成交易时间" prop="successTime"></el-table-column>
    </el-table>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="pageSize"
                     @current-change="handleChnagePage"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import AccountMess from './Account.vue';
  export default {
    components: {AccountMess},
    props: {
      myRecords: Array,
      pageTotal: Number,
      pageSize: Number,
      pageNumber: Number
    },
    data() {
      return {
        currentValue: []
      }
    },
    created() {
//      this.currentValue = this.myRecords && this.myRecords != {} ? this.$deepcopy(this.myRecords) : {};
    },
    methods: {
      handleChnagePage(val){
        this.$emit('changePage',val);
      },
      handleRecharge(val){
        this.$emit('recharge',val);
      },
      handleWithdraw(val){
        this.$emit('withdraw',val);
      }
    }
  }
</script>
<style>
  .el-table .warning-row {
    font-size: 120%;
    color: red;
    font-weight: bold;
  }

  .el-table .success-row {
    font-size: 120%;
    color: #67c23a;
    font-weight: bold;
  }
</style>
