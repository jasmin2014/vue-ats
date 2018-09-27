<template>
  <div class="transactions">
    <el-table :data="list" border>
      <el-table-column v-for="col in table.slice(0, 4)" :key="col.prop" align="center"
                       :label="col.label" :prop="col.prop"></el-table-column>
      <el-table-column label="交易金额" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.flowType === 1" class="income">+{{ scope.row.transAmount }}</span>
          <span v-else-if="scope.row.flowType === 0" class="outcome">-{{ scope.row.transAmount }}</span>
          <span v-else>{{ scope.row.transAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="col in table.slice(4)" :key="col.prop" align="center"
                       :label="col.label" :prop="col.prop"></el-table-column>
    </el-table>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next"
                     :total="params.pageTotal"
                     :page-size="params.pageSize"
                     :page-number="params.pageNumber"
                     @current-change="handleCurrentChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      list: Array,
      params: Object
    },
    data() {
      return {
        table: [
          {
            label: '流水号',
            prop: 'flowId'
          },
          {
            label: '费用类型',
            prop: 'feeTypeName'
          },
          {
            label: '交易类型',
            prop: 'busiTypeName'
          },
          {
            label: '账户类型',
            prop: 'acTitleName'
          },
          {
            label: '可用余额',
            prop: 'availableBalance'
          },
          {
            label: '冻结余额',
            prop: 'freezeBalance'
          },
          {
            label: '创建时间',
            prop: 'transTime'
          },
          {
            label: '完成交易时间',
            prop: 'successTime'
          }
        ]
      }
    },
    methods: {
      handleCurrentChange(index) {
        this.$emit('current-change', index);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .income, .outcome {
    font-size: 16px;
  }

  .income {
    color: #67c23a;
  }

  .outcome {
    color: #f56c6c;
  }
</style>
