<!--续借-->
<template>
  <el-form ref="form"
           :model="currentValue"
           :rules="mode === 'VIEW' ? {} : rules"
           label-width="130px">
    <el-row>
      <el-col :span="22">
        <el-form-item label="原协议编号" prop="oldContract">
          <ats-input v-model="currentValue.oldContract" disabled></ats-input>
        </el-form-item>
        <el-form-item label="续借协议编号" prop="contract">
          <ats-input v-model.trim="currentValue.contract"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="续借金额" prop="amount">
          <ats-input v-model="currentValue.amount" :mode="mode"
                     type="number" :min="0" unit="元"></ats-input>
        </el-form-item>
        <el-form-item label="续借期数" prop="loanTerms">
          <ats-input v-model="currentValue.loanTerms" :mode="mode"
                     type="number" :min="1" :max="72" :step="1"></ats-input>
        </el-form-item>
        <el-form-item label="渠道借款利率" prop="repayRate">
          <ats-input v-model="repayRate" :mode="mode"
                     type="number" unit="%"
                     :min="0" :max="100" :step="0.01"></ats-input>
        </el-form-item>
        <el-form-item label="利率类型" prop="repayRateType">
          <ats-select v-model="currentValue.repayRateType" :mode="mode"
                      :kind="this.$enum.LOAN_RATES"
                      :group="this.$enum.LOAN_RATES"></ats-select>
        </el-form-item>
        <el-form-item label="放款模式" prop="loanModel">
          <ats-select v-model="currentValue.loanModel"
                      :options="loanModelList"
                      :mode="mode"></ats-select>
        </el-form-item>
        <el-form-item v-if="isDSModel" label="代收金额" prop="collectionAmount">
          <ats-input v-model="currentValue.collectionAmount"
                     type="number" unit="元"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item v-if="isDSModel" label="代收银行卡" prop="collectionBankCard">
          <ats-select v-if="!isUpload"
                      v-model="currentValue.collectionBankCard"
                      :options="collectionCardList"
                      :mode="mode"
                      placeholder="无"
                      clearable
                      @input="mode !== 'VIEW' && validateField('collectionBankCard')"></ats-select>
          <ats-input v-else
                     v-model="currentValue.collectionBankCard"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="资料原图" prop="attachments">
          <ats-upload-pic v-model="attachments"
                          :mode="mode"></ats-upload-pic>
        </el-form-item>
        <el-form-item v-if="!isUpload" label="资料文件" prop="pdfs">
          <ats-upload-doc v-model="pdfs"
                          :mode="mode"
                          :limit="5"
                          accept=".pdf">
            <div slot="tip" class="el-upload__tip">请提供pdf格式文件</div>
          </ats-upload-doc>
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
  import { mapState } from 'vuex'
  import { getModelEnums } from '../../assets/api/asset';

  export default {
    props: {
      value: Object,
      mode: String,
      isUpload: Boolean
    },
    data() {
      return {
        loanModelList: [],
        currentValue: Object.assign({
          oldContract: '',
          contract: '',
          amount: '',
          loanTerms: '',
          repayRate: '',
          repayRateType: '',
          loanModel: '',
          collectionAmount: null,
          collectionBankCard: '',
          attachments: []
        }, this.value),
        rules: {
          contract: [
            { required: true, message: '请输入续借协议编号', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '请输入续借金额', trigger: 'blur', type: 'number' },
            { min: 0.01, message: '续借金额大于0', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 2)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ],
          loanTerms: [
            { required: true, message: '请输入续借期数', trigger: 'blur', type: 'number' },
            { min: 1, max: 72, message: '期数范围为1-72', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 0)) {
                  callback()
                } else {
                  callback('请输入整数')
                }
              }
            }
          ],
          repayRate: [
            { required: true, message: '请输入渠道借款利率', trigger: 'blur', type: 'number' },
            { min: 0, max: 1, message: '利率范围为0-100%', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 4)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ],
          repayRateType: [
            { required: true, message: '请选择利率类型', trigger: 'change' }
          ],
          loanModel: [
            { required: true, message: '请选择放款模式', trigger: 'change' }
          ],
          collectionAmount: [
            { required: true, message: '请填写代收金额', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.currentValue.amount && value > this.currentValue.amount) {
                  callback('代收金额不能大于借款金额')
                } else if (this.currentValue.amount && value <= 0) {
                  callback('代收金额需大于0')
                } else if (!this.$valid.floatValidator(value, 2)) {
                  callback('保留2位小数')
                } else {
                  callback()
                }
              }
            }
          ],
          collectionBankCard: [
            { required: true, message: this.isUpload ? '请输入代收银行卡' : '请选择代收银行卡', trigger: this.isUpload ? 'blur' : 'change' },
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (this.isUpload) {
                  if (this.$valid.card.test(value)) {
                    callback()
                  } else {
                    callback('请输入正确的银行卡号')
                  }
                } else {
                  callback();
                }
              }
            }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        collectionCardList: state => state.application.collectionCardList
      }),
      repayRate: {
        get() {
          if (typeof this.currentValue.repayRate === 'number') {
            return this.$floatMultiply(this.currentValue.repayRate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.repayRate = null;
          } else {
            this.currentValue.repayRate = this.$floatDivide(val, 100);
          }
        }
      },
      attachments: {
        get() {
          if (this.currentValue.attachments) {
            return this.currentValue.attachments.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_P_LOAN_APP).map((_, i) => ({
              id: _.id,
              name: _.name,
              url: _.fileUrl,
              type: _.fileType
            }))
          }
          return [];
        },
        set(val) {
          if (val) {
            this.currentValue.attachments = this.currentValue.attachments.filter(_ => _.kind !== this.$enum.PROOF_MATERIAL_P_LOAN_APP).concat(val.map(_ => ({
              id: _.id,
              name: _.name,
              fileType: _.type,
              fileUrl: _.url,
              kind: this.$enum.PROOF_MATERIAL_P_LOAN_APP
            })))
          }
        }
      },
      pdfs: {
        get() {
          if (this.currentValue.attachments) {
            return this.currentValue.attachments.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF).map((_, i) => ({
              id: _.id,
              name: _.name,
              url: _.fileUrl,
              type: _.fileType
            }))
          }
          return [];
        },
        set(val) {
          if (val) {
            this.currentValue.attachments = this.currentValue.attachments.filter(_ => _.kind !== this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF).concat(val.map(_ => ({
              id: _.id,
              name: _.name,
              fileType: _.type,
              fileUrl: _.url,
              kind: this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF
            })))
          }
        }
      },
      isDSModel: {
        get() {
          return [this.$enum.LOAN_MODEL_DS].includes(this.currentValue.loanModel)
        }
      },
      loanModelFullList() {
        return this.$store.state.enums[`${this.$enum.LOAN_MODEL}.${this.$enum.LOAN_MODEL}`] || []
      }
    },
    watch: {
      value(val) {
        this.currentValue = this.$deepcopy(val);
      }
    },

    created() {
      this.initPatternEnums();
    },

    methods: {
      clearValidate() {
        this.$refs['form'].clearValidate();
      },

      handleConfirm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const val = this.$deepcopy(this.currentValue);
            val.yearRateMin = val.repayRate;
            val.yearRateMax = val.repayRate;
            this.$emit('save', val);
          } else {
            return false;
          }
        })
      },
      handleCancel() {
        this.$emit('cancel');
      },

      initPatternEnums() {
        getModelEnums().then(({data}) => {
          if (data.code === 200) {
            this.loanModelList = this.loanModelFullList.filter(_ => data.body.loanPatterns.includes(_.value));
            if (!data.body.loanPatterns.includes(this.currentValue.loanModel)) {
              this.currentValue.loanModel = '';
            }
          }
        })
      }
    }
  }
</script>

