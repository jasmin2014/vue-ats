<template>
  <div class="asset">
    <el-form class="form-label flex">
      <el-row>
        <el-col :span="6">
          <el-form-item label="主体性质">
            <ats-select v-model="info.loanPartyKind"
                        :mode="mode === 'CREATE' ? mode : 'VIEW'"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"
                        @change="handleCustomerTypeChange"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="1" :offset="1" v-if="mode === 'CREATE'">
          <el-button type="primary" @click="handleSelectCustomer">选择客户</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="申请信息" name="first">
          <apply v-model="info"
                 ref="apply"
                 :mode="mode"
                 :type="type"
                 :error="error"
                 @save="handleApplySave"
                 @save-protection="handleApplySaveProtection"
                 @delete-protection="handleApplyDeleteProtection"></apply>
        </el-tab-pane>
        <el-tab-pane v-if="material"
                     label="证明材料" name="second">
          <doc v-model="material"
               :mode="mode"
               :type="type"
               @upload="handleDocUpload"
               @remove="handleDocRemove"></doc>
        </el-tab-pane>
        <el-tab-pane v-if="fee"
                     label="收费信息" name="third">
          <fee v-model="fee"
               :mode="mode"
               @edit="handleFeeEdit"
               @create="handleFeeCreate"
               @delete="handleFeeDelete"
               @phase-change="handleFeePhaseChange"></fee>
        </el-tab-pane>
        <el-tab-pane v-if="risk"
                     label="资产风险等级" name="fourth">
          <risk v-model="risk"
                :mode="mode"></risk>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
  import Apply from './Apply.vue'
  import Doc from './Doc.vue'
  import Fee from './Fee.vue'
  import Risk from './Risk.vue'

  export default {
    props: {
      mode: String,
      info: Object,
      material: [Array, Object],
      fee: Object,
      risk: Object,
      type: String,
      error: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        activeTab: 'first'
      }
    },
    methods: {
      handleCustomerTypeChange(type) {
        this.$emit('customer-type-change', type);
      },
      handleSelectCustomer() {
        this.$emit('select-customer', this.info.loanPartyKind)
      },
      handleDocUpload(file) {
        this.$emit('material-upload', file)
      },
      handleDocRemove(file) {
        this.$emit('material-remove', file)
      },
      handleFeePhaseChange(phase) {
        this.$emit('fee-phase-change', phase)
      },
      handleFeeEdit(val) {
        this.$emit('fee-edit', val)
      },
      handleFeeCreate(val) {
        this.$emit('fee-create', val)
      },
      handleFeeDelete(val, phase) {
        this.$emit('fee-delete', val, phase)
      },
      handleApplySave(val, isBack) {
        this.$emit('save', val, isBack)
      },
      handleApplySaveProtection(val) {
        this.$emit('save-protection', val)
      },
      handleApplyDeleteProtection(id) {
        this.$emit('delete-protection', id)
      }
    },
    components: {
      Apply,
      Doc,
      Fee,
      Risk
    }
  }
</script>
