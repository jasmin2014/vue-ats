<template>
  <el-date-picker v-model="currentValue"
                  :class="readonly ? 'is-readonly' : ''"
                  :readonly="readonly"
                  :type="type"
                  :placeholder="placeholder"
                  :disabled="disabled"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  @input="handleInput"
                  @change="handleChange"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @pick="handlePick"
                  @dodestroy="handleDodestroy"></el-date-picker>
</template>

<script>
  export default {
    name: 'AtsDatePicker',
    props: {
      value: {},
      mode: String,
      type: String,
      disabled: Boolean,
      pickerOptions: Object
    },
    data() {
      return {
        currentValue: this.value,
        placeholder: this.type === 'daterange' ? '选择日期范围' : '选择日期'
      }
    },
    computed: {
      readonly() {
        return this.mode === 'VIEW'
      }
    },
    watch: {
      'value'(val, oldValue) {
        this.setCurrentValue(val);
      }
    },
    methods: {
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.currentValue = value;
      },
      handleInput(value) {
        this.$emit('input', value);
        this.setCurrentValue(value);
      },
      handleChange(value) {
        this.$emit('change', value)
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      handleBlur(event) {
        this.$emit('blur', event);
      },
      handlePick(event) {
        this.$emit('pick', event);
      },
      handleDodestroy(event) {
        this.$emit('dodestroy', event);
      }
    }
  }
</script>
