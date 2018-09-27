<!-- 新增企业关系 -->
<template>
  <el-form ref="form"
           :model="currentValue"
           :rules="mode === 'VIEW' ? {} : rules"
           label-width="130px">
    <el-row>
      <el-col :span="11">
        <el-form-item label="服务方式" prop="serviceType">
          <ats-select v-model="currentValue.serviceType"
                      :kind="this.$enum.SERVICE_TYPE"
                      :group="this.$enum.SERVICE_TYPE"
                      :mode="mode"></ats-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="11">
        <el-form-item :label="orgLabel" prop="fromParty">
          <ats-select v-model="currentValue.fromParty"
                      :mode="mode"
                      :org="orgType"
                      :org-status="1"></ats-select>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-form-item :label="orgAtsLabel">
          <ats-input v-model="currentValue.toPartyName" disabled></ats-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div v-if="modelShow">
      <el-row>
        <el-col :span="18">
          <el-form-item label="放款模式" prop="loanModels">
            <ats-checkbox v-model="currentValue.loanModels"
                          :kind="this.$enum.LOAN_MODEL"
                          :group="this.$enum.LOAN_MODEL"
                          :disabled-options="[$enum.LOAN_MODEL_CG, $enum.LOAN_MODEL_HG, $enum.LOAN_MODEL_CM]"
                          :mode="mode">
            </ats-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="还款模式" prop="repayModels">
            <ats-checkbox v-model="currentValue.repayModels"
                          :kind="this.$enum.REPAY_MODEL"
                          :group="this.$enum.REPAY_MODEL"
                          :mode="mode">
            </ats-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-row v-if="mode !== 'VIEW'">
      <el-col :span="24">
        <el-form-item label="相关协议" prop="agrees">
          <ats-upload v-model="agreeFiles"
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
          loanModels:[],
          repayModels:[],
          serviceType: '',
          fromParty: '',
          toPartyName: 'ATS机构',
          toParty: '100000000000000000',
          agrees: []
        }, this.value),
        rules: {
          serviceType: [
            { required: true, message: '请选择服务方式!', trigger: 'change' }
          ],
          fromParty: [
            { required: true, message: '请选择渠道机构!', trigger: 'change' }
          ],
          kind: [
            { required: true, message: '请选择风险承担模式!', trigger: 'change' }
          ],
          agrees: [
            { type: 'array', required: true, message: '请上传图片!', trigger: 'submit' }
          ],
          loanModels: [
            { required: true, min: 1, message: '至少选择一种放款模式', trigger: 'change', type: 'array'}
          ],
          repayModels: [
            { required: true, min: 1, message: '至少选择一种还款模式', trigger: 'change', type: 'array'}
          ]
        }

      }
    },
    computed: {
      orgLabel() {
        return this.currentValue.serviceType === this.$enum.SERVICE_TYPE_FUND ? '资金端机构' : '资产渠道机构';
      },
      orgAtsLabel() {
        return this.currentValue.serviceType === this.$enum.SERVICE_TYPE_FUND ? '资产渠道机构' : '资金端机构';
      },
      orgType() {
        const currentType = this.currentValue.serviceType;
        if (currentType === this.$enum.SERVICE_TYPE_ASSET) {
          return this.$enum.BUSINESS_ASSET
        } else if (currentType === this.$enum.SERVICE_TYPE_FUND) {
          return this.$enum.BUSINESS_FUND
        }
      },
      modelShow(){
        const currentType = this.currentValue.serviceType;
        if (currentType === this.$enum.SERVICE_TYPE_FUND){
          return false;
        }else {
          return true;
        }
      },
      agreeFiles: {
        get() {
          if (this.currentValue.agrees) {
            return this.currentValue.agrees.map((_, i) => ({
              name: '',
              url: _.uri,
              id: i
            }))
          }
          return [];
        },
        set(val) {
          if (val) {
            this.currentValue.agrees = val.map(_ => ({
              uri: _.url
            }))
          } else {
            this.currentValue.agrees = []
          }
        }
      }
    },
    watch: {
      value(val, oldVal) {
        this.setCurrentValue(this.$deepcopy(val))
      },
      'currentValue.serviceType'(val, oldVal) {
        if (oldVal) {
          this.$set(this.currentValue, 'fromParty', '');
        }
      }
    },
    methods: {
      clearValidate() {
        this.$refs['form'].clearValidate();
      },
      setCurrentValue(val) {
        this.currentValue.serviceType = val.serviceType;
        this.currentValue.fromParty = val.fromParty;
        this.currentValue.loanModels = val.loanModels || [];
        this.currentValue.repayModels = val.repayModels || [];
        this.currentValue.agrees = val.agrees || [];
        this.currentValue = Object.assign(this.currentValue, val);
      },
      handleConfirm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let val = this.$objFilter(this.$deepcopy(this.currentValue), _ => typeof _ !== 'object');
            let repayModels = this.currentValue.repayModels;
            let loanModels = this.currentValue.loanModels;
            this.$emit('save', {
              partyRelDTO: Object.assign({
                repayModels,
                loanModels,
                kind: this.currentValue.serviceType
              },val),
              agrees: this.currentValue.agrees.map(_ => ({
                uri: _.uri,
                kind: val.serviceType === this.$enum.SERVICE_TYPE_ASSET ? this.$enum.CONTRACT_TYPE_ASSET : this.$enum.CONTRACT_TYPE_FUND
              })).map(_ => ({
                uri: _.uri,
                kind: _.kind,
                name: this.$filter(_.kind, this.$enum.CONTRACT_TYPE, val.kind)
              }))
            });
          } else {
            return false;
          }
        })
      },
      handleCancel() {
        this.$emit('cancel');
      },
      handleUploadContract(file) {
        this.currentValue.agrees = this.currentValue.agrees.concat({
          uri: file.key
        })
      },
      handleRemoveContract(file) {
        this.agreeFiles = this.agreeFiles.filter(_ => _.id !== file.id)
      }
    }
  }
</script>
