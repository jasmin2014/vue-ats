<!-- 收纳列表 -->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="申请日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind" placeholder="全部"
                        :clearable="true"
                        :kind="this.$enum.ASSET_TYPE"
                        :group="this.$enum.ASSET_TYPE">
            </ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="项目名称">
            <ats-select v-model="search.loanKind" placeholder="全部"
                        :clearable="true"
                        :kind="this.$enum.LOAN_TYPE"
                        :group="search.assetKind">
            </ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资产风险等级">
            <ats-select v-model="search.assetRiskLevel" placeholder="全部"
                        :clearable="true"
                        :kind="this.$enum.RISK_LEVEL"
                        :group="this.$enum.RISK_LEVEL_GROUP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <ats-select v-model="assetStatus" placeholder="全部"
                        :clearable="true"
                        :kind="this.$enum.LOAN_STATUS"
                        :group="this.$enum.LOAN_STATUS_GROUP"
                        :sequence="[5,6,7,9,10,12,13,14,15]">
            </ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams"
                      placeholder="姓名/协议编号/身份证"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" title="查找"
                       @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-row>
      <el-table :data="list" class='table-center' border>
        <el-table-column v-for="col in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width" :key="col.prop" align="center"></el-table-column>
        <el-table-column label="备注" fixed="right">
          <template slot-scope="scope">
            {{scope.row.remarks}}<br>
            <el-tooltip content="查看备注">
              <el-button size="mini" icon="fa fa-ellipsis-h"
                         @click="toShowBackup(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120px">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetStoredDetail'"
                        content="查看">
              <el-button size="mini" icon="fa fa-eye"
                         @click="goDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetStoredPush'"
                        v-if="canPush(scope.row)"
                        content="处理图片并推送">
              <el-button size="mini"
                         icon="fa fa-upload"
                         type="success"
                         @click="handlePush(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetStoredPlanEdit'"
                        v-if="canSetPlan(scope.row)"
                        content="设置还款计划">
              <el-button type="info" size="small" icon="fa fa-gear"
                         @click="goHandLoan(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetStoredSign'"
                        v-if="canSign(scope.row)"
                        content="签约放款">
              <el-button type="success" size="small" icon="fa fa-handshake-o"
                         @click="toSignedOnLoan(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="handlePageChange"></el-pagination>
    </el-row>
    <el-dialog title="签约放款" :visible.sync="signedOnLoanForm.showDialog" @close="signedOnLoanForm.showDialog = false">
      <el-row>
        <el-button type="success" @click="postPayment('ONLINE')">线上放款</el-button>
        <el-button type="primary" @click="handleOfflineLoan">线下放款</el-button>
      </el-row>
      <div slot="footer">
        <el-button @click="signedOnLoanForm.showDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="线下放款" :visible.sync="signedOnLoanForm.showOFFLINEDialog" @close="handleCancelLoan">
      <el-form :model="signedOnLoanForm">
        <el-row class="fullwidth">
          <el-form-item label="放款凭证">
            <ats-upload v-model="signedOnLoanForm.fileList" :limit="1" :text="'请上传放款凭证'" @success="uploadSuccess"
                        @remove="handleRemove"></ats-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="需放款金额(元)">
              <el-input v-model="signedOnLoanForm.amount" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="放款日期">
              <el-date-picker
                v-model="signedOnLoanForm.paymentDate"
                type="date"
                :picker-options="loanTermOptions"
                placeholder="选择日期" :value-format="'yyyy-MM-dd'">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="postPayment('OFFLINE')">确 定</el-button>
        <el-button @click="handleCancelLoan">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getAcceptList, getLoanRemark, postPayment} from '../../../api/assetMgt';

  export default {
    data() {
      return {
        pageTotal: 0,
        search: {
          assetKind: '',
          loanKind: '',
          assetRiskLevel: '',
          statusCount: this.$arrayToBinary([5, 6, 7, 9, 10, 12, 13, 14, 15]),
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          otherParams: '',
          pageNumber: 1,
          pageSize: 20
        },
        currentPage: 1,
        paymentVoucher: '',
        signedOnLoanForm: {
          showDialog: false,
          showOFFLINEDialog: false,
          fileList: [],
          amount: '',
          date: ''
        },
        list: [],
        loanTermOptions: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        table: [
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '协议编号',
            prop: 'contract'
          },
          {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          },
          {
            label: '客户姓名/企业名称',
            prop: 'loanPartyName'
          },
          {
            label: '信用评分',
            prop: 'creditScore'
          },
          {
            label: '资产风险等级',
            prop: 'assetRiskLevel',
            formatter: (row, col, val) => this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP)
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '项目名称',
            prop: 'loanKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind)
          },
          {
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '借款利率区间',
            prop: 'loanYearRateMin',
            formatter: (row, col, val) => !val && !row.loanYearRateMax ? '--' : `${this.$floatToPercentage(val) || ''} - ${this.$floatToPercentage(row.loanYearRateMax) || ''}`
          },
          {
            label: '期数',
            prop: 'repayTerms'
          },
          {
            label: '期数单位',
            prop: 'repayTimeType',
            formatter: (row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, val) => this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '募集期',
            prop: 'raiseFromDate',
            width: 100,
            formatter: (row, col, value) => (value || row.raiseThruDate) ? `${value.slice() || '?'} - ${row.raiseThruDate || '?'}` : '不限'
          },
          {
            label: '状态',
            prop: 'status',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_STATUS, this.$enum.LOAN_STATUS_GROUP)
          },
          {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          }
        ]
      };
    },
    created() {
      this.getAcceptList(1);
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.appliedStartTime || this.search.appliedEndTime) {
            const dateRange = [];
            dateRange[0] = this.search.appliedStartTime;
            dateRange[1] = this.search.appliedEndTime;
            return dateRange;
          } else {
            return null;
          }
        },
        set(range) {
          if (range) {
            this.search.appliedStartTime = range[0];
            this.search.appliedEndTime = range[1];
          } else {
            this.search.appliedStartTime = '';
            this.search.appliedEndTime = '';
          }
        }
      },
      assetStatusList: {
        get() {
          return this.$binaryToArray(this.search.statusCount || 0)
        },
        set(val) {
          this.search.statusCount = this.$arrayToBinary(val)
        }
      },
      assetStatus: {
        get() {
          if (this.assetStatusList && this.assetStatusList.length === 1) {
            return this.$enum.LOAN_STATUS_LIST[this.assetStatusList[0]]
          } else {
            return ''
          }
        },
        set(val) {
          if (val) {
            this.assetStatusList = [this.$enum.LOAN_STATUS_LIST.indexOf(val)]
          } else {
            this.assetStatusList = [5, 6, 7, 9, 10, 12, 13, 14, 15]
          }
        }
      }
    },
    methods: {
      canSetPlan(row) {
        const finance = 1; // this.$getLocalStorage('user').finance;
        return ['NO_SET_REPAYMENT'].includes(row.status) && finance !== 1;
      },
      canSign(row) {
        const finance = 1; // this.$getLocalStorage('user').finance;
        return ['WAIT_LEND', 'LOAN_FAIL', 'WAIT_FEEDBACK', 'FEEDBACK'].includes(row.status) && finance !== 1;
      },
      canPush(row) {
        return [this.$enum.LOAN_STATUS_FEEDBACK, this.$enum.LOAN_STATUS_NO_SET_REPAYMENT].includes(row.status);
      },
      uploadSuccess(val) {
        this.signedOnLoanForm.fileList.push({
          url: val.key,
          name: val.name
        });
        this.paymentVoucher = val.key;
      },
      handlePageChange(val) {
        this.currentPage = val;
        this.getAcceptList(val);
      },
      handleOfflineLoan() {
        this.signedOnLoanForm.showOFFLINEDialog = true;
        this.signedOnLoanForm.showDialog = false;
      },
      handleCancelLoan() {
        this.signedOnLoanForm.showOFFLINEDialog = false;
        this.$set(this.signedOnLoanForm, 'fileList', []);
        this.signedOnLoanForm.paymentDate = '';
      },
      handleRemove() {
        this.$set(this.signedOnLoanForm, 'fileList', []);
        this.paymentVoucher = '';
      },
      postPayment(payMethod) {
        let _params = {};

        if (payMethod === 'OFFLINE') {
          _params = {
            loanApplication: this.signedOnLoanForm.loanId,
            payMethod: 'OFFLINE',
            paymentVoucher: this.paymentVoucher,
            paymentDate: this.signedOnLoanForm.paymentDate
          };
          postPayment(_params).then(response => {
            if (response.data.code === 201) {
              this.$message({
                message: '签约放款成功',
                type: 'success'
              });
              setTimeout(() => {
                this.getAcceptList(this.currentPage);
                this.signedOnLoanForm.showOFFLINEDialog = false;
                this.$set(this.signedOnLoanForm, 'fileList', []);
                this.signedOnLoanForm.paymentDate = '';
              }, 1000);
            }
          }, response => {
          })
        } else if (payMethod === 'ONLINE') {
          _params = {
            loanApplication: this.signedOnLoanForm.loanId,
            payMethod: 'ONLINE'
          };
          postPayment(_params).then(response => {
            if (response.data.code === 201) {
              this.$message({
                message: '签约放款成功',
                type: 'success'
              });
              setTimeout(() => {
                this.getAcceptList(this.currentPage);
                this.signedOnLoanForm.showDialog = false;
              }, 1000);
            }
          }, response => {
          })
        }
      },
      getAcceptList(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getAcceptList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.pageTotal = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.list = [];
          this.pageTotal = 0;
        })
      },
      statusFormat(row, col, val) {
        return this.$filter(val, this.$enum.LOAN_STATUS, this.$enum.LOAN_STATUS_GROUP)
      },
      handleSearch() {
        this.getAcceptList(1);
      },
      goDetail(row) {
        this.$router.push({
          name: 'AssetStoredDetail',
          params: { id: row.id }
        });
      },
      handlePush(row) {
        this.$router.push({
          name: 'AssetStoredPush',
          params: { id: row.id }
        });
      },
      goHandLoan(row) {
        this.$router.push({
          name: 'AssetStoredPlanEdit',
          params: { id: row.id }
        })
      },
      toSignedOnLoan(row) {
        this.signedOnLoanForm.showDialog = true;
        this.signedOnLoanForm.amount = row.loanAmount;
        this.signedOnLoanForm.loanId = row.id;
      },
      toShowBackup(row) {
        getLoanRemark(row.id).then(({ data }) => {
          if (data.code === 200) {
            const note = data.body.map((_, i) => `${i + 1}. ${_.remarks}[${_.createdTime}]`).join('\n');
            const h = this.$createElement;
            const message = note.length ? h('div', null, note.split('\n').map(_ => h('p', null, _))) : '无';
            this.$msgbox({
              title: '备注',
              message
            }).catch(() => {
            })
          }
        }, (response) => {
        })
      }
    }
  };
</script>
