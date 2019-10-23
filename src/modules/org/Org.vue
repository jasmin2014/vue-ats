<template>
  <div class="org">
    <el-form class="form-label flex"
             ref="form1"
             :model="currentValue"
             :rules="mode === 'CREATE' ? rules1 : {}">
      <el-row>
        <el-col :span="8">
          <el-form-item label="机构名称" prop="orgName" :error="error['partyOrgBaseDTO.orgName']">
            <ats-input v-model.trim="currentValue.orgName"
                       :mode="mode === 'EDIT' ? 'VIEW' : mode"
                       @blur="handleOrgNameBlur"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item label="统一社会信用代码" prop="usciCode" :error="error['partyOrgBaseDTO.usciCode']">
            <ats-input v-model.trim="currentValue.usciCode"
                       :mode="mode === 'EDIT' ? 'VIEW' : mode" placeholder="18位数字或字母"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="3" v-if="mode !== 'VIEW'">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-col>
        <el-col :span="4" :offset="3" v-else-if="mode === 'VIEW' && business !== $enum.BUSINESS_CENTER">
          <el-button v-action="'OrgEdit'" type="primary" @click="handleEdit">编辑</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-form label-width="150px"
             ref="form2"
             :model="currentValue"
             :rules="mode === 'VIEW' ? {} : rules2">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="基本信息" name="first">
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="机构简码" prop="orgShortName" :error="error['partyOrgBaseDTO.orgShortName']">
                <ats-input v-model.trim="currentValue.orgShortName"
                           :mode="mode === 'EDIT' ? 'VIEW' : mode"
                           placeholder="2位字母或数字"></ats-input>
              </el-form-item>
            </el-col>
            <el-col v-if="business !== $enum.BUSINESS_CENTER" :span="10">
              <el-form-item label="机构ID">
                <ats-input v-model.trim="currentValue.id"
                           mode="VIEW"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="联系电话" prop="relPhone" :error="error['partyOrgBaseDTO.relPhone']">
                <ats-input v-model.trim="currentValue.relPhone" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="邮政编码" prop="postCode" :error="error['partyOrgBaseDTO.postCode']">
                <ats-input v-model.trim="currentValue.postCode" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="人员规模">
                <ats-select v-model="currentValue.staffStat" :mode="mode"
                            :kind="this.$enum.COMPANY_SCALE" :group="this.$enum.COMPANY_SCALE"></ats-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="企业网址" prop="webSite" :error="error['partyOrgBaseDTO.webSite']">
                <ats-input v-model.trim="currentValue.webSite" :mode="mode" placeholder="以 http(s):// 开头"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="20">
              <el-form-item label="办公地址" prop="optAddress" :error="error['partyOrgBaseDTO.optAddress']">
                <ats-input v-model.trim="currentValue.optAddress" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="2">
              <el-form-item label="公司 logo" prop="logoMaterial"
                            :error="error['partyOrgBaseDTO.logoUrl'] || fileError.logoMaterial">
                <p class="logo-hint">建议宽高比 >= 3:1，透明或白色背景</p>
                <ats-upload v-model="logo"
                            :mode="mode" :limit="1"
                            placeholder="2M以内"
                            @remove="handleRemoveLogo"
                            @success="handleUploadLogo"></ats-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="business === this.$enum.BUSINESS_CENTER">
            <el-col :span="20" :offset="2">
              <el-form-item label="业务端" prop="orgType" :error="error['partyOrgBaseDTO.orgType']">
                <ats-radio v-model="currentValue.orgType"
                           :mode="mode === 'EDIT' ?  'VIEW' : mode"
                           :options="businessList"
                           border></ats-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="currentValue.orgType === 1 && business === this.$enum.BUSINESS_CENTER">
            <el-row>
              <el-col :span="20" :offset="2">
                <el-form-item label="资产推送" prop="partyOrgFundDTO.sendFlag">
                  <ats-radio v-model="currentValue.partyOrgFundDTO.sendFlag"
                             :mode="mode"
                             type="boolean-num"></ats-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="currentValue.partyOrgFundDTO.sendFlag === 1">
              <el-row>
                <el-col :span="20" :offset="2">
                  <el-form-item label="推送地址" prop="partyOrgFundDTO.pushUrl">
                    <ats-input v-model="currentValue.partyOrgFundDTO.pushUrl"
                               :mode="mode"></ats-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20" :offset="2">
                  <el-form-item label="撤贷地址" prop="partyOrgFundDTO.repealUrl">
                    <ats-input v-model="currentValue.partyOrgFundDTO.repealUrl"
                               :mode="mode"></ats-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20" :offset="2">
                  <el-form-item label="提前结清地址" prop="partyOrgFundDTO.earlyUrl">
                    <ats-input v-model="currentValue.partyOrgFundDTO.earlyUrl"
                               :mode="mode"></ats-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20" :offset="2">
                  <el-form-item label="查询开户" prop="partyOrgFundDTO.isQueryAccount">
                    <ats-radio v-model="currentValue.partyOrgFundDTO.isQueryAccount"
                               :mode="mode"
                               type="boolean-num"></ats-radio>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="currentValue.partyOrgFundDTO.isQueryAccount === 1">
                <el-col :span="20" :offset="2">
                  <el-form-item label="查询地址" prop="partyOrgFundDTO.queryUrl">
                    <ats-input v-model="currentValue.partyOrgFundDTO.queryUrl"
                               :mode="mode"></ats-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-if="currentValue.orgType === 2">
            <el-row>
              <el-col :span="20" :offset="2">
                <el-form-item label="放款模式" prop="partyOrgAssetDTO.loanPatterns">
                  <ats-checkbox v-model="currentValue.partyOrgAssetDTO.loanPatterns"
                                :kind="$enum.LOAN_MODEL"
                                :group="$enum.LOAN_MODEL"
                                visible=""
                                :mode="mode"></ats-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" :offset="2">
                <el-form-item label="提前结清功能" prop="partyOrgAssetDTO.earlySwitch">
                  <ats-radio v-model="currentValue.partyOrgAssetDTO.earlySwitch"
                             :mode="mode"
                             type="boolean-num"></ats-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" :offset="2">
                <el-form-item label="续借功能" prop="partyOrgAssetDTO.renewSwitch">
                  <ats-radio v-model="currentValue.partyOrgAssetDTO.renewSwitch"
                             :mode="mode"
                             type="boolean-num"></ats-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" :offset="2">
                <el-form-item label="撤贷功能" prop="partyOrgAssetDTO.repealSwitch">
                  <ats-radio v-model="currentValue.partyOrgAssetDTO.repealSwitch"
                             :mode="mode"
                             type="boolean-num"></ats-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="机构联系人" name="second">
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="姓名" prop="contactPartyName" :error="error['contactPartyName']">
                <ats-input v-model.trim="currentValue.contactPartyName" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="职务" prop="contactPartyPosition" :error="error['contactPartyPosition']">
                <ats-input v-model.trim="currentValue.contactPartyPosition" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="手机号码" prop="contactPartyMobile" :error="error['contactPartyMobile']">
                <ats-input v-model.trim="currentValue.contactPartyMobile" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="预留邮箱" prop="contactPartyEmail" :error="error['contactPartyEmail']">
                <ats-input v-model.trim="currentValue.contactPartyEmail" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="企业法人代表信息" name="third">
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="姓名" prop="legalPartyName" :error="error['additionalPersonList[1].realName']">
                <ats-input v-model.trim="currentValue.legalPartyName" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="手机号码" prop="legalPartyMobile" :error="error['additionalPersonList[1].mobile']">
                <ats-input v-model.trim="currentValue.legalPartyMobile" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="证件类型" prop="legalIdentKind" :error="error['legalIdentKind']">
                <ats-select v-model="currentValue.legalIdentKind" :mode="mode"
                            :kind="this.$enum.IDENT_TYPE" :group="this.$enum.IDENT_TYPE"></ats-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="证件号码" prop="legalPartyIdent" :error="error['legalPartyIdent']">
                <ats-input v-model.trim="currentValue.legalPartyIdent" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="家庭地址" prop="legalHomeAddress"
                            :error="error['additionalPersonList[1].homeAddress']">
                <ats-input v-model.trim="currentValue.legalHomeAddress" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="户籍地址" prop="legalDomicileAddress"
                            :error="error['additionalPersonList[1].domicileAddress']">
                <ats-input v-model.trim="currentValue.legalDomicileAddress" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="证件照片" prop="identMaterial"
                            :error="error['additionalPersonList[1].paperUrl'] || fileError.legalPaperUrl">
                <ats-upload v-model="legalFiles"
                            @success="handleUploadLegalFiles"
                            @remove="handleRemoveLegalFiles"
                            :mode="mode" :limit="2"
                            text="证件照片"></ats-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="工商信息" name="fourth">
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="组织机构代码" prop="orgNo" :error="error['partyOrgBaseDTO.orgNo']">
                <ats-input v-model.trim="currentValue.orgNo"
                           :mode="mode === 'EDIT' ? 'VIEW' : mode"
                           placeholder='8位数字或字母 + "-" + 1位数字'></ats-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="注册号" prop="regNo" :error="error['partyOrgBaseDTO.regNo']">
                <ats-input v-model.trim="currentValue.regNo"
                           :mode="mode === 'EDIT' ? 'VIEW' : mode"
                           placeholder="15位数字"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="经营状态">
                <ats-select v-model="currentValue.manageStatus" :mode="mode"
                            :kind="this.$enum.COMPANY_STATUS" :group="this.$enum.COMPANY_STATUS"></ats-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="所属行业" prop="industry" :error="error['partyOrgBaseDTO.industry']">
                <ats-select v-model="currentValue.industry" :mode="mode"
                            :kind="this.$enum.INDUSTRY" :group="this.$enum.INDUSTRY"></ats-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="公司类型" prop="orgKind" :error="error['partyOrgBaseDTO.orgKind']">
                <ats-select v-model="currentValue.orgKind" :mode="mode"
                            :kind="this.$enum.COMPANY_TYPE" :group="this.$enum.COMPANY_TYPE"></ats-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="成立日期">
                <ats-date-picker v-model="currentValue.optDate"
                                 :picker-options="datePickerOptions"
                                 :mode="mode"></ats-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="营业期限">
                <ats-date-picker v-model="businessTerm" :mode="mode"
                                 :type="'daterange'"></ats-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="发证日期">
                <ats-date-picker v-model="currentValue.issueDate"
                                 :picker-options="datePickerOptions"
                                 :mode="mode"></ats-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="登记机关" prop="issuingAuthority" :error="error['partyOrgBaseDTO.issuingAuthority']">
                <ats-input v-model.trim="currentValue.issuingAuthority" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="注册资本" prop="regCapAmount" :error="error['partyOrgBaseDTO.regCapAmount']">
                <ats-input v-model="currentValue.regCapAmount" :mode="mode"
                           type="number" unit="元" :min="0" :step="0.01"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="20">
              <el-form-item label="企业地址" prop="regAddress" :error="error['partyOrgBaseDTO.regAddress']">
                <ats-input v-model.trim="currentValue.regAddress" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="20">
              <el-form-item label="经营范围" prop="optScope" :error="error['partyOrgBaseDTO.optScope']">
                <ats-input v-model="currentValue.optScope" :mode="mode" type="textarea"
                           :rows="2"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="相关证件" name="fifth" prop="file1">
          <el-row type="flex" justify="center">
            <ats-upload v-model="file1"
                        :mode="mode"
                        text="营业执照"
                        :limit="1"
                        required
                        @success="handleUploadLicense"
                        @remove="handleRemoveLicense"></ats-upload>
            <ats-upload v-model="file2"
                        :mode="mode"
                        text="开户许可证"
                        :limit="1"
                        @success="handleUploadPermit"
                        @remove="handleRemovePermit"></ats-upload>
            <ats-upload v-model="file3"
                        :mode="mode"
                        text="纳税证明"
                        :limit="1"
                        @success="handleUploadTax"
                        @remove="handleRemoveTax"></ats-upload>
            <ats-upload v-model="filesOther"
                        :mode="mode"
                        text="其他"
                        @success="handleUploadOther"
                        @remove="handleRemoveOther"></ats-upload>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
  import {checkOrgExisted} from '../../center/api/org';

  const BUSINESS_LIST = [
    {
      value: 1,
      text: '资金端'
    },
    {
      value: 2,
      text: '资产端'
    }
  ];

  export default {
    props: {
      mode: String,
      value: Object,
      business: String,
      error: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      const validator = (rule, value, callback) => {
        if (!value || this.mode === 'EDIT') {
          callback();
          return;
        }
        const params = {};
        params[rule.field] = value;
        checkOrgExisted(params).then(({ data }) => {
          if (data.code === 200) {
            if (!data.body) {
              callback()
            } else {
              callback(rule.name + '已存在')
            }
          }
        }, () => {
          callback();
        })
      };
      return {
        activeName: 'first',
        businessList: BUSINESS_LIST,
        currentValue: {
          partyId: '',
          orgName: '',
          usciCode: '',
          // 基本信息
          orgShortName: '',
          relPhone: '',
          postCode: '',
          staffStat: '',
          webSite: '',
          optAddress: '',
          optAddressLocate: '',
          logoMaterial: null,
          orgType: '',
          // 资金选项
          partyOrgFundDTO: {
            sendFlag: 0,
            earlyUrl: '',
            pushUrl: '',
            repealUrl: '',
            isQueryAccount: 0,
            queryUrl: ''
          },
          // 资产选项
          partyOrgAssetDTO: {
            loanPatterns: [],
            // repayPatterns: [],
            confirmUri: '',
            earlySwitch: 1,
            renewSwitch: 1,
            repealSwitch: 1
          },
          // 联系人
          contactPartyName: '',
          contactPartyPosition: '',
          contactPartyMobile: '',
          contactPartyEmail: '',
          // 法人
          legalPartyName: '',
          legalPartyMobile: '',
          legalIdentKind: this.$enum.IDENT_TYPE_IDENTITY,
          legalPartyIdent: '',
          legalHomeAddress: '',
          legalDomicileAddress: '',
          identMaterial: [],
          // 工商信息
          orgNo: '',
          regNo: '',
          manageStatus: '',
          industry: '',
          orgKind: '',
          optDate: '',
          businessTermStart: '',
          businessTermEnd: '',
          issueDate: '',
          issuingAuthority: '',
          regCapAmount: '',
          regAddress: '',
          regAddressLocate: '',
          optScope: '',
          // 相关证件
          businessLicenseMaterial: null,
          accountLicenseMaterial: null,
          taxMaterial: null,
          otherMaterial: [],
        },
        rules1: {
          orgName: [
            { required: true, message: '请输入机构名称', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' },
            { validator, trigger: 'blur', name: '机构名称' }
          ],
          usciCode: [
            { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
            { pattern: this.$valid.usciCode, message: '18位数字、字母', trigger: 'blur' },
            { validator, trigger: 'blur', name: '统一社会信用代码' }
          ]
        },
        rules2: {
          // 基本信息
          orgShortName: [
            { required: true, message: '请输入机构简码', trigger: 'blur' },
            { pattern: /^(\d|\w){2}$/, message: '2位数字或字母', trigger: 'blur' },
            { validator, trigger: 'blur', name: '机构简码' }
          ],
          relPhone: [
            { pattern: this.$valid.telephone, message: '请输入正确的电话号码', trigger: 'blur' }
          ],
          postCode: [
            { pattern: this.$valid.postCode, message: '请输入正确的邮政编码', trigger: 'blur' }
          ],
          webSite: [
            { pattern: this.$valid.webSite, message: '请输入正确的网址', trigger: 'blur' },
            { min: 0, max: 100, message: '网址过长', trigger: 'blur' }
          ],
          optAddress: [
            { required: true, message: '请输入办公地址', trigger: 'blur' },
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          orgType: [
            { required: true, message: '请选择业务端', trigger: 'change', type: 'number' }
          ],
          logoMaterial: [
            { required: true, message: '请上传公司logo', trigger: 'change' }
          ],
          'partyOrgFundDTO.sendFlag': [
            { required: true, message: '请选择是否资产推送', trigger: 'change', type: 'number' }
          ],
          'partyOrgFundDTO.pushUrl': [
            { required: true, message: '请填写推送接口', trigger: 'blur' },
            { pattern: this.$valid.webSite, message: '请输入正确的接口地址', trigger: 'blur' }
          ],
          'partyOrgFundDTO.repealUrl': [
            { required: true, message: '请填写撤贷接口', trigger: 'blur' },
            { pattern: this.$valid.webSite, message: '请输入正确的接口地址', trigger: 'blur' }
          ],
          'partyOrgFundDTO.earlyUrl': [
            { required: true, message: '请填写提前结清接口', trigger: 'blur' },
            { pattern: this.$valid.webSite, message: '请输入正确的接口地址', trigger: 'blur' }
          ],
          'partyOrgFundDTO.isQueryAccount': [
            { required: true, message: '请选择是否查询开户', trigger: 'change', type: 'number' }
          ],
          'partyOrgFundDTO.queryUrl': [
            { required: true, message: '请填写查询开户接口', trigger: 'blur' },
            { pattern: this.$valid.webSite, message: '请输入正确的接口地址', trigger: 'blur' }
          ],
          'partyOrgAssetDTO.loanPatterns': [
            { required: true, min: 1, message: '请选择放款模式', trigger: 'change', type: 'array' }
          ],
          // 'partyOrgAssetDTO.repayPatterns': [
          //   { required: true, min: 1, message: '请选择还款模式', trigger: 'change', type: 'array' }
          // ],
          'partyOrgAssetDTO.confirmUri': [
            { pattern: this.$valid.webSite, message: '请输入正确的接口地址', trigger: 'blur' }
          ],
          'partyOrgAssetDTO.earlySwitch': [
            { required: true, message: '请选择是否开通提前结清功能', trigger: 'change', type: 'number' }
          ],
          'partyOrgAssetDTO.renewSwitch': [
            { required: true, message: '请选择是否开通续借功能', trigger: 'change', type: 'number' }
          ],
          'partyOrgAssetDTO.repealSwitch': [
            { required: true, message: '请选择是否开通撤贷功能', trigger: 'change', type: 'number' }
          ],
          // 机构联系人
          contactPartyName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          contactPartyPosition: [
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          contactPartyMobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          contactPartyEmail: [
            { required: true, message: '请输入预留邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
          ],
          // 企业法人代表信息
          legalPartyName: [
            { required: true, message: '请输入法人姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '1-10字以内', trigger: 'blur' }
          ],
          legalPartyMobile: [
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          legalIdentKind: [
            { required: true, message: '请选择证件类型', trigger: 'change' }
          ],
          legalPartyIdent: [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
            { pattern: this.$valid.ident, message: '请输入正确的证件号码', trigger: 'blur' }
          ],
          legalHomeAddress: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          legalDomicileAddress: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          identMaterial: [
            { required: true, min: 2, message: '请上传证件照片', trigger: 'submit', type: 'array' }
          ],
          // 工商信息
          orgNo: [
            { required: true, pattern: this.$valid.orgNo, message: '请填写正确的组织机构代码', trigger: 'blur' },
            { validator, trigger: 'blur', name: '组织机构代码' }
          ],
          regNo: [
            { required: true, pattern: this.$valid.regNo, message: '请填写正确的注册号', trigger: 'blur' },
            { validator, trigger: 'blur', name: '注册号' }
          ],
          industry: [
            { required: true, message: '请选择所属行业', trigger: 'change' }
          ],
          orgKind: [
            { required: true, message: '请选择公司类型', trigger: 'change' }
          ],
          issuingAuthority: [
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          regCapAmount: [
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback()
                } else if (typeof value !== 'number') {
                  callback('请输入数字');
                } else {
                  if (value < 0 || value > Number.MAX_SAFE_INTEGER) {
                    callback('范围0-' + Number.MAX_SAFE_INTEGER)
                  } else if (!this.$valid.floatValidator(value, 2)) {
                    callback('保留2位小数')
                  } else {
                    callback()
                  }
                }
              }
            }
          ],
          regAddress: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          optScope: [
            { min: 0, max: 1000, message: '100字以内', trigger: 'blur' }
          ]
        },
        fileError: {
          logoMaterial: '',
          legalPaperUrl: ''
        },
        datePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    computed: {
      logo: {
        get() {
          return this.currentValue.logoMaterial ? [{
            name: 'logo',
            url: this.currentValue.logoMaterial.fileUri
          }] : []
        },
        set(val) {
          if (val && val.length) {
            this.currentValue.logoMaterial = {
              fileName: val[0].name,
              fileUri: val[0].url,
              fileType: val[0].type,
              kind: this.$enum.PROOF_MATERIAL_O_LOGO
            }
          } else {
            this.currentValue.logoMaterial = null;
          }
        }
      },
      legalFiles: {
        get() {
          if (this.currentValue.identMaterial && this.currentValue.identMaterial.length) {
            return this.currentValue.identMaterial.map((_, i) => ({
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
            this.currentValue.identMaterial = val.map(_ => ({
              fileName: _.name,
              fileType: _.type,
              fileUri: _.url,
              kind: this.$enum.PROOF_MATERIAL_O_LEGAL_IDENT
            }))
          } else {
            this.currentValue.identMaterial = []
          }
        }
      },
      file1: {
        get() {
          if (this.currentValue.businessLicenseMaterial) {
            const { fileName, fileType, fileUri } = this.currentValue.businessLicenseMaterial;
            return [{
              name: fileName,
              type: fileType,
              url: fileUri
            }]
          }
          return [];
        },
        set(val) {
          if (val && val.length > 0) {
            this.currentValue.businessLicenseMaterial = {
              fileName: val[0].name,
              fileType: val[0].type,
              fileUri: val[0].url,
              kind: this.$enum.PROOF_MATERIAL_O_LICENSE
            }
          } else {
            this.currentValue.businessLicenseMaterial = null;
          }
        }
      },
      file2: {
        get() {
          if (this.currentValue.accountLicenseMaterial) {
            const { fileName, fileType, fileUri } = this.currentValue.accountLicenseMaterial;
            return [{
              name: fileName,
              type: fileType,
              url: fileUri
            }]
          }
          return [];
        },
        set(val) {
          if (val && val.length > 0) {
            this.currentValue.accountLicenseMaterial = {
              fileName: val[0].name,
              fileType: val[0].type,
              fileUri: val[0].url,
              kind: this.$enum.PROOF_MATERIAL_O_PERMIT
            }
          } else {
            this.currentValue.accountLicenseMaterial = null;
          }
        }
      },
      file3: {
        get() {
          if (this.currentValue.taxMaterial) {
            const { fileName, fileType, fileUri } = this.currentValue.taxMaterial;
            return [{
              name: fileName,
              type: fileType,
              url: fileUri
            }]
          }
          return [];
        },
        set(val) {
          if (val && val.length > 0) {
            this.currentValue.taxMaterial = {
              fileName: val[0].name,
              fileType: val[0].type,
              fileUri: val[0].url,
              kind: this.$enum.PROOF_MATERIAL_O_TAX
            }
          } else {
            this.currentValue.taxMaterial = null;
          }
        }
      },
      filesOther: {
        get() {
          if (this.currentValue.otherMaterial && this.currentValue.otherMaterial.length) {
            return this.currentValue.otherMaterial.map((_, i) => ({
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
            this.currentValue.otherMaterial = val.map(_ => ({
              filename: _.name,
              fileType: _.type,
              fileUri: _.url,
              kind: this.$enum.PROOF_MATERIAL_O_OTHER
            }))
          } else {
            this.currentValue.otherMaterial = []
          }
        }
      },
      businessTerm: {
        get() {
          if (this.currentValue.businessTermStart || this.currentValue.businessTermEnd) {
            const dateRange = [];
            dateRange[0] = this.currentValue.businessTermStart;
            dateRange[1] = this.currentValue.businessTermEnd;
            return dateRange;
          }
          return null;
        },
        set(val) {
          if (val) {
            this.currentValue.businessTermStart = val[0];
            this.currentValue.businessTermEnd = val[1]
          } else {
            this.currentValue.businessTermStart = '';
            this.currentValue.businessTermEnd = ''
          }
        }
      }
    },
    watch: {
      value(val, oldVal) {
        if (val) {
          this.setCurrentValue(val)
        }
      }
    },
    methods: {
      handleOrgNameBlur() {
        this.$emit('org-name-change', this.currentValue.orgName);
      },
      handleUploadLogo(file) {
        this.logo = [{
          url: file.key,
          type: file.type,
          name: file.name
        }];
        this.$refs.form2.validateField('logoMaterial');
      },
      handleRemoveLogo() {
        this.logo = [];
        this.$refs.form2.validateField('logoMaterial');
      },
      handleUploadLegalFiles(file) {
        this.legalFiles = this.legalFiles.concat({
          url: file.key,
          type: file.type,
          name: file.name
        });
        this.$refs.form2.validateField('identMaterial');
      },
      handleRemoveLegalFiles(file) {
        this.legalFiles = this.legalFiles.filter(_ => _.id !== file.id);
        this.$refs.form2.validateField('identMaterial');
      },
      handleUploadLicense(file) {
        this.file1 = [{
          url: file.key,
          type: file.type,
          name: this.$filter(this.$enum.PROOF_MATERIAL_O_LICENSE, this.$enum.PROOF_MATERIAL, this.$enum.PROOF_MATERIAL_O)
        }]
      },
      handleRemoveLicense() {
        this.file1 = [];
      },
      handleUploadPermit(file) {
        this.file2 = [{
          url: file.key,
          type: file.type,
          name: this.$filter(this.$enum.PROOF_MATERIAL_O_PERMIT, this.$enum.PROOF_MATERIAL, this.$enum.PROOF_MATERIAL_O)
        }]
      },
      handleRemovePermit() {
        this.file2 = [];
      },
      handleUploadTax(file) {
        this.file3 = [{
          url: file.key,
          type: file.type,
          name: this.$filter(this.$enum.PROOF_MATERIAL_O_TAX, this.$enum.PROOF_MATERIAL, this.$enum.PROOF_MATERIAL_O)
        }]
      },
      handleRemoveTax() {
        this.file3 = [];
      },
      handleUploadOther(file) {
        this.filesOther = this.filesOther.concat({
          url: file.key,
          type: file.type,
          name: this.$filter(this.$enum.PROOF_MATERIAL_O_OTHER, this.$enum.PROOF_MATERIAL, this.$enum.PROOF_MATERIAL_O)
        })
      },
      handleRemoveOther(file) {
        this.filesOther = this.filesOther.filter(_ => _.id !== file.id);
      },
      handleSelectOrg() {
        this.$emit('select-org')
      },
      handleSave() {
        this.$refs['form1'].validate((valid1) => {
          if (valid1) {
            this.$refs['form2'].validate((valid2) => {
              const val = this.$deepcopy(this.currentValue);
              if (!valid2) {
                this.$message.error('请检查保存信息');
                return false;
              } else if (this.validate()) {
                this.$emit('save', val);
              } else {
                return false;
              }
            })
          } else {
            this.$message.error('请检查保存信息');
            return false;
          }
        });
      },
      handleEdit() {
        this.$router.replace({
          name: 'OrgEdit'
        })
      },
      validate() {
        if (!this.file1.length) {
          this.activeName = 'fifth';
          this.$message.error('请上传机构营业执照');
          return false;
        }
        // if (!this.file2.length) {
        //   this.activeName = 'fifth';
        //   this.$message.error('请上传机构开户许可证');
        //   return false;
        // }
        // if (!this.file3.length) {
        //   this.$message.error('请上传机构纳税证明');
        //   return false;
        // }
        return true;
      },
      handleCancel() {
        this.$refs['form1'].resetFields();
        this.$refs['form2'].resetFields();
        if (this.business === this.$enum.BUSINESS_CENTER) {
          this.$router.go(-1);
        } else {
          this.$router.replace({
            name: 'OrgDetail'
          })
        }
      },
      setCurrentValue(val) {
        this.currentValue = Object.assign(this.currentValue, val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hint {
    margin-left: 30px;
    margin-bottom: 20px;
  }

  .logo-hint {
    margin: 0;
    color: #606266;
  }
</style>
