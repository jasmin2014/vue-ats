<template>
  <div class="apply">
    <el-form ref="form"
             :model="currentValue"
             :rules="mode === 'VIEW' ? {} : rules"
             class="apply"
             label-width="150px">
      <div class="info" v-if="!isUpload">
        <h4>
          <span>客户信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="labelName">
              <ats-input v-model="currentValue.loanPartyName"
                         :disabled="true"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="labelIdent">
              <ats-input v-model="currentValue.loanIdent"
                         :disabled="true"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="card" v-if="!isUpload">
        <h4>
          <span>放款银行卡<i class="required"></i></span>
        </h4>
        <el-table :data="currentValue.cardList"
                  border>
          <el-table-column label="序号" type="index" align="center"></el-table-column>
          <el-table-column label="银行卡号" prop="bankCard" align="center"></el-table-column>
          <el-table-column label="所属银行" prop="bankName" align="center"></el-table-column>
          <el-table-column label="开户行" prop="issuingBank" align="center"></el-table-column>
          <el-table-column v-if="currentValue.loanPartyKind === $enum.SUBJECT_PROP_PERSON"
                           label="银行手机号码" prop="reservedMobile" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.inUse">使用中</span>
              <el-button v-else-if="mode !== 'VIEW'"
                         @click="handleUseCard(scope.row)"
                         type="success" icon="fa fa-check-square" size="small">&nbsp;使用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="loan">
        <h4>
          <span>借款信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="借贷编号">
              <ats-input v-model="currentValue.loanApplicationNo" :mode="mode" :disabled="true"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="协议编号" prop="contract" :error="error.contract">
              <ats-input v-model.trim="currentValue.contract" :mode="mode === 'CREATE' || isUpload ? mode : 'VIEW'"></ats-input>
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
            <el-form-item label="借贷属性" prop="kind" :error="error.kind">
              <ats-select v-if="type !== this.$enum.BUSINESS_ASSET || mode === 'VIEW'"
                          v-model="currentValue.kind" :mode="mode" disabled
                          :kind="this.$enum.LOAN_PROP" :group="this.$enum.LOAN_PROP"></ats-select>
              <ats-select v-else
                          v-model="currentValue.kind" :mode="mode" disabled
                          :kind="this.$enum.LOAN_PROP" :group="this.$enum.LOAN_PROP"
                          @change="handleLoanAttributeChange"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产类型" prop="assetKind" :error="error.assetKind">
              <ats-select v-if="type !== this.$enum.BUSINESS_ASSET || mode === 'VIEW'"
                          v-model="currentValue.assetKind" :mode="mode"
                          :kind="this.$enum.ASSET_TYPE" :group="this.$enum.ASSET_TYPE"></ats-select>
              <ats-select v-else
                          v-model="currentValue.assetKind" :mode="mode" :options="assetKindList" clearable
                          @change="handleAssetKindChange"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="loanKind" :error="error.loanKind">
              <ats-select v-if="type !== this.$enum.BUSINESS_ASSET || mode === 'VIEW'"
                          v-model="currentValue.loanKind" :mode="mode"
                          :kind="this.$enum.LOAN_TYPE" :group="currentValue.assetKind"></ats-select>
              <ats-select v-else
                          v-model="currentValue.loanKind" :mode="mode" :options="loanKindList" clearable
                          @change="handleLoanKindChange"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="还款方式" prop="repayWay" :error="error.repayWay">
              <ats-select v-if="type !== this.$enum.BUSINESS_ASSET || mode === 'VIEW'"
                          v-model="currentValue.repayWay" :mode="mode"
                          :kind="this.$enum.REPAY_WAY" :group="this.$enum.REPAY_WAY"></ats-select>
              <ats-select v-else
                          v-model="currentValue.repayWay" :mode="mode" :options="repayWayList" clearable></ats-select>
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
          <el-col :span="8">
            <el-form-item label="意向资金端" prop="intentionFund" :error="error.intentionFund">
              <ats-input v-if="type === $enum.BUSINESS_FUND"
                         v-model="fundOrgName" :mode="mode"></ats-input>
              <ats-select v-else
                          v-model="currentValue.intentionFund" placeholder="无"
                          :org="this.$enum.BUSINESS_FUND"
                          :mode="mode" clearable></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="放款模式" prop="loanModel" :error="error.loanModel">
              <ats-select v-if="type !== this.$enum.BUSINESS_ASSET || mode === 'VIEW'"
                          v-model="currentValue.loanModel" :mode="mode" clearable
                          :disabled-options="[$enum.LOAN_MODEL_CG, $enum.LOAN_MODEL_HG, $enum.LOAN_MODEL_CM]"
                          :kind="this.$enum.LOAN_MODEL" :group="this.$enum.LOAN_MODEL"></ats-select>
              <ats-select v-else
                          v-model="currentValue.loanModel" :mode="mode"
                          :disabled-options="[$enum.LOAN_MODEL_CG, $enum.LOAN_MODEL_HG, $enum.LOAN_MODEL_CM]"
                          :options="loanModelList"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="还款模式" prop="repayModel" :error="error.repayModel">
              <ats-select v-if="type !== this.$enum.BUSINESS_ASSET || mode === 'VIEW'"
                          v-model="currentValue.repayModel" :mode="mode" clearable
                          :kind="this.$enum.REPAY_MODEL" :group="this.$enum.REPAY_MODEL"></ats-select>
              <ats-select v-else
                          v-model="currentValue.repayModel" :mode="mode"
                          :options="repayModelList"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注信息">
              <ats-input v-if="mode !== 'CREATE'"
                         v-model="remarks" mode="VIEW" :type="'textarea'" :rows="2"></ats-input>
              <ats-input v-model.trim="currentValue.addNote"
                         :mode="mode"
                         v-if="mode !== 'VIEW'"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form class="protection"
               v-if="mode !== 'CREATE'"
               :model="newProtection"
               ref="protectionForm"
               :rules="protectionRules"
               size="small">
        <el-row type="flex" justify="space-between" align="middle">
          <h4>
            <span>保障方案</span>
          </h4>
          <el-button size="small" type="primary" icon="fa fa-plus" title="新增保障方案"
                     v-if="mode !== 'VIEW'"
                     @click="handleCreateProtection()"></el-button>
        </el-row>
        <el-row>
          <el-table :data="currentValue.protectionList" border>
            <el-table-column label="序号" type="index" align="center"></el-table-column>
            <el-table-column label="保障方式" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$create || scope.row.$edit"
                              prop="model">
                  <ats-select v-model="newProtection.model"></ats-select>
                </el-form-item>
                <span v-else>{{ scope.row.model }}</span>
              </template>
            </el-table-column>
            <el-table-column label="保障机制" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$create || scope.row.$edit"
                              prop="mechanism">
                  <ats-select v-model="newProtection.mechanism"></ats-select>
                </el-form-item>
                <span v-else>{{ scope.row.mechanism }}</span>
              </template>
            </el-table-column>
            <el-table-column label="保障合同" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              :error="fileError"
                              prop="fileId">
                  <el-button size="small" type="success"
                             @click="handleUploadFiles('EDIT', scope.row)">上传合同文件</el-button>
                </el-form-item>
                <el-button v-else
                           size="small"
                           @click="handleUploadFiles('VIEW', scope.row)">查看合同文件</el-button>
              </template>
            </el-table-column>
            <el-table-column v-if="mode !== 'VIEW'"
                             label="操作" align="center" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditProtection(scope.row)"></el-button>
                  <el-button title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteProtection(scope.row)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveProtection(scope.row)">保存</el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelProtection(scope.row)">取消</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <div class="creditor">
        <h4>
          <span>债权信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="债权人">
              <ats-select v-model="currentValue.creditor" :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="债权开始日">
              <ats-date-picker v-model="currentValue.creditorStartTime"
                               value-format="yyyy-MM-dd"
                               :mode="mode"></ats-date-picker>
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
          <el-col :span="11">
            <el-form-item label="借款利率区间" prop="loanIntRateMin" :error="error.loanIntRateMin || error.loanIntRateMax">
              <el-col :span="11">
                <ats-input v-model="loanIntRateMin" :mode="mode"
                           type="number" unit="%"
                           :min="0" :max="100" :step="0.01"></ats-input>
              </el-col>
              <el-col :span="2" style="text-align: center;">
                <span>-</span>
              </el-col>
              <el-col :span="11">
                <ats-input v-model="loanIntRateMax" :mode="mode"
                           type="number" unit="%"
                           :min="0" :max="100" :step="0.01"></ats-input>
              </el-col>
            </el-form-item>
          </el-col>
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
                  v-if="type !== this.$enum.BUSINESS_ASSET
                        || currentValue.status === $enum.LOAN_STATUS_CLEARED
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
                  v-if="type !== this.$enum.BUSINESS_ASSET
                        || currentValue.status === $enum.LOAN_STATUS_CLEARED
                        || currentValue.status === $enum.LOAN_STATUS_APPLY_ADVANCE
                        || currentValue.status === $enum.LOAN_STATUS_LOANED">
            <el-form-item label="起息日">
              <ats-date-picker v-model="currentValue.paymentDate"
                               value-format="yyyy-MM-dd"
                               :mode="mode"></ats-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="raise">
        <h4>
          <span>募集需求</span>
        </h4>
        <el-row>
          <el-col :span="10">
            <el-form-item label="募集期">
              <ats-date-picker v-model="loanTerm" :mode="mode === 'EDIT' ? 'VIEW' : mode"
                               :picker-options="loanTermOptions"
                               :type="'daterange'"></ats-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="log">
        <h4>
          <span>创建信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="创建渠道">
              <ats-input v-model="currentValue.assetChannel" :disabled="true"></ats-input>
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
                          :region="'86'" clearable></ats-select>
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
          <el-col :span="8">
            <el-form-item label="保存状态">
              <ats-input v-model="currentValue.saveStatus" :disabled="true"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款状态">
              <ats-select v-model="value.status" disabled
                          :kind="this.$enum.LOAN_STATUS"
                          :group="this.$enum.LOAN_STATUS_GROUP"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="mode !== 'VIEW' && !isUpload"
              type="flex" justify="center">
        <el-button type="primary" @click="handleSave(true)">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-row>
    </el-form>
    <ats-upload-dialog :visible.sync="showUploadDialog"
                       v-model="newProtection.files"
                       :mode="uploadMode"
                       @upload="handleUploadDialogUpload"
                       @remove="handleUploadDialogRemove"
                       @close="handleUploadDialogClose"
                       @cancel="handleUploadDialogCancel"
                       @confirm="handleUploadDialogConfirm"></ats-upload-dialog>
  </div>
