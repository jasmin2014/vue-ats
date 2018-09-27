<template>
  <div class="upload-asset">
    <el-form class="form-label flex">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <el-form-item label="主体性质">
            <ats-select v-model="apply.loanPartyKind"
                        :mode="mode === 'CREATE' ? mode : 'VIEW'"
                        :kind="this.$enum.SUBJECT_PROP" :group="this.$enum.SUBJECT_PROP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="3" v-if="mode !== 'VIEW'">
          <el-button type="primary" @click="handleSave">保存并上传</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-alert v-for="(msg, index) in errorMsg" :key="index"
              class="error-msg"
              :title="msg"
              :closable="false"
              type="error"></el-alert>
    <el-row class="mgt20">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="客户信息" name="customer">
          <individual v-if="apply.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON"
                      v-model="customer"
                      ref="customer"
                      :mode="mode"
                      :show-card="showCard"
                      is-upload
                      @save="handleCustomerSave"
                      @error="handleCustomerError"></individual>
          <enterprise v-else-if="apply.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE"
                      v-model="customer"
                      ref="customer"
                      :mode="mode"
                      :show-card="showCard"
                      is-upload
                      @save="handleCustomerSave"
                      @error="handleCustomerError"></enterprise>
        </el-tab-pane>
        <el-tab-pane v-if="apply"
                     label="申请信息" name="apply">
          <apply v-model="apply"
                 ref="apply"
                 :mode="mode"
                 :type="end"
                 is-upload
                 @save="handleApplySave"
                 @error="handleApplyError"></apply>
        </el-tab-pane>
        <el-tab-pane v-if="material"
                     label="证明材料" name="material">
          <doc v-model="material"
               ref="doc"
               :mode="mode"
               :type="end"
               is-upload
               @save="handleDocSave"></doc>
        </el-tab-pane>
        <el-tab-pane v-if="fee"
                     label="收费信息" name="fee">
          <fee v-model="fee"
               ref="fee"
               :mode="mode"
               is-upload
               @save="handleFeeSave"
               @phase-change="handleFeePhaseChange"></fee>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
  import Individual from '../customer/Individual.vue'
  import Enterprise from '../customer/Enterprise.vue'
  import Apply from './Apply.vue'
  import Doc from './Doc.vue'
  import Fee from './Fee.vue'

  export default {
    props: {
      mode: String,
      end: String,
      customer: Object,
      apply: Object,
      material: [Array, Object],
      fee: Object,
      errorMsg: Array
    },
    data() {
      return {
        activeTab: 'customer',
        detail: {},
        showCard: this.end === this.$enum.BUSINESS_ASSET
      }
    },
    methods: {
      handleSave() {
        this.$refs.customer.save();
      },
      handleCustomerSave(val) {
        this.detail.customer = val;
        this.$refs.apply.save();
      },
      handleApplySave(val) {
        const protectionList = val.protectionList;
        delete val.protectionList;
        this.detail.apply = {
          base: val,
          protectionList: protectionList
        };
        this.$refs.doc.save();
      },
      handleDocSave(val) {
        this.detail.material = val;
        this.$refs.fee.save();
      },
      handleFeeSave(val) {
        this.detail.fee = val;
        console.log(this.detail);
        this.$emit('save', this.$deepcopy(this.detail))
      },
      handleCustomerError() {
        this.activeTab = 'customer'
      },
      handleApplyError() {
        this.activeTab = 'apply'
      },
      handleFeePhaseChange(phase) {
        this.$emit('fee-phase-change', phase)
      }
    },
    components: {
      Individual,
      Enterprise,
      Apply,
      Doc,
      Fee
    }
  }
</script>

<style lang="scss">
  .upload-asset {
    .error-msg {
      margin-top: -5px;
    }
  }
</style>
