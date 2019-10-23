<template>
  <div class="card">
    <el-form ref="form"
             :model="currentValue"
             :rules="rules"
             label-width="200px">
      <el-form-item label="银行卡主体" prop="bankType">
        <ats-select v-model="currentValue.bankType"
                    :kind="$enum.BANK_TYPE"
                    :group="$enum.BANK_TYPE"
                    :mode="mode"></ats-select>
      </el-form-item>
    </el-form>

    <div v-if="currentValue.bankType">
      <el-form ref="cardForm"
               v-if="currentValue.bankType === $enum.BANK_TYPE_PERSONAL_CARD"
               :model="currentValue"
               :rules="personRules"
               label-width="200px">
        <el-form-item label="姓名" prop="name">
          <ats-input v-model.trim="currentValue.name"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="ident">
          <ats-input v-model.trim="currentValue.ident"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCard">
          <ats-input v-model.trim="currentValue.bankCard"
                     :mode="mode === 'EDIT' ? 'VIEW' : mode"
                     @blur="handleBankCardBlur"></ats-input>
        </el-form-item>
        <el-form-item label="所属银行" prop="ownerBank">
          <ats-input v-model.trim="currentValue.ownerBank"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="开户行" prop="openBank">
          <ats-input v-model.trim="currentValue.openBank"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="预留手机号码" prop="mobilePhone">
          <ats-input v-model.trim="currentValue.mobilePhone"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-form>

      <el-form ref="cardForm"
               v-else-if="currentValue.bankType === $enum.BANK_TYPE_PUBLIC_CARD"
               :model="currentValue"
               :rules="publicRules"
               label-width="200px">
        <el-form-item label="企业名称" prop="name">
          <ats-input v-model.trim="currentValue.name"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="ident">
          <ats-input v-model.trim="currentValue.ident"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCard">
          <ats-input v-model.trim="currentValue.bankCard"
                     :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-input>
        </el-form-item>
        <el-form-item label="所属银行" prop="ownerBank">
          <ats-input v-model.trim="currentValue.ownerBank"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="开户行" prop="openBank">
          <ats-input v-model.trim="currentValue.openBank"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="所在省" prop="province">
          <ats-select v-model="currentValue.province"
                      region="86"
                      :mode="mode"></ats-select>
        </el-form-item>
        <el-form-item label="所在市" prop="city">
          <ats-select v-model="currentValue.city"
                      :region="currentValue.province"
                      :mode="mode"></ats-select>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="linkmanName">
          <ats-input v-model.trim="currentValue.linkmanName"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="联系人手机号码" prop="mobilePhone">
          <ats-input v-model.trim="currentValue.mobilePhone"
                     :mode="mode"></ats-input>
        </el-form-item>
      </el-form>

      <el-row type="flex" justify="center">
        <el-button type="primary"
                   @click="handleSave">保存</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {getBankNameByCard} from '../../api/enum';

  export default {
    props: {
      value: {
        type: Object,
        default() {
          return {
            bankType: this.$enum.BANK_TYPE_PERSONAL_CARD
          }
        }
      },
      mode: String
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value),
        rules: {
          bankType: [
            { required: true, message: '请选择银行卡主体', trigger: 'change' }
          ]
        },
        personRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          ident: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { pattern: this.$valid.ident, message: '请输入正确的身份证号', trigger: 'blur' }
          ],
          bankCard: [
            { required: true, message: '请输入银行卡号', trigger: 'blur' },
            { pattern: this.$valid.card, message: '请输入正确的银行卡号', trigger: 'blur' }
          ],
          ownerBank: [
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          openBank: [
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          mobilePhone: [
            { required: true, message: '请输入预留手机号', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ]
        },
        publicRules: {
          name: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          ident: [
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
            { pattern: this.$valid.usciCode, message: '请输入正确的统一社会信用代码', trigger: 'blur' }
          ],
          bankCard: [
            { required: true, message: '请输入银行卡号', trigger: 'blur' },
            { pattern: this.$valid.card, message: '请输入正确的银行卡号', trigger: 'blur' }
          ],
          ownerBank: [
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          openBank: [
            { required: true, message: '请输入开户行', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          province: [
            { required: true, message: '请选择所在省', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择所在市', trigger: 'change' }
          ],
          linkmanName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' }
          ],
          mobilePhone: [
            { required: true, message: '请输入预留手机号', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      'currentValue.bankType'(val, oldVal) {
        if (val !== oldVal) {
          this.$nextTick(() => {
            this.$refs.cardForm && this.$refs.cardForm.clearValidate();
          })
        }
      }
    },

    methods: {
      handleSave() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$refs.cardForm.validate(cardValid => {
              if (cardValid) {
                const value = this.$deepcopy(this.currentValue);
                if (value.bankType === this.$enum.BANK_TYPE_PERSONAL_CARD) {
                  delete value.province;
                  delete value.city;
                  delete value.linkmanName;
                  value.identType = this.$enum.IDENT_TYPE_IDENTITY;
                } else {
                  delete value.identType;
                }
                this.$emit('save', value)
              }
            });
          }
        });
      },
      handleBankCardBlur() {
        const card = this.currentValue.bankCard;
        this.$set(this.currentValue, 'ownerBank', '');

        if (this.$valid.card.test(card)) {
          getBankNameByCard(card).then(({ data }) => {
            if (data.code === 200 && data.body) {
              this.$set(this.currentValue, 'ownerBank', data.body.bankName);
            }
            this.$refs.cardForm.validateField('ownerBank');
          }).catch(() => {
            this.$refs.cardForm.validateField('ownerBank');
          })
        }
      }
    }
  }
</script>
