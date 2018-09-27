<!--续贷-->
<template>
  <el-form ref="form"
           :model="currentValue"
           :rules="mode === 'VIEW' ? {} : rules"
           label-width="130px">
    <el-row>
      <el-col :span="22">
        <el-form-item label="原协议编号" prop="oldContract">
          <ats-input v-model="currentValue.oldContract" disabled></ats-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22">
        <el-form-item label="续贷协议编号" prop="contract">
          <ats-input v-model.trim="currentValue.contract"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22">
        <el-form-item label="续贷金额" prop="amount">
          <ats-input v-model="currentValue.amount" :mode="mode"
                     type="number" :min="0" unit="元"></ats-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22">
        <el-form-item label="续贷期数" prop="loanTerms">
          <ats-input v-model="currentValue.loanTerms" :mode="mode"
                     type="number" :min="1" :max="72" :step="1"></ats-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22">
        <el-form-item label="年利率" prop="yearRate">
          <ats-input v-model="yearRate" unit="%"
                     type="number" :min="0" :max="100" :step="0.01"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-button v-if="mode !== 'VIEW'" type="primary" @click="handleConfirm">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </el-row>
  </el-form>
</template>
<script>
  export default {
    props: {
      value: Object,
      mode: String
    },
    data() {
      return {
        currentValue: Object.assign({
          oldContract: '',
          contract: '',
          amount: '',
          loanTerms: '',
          yearRate: ''
        }, this.value),
        rules: {
          contract: [
            { required: true, message: '请输入续贷协议编号', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '请输入续贷金额', trigger: 'blur', type: 'number' },
            { min: 0.01, message: '续贷金额大于0', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 2)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ],
          loanTerms: [
            { required: true, message: '请输入续贷期数', trigger: 'blur', type: 'number' },
            { min: 1, max: 72, message: '期数范围为1-72', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 0)) {
                  callback()
                } else {
                  callback('请输入整数')
                }
              }
            }
          ],
          yearRate: [
            { required: true, message: '请输入年利率', trigger: 'blur', type: 'number' },
            { min: 0, max: 1, message: '年利率范围为0-100%', trigger: 'blur', type: 'number' },
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
        }
      }
    },
    computed: {
      agreeFiles: {
        get() {
          if (this.currentValue.agrees) {
            return this.currentValue.agrees.map((_, i) => ({
              name: '',
              url: _.uri,
              id: i
            }))
          }
          return [];
        },
        set(val) {
          if (val) {
            this.currentValue.agrees = val.map(_ => ({
              uri: _.url
            }))
          } else {
            this.currentValue.agrees = []
          }
        }
      },
      yearRate: {
        get() {
          if (typeof this.currentValue.yearRate === 'number') {
            return this.$floatMultiply(this.currentValue.yearRate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.yearRate = null;
          } else {
            this.currentValue.yearRate = this.$floatDivide(val, 100);
          }
        }
      }
    },
    watch: {
      value(val) {
        this.currentValue = this.$deepcopy(val);
      }
    },
    methods: {
      clearValidate() {
        this.$refs['form'].clearValidate();
        this.yearRate = '';
      },
      handleConfirm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const val = this.$deepcopy(this.currentValue);
            this.$emit('save', val);
          } else {
            return false;
          }
        })
      },
      handleCancel() {
        this.$emit('cancel');
      }
    }
  }
</script>

