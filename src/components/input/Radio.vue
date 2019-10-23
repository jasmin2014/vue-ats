<template>
  <el-radio-group v-model="currentValue"
                  :disabled="mode === 'VIEW'"
                  @input="handleInput"
                  @change="handleChange">
    <el-radio v-for="option in currentOptions"
              :label="option.value"
              :disabled="option.disabled"
              :key="option.value"
              :border="border">{{ option.text }}</el-radio>
  </el-radio-group>
</template>

<script>
  import {getSysEnum} from '../../api/enum'
  const BOOLEAN_OPTIONS = [
    { text: '是', value: true },
    { text: '否', value: false }];

  export default {
    name: 'AtsRadio',
    props: {
      value: [String, Number, Boolean],
      mode: String,
      options: Array,
      kind: String,
      group: String,
      enumKey: String,
      visible: {
        type: [Number, String],
        default: 0
      },
      sequence: Array,
      border: Boolean,
      type: String, // boolean, boolean-num
      trueText: {
        type: String,
        default: '是'
      },
      falseText: {
        type: String,
        default: '否'
      }
    },
    data() {
      return {
        currentValue: this.value,
        currentOptions: this.options || []
      }
    },
    watch: {
      value(val, oldVal) {
        this.setCurrentValue(val);
      },
      options(val, oldValue) {
        this.currentOptions = val;
      }
    },
    created() {
      if (!this.options) {
        if (this.kind) {
          this.getOptions(this.kind, this.group, this.enumKey, this.visible, this.sequence);
        } else if (this.type === 'boolean') {
          this.currentOptions = [
            { text: this.trueText, value: true },
            { text: this.falseText, value: false }
          ]
        } else if (this.type === 'boolean-num') {
          this.currentOptions = [
            { text: this.trueText, value: 1 },
            { text: this.falseText, value: 0 }
          ]
        }
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
        this.$emit('change', value);
      },
      getOptions(kind, group, enumKey, visible, sequence) {
        const enums = this.$store.state.enums;
        if (enums && enums[`${kind}.${group}`]) {
          switch (visible) {
            case 0: // 显示可用
              this.currentOptions = enums[`${kind}.${group}`].filter(_ => _.visible === 0);
              break;
            case 1: // 显示禁用
              this.currentOptions = enums[`${kind}.${group}`].filter(_ => _.visible === 1);
              break;
            default: // disable禁用枚举
              this.currentOptions = enums[`${kind}.${group}`].map(_ => ({
                ..._,
                disabled: _.visible !== 0
              }));
              break;
          }
          return;
        }
        return getSysEnum(kind, group, enumKey, visible, sequence).then((response) => {
          const res = response.data;
          if (res.code === 200) {
            switch (visible) {
              case 0:
              case 1:
                this.currentOptions = res.body.map(_ => ({ text: _.displayName, value: _.enumKey }));
                break;
              default:
                this.currentOptions = res.body.map(_ => ({ text: _.displayName, value: _.enumKey, disabled: _.visible !== 0 }));
                break;
            }
          }
        }, () => {})
      }
    }
  }
</script>
