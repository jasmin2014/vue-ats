<template>
  <div class="account-center">
    <h5>{{ $filter(type, this.$enum.ACCOUNT_TYPE, business) }}总览</h5>
    <el-card>
      <el-row v-if="isOpen === 1">
        <table class="table-account">
          <tbody>
          <tr>
            <td>账户余额（元）：<b>{{currentValue.balance}}</b></td>
            <td>
              <el-button type="success" size="small"
                         v-action="'FinanceAccountCharge'"
                         @click="handleRecharge">充值</el-button>
              <el-button type="primary" size="small"
                         v-action="'FinanceAccountWithdraw'"
                         :disabled="!canWithdraw()"
                         @click="handleWithdraw">提现</el-button>
            </td>
            <td rowspan="2">
              <el-table v-if="currentValue.authList.length > 0"
                        :data="currentValue.authList" border>
                <el-table-column v-for="col in table" :key="col.prop" align="center"
                                 :label="col.label" :prop="col.prop" :formatter="col.formatter" :class="col.customClass"></el-table-column>
              </el-table>
              <el-row v-else>
                <el-button type="primary" size="small"
                           v-action="'FinanceAccountBind'"
                           @click="handleBindCard">绑定银行卡</el-button>
              </el-row>
            </td>
          </tr>
          <tr>
            <td>可用金额（元）：<b>{{currentValue.availableBalance}}</b></td>
            <td>冻结金额（元）：<b>{{currentValue.freezeAmount}}</b></td>
          </tr>
          </tbody>
        </table>
      </el-row>
      <el-row v-else>
        尚未开户，请进行认证开户。
        <el-button type="primary" size="small"
                   v-action="'FinanceAccountOpen'"
                   @click="handleOpenAccount">开户</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    props: {
      value: Object,
      type: String, // 账户类型枚举
      isOpen: Number,
      business: String
    },
    data() {
      return {
        currentValue: this.value || {},
        table: [
          {
            label: '姓名',
            prop: 'ownerName'
          },
          {
            label: '银行卡号',
            prop: 'bankCard',
            customClass: 'bank-card'
          },
          {
            label: '所属银行',
            prop: 'bankName'
          },
          {
            label: '认证状态',
            prop: 'authStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.BANK_CARD_AUTH_STATUS, this.$enum.BANK_CARD_AUTH_STATUS)
          }
        ]
      }
    },
    watch: {
      value(val) {
        this.setCurrentValue(val);
      }
    },
    methods: {
      setCurrentValue(val) {
        this.currentValue = this.$deepcopy(val);
      },
      canWithdraw() {
        const cardList = this.currentValue.authList;
        return cardList && cardList.length > 0 && cardList.some(_ => _ && _.authStatus === this.$enum.BANK_CARD_AUTH_STATUS_SUCCESS)
      },
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
          this.$emit('recharge', {
            type: this.type,
            amount
          });
        }).catch(() => {})
      },
      handleWithdraw() {
        this.$emit('withdraw', {
          acTitle: this.type,
          bankCard: this.currentValue.authList[0].bankCard,
          balance: this.currentValue.availableBalance
        })
      },
      handleBindCard() {
        this.$emit('bind', this.type);
      },
      handleOpenAccount() {
        this.$emit('open', this.type);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .account-center {
    font-size: 14px;

    .table-account {
      text-align: center;
      table-layout: fixed;
      width: 100%;
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

      .el-table {
        border-collapse: separate;
      }

      .bank-card {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
</style>
