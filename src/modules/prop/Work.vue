<template>
  <el-form class="prop-eshop"
           ref="form"
           :model="currentValue"
           :rules="mode !== 'VIEW' ? rules : {}"
           label-width="0" size="small">
    <table class="el-table el-table--border" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>单位名称</th>
        <th>所属行业</th>
        <th>单位性质</th>
        <th>单位电话</th>
        <th>单位地址</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <el-form-item prop="workOrgName">
            <ats-input v-model.trim="currentValue.workOrgName"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="workType">
            <ats-select v-model="currentValue.workType"
                        :kind="$enum.INDUSTRY"
                        :group="$enum.INDUSTRY"
                        :mode="mode"></ats-select>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="workOrgNature">
            <ats-select v-model="currentValue.workOrgNature"
                        :kind="$enum.COMPANY_PROP"
                        :group="$enum.COMPANY_PROP_GROUP"
                        :mode="mode"></ats-select>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="workOrgPhone">
            <ats-input v-model.trim="currentValue.workOrgPhone"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="workOrgAddress">
            <ats-input v-model.trim="currentValue.workOrgAddress"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
      </tr>
      </tbody>
    </table>
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
        currentValue: this.$deepcopy(this.value || {}),
        rules: {
          workOrgName: [
            { required: true, message: '请输入单位名称', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          workType: [
            { required: true, message: '请选择所属行业', trigger: 'change' }
          ],
          workOrgNature: [
            { required: true, message: '请选择单位性质', trigger: 'change' }
          ],
          workOrgPhone: [
            { max: 30, message: '长度30以内', trigger: 'blur' }
          ],
          workOrgAddress: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      value(val) {
        this.currentValue = this.$deepcopy(val || {})
      }
    },
    methods: {
      validate(callback) {
        const val = this.currentValue;
        if (!val.workOrgName && !val.workType && !val.workOrgNature && !val.workOrgPhone && !val.workOrgAddress) {
          typeof callback === 'function' && callback(true);
        } else {
          this.$refs.form.validate((valid) => {
            typeof callback === 'function' && callback(valid);
            if (valid) {
              this.$emit('input', this.$deepcopy(this.currentValue));
            } else {
              return false;
            }
          })
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
