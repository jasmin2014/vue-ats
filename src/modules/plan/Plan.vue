<template>
  <div class="plan">
    <el-form ref="form"
             :model="currentValue"
             :rules="mode === 'VIEW' ? {} : rules"
             label-width="150px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="标的名称">
            <ats-input v-model="currentValue.loanTitle" :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="放款金额">
            <ats-input v-model="currentValue.loanAmount" :mode="mode"
                       type="number" unit="元" :step="0.01"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="借款期数">
            <ats-input v-model="currentValue.repayTerms" :mode="mode"
                       type="number" unit="期"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="期数(单位)">
            <el-col :span="12" v-if="currentValue.repayTimeType !== this.$enum.TERM_UNIT_NATURAL_MONTH">
              <ats-input v-model="currentValue.repayTime" :mode="mode"
                         type="number"></ats-input>
            </el-col>
            <el-col :span="currentValue.repayTimeType !== this.$enum.TERM_UNIT_NATURAL_MONTH ? 12 : 24">
              <ats-select v-model="currentValue.repayTimeType" :mode="mode"
                          :kind="this.$enum.TERM_UNIT" :group="this.$enum.TERM_UNIT"></ats-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="借款利率">
            <ats-input v-model="repayYearRate" :mode="mode"
                       type="number" unit="%" :step="0.01"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="违约费率">
            <ats-input v-model="defaultsRate" :mode="mode"
                       type="number" unit="%"
                       :min="0" :max="100" :step="0.01"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="起息日">
            <ats-date-picker v-model="currentValue.interestDate" :mode="mode"></ats-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="还款方式">
            <ats-select v-model="currentValue.repayWay" :mode="mode"
                        :kind="this.$enum.REPAY_WAY" :group="this.$enum.REPAY_WAY"></ats-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="逾期罚息日利率">
            <ats-input v-model="penaltyRate" :mode="mode"
                       type="number" unit="%"
                       :min="0" :max="100" :step="0.01"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="逾期管理费率">
            <ats-input v-model="penaltyManageRate" :mode="mode"
                       type="number" unit="%"
                       :min="0" :max="100" :step="0.01"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="坏账罚息日利率">
            <ats-input v-model="badDebtRate" :mode="mode"
                       type="number" unit="%"
                       :min="0" :max="100" :step="0.01"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="坏账管理费率">
            <ats-input v-model="badDebtManageRate" :mode="mode"
                       type="number" unit="%"
                       :min="0" :max="100" :step="0.01"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="currentValue.planDTOList">
        <el-table :data="currentValue.planDTOList"
                  border show-summary
                  :summary-method="getSummaries">
          <el-table-column label="期数" prop="term" align="center"></el-table-column>
          <el-table-column label="计划还款日" prop="planedRepayDate" align="center"></el-table-column>
          <el-table-column label="还款金额(元)" prop="total" align="center"></el-table-column>
          <el-table-column label="本金(元)" align="center">
            <template slot-scope="scope">
              <span v-if="mode === 'VIEW'">{{ scope.row.capAmount }}</span>
              <el-form-item v-else :error="error[scope.$index] && error[scope.$index].capAmount">
                <ats-input v-model="scope.row.capAmount"
                           type="number" :min="0" :step="0.01"></ats-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="利息(元)" align="center">
            <template slot-scope="scope">
              <span v-if="mode === 'VIEW'">{{ scope.row.intAmount }}</span>
              <el-form-item v-else :error="error[scope.$index] && error[scope.$index].intAmount">
                <ats-input v-model="scope.row.intAmount"
                           type="number" :min="0" :step="0.01"></ats-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="手续费" prop="feeAmount" align="center"></el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <el-row v-if="mode !== 'VIEW'"
            class="mgt20" type="flex" justify="center">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      value: Object,
      mode: String
    },
    data() {
      return {
        currentValue: {
          loanTitle: '',
          loanAmount: 0,
          intTotalAmount: 0,
          feeTotalAmount: 0,
          repayWay: '',
          repayTerms: 0,
          repayTimeType: '',
          repayTime: 0,
          repayYearRate: 0,
          penaltyRate: 0,
          defaultsRate: 0,
          initialFee: 0,
          interestDate: '',
          badDebtManageRate: 0,
          badDebtRate: 0,
          penaltyManageRate: 0,
          planDTOList: []
        },
        table: [
          { label: '当前期数', prop: 'term' },
          { label: '计划还款日', prop: 'planedRepayDate' },
          { label: '还款金额（元）', prop: 'total' },
          { label: '本金（元）', prop: 'capAmount' },
          { label: '利息（元）', prop: 'intAmount' },
          { label: '手续费', prop: 'feeAmount' },
          { label: '剩余还款金额', prop: 'restAmount' },
          { label: '还款状态', prop: 'repayStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.REPAY_STATUS, this.$enum.REPAY_STATUS)
          }
        ],
        rules: {
          penaltyRate: [
            { required: true, message: '请填写逾期罚息费率', trigger: 'blur', type: 'number'},
            { min: 0, max: 1, message: '费率范围是0-100%', trigger: 'blur', type: 'number'},
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 4)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ],
          defaultsRate: [
            { required: true, message: '请填写违约费率', trigger: 'blur', type: 'number'},
            { min: 0, max: 1, message: '费率范围是0-100%', trigger: 'blur', type: 'number'},
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 4)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ]
        },
        error: []
      }
    },
    watch: {
      value(val) {
        this.setCurrentValue(val)
      }
    },
    computed: {
      repayYearRate: {
        get() {
          if (typeof this.currentValue.repayYearRate === 'number') {
            return this.$floatMultiply(this.currentValue.repayYearRate, 100)
          }
          return ''
        },
        set(val) {
          if (val === '') {
            this.currentValue.repayYearRate = null;
          } else {
            this.currentValue.repayYearRate = this.$floatDivide(val, 100);
          }
        }
      },
      penaltyRate: {
        get() {
          if (typeof this.currentValue.penaltyRate === 'number') {
            return this.$floatMultiply(this.currentValue.penaltyRate, 100)
          }
          return ''
        },
        set(val) {
          if (val === '') {
            this.currentValue.penaltyRate = null;
          } else {
            this.currentValue.penaltyRate = this.$floatDivide(val, 100);
          }
        }
      },
      penaltyManageRate: {
        get() {
          if (typeof this.currentValue.penaltyManageRate === 'number') {
            return this.$floatMultiply(this.currentValue.penaltyManageRate, 100)
          }
          return ''
        },
        set(val) {
          if (val === '') {
            this.currentValue.penaltyManageRate = null;
          } else {
            this.currentValue.penaltyManageRate = this.$floatDivide(val, 100);
          }
        }
      },
      badDebtRate: {
        get() {
          if (typeof this.currentValue.badDebtRate === 'number') {
            return this.$floatMultiply(this.currentValue.badDebtRate, 100)
          }
          return ''
        },
        set(val) {
          if (val === '') {
            this.currentValue.badDebtRate = null;
          } else {
            this.currentValue.badDebtRate = this.$floatDivide(val, 100);
          }
        }
      },
      badDebtManageRate: {
        get() {
          if (typeof this.currentValue.badDebtManageRate === 'number') {
            return this.$floatMultiply(this.currentValue.badDebtManageRate, 100)
          }
          return ''
        },
        set(val) {
          if (val === '') {
            this.currentValue.badDebtManageRate = null;
          } else {
            this.currentValue.badDebtManageRate = this.$floatDivide(val, 100);
          }
        }
      },
      defaultsRate: {
        get() {
          if (typeof this.currentValue.defaultsRate === 'number') {
            return this.$floatMultiply(this.currentValue.defaultsRate, 100)
          }
          return ''
        },
        set(val) {
          if (val === '') {
            this.currentValue.defaultsRate = null;
          } else {
            this.currentValue.defaultsRate = this.$floatDivide(val, 100);
          }
        }
      },
      capAmountTotal() {
        return this.currentValue.planDTOList.map(_ => isNaN(Number(_.capAmount)) ? 0 : Number(_.capAmount)).reduce((prev, curr) => (this.$floatPlus(prev, curr)), 0);
      },
      intAmountTotal() {
        return this.currentValue.planDTOList.map(_ => isNaN(Number(_.intAmount)) ? 0 : Number(_.intAmount)).reduce((prev, curr) => (this.$floatPlus(prev, curr)), 0);
      }
    },
    methods: {
      handleSave() {
        const isCapAmountValid = (this.capAmountTotal === this.currentValue.loanAmount);
        const isIntAmountValid = (this.intAmountTotal === this.currentValue.intTotalAmount);
        let isValid = isCapAmountValid && isIntAmountValid;
        this.currentValue.planDTOList.forEach((item, index) => {
          this.$set(this.error, index, {});
          if (isCapAmountValid) {
            if (!this.$valid.floatValidator(item.capAmount, 2)) {
              this.error[index].capAmount = '保留2位小数';
              isValid = false;
            }
          } else {
            this.error[index].capAmount = '本金之和应等于' + this.currentValue.loanAmount;
          }
          if (isIntAmountValid) {
            if (!this.$valid.floatValidator(item.intAmount, 2)) {
              this.error[index].intAmount = '保留2位小数';
              isValid = false;
            }
          } else {
            this.error[index].intAmount = '利息之和应等于' + this.currentValue.intTotalAmount;
          }
        });
        this.$refs.form.validate((valid) => {
          if (isValid && valid) {
            this.$emit('save', {
              defaultsRate: this.currentValue.defaultsRate,
              penaltyRate: this.currentValue.penaltyRate,
              repayPlans: this.currentValue.planDTOList.map(_ => ({
                term: _.term,
                capAmount: _.capAmount,
                intAmount: _.intAmount
              }))
            })
          } else {
            this.$message.error('请检查保存信息');
          }
        })
      },
      handleCancel() {
        this.$emit('cancel')
      },
      getSummaries({data}) {
        const sums = [];
        sums[0] = '总计';
        sums[3] = this.currentValue.loanAmount;
        if (this.mode === 'VIEW') {
          sums[2] = data.map(_ => isNaN(Number(_.total)) ? 0 : Number(_.total)).reduce((prev, curr) => (this.$floatPlus(prev, curr)), 0);
          sums[4] = data.map(_ => isNaN(Number(_.intAmount)) ? 0 : Number(_.intAmount)).reduce((prev, curr) => (this.$floatPlus(prev, curr)), 0);
          sums[5] = data.map(_ => isNaN(Number(_.feeAmount)) ? 0 : Number(_.feeAmount)).reduce((prev, curr) => (this.$floatPlus(prev, curr)), 0);
          sums[6] = data.map(_ => isNaN(Number(_.restAmount)) ? 0 : Number(_.restAmount)).reduce((prev, curr) => (this.$floatPlus(prev, curr)), 0);
        } else {
          sums[4] = this.currentValue.intTotalAmount;
          sums[5] = this.currentValue.feeTotalAmount;
        }
        return sums;
      },
      setCurrentValue(val) {
        this.currentValue = Object.assign(this.currentValue, val)
      }
    }
  }
</script>

<style lang="scss">
  .plan {
    .cell {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
</style>
