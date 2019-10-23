<template>
  <div class="protection-config">
    <el-form v-if="currentValue"
             ref="form"
             label-width="180px"
             :model="currentValue"
             :rules="mode !== 'VIEW' ?  rules : {}"
             :validate-on-rule-change="false">
      <el-row>
        <el-col :span="14" :offset="2">
          <el-form-item label="方案名称" prop="protectionName">
            <ats-input v-model.trim="currentValue.protectionName"
                       :mode="mode"></ats-input>
          </el-form-item>
          <el-form-item label="保障方式" prop="protectionModel">
            <ats-select v-model="currentValue.protectionModel"
                        :kind="$enum.PROTECTION_MODEL"
                        :group="$enum.PROTECTION_MODEL"
                        :mode="mode"
                        clearable></ats-select>
          </el-form-item>
          <el-form-item label="保障平台" prop="protectionOrgId">
            <ats-input v-model="currentValue.protectionOrgName" disabled></ats-input>
          </el-form-item>
          <el-form-item label="关系资金端" prop="fundOrg">
            <ats-select v-model="currentValue.fundOrg"
                        :value-text.sync="currentValue.fundOrgName"
                        :org="$enum.BUSINESS_INTENTION_FUND"
                        :mode="mode"></ats-select>
          </el-form-item>
          <el-form-item label="涉及银行卡" prop="bankAccount">
            <ats-input v-if="mode === 'VIEW'"
                       :value="currentValue.bankAccount"
                       :mode="mode"></ats-input>
            <ats-select v-else
                        v-model="currentValue.compensatoryAccountId"
                        :extra-data.sync="currentValue.bankAccount"
                        :options="collectionCardList"
                        :mode="mode"
                        clearable></ats-select>
          </el-form-item>
          <el-form-item label="保障协议" prop="fileUrl">
            <ats-upload-doc v-model="fileList"
                            :limit="1"
                            :mode="mode"
                            @success="validateUploadFile"
                            @remove="validateUploadFile"></ats-upload-doc>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="mode !== 'VIEW'">
        <el-col :span="14" :offset="2">
          <el-button type="primary"
                     style="margin-left: 180px;"
                     @click="handleSave">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  const DEFAULT_VALUE = {
    planId: '',
    protectionName: '',
    protectionModel: '',
    protectionOrgId: '',
    protectionOrgName: '',
    bankAccount: '',
    compensatoryAccountId: '',
    fundOrg: '',
    fundOrgName: '',
    fileUrl: '',
    fileName: ''
  };

  export default {
    props: {
      value: Object,
      mode: String
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value),
        rules: {
          protectionName: [
            { required: true, message: '请输入方案名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度1-10', trigger: 'blur' }
          ],
          protectionModel: [
            { required: true, message: '请选择保障方式', trigger: 'change' }
          ],
          fundOrg: [
            { required: true, message: '请选择关联资金端', trigger: 'change' }
          ],
          bankAccount: [
            { required: true, message: '请选择涉及银行卡', trigger: 'change' }
          ],
          fileUrl: [
            { message: '请上传保障协议', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        collectionCardList: state => state.application.collectionCardList
      }),
      fileList: {
        get() {
          if (this.currentValue.fileUrl) {
            return [{
              name: this.currentValue.fileName || '保障协议',
              url: this.currentValue.fileUrl
            }]
          }
          return []
        },
        set(val) {
          this.currentValue.fileUrl = val && val.length ? val[0].url : '';
          this.currentValue.fileName = val && val.length ? val[0].name : '';
        }
      }
    },
    watch: {
      value(val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
          this.setCurrentValue(val);
        }
      },
      'currentValue.fundOrg'(val, oldVal) {
        if (val !== oldVal) {
          this.$store.commit('application/updateIntentionFund', val);
          if (oldVal) {
            this.currentValue.bankAccount = '';
            this.currentValue.compensatoryAccountId = '';
          }
        }
      }
    },

    destroyed() {
      this.$store.commit('application/reset')
    },

    methods: {
      setCurrentValue(val) {
        this.currentValue = Object.assign(this.$deepcopy(DEFAULT_VALUE), val)
      },

      handleSave() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const value = this.currentValue;
            this.$emit('save', {
              protectionName: value.protectionName,
              protectionModel: value.protectionModel,
              protectionOrgId: value.protectionOrgId,
              protectionOrgName: value.protectionOrgName,
              bankAccount: value.bankAccount,
              compensatoryAccountId: value.compensatoryAccountId,
              fundOrg: value.fundOrg,
              fundOrgName: value.fundOrgName,
              fileUrl: value.fileUrl,
              fileName: value.fileName
            })
          }
        })
      },
      handleCancel() {
        this.$router.go(-1)
      },

      validateUploadFile() {
        this.$refs.form.validateField('fileUrl');
      }
    }
  }
</script>
