<template>
  <div class="org-base">
    <el-form ref="form"
             v-if="currentValue"
             :model="currentValue"
             :rules="mode !== 'VIEW' ? rules : {}"
             label-width="150px">
      <div class="applicant" v-if="currentValue.applicantPerson">
        <h4>
          <span>申请人信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="applicantPerson.applicantName">
              <ats-input v-model.trim="currentValue.applicantPerson.applicantName"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="applicantPerson.applicantIdent">
              <ats-input v-model.trim="currentValue.applicantPerson.applicantIdent"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="applicantPerson.applicantMobile">
              <ats-input v-model.trim="currentValue.applicantPerson.applicantMobile"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业关系" prop="applicantPerson.applicantOrgRelation">
              <ats-select v-model="currentValue.applicantPerson.applicantOrgRelation"
                          :kind="this.$enum.CUSTOMER_ORG_APPLICANT_TYPE"
                          :group="this.$enum.CUSTOMER_ORG_APPLICANT_TYPE"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="base">
        <h4>
          <span>基本信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="contactPhone">
              <ats-input v-model.trim="currentValue.contactPhone"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编号" prop="postalCode">
              <ats-input v-model.trim="currentValue.postalCode"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业网址" prop="webSite">
              <ats-input v-model.trim="currentValue.webSite"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="办公地址" prop="businessAddress">
              <ats-input v-model.trim="currentValue.businessAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="business">
        <h4>
          <span>工商信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公司类型" prop="enterpriseType">
              <ats-select v-model="currentValue.enterpriseType"
                          :kind="this.$enum.COMPANY_TYPE"
                          :group="this.$enum.COMPANY_TYPE"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业状态" prop="businessCondition">
              <ats-select v-model="currentValue.businessCondition"
                          :kind="this.$enum.COMPANY_STATUS"
                          :group="this.$enum.COMPANY_STATUS"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人员规模" prop="staffStat">
              <ats-select v-model="currentValue.staffStat"
                          :kind="this.$enum.COMPANY_SCALE"
                          :group="this.$enum.COMPANY_SCALE"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属行业" prop="industry">
              <ats-select v-model="currentValue.industry"
                          :kind="this.$enum.INDUSTRY"
                          :group="this.$enum.INDUSTRY"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册资本" prop="registeredCapital">
              <ats-input v-model="currentValue.registeredCapital"
                         type="number" unit="元" :min="0" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实缴资本" prop="contributedCapital">
              <ats-input v-model="currentValue.contributedCapital"
                         type="number" unit="元" :min="0" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="注册地址" prop="registeredAddress">
              <ats-input v-model.trim="currentValue.registeredAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成立日期" prop="registerDate">
              <ats-date-picker v-model="currentValue.registerDate"
                               :picker-options="datePickerOptions"
                               :mode="mode"></ats-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="营业期限" prop="businessTerm">
              <ats-date-picker v-model="businessTerm"
                               type="daterange"
                               :mode="mode"></ats-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发证日期" prop="issueDate">
              <ats-date-picker v-model="currentValue.issueDate"
                               :picker-options="datePickerOptions"
                               :mode="mode"></ats-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记机关" prop="issuingAuthority">
              <ats-input v-model.trim="currentValue.issuingAuthority"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="经营区域" prop="businessProvince">
              <el-col :span="12">
                <ats-select v-model="currentValue.businessProvince"
                            region="86"
                            clearable
                            :mode="mode"></ats-select>
              </el-col>
              <el-col :span="12">
                <ats-select v-model="currentValue.businessCity"
                            :region="currentValue.businessProvince"
                            clearable
                            :mode="mode"></ats-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收益情况(万元)" prop="incomeSituation">
              <ats-select v-model="currentValue.incomeSituation"
                          :kind="this.$enum.COMPANY_INCOME"
                          :group="this.$enum.COMPANY_INCOME"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="经营范围">
              <ats-input v-model="currentValue.businessScope"
                         type="textarea"
                         :rows="2"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="legal" v-if="currentValue.legal">
        <h4>
          <span>法人代表信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="法人代表姓名" prop="legal.realName">
              <ats-input v-model.trim="currentValue.legal.realName"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="legal.sex">
              <ats-select v-model="currentValue.legal.sex"
                          :kind="this.$enum.GENDER"
                          :group="this.$enum.GENDER"
                          :mode="mode"
                          disabled></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="婚姻状况">
              <ats-select v-model="currentValue.legal.marriage"
                          :kind="this.$enum.MARRIAGE_STATUS"
                          :group="this.$enum.MARRIAGE_STATUS"
                          clearable
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="住房状况">
              <ats-select v-model="currentValue.legal.homeType"
                          :kind="this.$enum.HOUSE_STATUS"
                          :group="this.$enum.HOUSE_STATUS"
                          clearable
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学历">
              <ats-select v-model="currentValue.legal.education"
                          :kind="this.$enum.EDUCATION"
                          :group="this.$enum.EDUCATION_GROUP"
                          clearable
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年收入(万元)" prop="legal.pmIncome">
              <ats-select v-model="currentValue.legal.pmIncome"
                          :kind="this.$enum.INCOME_YEAR"
                          :group="this.$enum.INCOME_YEAR"
                          :mode="mode"
                          clearable></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="证件类型" prop="legal.identKind">
              <ats-select v-model="currentValue.legal.identKind"
                          :kind="this.$enum.IDENT_TYPE"
                          :group="this.$enum.IDENT_TYPE"
                          disabled></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="legal.ident">
              <ats-input v-model.trim="currentValue.legal.ident"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="legal.mobile">
              <ats-input v-model.trim="currentValue.legal.mobile"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在省份" prop="legal.province">
              <ats-select v-model="currentValue.legal.province"
                          region="86"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在城市" prop="legal.city">
              <ats-select v-model="currentValue.legal.city"
                          :region="currentValue.legal.province"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话号码" prop="legal.telephone">
              <ats-input v-model.trim="currentValue.legal.telephone"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="家庭住址" prop="legal.homeAddress">
              <ats-input v-model.trim="currentValue.legal.homeAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="常住地址" prop="legal.residentAddress">
              <ats-input v-model.trim="currentValue.legal.residentAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户籍地址" prop="legal.domicileAddress">
              <ats-input v-model.trim="currentValue.legal.domicileAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="other">
        <h4>
          <span>股东信息</span>
        </h4>
        <stock ref="stock"
               v-if="mode !== 'VIEW' || (currentValue.stocks && currentValue.stocks.length > 0)"
               v-model="currentValue.stocks"
               :is-upload="isUpload"
               :mode="mode"></stock>
      </div>
      <div class="materials">
        <h4>
          <span>证件照片</span>
        </h4>
        <el-row type="flex" justify="center">
          <el-form-item label-width="0" prop="materials">
            <ats-upload v-model="materials"
                        :mode="mode"
                        @success="handleUploadMaterial"
                        @remove="handleRemoveMaterial"></ats-upload>
          </el-form-item>
        </el-row>
      </div>
      <div class="risk">
        <debt v-if="currentValue.personDebtInformationList"
              v-model="currentValue.personDebtInformationList"></debt>
        <credit-data v-if="currentValue.creditDataDTO"
                     v-model="currentValue.creditDataDTO"></credit-data>
        <involved v-if="currentValue.involvedAppealDTO"
                  v-model="currentValue.involvedAppealDTO"></involved>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Stock from '../prop/Stock'
  import Debt from '../risk/Debt'
  import CreditData from '../risk/CreditData'
  import Involved from '../risk/Involved'

  export default {
    components: {
      Stock,
      Debt,
      CreditData,
      Involved
    },

    props: {
      value: Object,
      mode: String,
      error: {
        type: Object,
        default() {
          return {};
        }
      },
      isUpload: Boolean,
      encode: Boolean
    },
    data() {
      return {
        currentValue: this.$deepcopy({
          materials: [],
          ...this.value
        }),
        rules: {
          'applicantPerson.applicantName': [
            { required: true, message: '请输入申请人姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          'applicantPerson.applicantIdent': [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
            { pattern: this.$valid.ident, message: '请输入正确的身份证号', trigger: 'blur' }
          ],
          'applicantPerson.applicantMobile': [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          'applicantPerson.applicantOrgRelation': [
            { required: true, message: '请选择申请人的企业关系', trigger: 'change' }
          ],
          contactPhone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { pattern: this.$valid.telOrMobile, message: '请输入正确的电话或手机号码', trigger: 'blur' }
          ],
          postalCode: [
            { pattern: this.$valid.postCode, message: '请输入正确的邮政编码', trigger: 'blur' }
          ],
          businessAddress: [
            { required: true, message: '请输入办公地址', trigger: 'blur' },
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          webSite: [
            { pattern: this.$valid.webSite, message: '请输入正确的网址', trigger: 'blur' },
            { min: 0, max: 100, message: '网址过长', trigger: 'blur' }
          ],
          enterpriseType: [
            { required: true, message: '请选择公司类型', trigger: 'change' }
          ],
          industry: [
            { required: true, message: '请选择所属行业', trigger: 'change' }
          ],
          registeredCapital: [
            { required: true, message: '请输入注册资本', trigger: 'blur', type: 'number' },
            {
              min: 0,
              max: 9999999999999,
              message: '范围0-' + 9999999999999,
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
          contributedCapital: [
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (typeof value === 'number' && !isNaN(value)) {
                  if (value < 0 || value > 9999999999999) {
                    callback('范围0-9999999999999')
                  } else if (!this.$valid.floatValidator(value, 2)) {
                    callback('保留2位小数')
                  } else {
                    callback()
                  }
                } else {
                  callback();
                }
              }
            }
          ],
          registeredAddress: [
            { message: '请输入注册地址', trigger: 'blur' },
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          registerDate: [
            { required: true, message: '请选择成立日期', trigger: 'change' }
          ],
          issuingAuthority: [
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          businessProvince: [
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback('请选择经营省份');
                } else if (!this.currentValue.businessCity) {
                  callback('请选择经营城市');
                } else {
                  callback();
                }
              }
            }
          ],
          incomeSituation: [
            { required: true, message: '请选择收益情况', trigger: 'change' }
          ],
          'legal.realName': [
            { required: true, message: '请输入企业法人代表姓名', trigger: 'blur' },
            { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
          ],
          'legal.identKind': [
            { required: true, message: '请选择证件类型', trigger: 'change' }
          ],
          'legal.ident': [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
            { pattern: this.$valid.ident, message: '请输入正确的身份证号', trigger: 'blur' }
          ],
          'legal.mobile': [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          'legal.telephone': [
            { pattern: this.$valid.telephone, message: '请输入正确的电话号码', trigger: 'blur' }
          ],
          'legal.homeAddress': [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          'legal.residentAddress': [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          'legal.domicileAddress': [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ]
        },
        datePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    computed: {
      businessTerm: {
        get() {
          if (this.currentValue.businessTerm) {
            return this.currentValue.businessTerm.split('~');
          }
          return null;
        },
        set(val) {
          val = val || [];
          this.currentValue.businessTerm = val.join('~');
        }
      },
      materials: {
        get() {
          if (this.currentValue.materials) {
            return this.currentValue.materials.map((_, index) => ({
              id: _.id || index + 1,
              name: _.fileName,
              type: _.fileType,
              url: _.fileUri
            }));
          } else {
            return []
          }
        },
        set(val) {
          if (val) {
            this.currentValue.materials = val.map((_, index) => ({
              id: typeof _.id === 'number' && _.id < 100000 ? index + 1 : _.id, // 每次重新更新index id，保留组件生成id
              fileName: _.name,
              fileUri: _.url,
              fileType: _.type,
              kind: this.$enum.PROOF_MATERIAL_O_OTHER
            }))
          } else {
            this.currentValue.materials = [];
          }
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          this.setCurrentValue(val);
        },
        deep: true
      }
    },

    methods: {
      save(callback) {
        let isValid = true;

        this.$refs.form.validate((valid) => {
          if (!valid) isValid = false;
        });

        this.$refs.stock.validate((valid) => {
          if (!valid) isValid = false;
        });

        if (isValid) {
          this.$emit('input', this.$deepcopy(this.currentValue));
        }
        typeof callback === 'function' && callback(isValid);
      },
      setCurrentValue(val) {
        val.materials = val.materials || [];
        if (this.encode) {
          if (val.applicantPerson) {
            val.applicantPerson.applicantName = this.$encoder.personName(val.applicantPerson.applicantName);
            val.applicantPerson.applicantIdent = this.$encoder.ident(val.applicantPerson.applicantIdent);
            val.applicantPerson.applicantMobile = this.$encoder.mobile(val.applicantPerson.applicantMobile);
          }
          val.contactPhone = this.$encoder.mobile(val.contactPhone);
          if (val.legal) {
            val.legal.realName = this.$encoder.personName(val.legal.realName);
            val.legal.ident = this.$encoder.ident(val.legal.ident);
            val.legal.mobile = this.$encoder.mobile(val.legal.mobile);
          }
        }
        this.currentValue = this.$deepcopy(val);
      },
      handleUploadMaterial(file) {
        this.materials = this.materials.concat([{
          id: file.uid,
          url: file.key,
          name: file.name,
          type: file.type
        }]);

        if (this.mode === 'EDIT') {
          console.log('ADD' + file.uid);
          this.$store.commit('material/add', {
            uid: file.uid,
            fileUri: file.key,
            fileName: file.name,
            fileType: file.type,
            kind: this.$enum.PROOF_MATERIAL_O_OTHER
          })
        }
      },
      handleRemoveMaterial(file) {
        this.materials = this.materials.filter(_ => _.id !== file.id);

        if (this.mode === 'EDIT') {
          console.log('DELETE' + file.id);
          this.$store.commit('material/delete', {
            id: file.id
          })
        }
      }
    }
  }
</script>
