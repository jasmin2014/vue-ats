<template>
  <el-form class="relationship"
           ref="form"
           :model="currentValue"
           v-if="currentValue.list">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col :span="4">
        <h5>亲属联系人</h5>
      </el-col>
      <el-col :span="1" v-if="!isUpload || currentValue.list.length === 0">
        <el-button size="small" type="primary" icon="fa fa-plus" title="新增亲属联系人"
                   v-if="mode !== 'VIEW'"
                   @click="handleCreateRow()"></el-button>
      </el-col>
    </el-row>
    <el-row
      v-for="(friend, index) in currentValue.list"
      :key="index">
      <el-col :span="7">
        <el-form-item label="姓名"
                      size="small"
                      label-width="100px"
                      :prop="'list.' + index + '.realName'"
                      :rules="mode !== 'VIEW' ? rules.realName : {}">
          <ats-input v-model.trim="friend.realName"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="关系"
                      size="small"
                      label-width="100px"
                      :prop="'list.' + index + '.kind'"
                      :rules="mode !== 'VIEW' ? rules.kind : {}">
          <ats-select v-model="friend.kind"
                      :mode="mode"
                      :kind="$enum.REL_RELATIVE"
                      :group="$enum.REL_RELATIVE"></ats-select>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="手机号码"
                      size="small"
                      label-width="100px"
                      :prop="'list.' + index + '.mobile'"
                      :rules="mode !== 'VIEW' ? rules.mobile : {}">
          <ats-input v-model.trim="friend.mobile"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-col>
      <el-col v-if="mode !== 'VIEW'"
              :span="2" :offset="1">
        <el-button type="danger" icon="fa fa-trash" size="mini"
                   @click="handleDeleteRow(index)"></el-button>
      </el-col>
    </el-row>
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
          realName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          kind: [
            { required: true, message: '请选择联系人关系', trigger: 'change' }
          ],
          mobile: [
            { required: true, message: '请输入联系人手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
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
        if (this.currentValue.list) {
          this.currentValue.list.push({});
        }
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
