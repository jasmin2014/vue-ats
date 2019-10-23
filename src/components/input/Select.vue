<template>
  <el-select v-if="!readonly || disabled"
             v-model="currentValue"
             :disabled="disabled"
             :placeholder="placeholder"
             :clearable="clearable"
             :filterable="filterable"
             :allow-create="allowCreate"
             @input="handleInput"
             @change="handleChange"
             @clear="handleClear"
             @visible-change="handleVisibleChange"
             @remove-tag="handleRemoveTag">
    <el-option v-for="option in currentOptions"
               :label="option.text"
               :value="option.value"
               :key="option.value"
               :disabled="option.disabled || (disabledOptions && disabledOptions.includes(option.value)) || (typeof disabledMethod === 'function' && disabledMethod(option))"></el-option>
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
  import {
    getSysEnum,
    getRegionEnum,
    getOrgListFromCenter,
    getAssetListFromFund,
    getFundListFromAsset,
    getIntentionFundListFromAsset,
    getRelAssetListFromFund
  } from '../../api/enum'
  import {mapState} from 'vuex'

  export default {
    name: 'AtsSelect',
    props: {
      value: [String, Number, Boolean],
      valueText: [String, Number, Boolean],
      extraData: [String, Number, Boolean, Object],
      text: Boolean,
      type: {
        type: String, // enum, region, org, boolean
        default: 'enum'
      },
      kind: String,
      group: String,
      enumKey: String,
      visible: {
        type: [Number, String],
        default: 0
      },
      sequence: Array,
      region: String,
      org: [Boolean, String],
      orgType: String,
      orgStatus: Number,
      options: Array,
      mode: String,
      disabled: Boolean,
      placeholder: String,
      clearable: Boolean,
      noGroup: Boolean,
      disabledOptions: Array,
      disabledMethod: Function,
      hideDisabledOrg: Boolean,
      trueText: {
        type: String,
        default: '是'
      },
      falseText: {
        type: String,
        default: '否'
      },
      filterable: {
        type: Boolean,
        default: false
      },
      allowCreate: {
        type: Boolean,
        default: false
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
      },
      ...mapState([
        'businessType'
      ])
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
            this.setCurrentValue('');
          }
          this.setSelected();
        }
      },
      region(val, oldValue) {
        if (val) {
          this.getRegions(val);
        } else {
          this.currentOptions = [];
        }
      },
      group(val, oldValue) {
        if (val) {
          this.getOptions(this.kind, val, this.enumKey, this.visible, this.sequence);
        } else {
          this.currentOptions = [];
        }
      },
      org(val, oldValue) {
        if (val) {
          this.getOrgList(val, this.orgStatus)
        } else {
          this.currentOptions = [];
        }
      },
      businessType(val) {
        if (this.org && val) {
          this.getOrgList(this.org, this.orgStatus)
        }
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
          this.handleChange(value)
        }
        this.$emit('input', value);
        this.setSelected();
      },
      setSelected() {
        const selected = this.currentOptions.find(_ => _.value === this.currentValue);
        this.$emit('update:valueText', selected ? selected.text : undefined);
        this.$emit('update:extraData', selected ? selected.extraData : undefined);
        if (this.org) {
          this.$emit('update:orgType', selected ? selected.orgType : undefined);
        }
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
        const binarySequence = sequence ? this.$arrayToBinary(sequence) : null;
        getSysEnum(kind, group, enumKey, visible, binarySequence).then((response) => {
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
        const orgId = this.$getLocalStorage('user').orgId;
        const businessType = this.businessType;
        if (!businessType) return;

        let promise = null;
        switch (businessType) {
          case this.$enum.BUSINESS_CENTER:
            promise = getOrgListFromCenter(orgType === true ? '' : orgType, statusEnable);
            break;
          case this.$enum.BUSINESS_ASSET:
            if (orgType === this.$enum.BUSINESS_FUND) {
              promise = getFundListFromAsset(orgId);
            } else if (orgType === this.$enum.BUSINESS_INTENTION_FUND) {
              promise = getIntentionFundListFromAsset(orgId);
            }
            break;
          case this.$enum.BUSINESS_FUND:
            if (orgType === this.$enum.BUSINESS_ASSET) {
              promise = getAssetListFromFund(orgId);
            } else if (orgType === this.$enum.BUSINESS_REL_ASSET) {
              promise = getRelAssetListFromFund(orgId)
            }
            break;
          default:
            break;
        }

        if (promise) {
          promise.then(response => {
            const res = response.data;
            if (res.code === 200) {
              let options = [];
              options = res.body.map(_ => (
                {
                  text: _.orgName,
                  value: _.orgId,
                  orgType: _.orgType,
                  disabled: typeof this.disabledMethod === 'function' ? this.disabledMethod(_) : _.useFlag === 0
                })
              );
              if (this.hideDisabledOrg) {
                options = options.filter(_ => !_.disabled);
              }
              this.currentOptions = options;
            } else {
              this.currentOptions = [];
            }
          }, () => {
            this.currentOptions = []
          });
        } else {
          console.warn('业务端(' + this.businessType + ') 没有权限获取机构(' + orgType + ')')
        }
      }
    }
  }
</script>
