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
              <el-form-item label="公司 logo" prop="logoUrl"
                            :error="error['partyOrgBaseDTO.logoUrl'] || fileError.logoUrl">
                <ats-upload v-model="logo"
                            :mode="mode" :limit="1"
                            placeholder="2M以内"
                            @remove="handleRemoveLogo"
                            @success="handleUploadLogo"></ats-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="business === this.$enum.BUSINESS_CENTER">
            <el-col :span="10" :offset="2">
              <el-form-item label="是否上链" prop="isChain">
                <ats-select v-model="currentValue.isChain"
                            :mode="mode === 'EDIT' ?  'VIEW' : mode"
                            type="boolean"></ats-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="business === this.$enum.BUSINESS_CENTER">
            <el-col :span="20" :offset="2">
              <el-form-item label="业务端" prop="orgType" :error="error['partyOrgBaseDTO.orgType']">
                <ats-checkbox v-model="businessType"
                              :mode="mode === 'EDIT' ?  'VIEW' : mode"
                              :options="businessList"
                              border></ats-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="机构联系人" name="second">
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="姓名" prop="contact.realName" :error="error['additionalPersonList[0].realName']">
                <ats-input v-model.trim="currentValue.contact.realName" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="职务" prop="contact.job" :error="error['additionalPersonList[0].job']">
                <ats-input v-model.trim="currentValue.contact.job" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="手机号码" prop="contact.mobile" :error="error['additionalPersonList[0].mobile']">
                <ats-input v-model.trim="currentValue.contact.mobile" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="10">
              <el-form-item label="预留邮箱" prop="contact.email" :error="error['additionalPersonList[0].email']">
                <ats-input v-model.trim="currentValue.contact.email" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="企业法人代表信息" name="third">
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="姓名" prop="legal.realName" :error="error['additionalPersonList[1].realName']">
                <ats-input v-model.trim="currentValue.legal.realName" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="手机号码" prop="legal.mobile" :error="error['additionalPersonList[1].mobile']">
                <ats-input v-model.trim="currentValue.legal.mobile" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="证件类型" prop="legal.identKind" :error="error['additionalPersonList[1].identKind']">
                <ats-select v-model="currentValue.legal.identKind" :mode="mode"
                            :kind="this.$enum.IDENT_TYPE" :group="this.$enum.IDENT_TYPE"></ats-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="证件号码" prop="legal.ident" :error="error['additionalPersonList[1].ident']">
                <ats-input v-model.trim="currentValue.legal.ident" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="家庭地址" prop="legal.homeAddress" :error="error['additionalPersonList[1].homeAddress']">
                <ats-input v-model.trim="currentValue.legal.homeAddress" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="户籍地址" prop="legal.domicileAddress"
                            :error="error['additionalPersonList[1].domicileAddress']">
                <ats-input v-model.trim="currentValue.legal.domicileAddress" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item label="证件照片" prop="legal.paperUrl"
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
          <el-row>
            <el-col :span="10" :offset="2">
              <el-form-item label="代理人" prop="agentName" :error="error['partyOrgBaseDTO.agentName']">
                <ats-input v-model.trim="currentValue.agentName" :mode="mode"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
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
                <ats-select v-model="currentValue.status" :mode="mode"
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
                <ats-date-picker v-model="optDateRange" :mode="mode"
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
                <ats-input v-model="currentValue.optScope" :mode="mode" :type="'textarea'"
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
                        required
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
        <el-tab-pane label="区块链" name="sixth" v-if="mode !== 'CREATE' && currentValue.orgType >= 8">
        <!--<el-tab-pane label="区块链" name="sixth" v-if="(business === $enum.BUSINESS_CENTER || currentValue.chain.member) && currentValue.orgType >= 8">-->
          <el-row type="flex" justify="center">
            <el-col :span="16">
              <el-form-item label="区块链账户" prop="chain.partyId">
                <el-button v-if="!currentValue.chain.member"
                           :disabled="mode === 'VIEW'"
                           type="text"
                           @click="handleCreateChain()">创建</el-button>
                <ats-input v-else-if="currentValue.chain.member === 1"
                           v-model.trim="currentValue.partyId"
                           :mode="'VIEW'"></ats-input>
              </el-form-item>
              <div class="member" v-show="currentValue.chain.member === 1">
                <el-form-item label="客户端节点地址(内网)" prop="chain.nodeUrl">
                  <ats-input v-model.trim="currentValue.chain.nodeUrl"
                             :mode="mode"></ats-input>
                </el-form-item>
                <el-form-item label="点对点通信地址(外网)" prop="chain.anchorUrl">
                  <ats-input v-model.trim="currentValue.chain.anchorUrl"
                             :mode="mode"></ats-input>
                </el-form-item>
                <el-form-item label="联盟设置" prop="chain.channel">
                  <ats-checkbox v-model="currentValue.chain.channel" :mode="mode"
                                :kind="this.$enum.BLOCK_CHAIN_ALLIANCE"
                                :group="this.$enum.BLOCK_CHAIN_ALLIANCE"></ats-checkbox>
                </el-form-item>
                <div class="hint" v-if="business !== this.$enum.BUSINESS_CENTER">
                  <el-alert title="资产共享及敏感信息解密是使用备注公钥加密后传输的，同时为了解密备注信息，需要拥有备注公钥对应的私钥。本系统将自动为你生成备注的公私钥，也可由你的运营人员生成，然后将新生成的公钥修改提交即可。"></el-alert>
                </div>
                <el-form-item v-if="business !== this.$enum.BUSINESS_CENTER"
                              label="公钥" prop="publicKey">
                  <ats-input v-model.trim="currentValue.publicKey"></ats-input>
                </el-form-item>
                <el-form-item v-if="business !== this.$enum.BUSINESS_CENTER">
                  <el-button type="text"
                             @click="handleEditPublicKey">提交修改</el-button>
                  <el-button type="text"
                             @click="handleResetPublicKey">重置修改</el-button>
                </el-form-item>
              </div>
            </el-col>
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
      value: 0,
      text: '资金端'
    },
    {
      value: 1,
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
            if (data.body) {
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
          orgShortName: '',
          relPhone: '',
          postCode: '',
          staffStat: '',
          webSite: '',
          optAddress: '',
          optAddressLocate: '',
          logoUrl: '',
          isChain: false,
          orgType: '',
          agentName: '',
          orgNo: '',
          regNo: '',
          status: '',
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
          publicKey: '',
          chain: {
            partyId: '',
            member: 0, // 是否区块链成员
            anchorUrl: '',
            nodeUrl: '',
            channel: []
          },
          contact: {
            kind: this.$enum.REL_OP_FIRST_CONTACTOR
          },
          legal: {
            kind: this.$enum.REL_OP_LEGAL_PERSON,
            paperUrl: ''
          },
          files: []
        },
        // chainAccount: {
        //   partyId:'',
        //   token:'',
        //   time:''
        // },
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
            { required: true, message: '请输入联系电话', trigger: 'blur' },
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
          logoUrl: [
            { required: true, message: '请上传公司logo', trigger: 'change' }
          ],
          isChain: [
            { required: true, message: '请选择是否区块链机构', trigger: 'change', type: 'boolean' }
          ],
          orgType: [
            { required: true, message: '请选择业务端', trigger: 'change', type: 'number' }
          ],
          // 机构联系人
          'contact.realName': [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          'contact.job': [
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          'contact.mobile': [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          'contact.email': [
            { required: true, message: '请输入预留邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
          ],
          // 企业法人代表信息
          'legal.realName': [
            { required: true, message: '请输入法人姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '1-10字以内', trigger: 'blur' }
          ],
          'legal.mobile': [
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          'legal.identKind': [
            { required: true, message: '请选择证件类型', trigger: 'change' }
          ],
          'legal.ident': [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
            { pattern: this.$valid.ident, message: '请输入正确的证件号码', trigger: 'blur' }
          ],
          'legal.homeAddress': [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          'legal.domicileAddress': [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          'legal.paperUrl': [
            { required: true, message: '请上传证件照片', trigger: 'submit' }
          ],
          // 工商信息
          agentName: [
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          orgNo: [
            { pattern: this.$valid.orgNo, message: '请填写正确的组织机构代码', trigger: 'blur' },
            { validator, trigger: 'blur', name: '组织机构代码' }
          ],
          regNo: [
            { pattern: this.$valid.regNo, message: '请填写正确的注册号', trigger: 'blur' },
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
            { required: true, message: '请输入注册资本', trigger: 'blur', type: 'number' },
            {
              min: 0,
              max: Number.MAX_SAFE_INTEGER,
              message: '范围0-' + Number.MAX_SAFE_INTEGER,
              trigger: 'blur',
              type: 'number'
            },
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 2)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ],
          regAddress: [
            { required: true, message: '请输入企业地址', trigger: 'blur' },
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          optScope: [
            { min: 0, max: 1000, message: '100字以内', trigger: 'blur' }
          ]
        },
        fileError: {
          logoUrl: '',
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
          return this.currentValue.logoUrl ? [{
            name: 'logo',
            url: this.currentValue.logoUrl
          }] : []
        },
        set(val) {
          this.currentValue.logoUrl = val ? val[0].url : ''
        }
      },
      legalFiles: {
        get() {
          if (this.currentValue.legal && this.currentValue.legal.paperUrl) {
            return this.currentValue.legal.paperUrl.split('\n').map((_, i) => ({
              name: '',
              url: _,
              id: i
            }))
          }
          return [];
        },
        set(val) {
          if (val) {
            this.currentValue.legal.paperUrl = val.map(_ => _.url).join('\n')
          } else {
            this.currentValue.legal.paperUrl = ''
          }
        }
      },
      file1: {
        get() {
          return this.currentValue.files.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_O_LICENSE).map(_ => ({
            name: _.name,
            url: _.fileUri,
            type: _.fileType
          }));
        },
        set(val) {
          this.currentValue.files = this.currentValue.files.filter(_ => _.kind !== this.$enum.PROOF_MATERIAL_O_LICENSE).concat(val.map(_ => ({
            name: _.name,
            fileUri: _.url,
            kind: this.$enum.PROOF_MATERIAL_O_LICENSE,
            fileType: _.type
          })))
        }
      },
      file2: {
        get() {
          return this.currentValue.files.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_O_PERMIT).map(_ => ({
            name: _.name,
            url: _.fileUri,
            type: _.fileType
          }));
        },
        set(val) {
          this.currentValue.files = this.currentValue.files.filter(_ => _.kind !== this.$enum.PROOF_MATERIAL_O_PERMIT).concat(val.map(_ => ({
            name: _.name,
            fileUri: _.url,
            kind: this.$enum.PROOF_MATERIAL_O_PERMIT,
            fileType: _.type
          })))
        }
      },
      file3: {
        get() {
          return this.currentValue.files.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_O_TAX).map(_ => ({
            name: _.name,
            url: _.fileUri,
            type: _.fileType
          }));
        },
        set(val) {
          this.currentValue.files = this.currentValue.files.filter(_ => _.kind !== this.$enum.PROOF_MATERIAL_O_TAX).concat(val.map(_ => ({
            name: _.name,
            fileUri: _.url,
            kind: this.$enum.PROOF_MATERIAL_O_TAX,
            fileType: _.type
          })))
        }
      },
      filesOther: {
        get() {
          return this.currentValue.files.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_O_OTHER).map((_, i) => ({
            id: i,
            name: _.name,
            url: _.fileUri,
            type: _.fileType
          }));
        },
        set(val) {
          this.currentValue.files = this.currentValue.files.filter(_ => _.kind !== this.$enum.PROOF_MATERIAL_O_OTHER).concat(val.map(_ => ({
            name: _.name,
            fileUri: _.url,
            kind: this.$enum.PROOF_MATERIAL_O_OTHER,
            fileType: _.type
          })))
        }
      },
      optDateRange: {
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
      },
      businessType: {
        get() {
          if (this.currentValue.orgType === '') {
            return []
          } else {
            const orgType = this.currentValue.orgType;
            this.currentValue.isChain = orgType > 3;
            return this.$binaryToArray(orgType > 3 ? orgType >> 3 : orgType)
          }
        },
        set(val) {
          if (!val.length) {
            this.currentValue.orgType = '';
          } else {
            const binary = this.$arrayToBinary(val);
            this.currentValue.orgType = this.currentValue.isChain ? binary << 3 : binary;
          }
        }
      }
    },
    watch: {
      value(val, oldVal) {
        if (val) {
          this.setCurrentValue(val)
        }
      },
      'value.chain'(val, oldVal) {
        this.currentValue.chain = this.$deepcopy(val)
      },
      'value.publicKey'(val, oldVal) {
        this.currentValue.publicKey = val;
      },
      'currentValue.isChain'(val) {
        if (this.businessType.length) {
          const binary = this.$arrayToBinary(this.businessType);
          this.currentValue.orgType = val ? binary << 3 : binary;
        }
      }
    },
    methods: {
      handleOrgNameBlur() {
        this.$emit('org-name-change', this.currentValue.orgName);
      },
      handleUploadLogo(file) {
        this.currentValue.logoUrl = file.key;
        delete this.fileError.logoUrl;
      },
      handleRemoveLogo() {
        this.currentValue.logoUrl = '';
        this.fileError.logoUrl = '请上传公司logo'
      },
      handleUploadLegalFiles(file) {
        this.legalFiles = this.legalFiles.concat({
          url: file.key
        });
        delete this.fileError.legalPaperUrl;
      },
      handleRemoveLegalFiles(file) {
        this.legalFiles = this.legalFiles.filter(_ => _.id !== file.id);
        if (!this.legalFiles.length) {
          this.fileError.legalPaperUrl = '请上传证件照片'
        }
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
                this.$emit('save', {
                  partyOrgBaseDTO: this.$objFilter(val, item => typeof item !== 'object'),
                  additionalPersonList: [
                    val.contact,
                    val.legal
                  ],
                  materialList: val.files,
                  chain: val.chain
                })
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
      validate(val) {
        if (!this.file1.length) {
          this.$message.error('请上传机构营业执照');
          return false;
        }
        if (!this.file2.length) {
          this.$message.error('请上传机构开户许可证');
          return false;
        }
        // if (!this.file3.length) {
        //   this.$message.error('请上传机构纳税证明');
        //   return false;
        // }
        return true;
      },
      handleCancel() {
        this.$refs['form1'].resetFields();
        this.$refs['form2'].resetFields();
        this.$router.go(-1);
      },
      setCurrentValue(val) {
        this.currentValue = Object.assign(this.currentValue, val)
      },
      // 创建
      handleCreateChain() {
        this.$emit('create-chain', this.currentValue);
      },
      handleEditPublicKey() {
        if (this.currentValue.publicKey) {
          this.$emit('edit-publickey', this.currentValue.publicKey)
        } else {
          this.$message.error('公钥不能为空');
        }
      },
      handleResetPublicKey() {
        this.$emit('reset-publickey')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hint {
    margin-left: 30px;
    margin-bottom: 20px;
  }
</style>
