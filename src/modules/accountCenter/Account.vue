<template>
  <div class="account-center">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col :span="6">
        <h5>{{$filter(currentValue.acTitle, this.$enum.ACCOUNT_TYPE, AccountType)}}总览</h5>
      </el-col>
    </el-row>
    <el-card>
      <el-row v-if="currentValue.isOpenAccount === 1">
        <table class="overview" v-if="currentValue.data != null"
               width="100%">
          <tbody>
          <tr>
            <td class="account-balance">
              账户余额（元）：<b>{{currentValue.data.balance}}</b>
            </td>
            <td>
              <el-button type="success"
                         v-action="'FinanceAccountCharge'"
                         @click="rechargeForm.dialogrRchargeFormVisible = true">充值</el-button>
              <el-button type="primary"
                         v-action="'FinanceAccountWithdraw'"
                         @click="handleWithdraw">提现</el-button>
            </td>
            <td rowspan="2">
              <el-table v-if="currentValue.data.authList.length > 0"
                        ref="cardInfo"
                        :data="currentValue.data.authList"
                        border max-height="335">
                <el-table-column align="center" label="姓名" prop="ownerName"></el-table-column>
                <el-table-column align="center" label="银行卡号" prop="bankCard" width="250">
                  <template slot-scope="scope">
                    <span class="bank-card">{{scope.row.bankCard}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="所属银行" prop="bankName"></el-table-column>
                <el-table-column align="center" label="认证状态" prop="authStatus"
                                 :formatter="(row, col, val) => (this.$filter(val, this.$enum.BANK_CARD_AUTH_STATUS, this.$enum.BANK_CARD_AUTH_STATUS))"></el-table-column>
                <!--<el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button  v-if="['AUTH_SUCCESS'].includes(scope.row.authStatus)" title="解绑银行卡" size="small" type="warning" @click="handleUnbind">解绑银行卡</el-button>
                    <el-button v-if="['AUTH_FAIL'].includes(scope.row.authStatus)" title="绑定银行卡" size="small" type="warning" @click="handleBind">绑定银行卡</el-button>
                  </template>
                </el-table-column>-->
              </el-table>
              <el-row v-else>
                <el-col align="center">
                  <el-button type="primary" class="bind-btn"
                             v-action="'FinanceAccountBind'"
                             @click="handleBindCard">绑定银行卡</el-button>
                </el-col>
              </el-row>
            </td>
          </tr>
          <tr>
            <td class="account-balance">
              可用金额（元）：<b>{{currentValue.data.availableBalance}}</b>
            </td>
            <td class="account-balance">
              冻结金额（元）：<b>{{currentValue.data.freezeAmount}}</b>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else>暂无数据</div>
      </el-row>
      <el-row v-else>
        <el-col>
          您的账户还未开户，请进行认证开户
          <el-button type="primary"
                     v-action="'FinanceAccountOpen'"
                     @click="handleOpenAccount">开户
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="输入充值金额" width="600px"
               :visible.sync="rechargeForm.dialogrRchargeFormVisible"
               @close="handleCancelRecharge">
      <div v-html="rechargeDatas" style="display: none;"></div>
      <el-form ref="rechargeForm"
               :model="rechargeForm"
               :rules="rule1"
               style="width: 90%;">
        <el-form-item label="充值金额" :label-width="formLabelWidth" prop="recharge">
          <ats-input type="number" v-model="rechargeForm.recharge"></ats-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary"
                   @click="handleRecharge">确 定</el-button>
        <el-button @click="handleCancelRecharge">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="充值提示"
               :visible.sync="rechargeForm.reChargeDialogVisible"
               width="30%">
      <h3 align="center">请您在新打开的支付页面上完成支付</h3>
      <p>1、若未看到新窗口，请检查是否为浏览器拦截所致；</p>
      <p>2、不同银行到账时间不同，请耐心等待。若银行提示15分钟后仍未到账，请联系在线客服或电话客服0571-96056 。</p>
      <span slot="footer" align="center">
        <el-button type="primary" @click="handleCompletePayment">已完成支付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      myAuthList: Object,
      AccountType: String,
      rechargeDatas: String
    },
    data() {
      const inputNumber = (rule, value, callback) => {
        if (value === null ||
          value === '' ||
          value === undefined ||
          this.$valid.floatValidator(value, 2) &&
          value >= 0 && value <= 9999999999999998) {
          callback();
        } else if (value < 0) {
          callback('输入的数字不能小于0');
        } else if (value > 9999999999999998) {
          callback('输入的数字不能大于9999999999999998');
        } else {
          callback('请输入数字值并最多保留2位小数');
        }
      };
      return {
        currentValue: {},
        formLabelWidth: '120px',
        rechargeForm: {
          recharge: '',
          dialogrRchargeFormVisible: false,
          reChargeDialogVisible: false
        },
        rule1: {
          recharge: [
            { required: true, message: '请输入充值金额', trigger: 'blur' },
            { validator: inputNumber, trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      'myAuthList.isOpenAccount'(val) {
        this.currentValue.isOpenAccount = val;
        this.currentValue = this.$deepcopy(this.myAuthList);
      }
    },
    created() {
      this.currentValue = this.$deepcopy(this.myAuthList);
      if (this.myAuthList.data) {
        this.currentValue.data = this.$deepcopy(this.myAuthList.data) ? this.$deepcopy(this.myAuthList.data) : null;
        this.currentValue.data.balance = this.currentValue.data && this.currentValue.data.balance ? this.currentValue.data.balance : 0;
        this.currentValue.data.availableBalance = this.currentValue.data && this.currentValue.data.availableBalance ? this.currentValue.data.availableBalance : 0;
        this.currentValue.data.freezeAmount = this.currentValue.data && this.currentValue.data.freezeAmount ? this.currentValue.data.freezeAmount : 0;
        if (this.myAuthList.data.authList) {
          this.currentValue.data.authList = this.$deepcopy(this.myAuthList).data && this.$deepcopy(this.myAuthList).data.authList ? this.$deepcopy(this.myAuthList).data.authList : [];
        }
      }
    },
    methods: {
      closeRechargeDialog() {
        this.$refs['rechargeForm'].resetFields();
        this.rechargeForm.dialogrRchargeFormVisible = false;
      },
      showReChargeTipsDialog() {
        this.rechargeForm.reChargeDialogVisible = true;
      },
      handleOpenAccount(val) {
        val = this.$deepcopy(this.myAuthList).acTitle ? this.$deepcopy(this.myAuthList).acTitle : '';
        this.$emit('openAccount', val);
      },
      handleRecharge(val) {
        const _reChargeDatas = {
          acTitle: this.$deepcopy(this.myAuthList).acTitle ? this.$deepcopy(this.myAuthList).acTitle : '',
          amount: this.$deepcopy(this.rechargeForm).recharge
        };

        val = this.$deepcopy(_reChargeDatas);
        this.$refs['rechargeForm'].validate((valid) => {
          if (valid) {
            this.$emit('recharge', val);
          } else {
            return false;
          }
        });
      },
      handleWithdraw() {
        this.$emit('withdraw');
      },
      // handleUnbind(val) {
      //   this.$emit('unbind', val);
      // },
      handleBindCard(val) {
        this.$emit('bind', val);
      },
      handleCompletePayment() {
        this.$emit('reFresh');
      },
      handleCancelRecharge() {
        this.$refs['rechargeForm'].resetFields();
        this.rechargeForm.dialogrRchargeFormVisible = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  h5 {
    font-size: 16px;
    font-weight: normal;
  }

  .account-center {
    font-size: 14px;
  }

  .overview {
    text-align: center;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    table-layout: fixed;

    tr {
      height: 60px;
    }

    td {
      padding: 10px;
      border: 1px solid #ebeef5;

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
  }

  .account-balance {
    b {
      font-size: 18px;
      vertical-align: middle;
    }
  }

  .bank-card {
    font-size: 20px;
    font-weight: bold;
  }
</style>
