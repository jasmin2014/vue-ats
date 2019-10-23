<!-- 新增企业关系 -->
<template>
  <el-form ref="form"
           :model="currentValue"
           :rules="mode === 'VIEW' ? {} : rules"
           label-width="130px">
    <el-row>
      <el-col :span="22">
        <el-form-item label="资产机构" prop="assetOrgId">
          <ats-select v-model="currentValue.assetOrgId"
                      :value-text.sync="currentValue.assetOrgName"
                      :org="this.$enum.BUSINESS_ASSET"
                      placeholder="全部"
                      :mode="mode"
                      clearable></ats-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="22">
        <el-form-item label="资金机构" prop="fundOrgId">
          <ats-select v-model="currentValue.fundOrgId"
                      :value-text.sync="currentValue.fundOrgName"
                      :org="this.$enum.BUSINESS_FUND"
                      placeholder="全部"
                      :mode="mode"
                      clearable></ats-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="22">
        <el-form-item label="协议到期日" prop="endDate">
          <ats-date-picker v-model="currentValue.endDate"
                           value-format="yyyy-MM-dd"
                           :mode="mode"
                           clearable></ats-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="mode !== 'VIEW'">
      <el-col :span="22">
        <el-form-item label="相关协议" prop="materials">
          <ats-upload v-model="agreeFiles"
                      multiple
                      @success="handleUploadContract"
                      @remove="handleRemoveContract"></ats-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-button v-if="mode !== 'VIEW'" type="primary" @click="handleConfirm">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </el-row>
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
        currentValue: Object.assign({
          fundOrgId: '',
          fundOrgName: '',
          assetOrgId: '',
          assetOrgName: '',
          materials: []
        }, this.value),
        rules: {
          fundOrgId: [
            { required: true, message: '请选择资金机构', trigger: 'change' }
          ],
          assetOrgId: [
            { required: true, message: '请选择资产机构', trigger: 'change' }
          ],
          materials: [
            { required: true, min: 1, message: '请上传相关协议', trigger: 'submit', type: 'array' }
          ]
        }

      }
    },
    computed: {
      agreeFiles: {
        get() {
          if (this.currentValue.materials) {
            return this.currentValue.materials.map((_, i) => ({
              name: _.fileName,
              url: _.fileUri,
              type: _.fileType,
              id: i
            }))
          }
          return [];
        },
        set(val) {
          if (val) {
            this.currentValue.materials = val.map(_ => ({
              fileUri: _.url,
              fileName: _.name,
              fileType: _.type,
              kind: this.$enum.PROOF_MATERIAL_O_CONTRACT
            }))
          } else {
            this.currentValue.materials = []
          }
        }
      }
    },
    watch: {
      value(val, oldVal) {
        this.setCurrentValue(this.$deepcopy(val))
      }
    },
    methods: {
      clearValidate() {
        this.$refs['form'].clearValidate();
      },
      setCurrentValue(val) {
        this.currentValue.assetOrgId = val.assetOrgId;
        this.currentValue.assetOrgName = val.assetOrgName;
        this.currentValue.fundOrgId = val.fundOrgId;
        this.currentValue.fundOrgName = val.fundOrgName;
        this.currentValue.endDate = val.endDate;
        this.currentValue.materials = val.materials || [];
        this.currentValue = Object.assign(this.currentValue, val);
      },
      handleConfirm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const val = this.$deepcopy(this.currentValue);
            this.$emit('save', val);
          } else {
            return false;
          }
        })
      },
      handleCancel() {
        this.$emit('cancel');
      },
      handleUploadContract(file) {
        this.agreeFiles = this.agreeFiles.concat({
          url: file.key,
          name: file.name,
          type: file.type
        });
        this.$refs['form'].validateField('materials');
      },
      handleRemoveContract(file) {
        this.agreeFiles = this.agreeFiles.filter(_ => _.id !== file.id);
        this.$refs['form'].validateField('materials');
      }
    }
  }
</script>
