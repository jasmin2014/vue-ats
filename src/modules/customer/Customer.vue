<template>
  <div class="customer">
    <el-form class="form-label flex">
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户编号">
            <ats-input v-if="currentType === this.$enum.SUBJECT_PROP_PERSON"
                       v-model="value.personNo"
                       disabled></ats-input>
            <ats-input v-if="currentType === this.$enum.SUBJECT_PROP_ORGANIZE"
                       v-model="value.partyNo"
                       disabled></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="主体性质">
            <ats-select v-model="currentType"
                        :mode="mode === 'CREATE' ? mode : 'VIEW'"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"></ats-select>
          </el-form-item>
        </el-col>
        <!--<el-col :span="4" :offset="7" v-if="mode !== 'VIEW'">-->
          <!--<el-button type="primary" @click="handleSave">保存</el-button>-->
          <!--<el-button @click="handleCancel">取消</el-button>-->
        <!--</el-col>-->
      </el-row>
    </el-form>
    <individual v-if="currentType === this.$enum.SUBJECT_PROP_PERSON"
                ref="individual"
                v-model="value"
                :mode="from === 'create' ? 'CREATE' : mode"
                :end="end"
                :error="error"
                :show-card="showCard"
                @save-base="handleSaveBase"
                @save-contact="handleSaveContact"
                @save-prop="handleSaveProp"
                @bind-card="handleBindCard"
                @delete-prop="handleDeleteProp"
                @save-proof="handleSaveProof"
                @delete-proof="handleDeleteProof"></individual>
    <enterprise v-else-if="currentType === this.$enum.SUBJECT_PROP_ORGANIZE"
                ref="enterprise"
                v-model="value"
                :mode="from === 'create' ? 'CREATE' : mode"
                :end="end"
                :error="error"
                :show-card="showCard"
                @org-name-blur="handleOrgNameBlur"
                @save-base="handleSaveBase"
                @save-business="handleSaveBusiness"
                @save-legal="handleSaveLegal"
                @save-prop="handleSaveProp"
                @delete-prop="handleDeleteProp"
                @save-proof="handleSaveProof"
                @delete-proof="handleDeleteProof"></enterprise>
    <!--<el-card :class="end !== this.$enum.BUSINESS_ASSET ? 'no-card' : ''">-->
    <!--</el-card>-->
  </div>
</template>

<script>
  import Individual from './Individual.vue'
  import Enterprise from './Enterprise.vue'

  export default {
    props: {
      value: Object,
      type: String,
      end: String,
      mode: String,
      from: String,
      error: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        currentType: this.type,
        showCard: this.end === this.$enum.BUSINESS_ASSET
      }
    },
    watch: {
      currentType(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('update:type', val);
        }
      }
    },
    methods: {
      setUscCode(uscCode) {
        this.$refs['enterprise'].setUscCode(uscCode);
      },
      handleOrgNameBlur(orgName) {
        this.$emit('org-name-blur', orgName)
      },
      handleSaveBase(data) {
        this.$emit('save-base', {
          type: this.currentType,
          data
        })
      },
      handleSaveContact(data) {
        this.$emit('save-contact', {
          type: this.currentType,
          data
        })
      },
      handleSaveBusiness(data) {
        this.$emit('save-business', {
          type: this.currentType,
          data
        })
      },
      handleSaveLegal(data) {
        this.$emit('save-legal', {
          type: this.currentType,
          data
        })
      },
      handleSaveProp({type, data}) {
        this.$emit('save-prop', {
          type, // 资产信息类型
          data
        })
      },
      handleBindCard(propId) {
        this.$emit('bind-card', propId)
      },
      handleDeleteProp({type, id}) {
        this.$emit('delete-prop', {
          type,
          itemId: id
        })
      },
      handleSaveProof(file) {
        this.$emit('save-proof', {
          type: this.currentType,
          file
        })
      },
      handleDeleteProof(proofId) {
        this.$emit('delete-proof', {
          type: this.currentType,
          proofId
        })
      }
    },
    components: {
      Enterprise,
      Individual
    }
  }
</script>

<style lang="scss">
  .customer {
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
