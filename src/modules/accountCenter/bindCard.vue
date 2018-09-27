<template>
<div>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabChange">
    <el-tab-pane label="个人账户" name="first">
      <el-form label-width="150px"
               ref="form1"
               :model="currentValue"
               :rules="rules1">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="ownerName">
              <ats-input v-model.trim="currentValue.ownerName" :mode="'EDIT'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="accId">
              <ats-input v-model.trim="currentValue.accId" :mode="'EDIT'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="银行卡号" prop="bankCard">
              <ats-input v-model.trim="currentValue.bankCard" :mode="'EDIT'" @blur="handleGetBankName"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <ats-input v-model.trim="currentValue.bankName" :mode="mode"></ats-input>
              <!--<el-button type="text" @click="showBankLists">支持银行列表</el-button>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="预留银行手机号" :class="{'errorStyle':phoneIsError}"  prop="accMobile">
              <ats-input v-model.trim="currentValue.accMobile" :mode="'EDIT'" @focus="phoneIsError=false;"  @blur="phoneIsError=false;"></ats-input>
              <p v-if="phoneIsError">请输入正确的手机号</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleCertification('Personal')">实名认证</el-button>
        </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="对公账户" name="second">
      <el-form label-width="150px"
               ref="form2"
               :model="currentValue"
               :rules="rules1">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="银行开户名" prop="ownerOrgName">
              <ats-input v-model.trim="currentValue.ownerOrgName" :mode="'EDIT'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <label class="customer-label"><span style="color: red;">*</span> 开户银行所在地</label>
            <el-form-item prop="provinceCode">
              <ats-select v-model="currentValue.provinceCode"  placeholder="选择省份" :mode="'EDIT'" :region="'86'"></ats-select>
            </el-form-item>
            <el-form-item prop="cityCode">
              <ats-select v-model="currentValue.cityCode" :mode="'EDIT'" placeholder="选择城市" :region="currentValue.provinceCode"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="开户银行支行名称" prop="branchName">
              <ats-input v-model.trim="currentValue.branchName" :mode="'EDIT'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="对公银行账号" prop="bankCard">
              <ats-input v-model.trim="currentValue.bankCard" :mode="'EDIT'" @blur="handleGetBankName"></ats-input>
              <!--<el-button type="text" @click="showBankLists">支持银行列表</el-button>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <ats-input v-model.trim="currentValue.bankName" :mode="mode" ref="bankName"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="fullwidth">
          <el-col :span="12">
            <el-form-item label="开户许可证编号" prop="identityNo">
              <ats-input v-model.trim="currentValue.identityNo" :mode="'EDIT'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-form-item label="联系人手机号" prop="accMobile" :class="{'errorStyle':phoneIsError}">
              <ats-input v-model.trim="currentValue.accMobile" :mode="'EDIT'" @focus="phoneIsError=false;"  @blur="phoneIsError=false;"></ats-input>
              <p v-if="phoneIsError">请输入正确的手机号</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleCertification('Org')">提交认证</el-button>
        </el-row>
      </el-form>
    </el-tab-pane>
  </el-tabs>
  <!--<el-dialog title="银行卡列表" :visible.sync="dialogTableVisible">
    <el-table :data="gridData">
      <el-table-column property="bankName" label="银行" width="150"></el-table-column>
      <el-table-column property="cardType" label="卡类型" width="200"></el-table-column>
      <el-table-column property="perAmount" label="单笔限额"></el-table-column>
      <el-table-column property="oneDayAmount" label="单日限额"></el-table-column>
      <el-table-column property="oneMonthAmount" label="单月限额"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="dialogTableVisible = false">我知道了</el-button>
    </div>
  </el-dialog>-->
</div>
</template>

