<template>
  <el-form v-if="currentValue"
           class="key-config"
           ref="form"
           :model="currentValue"
           :rules="rules"
           label-width="120px">
    <el-form-item label="机构ID" prop="partyOrgId">
      <ats-select v-if="mode === 'CREATE'"
                  v-model="currentValue.partyOrgId"
                  :value-text.sync="currentValue.remark"
                  :org="$enum.BUSINESS_ALL"
                  :mode="mode === 'EDIT' ? 'VIEW' : mode"
                  :disabled-method="option => option.orgType == '4'"
                  clearable></ats-select>
      <ats-input v-else
                 v-model="currentValue.partyOrgId"
                 :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-input>
    </el-form-item>
    <el-form-item label="备注（机构名）" prop="remark">
      <ats-input v-model="currentValue.remark"
                 :mode="mode"></ats-input>
    </el-form-item>
    <el-form-item label="机构公钥" prop="publicKey">
      <ats-input v-model="currentValue.publicKey"
                 :mode="mode"
                 :rows="3"
                 type="textarea"></ats-input>
    </el-form-item>
    <el-form-item label="机构私钥" prop="privateKey">
      <ats-input v-model="currentValue.privateKey"
                 :mode="mode"
                 :rows="3"
                 type="textarea"></ats-input>
    </el-form-item>
    <el-form-item label="ATS公钥" prop="atsPublicKey">
      <ats-input v-model="currentValue.atsPublicKey"
                 :mode="mode"
                 :rows="3"
                 type="textarea"></ats-input>
    </el-form-item>
    <el-form-item label="ATS私钥" prop="atsPrivateKey">
      <ats-input v-model="currentValue.atsPrivateKey"
                 :mode="mode"
                 :rows="3"
                 type="textarea"></ats-input>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      value: Object,
      mode: String
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value),
        rules: {
          partyOrgId: [
            { required: true, message: '请输入机构ID', trigger: 'blur'}
          ],
          remark: [
            { required: true, message: '请输入备注（机构名）', trigger: 'blur'}
          ],
          publicKey: [
            { required: true, message: '请输入机构公钥', trigger: 'blur' }
          ],
          privateKey: [
            { required: true, message: '请输入机构私钥', trigger: 'blur' }
          ],
          atsPublicKey: [
            { required: true, message: '请输入ATS公钥', trigger: 'blur' }
          ],
          atsPrivateKey: [
            { required: true, message: '请输入ATS私钥', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      value(val, oldVal) {
        this.currentValue = this.$deepcopy(val)
      }
    },

    methods: {
      validate(callback) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit('input', this.$deepcopy(this.currentValue))
          }
          typeof callback === 'function' && callback(valid)
        })
      }
    }
  }
</script>
