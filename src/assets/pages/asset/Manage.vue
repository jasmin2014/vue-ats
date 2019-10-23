<!--履约资产信息-->
<template>
  <div class="asset-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="8">
          <el-form-item label="时间">
            <el-row>
              <el-col :span="8">
                <ats-select v-model="searchDateType"
                            :kind="this.$enum.SEARCH_DATE_TYPE"
                            :group="this.$enum.SEARCH_DATE_TYPE"></ats-select>
              </el-col>
              <el-col :span="16">
                <ats-date-picker-query v-model="searchDate"></ats-date-picker-query>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind" placeholder="全部" :clearable="true"
                        :kind="this.$enum.ASSET_TYPE" :group="this.$enum.ASSET_TYPE"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="业务类型">
            <ats-select v-model="search.projectType" placeholder="全部" :clearable="true"
                        :kind="this.$enum.PROJECT_TYPE" :group="this.$enum.PROJECT_TYPE"></ats-select>
          </el-form-item>
        </el-col>
        <!--<el-col :span="5">-->
          <!--<el-form-item label="项目名称">-->
            <!--<ats-select v-model="search.projectName" placeholder="全部" :clearable="true"-->
                        <!--:kind="this.$enum.LOAN_TYPE" :group="search.assetKind"></ats-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="5">
          <el-form-item label="状态">
            <ats-select v-model="assetStatus" placeholder="全部" :clearable="true"
                        :kind="this.$enum.LOAN_STATUS" :group="this.$enum.LOAN_STATUS_GROUP"
                        :sequence="statusSequence"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams" placeholder="借款编号/客户姓名/企业名称"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="协议编号">
            <el-input v-model="contracts" placeholder="协议编号（换行）"
                      :rows="1"
                      type="textarea"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" title="查找"
                       @click="handleSearch"></el-button>
            <el-button v-action="'AssetFinishDownload'"
                       type="warning" icon="fa fa-download" title="导出数据到Excel"
                       @click="handleDownload"></el-button>
            <stat-loan-amount v-action="'AssetFinishStat'"
                              :list="list.map(_ => _.loanAmount)"
                              :search="oldSearch"
                              :get-total="getTotal"
                              style="margin-left: 8px;"></stat-loan-amount>
            <el-button type="success"
                       style="margin-left: 8px;"
                       v-if="$store.state.user.earlySwitch === 1"
                       @click="handleBatchSettle">批量提前结清</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border @selection-change="handleTableSelectionChange">
        <el-table-column v-for="(col, index) in table"
                         v-bind="col"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="状态" align="center" fixed="right" width="100">
          <template slot-scope="scope">
            <el-tag :type="$enum.LOAN_STATUS_COLOR_MAP[scope.row.status]">
              {{ $filter(scope.row.status, $enum.LOAN_STATUS, $enum.LOAN_STATUS_GROUP) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" fixed="right">
          <template slot-scope="scope">
            {{ scope.row.remarks ? scope.row.remarks.split(':')[0] : '' }}<br>
            <el-tooltip content="查看备注">
              <el-button size="mini" icon="fa fa-ellipsis-h"
                         @click="handleNoteDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="230">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetFinishDetail'"
                        content="查看">
              <el-button size="small" icon="fa fa-eye"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-if="canClearAdvance(scope.row.status)"
                        v-action="'AssetFinishClearAdvanced'"
                        content="提前结清">
              <el-button size="small"
                         type="warning"
                         @click="handleEarlySettlement(scope.row)">提前结清
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="canRenew(scope.row.status)"
                        v-action="'AssetFinishContinue'"
                        content="续借">
              <el-button size="small"
                         type="success"
                         @click="handleRenew(scope.row)">续借
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="pageTotal" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>

    <!--续借-->
    <el-dialog title="续借"
               :visible.sync="showRenewDialog"
               width="600px"
               @open="handleDialogOpen"
               @close="handleDialogClose">
      <renew-loan ref="renewLoan"
                  v-if="renewDetail"
                  v-model="renewDetail"
                  mode="CREATE"
                  @save="handleSave"
                  @cancel="handleDialogCancel"></renew-loan>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getFinishedLoanApplicationList,
    getLoanRemark,
    downloadFinishedLoanList,
    renewLoan,
    batchEarlySettle,
    getFinishedLoanTotal
  } from '../../api/asset'
  import { getCollectionCardList } from '../../api/finance';
  import RenewLoan from '../../../modules/assets/RenewLoan.vue'
  import StatLoanAmount from '../../../modules/stat/StatLoanAmount'

  const statusSequence = [10, 12, 15];

  export default {
    data() {
      return {
        showRenewDialog: false,
        statusSequence,
        getTotal: getFinishedLoanTotal,
        contracts: '',
        search: {
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          paymentStartTime: '',
          paymentEndTime: '',
          statusCount: this.$arrayToBinary(statusSequence),
          contracts: [],
          pageSize: 20,
          pageNumber: 1
        },
        oldSearch: {},
        renewDetail: null,
        searchDateType: this.$enum.SEARCH_DATE_TYPE_APPLY,
        pageTotal: 0,
        selected: [],
        list: [],
        table: [
          {
            type: 'selection',
            width: 55,
            fixed: 'left',
            selectable: (row) => this.canClearAdvance(row.status)
          },
          {
            label: '借款编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '资金端',
            prop: 'fundOrgName'
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
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, value) => this.$filter(value, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '项目名称',
            prop: 'projectName'
          },
          {
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '借款利率(年化利率)',
            prop: 'repayIntRate',
            formatter: (row, col, value) => this.$floatToPercentage(value)
          },
          {
            label: '借款期数',
            prop: 'repayTerms'
          },
          {
            label: '期数单位',
            prop: 'repayTimeType',
            formatter: (row, col, value) => `${row.repayTime}${this.$filter(value, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, value) => this.$filter(value, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          },
          {
            label: '放款时间',
            prop: 'paymentDate',
            width: 85
          },
          {
            label: '所属营业部',
            prop: 'creatorBusiness'
          }
        ]
      };
    },
    computed: {
      searchDate: {
        get() {
          const type = this.searchDateType;
          if (type === this.$enum.SEARCH_DATE_TYPE_APPLY) {
            const dateRange = [];
            dateRange[0] = this.search.appliedStartTime || this.$dateStringify(this.$lastNMonth(new Date(), 3));
            dateRange[1] = this.search.appliedEndTime || this.$dateStringify(new Date());
            return dateRange
          } else if (type === this.$enum.SEARCH_DATE_TYPE_LOAN) {
            const dateRange = [];
            dateRange[0] = this.search.paymentStartTime || this.$dateStringify(this.$lastNMonth(new Date(), 3));
            dateRange[1] = this.search.paymentEndTime || this.$dateStringify(new Date());
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          const type = this.searchDateType;
          if (val && type === this.$enum.SEARCH_DATE_TYPE_APPLY) {
            this.search.appliedStartTime = val[0];
            this.search.appliedEndTime = val[1];
          } else if (val && type === this.$enum.SEARCH_DATE_TYPE_LOAN) {
            this.search.paymentStartTime = val[0];
            this.search.paymentEndTime = val[1]
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
            this.assetStatusList = statusSequence
          }
        }
      }
    },
    created() {
      this.getData(1)
    },
    methods: {
      canClearAdvance(status) {
        return this.$enum.LOAN_STATUS_LOANED === status && this.$store.state.user.earlySwitch === 1;
      },
      canRenew(state) {
        return this.$store.state.user.renewSwitch === 1
      },
      handleSearch() {
        this.getData(1)
      },
      handleDownload() {
        if (this.searchDateType === this.$enum.SEARCH_DATE_TYPE_APPLY) {
          this.search.paymentStartTime = '';
          this.search.paymentEndTime = '';
        } else {
          this.search.appliedStartTime = '';
          this.search.appliedEndTime = '';
        }
        const search = this.$objFilter(this.search, _ => _ !== '');
        search.contracts = this.contracts.trim().split('\n').filter(_ => !!_);
        this.$download(downloadFinishedLoanList(search), this.$store)
      },
      handleBatchSettle() {
        if (this.selected.length === 0) {
          this.$message.error('没有可提前结清的资产');
          this.getData(this.search.pageNumber)
        } else {
          this.batchSettle(this.$deepcopy(this.selected));
        }
      },

      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleTableSelectionChange(selection) {
        this.selected = selection.map(_ => _.id);
      },

      handleDetail(row) {
        this.$router.push({
          name: 'AssetFinishDetail',
          params: {id: row.id},
          query: {type: 'performance'}
        });
      },
      handleNoteDetail(row) {
        getLoanRemark(row.id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            const note = res.body.map((_, i) => `${i + 1}. ${_.remarks}[${_.createdTime}]`).join('\n');
            const h = this.$createElement;
            const message = note.length ? h('div', null, note.split('\n').map(_ => h('p', null, _))) : '无';
            this.$msgbox({
              title: '备注',
              message
            }).catch(() => {
            })
          }
        }, () => {
        })
      },
      handleRenew(row) {
        getCollectionCardList(row.fundOrg, this.$enum.BANK_USE_TYPE_COLLECTION).then(({ data }) => {
          if (data.code === 200 && data.body) {
            const list = data.body.map(_ => ({
              text: `${_.bankCard}（${_.name}）`,
              value: _.bankCard,
              extraData: {
                collectionAccount: _.name,
                collectionAccountId: _.bankUserId
              }
            }));
            this.$store.commit('application/updateCollectionCardList', list)
          }
        });
        this.renewDetail = {
          oldContract: row.contract,
          repayRateType: this.$enum.LOAN_RATES_YEAR
        };
        this.showRenewDialog = true;
      },
      handleEarlySettlement(row) {
        this.$confirm('确定提前结清?', '提示', {
          type: 'warning'
        }).then(() => {
          this.batchSettle([row.id])
        })
      },
      handleSave(val) {
        renewLoan(val.oldContract, val).then(({data}) => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.showRenewDialog = false;
            this.getData(this.search.pageNumber);
          }
        })
      },
      handleDialogCancel() {
        this.showRenewDialog = false;
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.$refs.renewLoan && this.$refs.renewLoan.clearValidate();
        })
      },
      handleDialogClose() {
        this.renewDetail = null;
        this.$refs.renewLoan.clearValidate();
      },

      getData(index) {
        if (this.searchDateType === this.$enum.SEARCH_DATE_TYPE_APPLY) {
          this.search.paymentStartTime = '';
          this.search.paymentEndTime = '';
        } else {
          this.search.appliedStartTime = '';
          this.search.appliedEndTime = '';
        }
        const search = this.$objFilter(this.search, _ => _ !== '');
        search.contracts = this.contracts.trim().split('\n').filter(_ => !!_);
        search.pageNumber = index;
        getFinishedLoanApplicationList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.oldSearch = search;
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
      batchSettle(idList) {
        batchEarlySettle(idList).then(({data}) => {
          if (data.code === 200) {
            this.$message({
              message: `${data.body.successCount}条提交成功` + (data.body.failCount > 0 ? `，${data.body.failCount}条提交失败` : ''),
              type: data.body.successCount === 0 ? 'error' : 'success'
            });
            setTimeout(() => {
              this.getData(this.search.pageNumber);
            }, 1000);
          }
        })
      }
    },
    components: {
      RenewLoan,
      StatLoanAmount
    }
  };
</script>
