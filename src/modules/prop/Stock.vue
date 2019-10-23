<template>
  <el-form class="stock"
           ref="form"
           :model="currentValue"
           v-if="currentValue.list">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col :span="4">
        <h5>股东信息</h5>
      </el-col>
      <el-col :span="1" v-if="!isUpload || currentValue.list.length === 0">
        <el-button size="small" type="primary" icon="fa fa-plus" title="新增股东信息"
                   v-if="mode !== 'VIEW'"
                   @click="handleCreateRow()"></el-button>
      </el-col>
    </el-row>
    <table class="el-table el-table--border" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>股东类型</th>
        <th>名称</th>
        <th>股份占比</th>
        <th v-if="mode !== 'VIEW'">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in currentValue.list" :key="index">
        <td>
          <el-form-item :prop="'list.' + index + '.shareholderType'"
                        :rules="mode !== 'VIEW' ? rules.shareholderType : null">
            <ats-select v-model="row.shareholderType"
                        :kind="$enum.SHAREHOLDER_TYPE"
                        :group="$enum.SHAREHOLDER_TYPE"
                        :mode="mode"></ats-select>
          </el-form-item>
        </td>
        <td>
          <el-form-item :prop="'list.' + index + '.personName'"
                        :rules="mode !== 'VIEW' ? rules.personName : null">
            <ats-input v-model.trim="row.personName"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item :prop="'list.' + index + '.stockProportion'"
                        :rules="mode !== 'VIEW' ? rules.stockProportion : null">
            <ats-input v-model="stockProportionList[index]"
                       type="number" :min="0" :step="0.01" unit="%"
                       :mode="mode"
                       @input="handleInput($event, index)"></ats-input>
          </el-form-item>
        </td>
        <td v-if="mode !== 'VIEW'">
          <el-button type="danger" icon="fa fa-trash" size="mini"
                     @click="handleDeleteRow(index)"></el-button>
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
      mode: String,
      isUpload: Boolean
    },
    data() {
      return {
        currentValue: {
          list: this.$deepcopy(this.value || [])
        },
        rules: {
          shareholderType: [
            { required: true, message: '请选择股东类型', trigger: 'change' }
          ],
          personName: [
            { required: true, message: '请输入股东名称', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur'}
          ],
          stockProportion: [
            { required: true, message: '请输入股份占比', trigger: 'blur', type: 'number' },
            { min: 0, max: 1, message: '范围为0-100%', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (!this.$valid.floatValidator(value, 4)) {
                  callback('保留2位小数')
                } else {
                  const total = this.currentValue.list.map(_ => _.stockProportion || 0).reduce((prev, curr) => this.$floatPlus(prev, curr), 0);
                  if (total < 0 || total > 1) {
                    callback('股份占比和不能超过100%')
                  } else {
                    callback()
                  }
                }
              }
            }
          ]
        }
      }
    },
    computed: {
      stockProportionList() {
        return this.currentValue.list.map(_ => {
          if (typeof _.stockProportion === 'number') {
            return this.$floatMultiply(_.stockProportion, 100);
          }
          return '';
        })
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
        if (this.currentValue.list) {
          this.currentValue.list.push({});
        }
      },
      handleDeleteRow(index) {
        if (this.currentValue.list) {
          this.currentValue.list.splice(index, 1);
        }
      },
      handleInput(val, index) {
        if (this.mode === 'VIEW') return;

        this.$set(this.stockProportionList, index, val);
        if (val === '') {
          this.currentValue.list[index].stockProportion = null;
        } else {
          this.currentValue.list[index].stockProportion = this.$floatDivide(val, 100);
        }
        for (let i = 0; i < this.currentValue.list.length; i++) {
          this.$refs.form.validateField('list.' + i + '.stockProportion');
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
