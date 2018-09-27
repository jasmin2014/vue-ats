<template>
  <el-select v-if="!readonly || disabled"
             v-model="currentValue"
             :disabled="disabled"
             :placeholder="placeholder"
             :clearable="clearable"
             @input="handleInput"
             @change="handleChange"
             @clear="handleClear"
             @visible-change="handleVisibleChange"
             @remove-tag="handleRemoveTag">
    <el-option v-for="option in currentOptions"
               :label="option.text"
               :value="option.value"
               :key="option.value"
               :disabled="option.disabled || (disabledOptions && disabledOptions.includes(option.value))"></el-option>
  </el-select>
  <el-input v-else-if="!text"
            v-model="displayValue"
            :class="readonly ? 'is-readonly' : ''"
            :readonly="readonly"></el-input>
  <span v-else>
    {{ displayValue }}
  </span>
</template>

<script>
  import {getSysEnum, getRegionEnum, getOrgList} from '../../api/enum'

  const BOOLEAN_OPTIONS = [
    { text: '是', value: true },
    { text: '否', value: false }];

  export default {
    name: 'AtsSelect',
    props: {
      value: [String, Number, Boolean],
      text: Boolean,
      type: {
        type: String, // enum, region, org, boolean
        default: 'enum'
      },
      kind: String,
      group: String,
      enumKey: String,
      visible: Number,
      sequence: Array,
      region: String,
      org: String,
      orgStatus: Number,
      options: Array,
      mode: String,
      disabled: Boolean,
      placeholder: String,
      clearable: Boolean,
      noGroup: Boolean,
      disabledOptions: Array,
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
    computed: {
      readonly() {
        return this.mode === 'VIEW'
      },
      displayValue() {
        const result = this.currentOptions.filter(_ => _.value === this.currentValue);
        return result.length > 0 ? result[0].text : this.currentValue;
      }
    },
    watch: {
      value(val, oldValue) {
        this.setCurrentValue(val);
      },
      options(val, oldValue) {
        this.currentOptions = val;
      },
      currentOptions(val, oldVal) {
        if (((val && val.length) || oldVal && oldVal.length) && this.currentValue) {
          if (!val.some(_ => _.value === this.currentValue)) {
            this.$emit('input', '');
          }
        }
      },
      region(val, oldValue) {
        if (val) {
          this.getRegions(val);
        } else {
          this.currentOptions = [];
        }
        // if (oldValue) {
        //   this.$emit('input', '')
        // }
      },
      group(val, oldValue) {
        if (val) {
          this.getOptions(this.kind, val, this.enumKey, this.visible, this.sequence);
        } else {
          this.currentOptions = [];
        }
        // if (oldValue) {
        //   this.$emit('input', '')
        // }
      },
      org(val, oldValue) {
        if (val) {
          this.getOrgList(val, this.orgStatus)
        } else {
          this.currentOptions = [];
        }
        // if (oldValue) {
        //   this.$emit('input', '')
        // }
      }
    },
    created() {
      if (!this.options) {
        if (this.kind) {
          if (this.group || this.noGroup) {
            this.getOptions(this.kind, this.group, this.enumKey, this.visible, this.sequence)
          }
        } else if (this.region) {
          this.getRegions(this.region)
        } else if (this.org) {
          this.getOrgList(this.org, this.orgStatus)
        } else if (this.type === 'boolean') {
          this.currentOptions = [
            { text: this.trueText, value: true },
            { text: this.falseText, value: false }
          ]
        }
      }
    },
    methods: {
      setCurrentValue(value) {
        if (value !== this.currentValue) {
          this.currentValue = value;
          this.$emit('change', value);
        }
        this.$emit('input', value);
      },
      handleInput(value) {
        this.setCurrentValue(value);
      },
      handleChange(value) {
        this.$emit('change', value);
      },
      handleClear(value) {
        this.$emit('clear', value);
      },
      handleVisibleChange(value) {
        this.$emit('visible-change', value);
      },
      handleRemoveTag(value) {
        this.$emit('remove-tag', value);
      },
      getOptions(kind, group, enumKey, visible, sequence) {
        const enums = this.$store.state.enums;
        if (!sequence && enums && enums[`${kind}.${group}`]) {
          this.currentOptions = enums[`${kind}.${group}`];
          return;
        }
        const binarySequence = sequence ? this.$arrayToBinary(sequence) : null;
        getSysEnum(kind, group, enumKey, visible, binarySequence).then((response) => {
          const res = response.data;
          if (res.code === 200) {
            this.currentOptions = res.body.map(_ => ({text: _.displayName, value: _.enumKey}));
          } else {
            this.currentOptions = [];
          }
        }, () => {
          this.currentOptions = []
        })
      },
      getRegions(region) {
        const regions = this.$store.state.regions;
        if (regions[region]) {
          this.currentOptions = regions[region];
          return;
        }
        getRegionEnum(region).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.currentOptions = res.body.map(_ => ({text: _.name, value: _.region}));
            this.$store.commit('saveRegions', {
              code: region,
              list: this.$deepcopy(this.currentOptions)
            });
          } else {
            this.currentOptions = [];
          }
        }, () => {
          this.currentOptions = []
        })
      },
      getOrgList(orgType, statusEnable) {
        getOrgList(orgType, statusEnable).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.currentOptions = res.body.map(_ => ({text: _.name, value: _.partyId}))
          } else {
            this.currentOptions = [];
          }
        }, () => {
          this.currentOptions = []
        })
      }
    }
  }
</script>
