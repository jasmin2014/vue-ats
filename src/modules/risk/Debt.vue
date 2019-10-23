<template>
  <div class="debt">
    <el-row>
      <h4><span>负债信息</span></h4>
    </el-row>
    <el-table :data="currentValue" border="">
      <el-table-column v-for="col in table"
                       :key="col.prop"
                       align="center"
                       :label="col.label"
                       :prop="col.prop"
                       :formatter="col.formatter"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      value: Array
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value || []),
        table: [
          {
            label: '出借平台',
            prop: 'loanPlatform'
          },
          {
            label: '平台类型',
            prop: 'platformType'
          },
          {
            label: '借款用途',
            prop: 'usageLoan'
          },
          {
            label: '借款日',
            prop: 'loanStart',
            formatter: (row, col, val) => val + (row.loanEnd ? ' - ' + row.loanEnd : '')
          },
          {
            label: '借款金额(元)',
            prop: 'loanAmount'
          }
        ]
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.currentValue = this.$deepcopy(val)
        }
      }
    }
  }
</script>
