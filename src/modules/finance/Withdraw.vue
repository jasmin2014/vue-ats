<template>
  <el-form ref="form"
           :model="currentValue"
           :rules="rules"
           label-width="250px" style="width: 700px;">
    <el-form-item label="提现至银行卡" prop="bankCard" :error="error.bankCard">
      <el-input v-model="currentValue.bankCard" readonly></el-input>
    </el-form-item>
    <el-form-item label="提现金额" prop="amount" :error="error.amount">
      <ats-input v-model="currentValue.amount" type="number"></ats-input>
    </el-form-item>
    <el-form-item>
      可用余额：{{ balance }} 元
      <el-button type="text"
                 @click="handleWithdrawAll"> 全部提现</el-button>
    </el-form-item>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    props: {
      value: Object,
      balance: Number,
      error: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    data() {
      return {
        currentValue: this.value,
        rules: {
          bankCard: [
            { required: true, message: '请输入提现银行卡', trigger: 'blur' },
            { pattern: this.$valid.card, message: '请输入正确的银行卡号', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '请输入提现金额', trigger: 'blur', type: 'number' },
            { min: 0, max: this.balance, message: '范围0-' + this.balance, trigger: 'blur', type: 'number'},
            {
              validator: (rule, value, callback) => {
                const num = Number(value);
                if (typeof num === 'number' && !isNaN(num)) {
                  if (num > 0) {
                    if (this.$valid.floatValidator(num, 2)) {
                      callback()
                    } else {
                      callback('保留2位小数')
                    }
                  } else {
                    callback('范围0-' + this.balance)
                  }
                } else {
                  callback('请输入数字')
                }
              }
            }
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('withdraw', this.$deepcopy(this.currentValue));
          } else {
            return false;
          }
        })
      },
      handleWithdrawAll() {
        this.$set(this.currentValue, 'amount', this.balance)
      }
    }
  }
</script>
