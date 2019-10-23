<template>
  <el-input v-if="type !== 'text'"
            v-model="currentValue"
            ref="input"
            :class="readonly ? 'is-readonly' : ''"
            :readonly="readonly"
            :disabled="disabled"
            :size="size"
            :type="type"
            :rows="rows"
            :min="min"
            :max="max"
            :step="step"
            :placeholder="placeholder"
            :clearable="clearable"
            :debounce="0"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur">
    <template v-if="unit" slot="append">{{ unit }}</template>
  </el-input>
  <div v-else
       class="el-input is-readonly">
    <div class="el-input__inner">
      {{ currentValue }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AtsInput',
    props: {
      value: [String, Number],
      mode: String,
      unit: String,
      type: String,
      size: String,
      rows: Number,
      disabled: Boolean,
      min: Number,
      max: {
        type: Number,
        default: Number.MAX_SAFE_INTEGER
      },
      step: Number,
      placeholder: String,
      clearable: Boolean
    },
    data() {
      return {
        currentValue: this.value
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
    mounted() {
      if (this.type === 'number') {
        const innerInput = this.$refs.input.$refs.input;
        if (innerInput) {
          innerInput.onkeypress = function (e) {
            const ev = e.which !== undefined ? e.which : window.event.keyCode;
            return /[0-9.\-]|(backspace)/i.test(e.key) || ev === 0;
          };

          // 数字输入框禁止滚轮改变数值
          innerInput.addEventListener('DOMMouseScroll', (e) => {
            e = e || window.event;
            e.preventDefault();
          });
          innerInput.onmousewheel = function (e) {
            return false;
          }
        }
      }
    },
    methods: {
      setCurrentValue(value) {
        if (this.type === 'number') {
          if (/^(-)?\d+\.\d*0+$/.test(value) || value === '') {
            this.currentValue = value;
          } else {
            const newValue = parseFloat(value);
            if (!isNaN(newValue)) {
              this.currentValue = value = newValue;
            } else {
              this.currentValue = value;
            }
          }
        } else {
          if (value !== this.currentValue) {
            this.currentValue = value;
          }
        }
        if (this.type !== 'text') {
          this.$emit('input', value);
        }
      },
      handleInput(value) {
        this.setCurrentValue(value);
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      handleBlur(event) {
        if (this.type === 'number') {
          const newValue = parseFloat(this.currentValue);
          if (!isNaN(newValue)) {
            this.currentValue = newValue;
          } else if (this.currentValue !== '' && this.currentValue !== undefined && this.currentValue !== null) {
            this.currentValue = 0;
          }
          this.$emit('input', this.currentValue)
        }
        this.$emit('blur', event);
      }
    }
  }
</script>

<style lang="scss" scoped>
  div.el-input__inner {
    line-height: 38px;
  }
</style>
