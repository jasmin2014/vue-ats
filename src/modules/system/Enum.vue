<template>
  <el-form v-if="currentValue"
           ref="form"
           :model="currentValue"
           :rules="rules"
           class="constant"
           label-width="150px">
    <el-form-item label="编号" v-if="mode !== 'CREATE'">
      <ats-input v-model="currentValue.id"
                 mode="VIEW"></ats-input>
    </el-form-item>
    <el-form-item label="枚举类型（kind）">
      <ats-input v-model="currentValue.kind"
                 :mode="mode"></ats-input>
    </el-form-item>
    <el-form-item label="枚举分组（group）">
      <ats-input v-model="currentValue.group"
                 :mode="mode"></ats-input>
    </el-form-item>
    <el-form-item label="枚举值">
      <ats-input v-model="currentValue.enumKey"
                 :mode="mode"></ats-input>
    </el-form-item>
    <el-form-item label="枚举名称">
      <ats-input v-model="currentValue.displayName"
                 :mode="mode"></ats-input>
    </el-form-item>
    <el-form-item label="状态" v-if="mode !== 'CREATE'">
      <ats-radio v-model="currentValue.visible" :options="[{ text: '启用', value: 0 }, { text: '禁用', value: 1 }]"></ats-radio>
    </el-form-item>
    <el-form-item label="备注">
      <ats-input v-model="currentValue.remarks"
                 :mode="mode"></ats-input>
    </el-form-item>
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
        currentValue: this.$deepcopy(this.value),
        rules: {}
      }
    },

    watch: {
      value(val, oldVal) {
        this.currentValue = this.$deepcopy(val)
      }
    },

    methods: {
      validate(callback) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit('input', this.$deepcopy(this.currentValue));
          }
          typeof callback === 'function' && callback(valid)
        })
      }
    }
  }
</script>
