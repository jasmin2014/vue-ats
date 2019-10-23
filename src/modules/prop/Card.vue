<template>
  <el-form class="card"
           ref="form"
           :model="currentValue"
           label-width="150px"
           :rules="mode !== 'VIEW' ? rules : {}">
    <h4>
      <span>放款银行卡</span>
    </h4>
    <el-row>
      <el-col :span="8">
        <el-form-item label="银行卡号" prop="loanCard">
          <ats-input v-model.trim="currentValue.loanCard"
                     @blur="getBankName"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="所属银行" prop="cardBank">
          <ats-input v-model.trim="currentValue.cardBank"
                     :disabled="type === $enum.SUBJECT_PROP_PERSON"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="type === $enum.SUBJECT_PROP_PERSON">
        <el-form-item label="银行预留手机号" prop="loanMobile">
          <ats-input v-model.trim="currentValue.loanMobile"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="type === $enum.SUBJECT_PROP_ORGANIZE">
        <el-form-item label="开户行" prop="openBank">
          <ats-input v-model.trim="currentValue.openBank"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="type === $enum.SUBJECT_PROP_ORGANIZE">
      <el-col :span="8">
        <el-form-item label="所在省" prop="bankProvince">
          <ats-select v-model="currentValue.bankProvince"
                      region="86"
                      :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="所在市" prop="bankCity">
          <ats-select v-model.trim="currentValue.bankCity"
                      :region="currentValue.bankProvince"
                      :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import {getBankNameByCard} from '../../api/enum';

  export default {
    props: {
      value: Object,
      type: String,
      mode: String
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value),
        rules: {
          loanCard: [
            { pattern: this.$valid.card, message: '8-28位数字', trigger: 'blur' }
          ],
          loanMobile: [
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          cardBank: [
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          openBank: [
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.currentValue = this.$deepcopy(val)
        }
      }
    },

    methods: {
      save(callback) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('input', this.$deepcopy(this.currentValue))
          }
          typeof callback === 'function' && callback(valid)
        });
      },
      clearValidate() {
        this.$refs.form.clearValidate();
      },
      getBankName() {
        const card = this.currentValue.loanCard;
        this.$set(this.currentValue, 'cardBank', '');
        if (this.$valid.card.test(card)) {
          getBankNameByCard(card).then(({ data }) => {
            if (data.code === 200 && data.body) {
              this.$set(this.currentValue, 'cardBank', data.body.bankName);
            }
            this.$refs.form.validateField('cardBank');
          }).catch(() => {
            this.$refs.form.validateField('cardBank');
          })
        }
      }
    }
  }
</script>