</template>

<script>
  import {getEnumsByLoanAttr, getModelEnums} from '../../assets/api/asset';
  import {getSysEnum} from '../../api/enum';

  export default {
    props: {
      value: Object,
      mode: String,
      type: String,
      isUpload: Boolean,
      error: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        fundOrgName: '',
        currentValue: Object.assign({
          id: '',
          loanParty: '',
          loanPartyKind: '',
          loanPartyName: '',
          loanIdent: '',
          cardList: [],
          loanApplicationNo: '',
          contract: '',
          loanAmount: null,
          kind: '',
          assetKind: '',
          loanKind: '',
          repayTerms: null,
          repayTime: null,
          repayTimeType: '',
          repayWay: '',
          usageLoan: '',
          payment: '',
          remarkList: [],
          addNote: '',
          loanModel: '',
          repayModel: '',
          intentionFund: '',
          protectionList: [],
          creditor: '',
          creditorStartTime: '',
          loanIntRate: null,
          loanIntRateMin: null,
          loanIntRateMax: null,
          cooperationRate: null,
          repayIntRate: null,
          repayRateType: '',
          raiseFromDate: '',
          raiseThruDate: '',
          assetChannel: '',
          creatorName: '',
          createdTime: '',
          appliedTime: '',
          creatorProvince: '',
          creatorCity: '',
          creatorBusiness: ''
        }, this.value),
        newProtection: {},
        isProtectionEditing: false,
        showUploadDialog: false,
        uploadMode: '',
        fileError: '',
        assetKindList: [],
        loanKindList: [],
        repayWayList: [],
        loanModelList: [],
        repayModelList: [],
        assetKindFullList: [],
        loanKindFullList: [],
        repayWayFullList: [],
        loanModelFullList: [],
        repayModelFullList: [],
        rules: {
          contract: [
            { required: true, message: '请输入协议编号', trigger: 'blur' },
            { min: 0, max: 50, message: '50字以内', trigger: 'blur'}
          ],
          loanAmount: [
            { required: true, message: '请输入借款金额', trigger: 'blur', type: 'number' },
            { min: 0, max: Number.MAX_SAFE_INTEGER, message: '范围0-' + Number.MAX_SAFE_INTEGER, trigger: 'blur', type: 'number' },
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
          assetKind: [
            { required: true, message: '请选择资产类型', trigger: 'change' }
          ],
          loanKind: [
            { required: true, message: '请选择项目名称', trigger: 'change' }
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
                  if (this.currentValue.repayTime <= 0 || this.currentValue.repayTime > 30) {
                    callback('天数范围为1-30天')
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
          repayModel: [
            { required: true, message: '请选择还款模式', trigger: 'change' }
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
          loanIntRateMin: [
            { required: true, message: '请输入借款利率区间', trigger: 'blur', type: 'number' },
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
            },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, v, callback) => {
                const value = this.currentValue.loanIntRateMax;
                if (typeof value !== 'number' && !value) {
                  callback('请输入借款利率区间')
                } else if (value < 0 || value > 1) {
                  callback('利率范围为0-100%')
                } else if (!this.$valid.floatValidator(value, 4)) {
                  callback('保留2位小数')
                } else if (this.currentValue.loanIntRateMin > this.currentValue.loanIntRateMax) {
                  callback('区间左值应小于或等于右值')
                } else {
                  callback();
                }
              }
            }
          ],
          cooperationRate: [
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (typeof value === 'number') {
                  if (value < 0 || value > 1) {
                    callback('利率范围为0-100%')
                  } else if (!this.$valid.floatValidator(value, 4)) {
                    callback('保留2位小数')
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              }
            }
          ],
          repayIntRate: [
            { required: true, message: '请输入借款利率', trigger: 'blur', type: 'number' },
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
          creatorBusiness: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ]
        },
        protectionRules: {
          model: [
            { required: true, message: '请选择保障方式', trigger: 'change' }
          ],
          mechanism: [
            { required: true, message: '请输入保障机制', trigger: 'blur' }
          ],
          fileId: [
            { required: true, message: '请上传保障合同文件', trigger: 'change' }
          ]
        },
        loanTermOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        }
      }
    },
    computed: {
      labelName() {
        return this.value.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE ? '企业名称' : '客户姓名'
      },
      labelIdent() {
        return this.value.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE ? '统一社会信用代码' : '证件号码'
      },
      loanIntRate: {
        get() {
          if (typeof this.currentValue.loanIntRate === 'number') {
            return this.$floatMultiply(this.currentValue.loanIntRate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.loanIntRate = null;
          } else {
            this.currentValue.loanIntRate = this.$floatDivide(val, 100);
          }
        }
      },
      loanIntRateMin: {
        get() {
          if (typeof this.currentValue.loanIntRateMin === 'number') {
            return this.$floatMultiply(this.currentValue.loanIntRateMin, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.loanIntRateMin = null;
          } else {
            this.currentValue.loanIntRateMin = this.$floatDivide(val, 100);
          }
        }
      },
      loanIntRateMax: {
        get() {
          if (typeof this.currentValue.loanIntRateMax === 'number') {
            return this.$floatMultiply(this.currentValue.loanIntRateMax, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.loanIntRateMax = null;
          } else {
            this.currentValue.loanIntRateMax = this.$floatDivide(val, 100);
          }
        }
      },
      cooperationRate: {
        get() {
          if (typeof this.currentValue.cooperationRate === 'number') {
            return this.$floatMultiply(this.currentValue.cooperationRate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.cooperationRate = null;
          } else {
            this.currentValue.cooperationRate = this.$floatDivide(val, 100);
          }
        }
      },
      repayIntRate: {
        get() {
          if (typeof this.currentValue.repayIntRate === 'number') {
            return this.$floatMultiply(this.currentValue.repayIntRate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.repayIntRate = null;
          } else {
            this.currentValue.repayIntRate = this.$floatDivide(val, 100);
          }
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
      loanTerm: {
        get() {
          if (this.currentValue.raiseFromDate && this.currentValue.raiseThruDate) {
            const dateRange = [];
            dateRange[0] = this.currentValue.raiseFromDate;
            dateRange[1] = this.currentValue.raiseThruDate;
            return dateRange
          }
        },
        set(val) {
          if (val) {
            this.currentValue.raiseFromDate = val[0];
            this.currentValue.raiseThruDate = val[1];
          } else {
            this.currentValue.raiseFromDate = '';
            this.currentValue.raiseThruDate = '';
          }
        }
      }
    },
    watch: {
      value: {
        handler(val, oldVal) {
          this.setCurrentValue(this.$deepcopy(val));
        },
        deep: true
      }
    },
    created() {
      /** 资金端查看时，资金意向端直接显示当前用户的机构名 **/
      if (this.type === this.$enum.BUSINESS_FUND) {
        if (this.$getLocalStorage('user')) {
          this.fundOrgName = this.$getLocalStorage('user').companyName;
        }
      }
      /** 资产端修改或创建时，[借贷属性、资产类型、项目名称（原借贷类型）、还款方式]的四级联动字段的初始化逻辑 **/
      if (this.type === this.$enum.BUSINESS_ASSET && this.mode !== 'VIEW') {
        if (this.$store.state.enums[`${this.$enum.ASSET_TYPE}.${this.$enum.ASSET_TYPE}`]) {
          this.assetKindFullList = this.$store.state.enums[`${this.$enum.ASSET_TYPE}.${this.$enum.ASSET_TYPE}`];
        } else {
          getSysEnum(this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE).then(({data}) => {
            this.assetKindFullList = data.body.map(_ => ({
              text: _.displayName,
              value: _.enumKey
            }));
          });
        }
        getSysEnum(this.$enum.LOAN_TYPE).then((res2) => {
          this.loanKindFullList = res2.data.body.map(_ => ({
            text: _.displayName,
            value: _.enumKey
          }));
        });
        if (this.$store.state.enums[`${this.$enum.REPAY_WAY}.${this.$enum.REPAY_WAY}`]) {
          this.repayWayFullList = this.$store.state.enums[`${this.$enum.REPAY_WAY}.${this.$enum.REPAY_WAY}`];
        } else {
          getSysEnum(this.$enum.REPAY_WAY, this.$enum.REPAY_WAY).then(({data}) => {
            this.repayWayFullList = data.body.map(_ => ({
              text: _.displayName,
              value: _.enumKey
            }));
          })
        }
        if (this.$store.state.enums[`${this.$enum.LOAN_MODEL}.${this.$enum.LOAN_MODEL}`]) {
          this.loanModelFullList = this.$store.state.enums[`${this.$enum.LOAN_MODEL}.${this.$enum.LOAN_MODEL}`];
        } else {
          getSysEnum(this.$enum.LOAN_MODEL, this.$enum.LOAN_MODEL).then(({data}) => {
            this.loanModelFullList = data.body.map(_ => ({
              text: _.displayName,
              value: _.enumKey
            }));
          });
        }
        if (this.$store.state.enums[`${this.$enum.REPAY_MODEL}.${this.$enum.REPAY_MODEL}`]) {
          this.repayModelFullList = this.$store.state.enums[`${this.$enum.REPAY_MODEL}.${this.$enum.REPAY_MODEL}`];
        } else {
          getSysEnum(this.$enum.REPAY_MODEL, this.$enum.REPAY_MODEL).then(({data}) => {
            this.repayModelFullList = data.body.map(_ => ({
              text: _.displayName,
              value: _.enumKey
            }));
          });
        }
      }
    },
    mounted() {
      /** 资产端修改或创建时，[借款模式、还款模式]的二级联动字段的初始化逻辑 **/
      if (this.type === this.$enum.BUSINESS_ASSET && this.mode !== 'VIEW') {
        getModelEnums().then(({data}) => {
          if (data.code === 200) {
            this.loanModelList = this.loanModelFullList.filter(_ => data.body.loanModels.includes(_.value));
            this.repayModelList = this.repayModelFullList.filter(_ => data.body.repayModels.includes(_.value));
            if (!data.body.loanModels.includes(this.currentValue.loanModel)) {
              this.currentValue.loanModel = '';
            }
            if (!data.body.repayModels.includes(this.currentValue.repayModel)) {
              this.currentValue.repayModel = '';
            }
          }
        })
      }
    },
    methods: {
      save() {
        this.handleSave();
      },
      handleSave(isBack) {
        if (this.isProtectionEditing) {
          this.$alert('请先选择客户', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return;
        }
        if (this.isProtectionEditing) {
          this.$alert('请先保存保障方案信息', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return;
        }
        if (this.isUpload || this.validate(this.currentValue)) {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$emit('save', {
                id: this.currentValue.id,
                partyId: this.currentValue.loanParty,
                loanPartyKind: this.currentValue.loanPartyKind,
                contract: this.currentValue.contract,
                loanAmount: this.currentValue.loanAmount,
                kind: this.currentValue.kind,
                assetKind: this.currentValue.assetKind,
                loanKind: this.currentValue.loanKind,
                loanTerms: this.currentValue.repayTerms,
                loanTimeType: this.currentValue.repayTimeType,
                loanTime: this.currentValue.repayTimeType === this.$enum.TERM_UNIT_NATURAL_MONTH ? 1 : this.currentValue.repayTime,
                repayWay: this.currentValue.repayWay,
                usageLoan: this.currentValue.usageLoan,
                payment: this.currentValue.payment,
                remarks: this.currentValue.addNote,
                loanModel: this.currentValue.loanModel,
                repayModel: this.currentValue.repayModel,
                intentionFund: this.currentValue.intentionFund,
                creditor: this.currentValue.creditor,
                creditorStartTime: this.currentValue.creditorStartTime,
                loanIntRate: this.currentValue.loanIntRate,
                loanIntRateMin: this.currentValue.loanIntRateMin,
                loanIntRateMax: this.currentValue.loanIntRateMax,
                cooperationRate: this.currentValue.cooperationRate,
                repayIntRate: this.currentValue.repayIntRate,
                repayRateType: this.currentValue.repayRateType,
                raiseFromDate: this.currentValue.raiseFromDate,
                raiseThruDate: this.currentValue.raiseThruDate,
                creatorProvince: this.currentValue.creatorProvince,
                creatorCity: this.currentValue.creatorCity,
                creatorBusiness: this.currentValue.creatorBusiness,
                cardBank: this.currentValue.cardBank,
                loanCard: this.currentValue.loanCard,
                loanMobile: this.currentValue.loanMobile,
                openBank: this.currentValue.openBank
              }, isBack)
            } else {
              this.$emit('error');
              this.$message.error('请检查保存信息');
              return false;
            }
          })
        }
      },
      validate(val) {
        if (!val.cardBank || !val.loanCard) {
          this.$message.error('请「使用」一张银行卡作为放款银行卡');
          return false;
        }
        return true;
      },
      handleCancel() {
        this.$router.go(-1)
      },
      handleUseCard(row) {
        this.setCurrentCard(row);
        if (this.mode === 'EDIT') {
          this.handleSave(false);
        }
      },
      handleCreateProtection() {
        if (this.isProtectionEditing) {
          this.$alert('请先保存其他保障方案信息', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return;
        }
        this.isProtectionEditing = true;
        this.newProtection = {};
        this.$set(this.newProtection, 'files', []);
        this.fileError = '';
        this.currentValue.protectionList.push({
          $create: true
        });
      },
      handleEditProtection(row) {
        if (this.isProtectionEditing) {
          this.$alert('请先保存其他保障方案信息', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return;
        }
        this.newProtection = this.$deepcopy(row);
        this.$set(this.newProtection, 'files', []);
        this.isProtectionEditing = true;
        this.$set(row, '$edit', true);
      },
      handleDeleteProtection(row) {
        this.$emit('delete-protection', row.id)
      },
      handleSaveProtection(row) {
        this.$refs['protectionForm'].validate((valid) => {
          if (valid) {
            this.isProtectionEditing = false;
            this.$emit('save-protection', {
              id: this.newProtection.id,
              model: this.newProtection.model,
              mechanism: this.newProtection.mechanism,
              fileId: this.newProtection.fileId
            })
          } else {
            return false;
          }
        });
      },
      handleCancelProtection(row) {
        if (row.$create) {
          this.currentValue.protectionList.pop();
        }
        delete row.$edit;
        delete row.$create;
        this.isProtectionEditing = false;
        this.newProtection = {};
        this.$set(this.newProtection, 'files', []);
        this.fileError = '';
      },
      handleUploadFiles(mode, row) {
        this.showUploadDialog = true;
        this.$nextTick(() => {
          if (mode === 'EDIT') {
            this.$set(this.newProtection, 'files', (this.newProtection.fileId ? this.newProtection.fileId.split(',').map(_ => ({
              name: '',
              url: _
            })) : []));
          } else {
            this.$set(this.newProtection, 'files', (row.fileId ? row.fileId.split(',').map(_ => ({
              name: '',
              url: _
            })) : []));
          }
          this.uploadMode = mode;
        })
      },
      handleUploadDialogUpload(file) {
        this.newProtection.files = this.newProtection.files.concat({
          url: file.key,
          name: ''
        })
      },
      handleUploadDialogRemove(file, fileList) {
        this.newProtection.files = fileList
      },
      handleUploadDialogClose() {
        this.fileError = this.newProtection.fileId ? undefined : '请上传附件';
        this.$set(this.newProtection, 'files', []);
      },
      handleUploadDialogCancel() {
        this.showUploadDialog = false;
      },
      handleUploadDialogConfirm(files) {
        this.newProtection.fileId = this.$deepcopy(files).map(_ => _.url).join(',');
        this.showUploadDialog = false;
      },
      setCurrentValue(val) {
        this.currentValue = Object.assign(this.currentValue, val);
        if (val.loanCard && val.cardList && val.cardList.length) {
          const index = val.cardList.findIndex(_ => _.bankCard === val.loanCard);
          if (index >= 0) {
            this.setCurrentCard(this.currentValue.cardList[index])
          }
        }
      },
      setCurrentCard(row) {
        if (row && typeof row === 'object') {
          this.currentValue.cardList.forEach(_ => this.$set(_, 'inUse', false));
          this.$set(row, 'inUse', true);
          this.currentValue.cardBank = row.bankName;
          this.currentValue.loanCard = row.bankCard;
          this.currentValue.loanMobile = row.reservedMobile;
          this.currentValue.openBank = row.issuingBank;
        }
      },
      handleLoanAttributeChange(val) {
        this.getEnumsByLoanAttribute(val).then(({data}) => {
          if (data.code === 200) {
            this.assetKindList = this.assetKindFullList.filter(_ => data.body.assetKinds.includes(_.value));
            if (!data.body.assetKinds.includes(this.currentValue.assetKind)) {
              this.currentValue.assetKind = '';
            }
          }
        })
      },
      handleAssetKindChange(val) {
        this.getEnumsByLoanAttribute(this.currentValue.kind, val).then(({data}) => {
          if (data.code === 200) {
            this.loanKindList = this.loanKindFullList.filter(_ => data.body.loanKinds.includes(_.value));
            if (!data.body.loanKinds.includes(this.currentValue.loanKind)) {
              this.currentValue.loanKind = '';
            }
          }
        })
      },
      handleLoanKindChange(val) {
        this.getEnumsByLoanAttribute(this.currentValue.kind, this.currentValue.assetKind, val).then(({data}) => {
          if (data.code === 200) {
            this.repayWayList = this.repayWayFullList.filter(_ => data.body.repayWays.includes(_.value));
            if (!data.body.repayWays.includes(this.currentValue.repayWay)) {
              this.currentValue.repayWay = '';
            }
          }
        })
      },
      getEnumsByLoanAttribute(kind, assetKind, loanKind) {
        if (this.type !== this.$enum.BUSINESS_ASSET) return;
        return getEnumsByLoanAttr(kind, assetKind, loanKind)
      }
    }
  }
</script>
