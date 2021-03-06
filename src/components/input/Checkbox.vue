<template>
  <el-checkbox-group v-model="currentValue"
                     :disabled="mode === 'VIEW'"
                     @input="handleInput"
                     @change="handleChange">
    <el-checkbox v-for="option in currentOptions"
                 :key="option.value"
                 :label="option.value"
                 :disabled="option.disabled || disabledOptions && disabledOptions.includes(option.value)"
                 :border="border">{{ option.text }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
  import {getSysEnum} from '../../api/enum'

  export default {
    name: 'AtsCheckbox',
    props: {
      value: Array,
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
      disabledOptions: Array
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value) || [],
        currentOptions: this.options || []
      }
    },
    watch: {
      value(val, oldVal) {
        this.setCurrentValue(val);
      },
      options(val, oldValue) {
        this.currentOptions = val;
      },
      group(val, oldValue) {
        if (val) {
          this.getOptions(this.kind, val, this.enumKey, this.visible, this.sequence);
        } else {
          this.currentOptions = [];
        }
      },
      currentOptions(val, oldVal) {
        this.setCurrentValue(this.currentValue.filter(_ =>
          (val.some(option => option.value === _))
        ))
      }
    },
    created() {
      if (!this.options) {
        if (this.kind && this.group) {
          this.getOptions(this.kind, this.group, this.enumKey, this.visible, this.sequence);
        }
      }
    },
    methods: {
      setCurrentValue(value) {
        if (JSON.stringify(value) !== JSON.stringify(this.currentValue)) {
          this.currentValue = value;
        }
        this.$emit('input', value);
      },
      handleInput(value) {
        this.setCurrentValue(value);
      },
      handleChange(value) {
        this.$emit('input', value);
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