<script>
  export default {
    props: {
      AccountValue: Object,
      mode: String
    },
    data() {
      return {
        activeName: 'first',
        dialogTableVisible: false,
        gridData: [],
        currentValue: {
          ownerName: '',
          ownerOrgName: '',
          accId: '',
          bankCard: '',
          bankName: '',
          branchName: '',
          identityNo: '',
          accMobile: '',
          provinceCode: '',
          cityCode: ''
        },
        phoneIsError: false,
        rules1: {
          ownerName: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          ownerOrgName: [
            { required: true, message: '请输入银行开户名称', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          accId: [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
            { pattern: this.$valid.ident, message: '请输入正确的身份证号', trigger: 'blur' }
          ],
          bankCard: [
            { required: true, message: '请输入银行卡号', trigger: 'blur' },
            { pattern: this.$valid.card, message: '请输入正确的银行卡号', trigger: 'blur' }
          ],
          bankName: [
            { required: true, message: '开户行名称不能为空', trigger: 'blur' }
          ],
          accMobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机证号', trigger: 'blur' }
          ],
          branchName: [
            { required: true, min: 0, max: 50, message: '请输入开户银行支行名称,50字以内', trigger: 'blur' }
          ],
          identityNo: [
            { required: true, message: '请输入开户许可证编号', trigger: 'blur' }
          ],
          provinceCode: [
            { required: true, message: '请选择省份', trigger: 'change' }
          ],
          cityCode: [
            { required: true, message: '请选择城市', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.gridData = this.AccountValue.gridData ? this.$deepcopy(this.AccountValue.gridData) : [];
    },
    watch: {
      'AccountValue.currentValue.bankName'(val){
        this.setCurrentValue(this.$deepcopy(val), 'bankName');
      }
    },
    methods: {
      handleTabChange(){
        this.mode = 'VIEW';
        this.currentValue.ownerName = '';
        this.currentValue.ownerOrgName = '';
        this.currentValue.accId = '';
        this.currentValue.bankCard = '';
        this.currentValue.bankName = '';
        this.currentValue.accMobile = '';
        this.currentValue.provinceCode = '';
        this.currentValue.cityCode = '';
        this.currentValue.branchName = '';
        this.currentValue.identityNo = '';
        if (this.activeName === 'first') {
          this.$refs['form1'].resetFields();
        } else {
          this.$refs['form2'].resetFields();
        }
      },
      setCurrentValue(val, key) {
        if (this.currentValue.hasOwnProperty(key)) {
          if (typeof val === 'object' && val instanceof Array) {
            this.currentValue[key] = val;
          } else if (typeof val === 'object') {
            for (const k in val) {
              if (this.currentValue[key].hasOwnProperty(k)) {
                this.currentValue[key][k] = val[k];
              }
            }
          } else {
            this.currentValue[key] = val;
          }
        }
      },
      handleResetFields() {
        let _index = 0;
        if (this.activeName === 'first') {
          this.$refs['form1'].fields.forEach((item, index) => {
            if(item.prop === 'bankName') {
              _index = index;
            }
          });
          this.$refs['form1'].fields[_index].onFieldBlur();
        } else {
          this.$refs['form2'].fields.forEach((item, index) => {
            if(item.prop === 'bankName') {
              _index = index;
            }
          });
          this.$refs['form2'].fields[_index].onFieldBlur();
        }
      },
      handleGetBankName(val) {
        val = this.currentValue.bankCard;
        this.$emit('getBankName', val);
      },
      validatePrivateInfo(callback){
        this.$refs['form1'].validate((valid) => {
          if (valid) {
            callback && callback();
          } else {
            return false;
          }
        });
      },
      validatePubInfo(callback) {
        this.$refs['form2'].validate((valid) => {
          if (valid) {
            callback && callback();
          } else {
            return false;
          }
        });
      },
      handleCertification(AccountType) {
        const val = this.$deepcopy(this.currentValue);
        val.AccountType = AccountType;
        this.$emit('auth', val);
      }
    }
  }
</script>
<style>
 .errorStyle input{
    border: 1px solid #f56c6c;
  }
 .errorStyle p{
   position: absolute;
   bottom: -43px;
   font-size: 12px;
   color: #f56c6c;
 }
  .errorMsg {
    position: absolute;
    top: 15px;
    left: 0;
    color: red;
  }
  .customer-label {
    font-size: 14px;
    float: left;
    width: 150px;
    line-height: 40px;
    text-align: right;
    padding-right: 15px;
  }
  .customer-row .el-col-9 .el-form-item .el-form-item__content {
    margin-left: 30px;
  }
</style>
