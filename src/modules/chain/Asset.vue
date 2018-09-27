<template>
  <div class="chain-asset">
    <el-row>
      <el-col :span="6">
        <el-form class="form-label flex">
          <el-form-item label="主体性质">
            <ats-select v-model="apply.loanPartyKind"
                        :mode="mode === 'CREATE' ? mode : 'VIEW'"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"
                        disabled
                        @change="handleCustomerTypeChange"></ats-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-button v-if="isPreview"
                   type="success"
                   @click="handleUpChain">上链</el-button>
        <el-button v-else-if="mode !== 'VIEW'"
                   type="primary"
                   @click="handleSave">保存</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="客户信息" name="customer">
          <individual v-if="apply.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON"
                      ref="individual"
                      v-model="customer"
                      :mode="mode"
                      @error="activeTab = 'customer'"></individual>
          <enterprise v-else-if="apply.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE"
                      ref="enterprise"
                      v-model="customer"
                      :mode="mode"></enterprise>
        </el-tab-pane>
        <el-tab-pane label="资产信息" name="apply">
          <apply ref="apply"
                 v-model="apply"
                 :mode="mode"
                 @error="activeTab = 'apply'"
                 @data-kind-change="handleDataKindChange"></apply>
        </el-tab-pane>
        <el-tab-pane v-if="result" label="参与结果" name="result">
          <share-result v-model="result"></share-result>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
  import Individual from './Individual'
  import Enterprise from './Enterprise'
  import Apply from './Apply'
  import ShareResult from './ShareResult'
  import {getReportHash} from '../../chain-assets/api/asset';

  export default {
    props: {
      customer: Object,
      apply: {
        type: Object,
        default: function () {
          return {
            loanPartyKind: this.$enum.SUBJECT_PROP_PERSON
          }
        }
      },
      result: Object,
      mode: String,
      business: String,
      isPreview: Boolean
    },
    data() {
      return {
        activeTab: 'customer'
      }
    },
    methods: {
      handleUpChain() {
        this.$emit('up-chain');
      },
      handleSave() {
        this.$refs['individual'].save((customer) => {
          this.$refs['apply'].save((apply) => {
            this.$emit('save', {
              customer,
              apply
            })
          });
        })
      },
      handleDataKindChange(kindCode) {
        if (!kindCode) return;

        const customer = this.$refs['individual'].get3Elements();
        if (customer.name && customer.ident && customer.mobile) {
          getReportHash(Object.assign({
            kindCode
          }, customer)).then(({ data }) => {
            if (data.code === 200) {
              this.$refs['apply'].setDataSourceHash(data.body)
            } else {
              this.$message.error(data.detail || data.message);
              this.$refs['apply'].clearDataSourceKind();
              this.$refs['apply'].setDataSourceHash(null);
            }
          }).catch(() => {})
        } else {
          this.$alert('请先填写客户信息', '提示', {
            type: 'warning'
          }).then(() => {
            this.$refs['apply'].clearDataSourceKind();
            this.activeTab = 'customer';
          })
        }
      },
      handleCustomerTypeChange(type) {
        this.$emit('customer-type-change', type);
      }
    },
    components: {
      Individual,
      Enterprise,
      Apply,
      ShareResult
    }
  }
</script>

<style lang="scss">
  .chain-asset {
    .no-card {
      border: none;
      box-shadow: none;
      background: initial;
      color: inherit;
      .el-card__body {
        padding: 0;
      }
    }
  }
</style>
