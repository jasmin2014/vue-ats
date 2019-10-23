<template>
  <el-form class="prop-car"
           ref="form"
           :model="currentValue"
           label-width="0" size="small">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col :span="4">
        <h5>公共资源</h5>
      </el-col>
      <el-col :span="1">
        <el-button size="small" type="primary" icon="fa fa-plus" title="新增公共资源"
                   v-if="mode !== 'VIEW'"
                   @click="handleCreateRow()"></el-button>
      </el-col>
    </el-row>
    <table class="el-table el-table--border" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>类型</th>
        <th>账号</th>
        <th>账户状态</th>
        <th>缴纳单位</th>
        <th>缴纳城市</th>
        <th>每月缴纳金额（元）</th>
        <th>余额（元）</th>
        <th v-if="mode !== 'VIEW'">操作</th>
      </tr>
      </thead>
      <tbody v-if="currentValue.list.length">
      <tr v-for="(row, index) in currentValue.list" :key="index">
        <td>
          <el-form-item :prop="'list.' + index + '.kind'"
                        :rules="mode !== 'VIEW' ? rules.kind : {}">
            <ats-select v-model="row.kind"
                        :kind="$enum.PF_PROP"
                        :group="$enum.PF_PROP"
                        :mode="mode"></ats-select>
          </el-form-item>
        </td>
        <td>
          <el-form-item :prop="'list.' + index + '.account'"
                        :rules="mode !== 'VIEW' ? rules.account : {}">
            <ats-input v-model.trim="row.account"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item :prop="'list.' + index + '.status'"
                        :rules="mode !== 'VIEW' ? rules.status : {}">
            <ats-select v-model="row.status"
                        :kind="$enum.PUBLIC_ACC_STATUS"
                        :group="$enum.PUBLIC_ACC_STATUS"
                        :mode="mode"></ats-select>
          </el-form-item>
        </td>
        <td>
          <el-form-item :prop="'list.' + index + '.payOrgParty'"
                        :rules="mode !== 'VIEW' ? rules.payOrgParty : {}">
            <ats-input v-model.trim="row.payOrgParty"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item :prop="'list.' + index + '.paymentCity'"
                        :rules="mode !== 'VIEW' ? rules.paymentCity : {}">
            <ats-input v-model.trim="row.paymentCity"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item :prop="'list.' + index + '.monthPaymentAmount'"
                        :rules="mode !== 'VIEW' ? rules.monthPaymentAmount : {}">
            <ats-input v-model.trim="row.monthPaymentAmount"
                       :mode="mode"
                       type="number" :min="0" :step="0.01"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item :prop="'list.' + index + '.balance'"
                        :rules="mode !== 'VIEW' ? rules.balance : {}">
            <ats-input v-model.trim="row.balance"
                       :mode="mode"
                       type="number" :min="0" :step="0.01"></ats-input>
          </el-form-item>
        </td>
        <td v-if="mode !== 'VIEW'">
          <el-button type="danger" icon="fa fa-trash" size="mini"
                     @click="handleDeleteRow(index)"></el-button>
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td :colspan="mode === 'VIEW' ? 3 : 4">
          <span class="el-table__empty-text" style="position: static;">暂无数据</span>
        </td>
      </tr>
      </tbody>
    </table>
  </el-form>
</template>

<script>
  export default {
    props: {
      value: Array,
      mode: String
    },
    data() {
      return {
        currentValue: {
          list: this.$deepcopy(this.value || [])
        },
        materials: [],
        showDialog: false,
        datePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },
        rules: {
          kind: [
            { required: true, message: '请选择账户类型', trigger: 'change' }
          ],
          account: [
            { required: true, message: '请输入帐号', trigger: 'blur' },
            { pattern: this.$valid.pfAccount, message: '9-20位数字', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择账户状态', trigger: 'change' }
          ],
          payOrgParty: [
            { required: true, message: '请输入缴纳单位', trigger: 'blur' }
          ],
          paymentCity: [
            { required: true, message: '请输入缴纳城市', trigger: 'blur' }
          ],
          monthPaymentAmount: [
            { required: true, message: '请输入每月缴纳金额', trigger: 'blur', type: 'number' },
            { min: 0, max: Number.MAX_SAFE_INTEGER, message: '请输入正确的每月缴纳金额', trigger: 'blur', type: 'number' },
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
          balance: [
            { required: true, message: '请输入余额', trigger: 'blur', type: 'number' },
            { min: 0, max: Number.MAX_SAFE_INTEGER, message: '请输入正确的余额', trigger: 'blur', type: 'number' },
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
          ]
        }
      }
    },
    watch: {
      value(val) {
        this.currentValue.list = this.$deepcopy(val || [])
      }
    },
    methods: {
      validate(callback) {
        this.$refs.form.validate((valid) => {
          typeof callback === 'function' && callback(valid);
          if (valid) {
            this.$emit('input', this.$deepcopy(this.currentValue.list));
          } else {
            return false;
          }
        })
      },
      handleCreateRow() {
        this.currentValue.list.push({});
      },
      handleDeleteRow(index) {
        if (this.currentValue.list) {
          this.currentValue.list.splice(index, 1);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table {
    th, td {
      text-align: center;
      padding: 12px 10px;
    }
  }
</style>
