<template>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="个人账户" name="private">
      <el-form ref="privateForm"
               :model="privateAccount"
               :rules="privateRules"
               label-width="250px" style="width: 700px;">
        <el-form-item label="真实姓名" prop="ownerName">
          <el-input v-model="privateAccount.ownerName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="accId">
          <el-input v-model="privateAccount.accId"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCard">
          <el-input v-model="privateAccount.bankCard"
                    @blur="handleBankCardBlur('private')"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
          <el-input v-model="privateAccount.bankName" disabled></el-input>
        </el-form-item>
        <el-form-item label="银行预留手机号" prop="accMobile">
          <el-input v-model="privateAccount.accMobile"></el-input>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleAuthPrivate">实名认证</el-button>
        </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="对公账户" name="public">
      <el-form ref="publicForm"
               :model="publicAccount"
               :rules="publicRules"
               label-width="250px" style="width: 700px;">
        <el-form-item label="银行开户名" prop="ownerName">
          <el-input v-model="publicAccount.ownerName"></el-input>
        </el-form-item>
        <el-form-item label="开户银行所在地" prop="provinceCode">
          <el-col :span="12">
            <ats-select v-model="publicAccount.provinceCode" region="86"></ats-select>
          </el-col>
          <el-col :span="12">
            <ats-select v-model="publicAccount.cityCode" :region="publicAccount.provinceCode"></ats-select>
          </el-col>
        </el-form-item>
        <el-form-item label="开户银行支行名称" prop="branchName">
          <el-input v-model="publicAccount.branchName"></el-input>
        </el-form-item>
        <el-form-item label="对公银行账号" prop="bankCard">
          <el-input v-model="publicAccount.bankCard"
                    @blur="handleBankCardBlur('public')"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
          <el-input v-model="publicAccount.bankName"></el-input>
        </el-form-item>
        <el-form-item label="开户许可证" prop="identityNo">
          <el-input v-model="publicAccount.identityNo"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机号" prop="accMobile">
          <el-input v-model="publicAccount.accMobile"></el-input>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleAuthPublic">实名认证</el-button>
        </el-row>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'private',
        privateAccount: {},
        publicAccount: {},
        privateRules: {
          ownerName: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          accId: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { pattern: this.$valid.ident, message: '请输入正确的身份证号', trigger: 'blur' }
          ],
          bankCard: [
            { required: true, message: '请输入银行卡号', trigger: 'blur' },
            { pattern: this.$valid.card, message: '请输入正确的银行卡号', trigger: 'blur' }
          ],
          bankName: [
            { required: true, message: '请输入开户行银行', trigger: 'blur' }
          ],
          accMobile: [
            { required: true, message: '请输入银行预留手机号', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ]
        },
        publicRules: {
          ownerName: [
            { required: true, message: '请输入银行开户名', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          provinceCode: [
            { required: true, message: '请选择省份', trigger: 'change' },
            {
              validator: (rule, value, callback) => {
                if (this.publicAccount.cityCode) {
                  callback();
                } else {
                  callback('请选择城市')
                }
              }
            }
          ],
          branchName: [
            { required: true, message: '请输入开户银行支行名称', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          bankCard: [
            { required: true, message: '请输入对公银行账号', trigger: 'blur' },
            { pattern: this.$valid.card, message: '请输入正确的银行卡号', trigger: 'blur' }
          ],
          bankName: [
            { required: true, message: '请输入开户行银行', trigger: 'blur' }
          ],
          identityNo: [
            { required: true, message: '请输入开户许可证', trigger: 'blur' }
          ],
          accMobile: [
            { required: true, message: '请输入联系人手机号', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      updatePrivateCardBin(card) {
        this.privateAccount.bankName = card.bankName;
        this.privateAccount.bankCode = card.bankCode;
        this.privateAccount.cardType = card.cardType;
      },
      updatePublicCardBin(card) {
        this.publicAccount.bankName = card.bankName;
        this.publicAccount.bankCode = card.bankCode;
        this.publicAccount.cardType = card.cardType;
      },
      handleAuthPrivate() {
        this.$refs['privateForm'].validate((valid) => {
          if (valid) {
            this.$emit('bind', {
              accountType: 'private',
              val: this.$deepcopy(this.privateAccount)
            })
          } else {
            return false;
          }
        })
      },
      handleAuthPublic() {
        this.$refs['publicForm'].validate((valid) => {
          if (valid) {
            this.$emit('bind', {
              accountType: 'public',
              val: this.$deepcopy(this.publicAccount)
            })
          } else {
            return false;
          }
        })
      },
      handleBankCardBlur(accountType) {
        const bankCard = this[accountType + 'Account'].bankCard;
        if (bankCard) {
          this.$emit('card-info', {
            accountType,
            bankCard
          });
        }
      }
    }
  }
</script>
