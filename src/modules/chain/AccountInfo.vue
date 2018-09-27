<template>
  <el-card>
    <table class="table-account">
      <tbody>
      <tr>
        <td>代币余额：<b>{{currentValue.balance}}</b></td>
        <td>
          <el-button type="success" size="small"
                     @click="handleRecharge">充值</el-button>
        </td>
        <td rowspan="2">
        </td>
      </tr>
      <tr>
        <td>可用金额：<b>{{currentValue.availableBalance}}</b></td>
        <td>冻结金额：<b>{{currentValue.frozen}}</b></td>
      </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script>
  export default {
    props: {
      value: Object
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    watch: {
      value(val) {
        this.currentValue = val;
      }
    },
    methods: {
      handleRecharge() {
        this.$prompt('请输入充值金额', '提示', {
          inputType: 'number',
          inputValidator: (val) => {
            const num = Number(val);
            if (typeof num !== 'number' || isNaN(num)) {
              return '请输入数字';
            } else if (num <= 0 || num > 9999999999999999) {
              return '充值金额范围0-9999999999999999';
            } else if (!this.$valid.floatValidator(num, 2)) {
              return '保留2位小数';
            } else {
              return true;
            }
          }
        }).then(({ value }) => {
          const amount = Number(value);
          this.$emit('recharge', amount);
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .table-account {
    text-align: center;
    table-layout: fixed;
    width: 100%;
    font-size: 14px;
    border: 1px solid #ebeef5;
    border-collapse: collapse;

    tr {
      height: 60px;
    }

    td {
      padding: 10px;
      border: 1px solid #ebeef5;

      b {
        font-size: 18px;
      }

      &:first-child, &:nth-child(2) {
        width: 25%;
      }

      &:nth-child(3) {
        width: 50%;
        max-width: 50%;
      }
    }
  }
</style>
