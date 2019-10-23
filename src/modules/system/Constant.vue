<template>
  <el-form v-if="currentValue"
           ref="form"
           :model="currentValue"
           :rules="rules"
           class="constant"
           label-width="120px">
    <el-form-item label="编号" v-if="mode !== 'CREATE'">
      <ats-input v-model="currentValue.id"
                 mode="VIEW"></ats-input>
    </el-form-item>
    <el-form-item label="类型">
      <ats-input v-model="currentValue.kind"
                 :mode="mode"></ats-input>
    </el-form-item>
    <el-form-item label="参数名">
      <ats-input v-model="currentValue.propName"
                 :mode="mode"></ats-input>
    </el-form-item>
    <el-form-item label="参数值">
      <ats-input v-model="currentValue.propValue"
                 :mode="mode"></ats-input>
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
