<template>
  <div class="application">
    <el-form v-if="currentValue"
             ref="form"
             label-width="150px"
             :model="currentValue"
             :rules="mode !== 'VIEW' ? rules : {}">
      <card ref="card"
            v-model="card"
            :type="end"
            :mode="mode"></card>
      <div class="loan">
        <h4>
          <span>借款信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="借款编号">
              <ats-input v-model="currentValue.loanApplicationNo"
                         :mode="mode"
                         disabled></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="协议编号" prop="contract" :error="error.contract">
              <ats-input v-model.trim="currentValue.contract"
                         :mode="mode === 'CREATE' || isUpload ? mode : 'VIEW'"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款金额" prop="loanAmount" :error="error.loanAmount">
              <ats-input v-model="currentValue.loanAmount" :mode="mode"
                         type="number" unit="元" :min="0" :step="0.01"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectId" :error="error.projectId">
              <ats-input v-if="type !== this.$enum.BUSINESS_ASSET || ((mode === 'EDIT' || mode === 'VIEW') && !isUpload)"
                         v-model="currentValue.projectName"
                         :mode="mode"
                         type="text"></ats-input>
              <ats-select v-else
                          v-model="currentValue.projectId"
                          :mode="mode"
                          :options="$store.state.application.projectNameList"
                          :extra-data.sync="projectInfo"
                          clearable></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产类型" prop="assetKind" :error="error.assetKind">
              <ats-select v-model="currentValue.assetKind"
                          :kind="this.$enum.ASSET_TYPE"
                          :group="this.$enum.ASSET_TYPE"
                          disabled></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="projectType" :error="error.assetKind">
              <ats-select v-model="currentValue.projectType"
                          :kind="this.$enum.PROJECT_TYPE"
                          :group="this.$enum.PROJECT_TYPE"
                          disabled></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="借款属性" prop="kind" :error="error.kind">
              <el-col :span="currentValue.kind === $enum.LOAN_PROP_NEW ? 12 : 24">
                <ats-select v-model="currentValue.kind"
                            :kind="this.$enum.LOAN_PROP"
                            :group="this.$enum.LOAN_PROP"
                            :mode="mode"
                            disabled></ats-select>
              </el-col>
              <el-col v-if="currentValue.kind === $enum.LOAN_PROP_NEW"
                      :span="12">
                <ats-select v-model="currentValue.newLoanKind"
                            :kind="this.$enum.LOAN_PROP_SUB"
                            :group="this.$enum.LOAN_PROP_SUB"
                            :mode="mode"></ats-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款期数" prop="repayTerms" :error="error.repayTerms">
              <ats-input v-model="currentValue.repayTerms" :mode="mode"
                         type="number" :min="1" :max="72"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期限(单位)" prop="repayTimeType" :error="error.repayTimeType || error.repayTime">
              <el-col :span="12">
                <ats-input v-model="currentValue.repayTime" :mode="mode"
                           type="number" :min="1" :max="30"></ats-input>
              </el-col>
              <el-col :span="12">
                <ats-select v-model="currentValue.repayTimeType" :mode="mode"
                            :kind="this.$enum.TERM_UNIT" :group="this.$enum.TERM_UNIT"></ats-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="还款方式" prop="repayWay" :error="error.repayWay">
              <ats-select v-model="currentValue.repayWay"
                          :kind="this.$enum.REPAY_WAY"
                          :group="this.$enum.REPAY_WAY"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款用途" prop="usageLoan" :error="error.usageLoan">
              <ats-select v-model="currentValue.usageLoan" :mode="mode"
                          :kind="this.$enum.LOAN_USAGE" :group="this.$enum.LOAN_USAGE_GROUP"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="还款来源" prop="payment" :error="error.payment">
              <ats-select v-model="currentValue.payment" :mode="mode"
                          :kind="this.$enum.PAYMENT_SOURCE" :group="this.$enum.PAYMENT_SOURCE"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="!isAudit" :span="24">
            <el-form-item label="备注信息">
              <ats-input v-if="mode !== 'CREATE'"
                         v-model="remarks" mode="VIEW" :type="'textarea'" :rows="2"></ats-input>
              <ats-input v-model.trim="currentValue.remarks"
                         :mode="mode"
                         v-if="mode !== 'VIEW'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="放款模式" prop="loanModel" :error="error.loanModel">
              <ats-select v-if="type !== this.$enum.BUSINESS_ASSET || mode === 'VIEW'"
                          v-model="currentValue.loanModel" :mode="mode" clearable
                          :kind="this.$enum.LOAN_MODEL" :group="this.$enum.LOAN_MODEL"></ats-select>
              <ats-select v-else
                          v-model="currentValue.loanModel" :mode="mode"
                          @input="handleLoanModelInput"
                          :options="loanModelList"></ats-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<el-form-item label="还款模式" prop="repayModel" :error="error.repayModel">-->
              <!--<ats-select v-if="type !== this.$enum.BUSINESS_ASSET || mode === 'VIEW'"-->
                          <!--v-model="currentValue.repayModel" :mode="mode" clearable-->
                          <!--:kind="this.$enum.REPAY_MODEL" :group="this.$enum.REPAY_MODEL"></ats-select>-->
              <!--<ats-select v-else-->
                          <!--v-model="currentValue.repayModel" :mode="mode"-->
                          <!--:options="repayModelList"></ats-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="意向资金端" prop="intentionFund"
                          :rules="intentionFundRules"
                          :error="error.intentionFund">
              <ats-input v-if="type === $enum.BUSINESS_FUND"
                         v-model="intentionFund"
                         type="text"
                         :mode="mode"></ats-input>
              <ats-select v-else-if="type === $enum.BUSINESS_CENTER"
                          v-model="currentValue.intentionFund"
                          :org="$enum.BUSINESS_FUND"
                          :mode="mode"></ats-select>
              <ats-select v-else
                          v-model="currentValue.intentionFund"
                          placeholder="无"
                          :org="$enum.BUSINESS_INTENTION_FUND"
                          :mode="currentValue.kind === $enum.LOAN_PROP_CONTINUE ? 'VIEW' : mode"
                          clearable
                          @input="mode !== 'VIEW' && validateField('intentionFund')"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务费率">
              <ats-input v-model="fundProfitRateService"
                         type="number" unit="%" disabled></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.isDSModel">
          <el-col :span="8">
            <el-form-item label="代收金额" prop="collectionAmount">
              <ats-input v-model="currentValue.collectionAmount"
                         type="number" unit="元"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="代收银行卡" prop="collectionBankCard">
              <ats-input v-if="mode === 'VIEW'"
                         :value="`${currentValue.collectionBankCard}（${currentValue.collectionAccount}）`"
                         :mode="mode"></ats-input>
              <ats-select v-else
                          v-model="currentValue.collectionBankCard"
                          :extra-data.sync="collectionAccount"
                          :options="collectionCardList"
                          :mode="mode"
                          placeholder="无"
                          clearable
                          @input="mode !== 'VIEW' && validateField('collectionBankCard')"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="currentValue.riskSwitch == '0'">
          <el-col :span="8">
            <el-form-item label="机构资产风险等级" prop="channelRiskLevel">
              <ats-select v-model="currentValue.channelRiskLevel"
                          :kind="this.$enum.RISK_LEVEL"
                          :group="this.$enum.RISK_LEVEL_GROUP"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构信用评分" prop="channelCreditScore">
              <ats-input v-model.number="currentValue.channelCreditScore"
                         :mode="mode"
                         placeholder="0-10000分"
                         :min="0" :max="10000" :step="1"
                         type="number"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="rate">
        <h4>
          <span>费率信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="渠道借款利率" prop="loanIntRate" :error="error.loanIntRate">
              <ats-input v-model="loanIntRate" :mode="mode"
                         type="number" unit="%" :min="0" :max="100" :step="0.01"></ats-input>
            </el-form-item>
          </el-col>
          <!--<el-col :span="11">-->
            <!--<el-form-item label="借款利率区间" prop="loanIntRateMin" :error="error.loanIntRateMin || error.loanIntRateMax">-->
              <!--<el-col :span="11">-->
                <!--<ats-input v-model="loanIntRateMin" :mode="mode"-->
                           <!--type="number" unit="%"-->
                           <!--:min="0" :max="100" :step="0.01"></ats-input>-->
              <!--</el-col>-->
              <!--<el-col :span="2" style="text-align: center;">-->
                <!--<span>-</span>-->
              <!--</el-col>-->
              <!--<el-col :span="11">-->
                <!--<ats-input v-model="loanIntRateMax" :mode="mode"-->
                           <!--type="number" unit="%"-->
                           <!--:min="0" :max="100" :step="0.01"></ats-input>-->
              <!--</el-col>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="合作利率" prop="cooperationRate" :error="error.cooperationRate">
              <ats-input v-model="cooperationRate" :mode="mode"
                         type="number" unit="%" :min="0" :max="100" :step="0.01"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="利率类型" prop="repayRateType" :error="error.repayRateType">
              <ats-select v-model="currentValue.repayRateType" :mode="mode"
                          :kind="this.$enum.LOAN_RATES" :group="this.$enum.LOAN_RATES"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"
                  v-if="currentValue.status === $enum.LOAN_STATUS_CLEARED
                        || currentValue.status === $enum.LOAN_STATUS_APPLY_ADVANCE
                        || currentValue.status === $enum.LOAN_STATUS_LOANED">
            <el-form-item label="借款利率" prop="repayIntRate" :error="error.repayIntRate">
              <ats-input v-model="repayIntRate" :mode="mode"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01"></ats-input>
            </el-form-item>
          </el-col>
          <!--起息日即放款日，为资金端放款后存在的字段，在资金端、资产中心和资产端（仅履约资产）展示-->
          <el-col :span="8"
                  v-if="currentValue.status === $enum.LOAN_STATUS_CLEARED
                        || currentValue.status === $enum.LOAN_STATUS_APPLY_ADVANCE
                        || currentValue.status === $enum.LOAN_STATUS_LOANED">
            <el-form-item label="起息日">
              <ats-date-picker v-model="currentValue.paymentDate"
                               value-format="yyyy-MM-dd"
                               :mode="mode"></ats-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="逾期罚息日利率" prop="penaltyRate">
              <ats-input v-model="penaltyRate"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="逾期管理费日利率" prop="penaltyManageRate">
              <ats-input v-model="penaltyManageRate"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="坏账罚息日利率" prop="badDebtRate">
              <ats-input v-model="badDebtRate"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="坏账管理费日利率" prop="badDebtManageRate">
              <ats-input v-model="badDebtManageRate"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="违约费率" prop="defaultsRate">
              <ats-input v-model="defaultsRate"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <protection ref="protection"
                  v-model="currentValue.planId"
                  :model.sync="currentValue.protectionModel"
                  :mode="mode"></protection>
      <div class="log">
        <h4>
          <span>创建信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="创建渠道">
              <ats-input v-model="currentValue.assetOrgName" :disabled="true"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <ats-input v-model="currentValue.creatorName" :disabled="true"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <ats-date-picker v-model="currentValue.createdTime" :disabled="true"></ats-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="提交时间">
              <ats-date-picker v-model="currentValue.appliedTime" :disabled="true"></ats-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在省份">
              <ats-select v-model="currentValue.creatorProvince" :mode="mode"
                          region="86" clearable></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在城市">
              <ats-select v-model="currentValue.creatorCity" :mode="mode"
                          :region="currentValue.creatorProvince" clearable></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在营业部" prop="creatorBusiness" :error="error.creatorBusiness">
              <ats-input v-model.trim="currentValue.creatorBusiness" :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<el-form-item label="保存状态">-->
              <!--<ats-input v-model="currentValue.saveStatus" :disabled="true"></ats-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="借款状态">
              <ats-select v-model="value.status" disabled
                          :kind="this.$enum.LOAN_STATUS"
                          :group="this.$enum.LOAN_STATUS_GROUP"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {getModelEnums} from '../../assets/api/asset';
  import Card from '../prop/Card';
  import Protection from '../prop/ProtectionPlan';

  export default {
    props: {
      value: Object,
      mode: String,
      end: String,
      error: {
        type: Object,
        default() {
          return {}
        }
      },
      isUpload: Boolean,
      isAudit: Boolean
    },
    data() {
      const rateRangeRule = { min: 0, max: 1, message: '利率范围为0-100%', trigger: 'blur', type: 'number' };
      const rateDecimalRule = (bit) => {
        return {
          trigger: 'blur',
          type: 'number',
          validator: (rule, value, callback) => {
            if (!value || this.$valid.floatValidator(value, bit)) {
              callback()
            } else {
              callback(`保留${bit - 2}位小数`)
            }
          }
        }
      };

      return {
        currentValue: this.$deepcopy(this.value),
        card: {
          loanCard: this.value.loanCard,
          cardBank: this.value.cardBank,
          loanMobile: this.value.loanMobile,
          openBank: this.value.openBank,
          bankProvince: this.value.bankProvince,
          bankCity: this.value.bankCity
        },
        protectionList: [],
        rules: {
          contract: [
            { required: true, message: '请输入协议编号', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur'}
          ],
          loanAmount: [
            { required: true, message: '请输入借款金额', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (value <= 0) {
                  callback('借款金额须大于0');
                  return;
                }
                if (this.end === this.$enum.SUBJECT_PROP_PERSON) {
                  if (value > 200000) {
                    callback('个人借款不能大于20万');
                    return;
                  }
                } else if (this.end === this.$enum.SUBJECT_PROP_ORGANIZE) {
                  if (value > 1000000) {
                    callback('企业借款不能大于100万');
                    return;
                  }
                }
                callback();
              }
            },
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
          projectId: [
            { required: true, message: '请选择项目名称', trigger: 'change' }
          ],
          kind: [
            { required: true, message: '请选择借贷属性', trigger: 'change' },
            {
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!this.currentValue.newLoanKind) {
                  callback('请选择借贷属性')
                } else {
                  callback()
                }
              }
            }
          ],
          repayTerms: [
            { required: true, message: '请输入借款期数', trigger: 'blur', type: 'number' },
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
          repayTimeType: [
            { required: true, message: '请选择借款期限', trigger: 'change' },
            { required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (value === this.$enum.TERM_UNIT_NATURAL_MONTH) {
                  if (this.currentValue.repayTime !== 1) {
                    callback('只能为1个月');
                  } else if (!this.$valid.floatValidator(this.currentValue.repayTime, 0)) {
                    callback('请输入整数')
                  } else {
                    callback();
                  }
                } else {
                  if (this.currentValue.repayTime <= 0 || this.currentValue.repayTime > 90) {
                    callback('天数范围为1-90天')
                  } else if (!this.$valid.floatValidator(this.currentValue.repayTime, 0)) {
                    callback('请输入整数')
                  } else {
                    callback()
                  }
                }
              }
            }
          ],
          repayWay: [
            { required: true, message: '请选择还款方式', trigger: 'change' }
          ],
          usageLoan: [
            { required: true, message: '请选择借款用途', trigger: 'change' }
          ],
          payment: [
            { required: true, message: '请选择还款来源', trigger: 'change' }
          ],
          loanModel: [
            { required: true, message: '请选择放款模式', trigger: 'change' }
          ],
          // repayModel: [
          //   { required: true, message: '请选择还款模式', trigger: 'change' }
          // ],
          collectionAmount: [
            { required: true, message: '请填写代收金额', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.currentValue.loanAmount && value > this.currentValue.loanAmount) {
                  callback('代收金额不能大于借款金额')
                } else if (this.currentValue.loanAmount && value <= 0) {
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
            { required: true, message: '请选择代收银行卡', trigger: 'change' }
          ],

          channelRiskLevel: [
            { required: true, message: '请选择资产风险等级', trigger: 'change' }
          ],
          channelCreditScore: [
            { required: true, message: '请输入信用评分', trigger: 'blur', type: 'number' },
            { min: 0, max: 10000, message: '评分范围0-10000', trigger: 'blur', type: 'number' },
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

          loanIntRate: [
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
          // loanIntRateMin: [
          //   { required: true, message: '请输入借款利率区间', trigger: 'blur', type: 'number' },
          //   rateRangeRule,
          //   rateDecimalRule,
          //   {
          //     trigger: 'blur',
          //     type: 'number',
          //     validator: (rule, v, callback) => {
          //       const value = this.currentValue.loanIntRateMax;
          //       if (typeof value !== 'number' && !value) {
          //         callback('请输入借款利率区间')
          //       } else if (value < 0 || value > 1) {
          //         callback('利率范围为0-100%')
          //       } else if (!this.$valid.floatValidator(value, 4)) {
          //         callback('保留2位小数')
          //       } else if (this.currentValue.loanIntRateMin > this.currentValue.loanIntRateMax) {
          //         callback('区间左值应小于或等于右值')
          //       } else {
          //         callback();
          //       }
          //     }
          //   }
          // ],
          cooperationRate: [
            rateRangeRule,
            rateDecimalRule(4)
          ],
          repayIntRate: [
            { required: true, message: '请输入借款利率', trigger: 'blur', type: 'number' },
            rateRangeRule,
            rateDecimalRule(4)
          ],
          repayRateType: [
            { required: true, message: '请选择利率类型', trigger: 'change' }
          ],
          penaltyRate: [
            { required: true, message: '请输入逾期罚息日利率', trigger: 'blur', type: 'number' },
            rateRangeRule,
            rateDecimalRule(6)
          ],
          penaltyManageRate: [
            rateRangeRule,
            rateDecimalRule(6)
          ],
          badDebtRate: [
            rateRangeRule,
            rateDecimalRule(6)
          ],
          badDebtManageRate: [
            rateRangeRule,
            rateDecimalRule(6)
          ],
          defaultsRate: [
            rateRangeRule,
            rateDecimalRule(4)
          ],

          creatorBusiness: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ]
        },
        extraRules: {
          intentionFund: [
            { required: true, message: '请选择意向资金端', trigger: 'change' }
          ]
        },
        loanModelList: []
      }
    },
    computed: {
      ...mapState({
        type: 'businessType',
        fundOrgName: state => state.user.orgName,
        collectionCardList: state => state.application.collectionCardList
      }),
      intentionFund: {
        get() {
          if (this.currentValue.intentionFund) {
            return this.fundOrgName
          }
          return '';
        }
      },
      loanModelFullList() {
        return this.$store.state.enums[`${this.$enum.LOAN_MODEL}.${this.$enum.LOAN_MODEL}`] || []
      },
      // repayModelFullList() {
      //   return this.$store.state.enums[`${this.$enum.REPAY_MODEL}.${this.$enum.REPAY_MODEL}`] || []
      // },
      loanIntRate: {
        get() {
          return this.getRate(this.currentValue, 'loanIntRate');
        },
        set(val) {
          this.setRate(this.currentValue, 'loanIntRate', val);
          this.setRate(this.currentValue, 'loanIntRateMin', val);
          this.setRate(this.currentValue, 'loanIntRateMax', val);
        }
      },
      // loanIntRateMin: {
      //   get() {
      //     return this.getRate(this.currentValue, 'loanIntRateMin');
      //   },
      //   set(val) {
      //     this.setRate(this.currentValue, 'loanIntRateMin', val);
      //   }
      // },
      // loanIntRateMax: {
      //   get() {
      //     return this.getRate(this.currentValue, 'loanIntRateMax');
      //   },
      //   set(val) {
      //     this.setRate(this.currentValue, 'loanIntRateMax', val);
      //   }
      // },
      cooperationRate: {
        get() {
          return this.getRate(this.currentValue, 'cooperationRate');
        },
        set(val) {
          this.setRate(this.currentValue, 'cooperationRate', val);
        }
      },
      repayIntRate: {
        get() {
          return this.getRate(this.currentValue, 'repayIntRate');
        },
        set(val) {
          this.setRate(this.currentValue, 'repayIntRate', val);
        }
      },
      remarks: {
        get() {
          if (this.currentValue.remarkList && this.currentValue.remarkList.length) {
            return this.currentValue.remarkList.map((_, i) => `${i + 1}. ${_.remarks}[${_.createdTime}]`).join('\n')
          } else {
            return ''
          }
        },
        set(val) {}
      },
      projectInfo: {
        get() {
          return {
            assetKind: this.currentValue.assetKind,
            projectType: this.currentValue.projectType,
            riskSwitch: this.currentValue.riskSwitch
          }
        },
        set(val) {
          this.$set(this.currentValue, 'assetKind', val ? val.assetKind : '');
          this.$set(this.currentValue, 'projectType', val ? val.projectType : '');
          this.$set(this.currentValue, 'riskSwitch', val ? val.riskSwitch : '');
        }
      },
      isDSModel: {
        get() {
          return [this.$enum.LOAN_MODEL_DS].includes(this.currentValue.loanModel)
        }
      },
      intentionFundRules: {
        get() {
          return this.isDSModel && this.mode !== 'VIEW' ? this.extraRules.intentionFund : undefined
        }
      },
      collectionAccount: {
        get() {
          return {
            collectionAccount: this.currentValue.collectionAccount,
            collectionAccountId: this.currentValue.collectionAccoutnId
          }
        },
        set(val) {
          if (val) {
            this.currentValue.collectionAccount = val.collectionAccount;
            this.currentValue.collectionAccountId = val.collectionAccountId;
          } else {
            this.currentValue.collectionAccount = '';
            this.currentValue.collectionAccountId = '';
          }
        }
      },
      fundProfitRateService: {
        get() {
          return this.getRate(this.currentValue, 'fundProfitRateService');
        },
        set(val) {
          this.setRate(this.currentValue, 'fundProfitRateService', val);
        }
      },
      penaltyRate: {
        get() {
          return this.getRate(this.currentValue, 'penaltyRate');
        },
        set(val) {
          this.setRate(this.currentValue, 'penaltyRate', val);
        }
      },
      penaltyManageRate: {
        get() {
          return this.getRate(this.currentValue, 'penaltyManageRate');
        },
        set(val) {
          this.setRate(this.currentValue, 'penaltyManageRate', val);
        }
      },
      badDebtRate: {
        get() {
          return this.getRate(this.currentValue, 'badDebtRate');
        },
        set(val) {
          this.setRate(this.currentValue, 'badDebtRate', val);
        }
      },
      badDebtManageRate: {
        get() {
          return this.getRate(this.currentValue, 'badDebtManageRate');
        },
        set(val) {
          this.setRate(this.currentValue, 'badDebtManageRate', val);
        }
      },
      defaultsRate: {
        get() {
          return this.getRate(this.currentValue, 'defaultsRate');
        },
        set(val) {
          this.setRate(this.currentValue, 'defaultsRate', val);
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          this.setCurrentValue(val);
        },
        deep: true
      },
      'currentValue.projectType'(val, oldVal) {
        if (val !== oldVal) {
          this.$store.commit('application/updateProjectType', val);
        }
      },
      'currentValue.intentionFund'(val, oldVal) {
        if (val !== oldVal) {
          this.$store.commit('application/updateIntentionFund', val)
        }
      },
      '$store.state.application.serviceFeeRate'(val, oldVal) {
        if (val !== oldVal) {
          this.$set(this.currentValue, 'fundProfitRateService', val);
        }
      },
      'currentValue.loanAmount'(val, oldVal) {
        if (this.isDSModel && (this.currentValue.collectionAmount !== '' && this.currentValue.collectionAmount !== null && this.currentValue.collectionAmount !== undefined)) {
          this.$nextTick(() => {
            this.$refs.form.validateField('collectionAmount');
          })
        }
      },
      isDSModel(val) {
        if (!val) {
          this.currentValue.collectionAmount = null;
        }
      }
    },

    mounted() {
      this.initPatternEnums();
    },
    destroyed() {
      this.$store.commit('application/reset')
    },

    methods: {
      save(callback) {
        let isValid = true;

        // 申请信息检验
        this.$refs.form.validate((valid) => {
          if (!valid) isValid = false;
        });

        // 银行卡信息
        this.$refs.card && this.$refs.card.save((valid) => {
          if (!valid) isValid = false;
        });

        // 保障方案信息
        this.$refs.protection && this.$refs.protection.validate(valid => {
          if (!valid) isValid = false;
        });

        if (isValid) {
          const val = Object.assign({}, this.$deepcopy(this.currentValue), this.$deepcopy(this.card));
          if (!this.isDSModel) {
            val.collectionAmount = null;
            val.collectionBankCard = '';
            val.collectionAccount = '';
            val.collectionAccountId = '';
          }
          if (this.$store.state.application.protectionPlanList.findIndex(_ => _.planId === val.planId) === -1) {
            val.planId = ''
          }
          val.loanApplicationRate = {
            assetProfitAmount: val.assetProfitAmount,
            assetProfitRateFirst: val.assetProfitRateFirst,
            assetProfitRateLast: val.assetProfitRateLast,
            assetProfitRateMiddle: val.assetProfitRateMiddle,
            atsProfitRateFirst: val.atsProfitRateFirst,
            atsProfitRateLast: val.atsProfitRateLast,
            atsProfitRateMiddle: val.atsProfitRateMiddle,
            badDebtManageRate: val.badDebtManageRate,
            badDebtRate: val.badDebtRate,
            defaultsRate: val.defaultsRate,
            fundProfitAmount: val.fundProfitAmount,
            fundProfitRateFirst: val.fundProfitRateFirst,
            fundProfitRateLast: val.fundProfitRateLast,
            fundProfitRateMiddle: val.fundProfitRateMiddle,
            fundProfitRateRisk: val.fundProfitRateRisk,
            fundProfitRateService: val.fundProfitRateService,
            fundProfitRiskAmount: val.fundProfitRiskAmount,
            penaltyManageRate: val.penaltyManageRate,
            penaltyRate: val.penaltyRate
          };
          this.$emit('input', val);
        }
        typeof callback === 'function' && callback(isValid);
      },
      setCurrentValue(val) {
        val = this.$deepcopy(val);
        delete val.remarks;
        this.currentValue = val;
        this.card = {
          loanCard: this.currentValue.loanCard,
          cardBank: this.currentValue.cardBank,
          loanMobile: this.currentValue.loanMobile,
          openBank: this.currentValue.openBank,
          bankProvince: this.currentValue.bankProvince,
          bankCity: this.currentValue.bankCity
        }
      },
      clearValidate() {
        this.$refs.form.clearValidate();
        this.$refs.card.clearValidate();
        this.$refs.protection.clearValidate();
      },
      validateField(prop) {
        this.$refs.form.validateField(prop)
      },
      handleLoanModelInput() {
        this.$nextTick(() => {
          this.$refs.form.clearValidate('intentionFund')
        })
      },

      getRate(obj, prop) {
        if (typeof obj[prop] === 'number') {
          return this.$floatMultiply(obj[prop], 100);
        }
        return '';
      },
      setRate(obj, prop, val) {
        if (val === '') {
          obj[prop] = null;
        } else {
          obj[prop] = this.$floatDivide(val, 100);
        }
      },

      /** 资产端修改或创建时，[借款模式、还款模式]的二级联动字段的初始化逻辑 **/
      initPatternEnums() {
        if (this.type) {
          if (this.type === this.$enum.BUSINESS_ASSET && this.mode !== 'VIEW') {
            getModelEnums().then(({data}) => {
              if (data.code === 200) {
                this.loanModelList = this.loanModelFullList.filter(_ => data.body.loanPatterns.includes(_.value));
                // this.repayModelList = this.repayModelFullList.filter(_ => data.body.repayPatterns.includes(_.value));
                if (!data.body.loanPatterns.includes(this.currentValue.loanModel)) {
                  this.currentValue.loanModel = '';
                }
                // if (!data.body.repayPatterns.includes(this.currentValue.repayModel)) {
                //   this.currentValue.repayModel = '';
                // }
              }
            })
          }
        } else {
          setTimeout(() => {
            this.initPatternEnums();
          }, 200)
        }
      }
    },
    components: {
      Card,
      Protection
    }
  }
</script>
