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
          <el-form-item label="项目名称">
            <ats-select v-model="search.loanKind" placeholder="全部" :clearable="true"
                        :kind="this.$enum.LOAN_TYPE" :group="search.assetKind"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <ats-select v-model="assetStatus" placeholder="全部" :clearable="true"
                        :kind="this.$enum.LOAN_STATUS" :group="this.$enum.LOAN_STATUS_GROUP"
                        :sequence="[10,12,15]"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams" placeholder="借贷编号/协议编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" title="查找"
                       @click="handleSearch"></el-button>
            <el-button v-action="'AssetFinishDownload'"
                       type="warning" icon="fa fa-download" title="导出数据到Excel"
                       @click="handleDownload"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width" :key="index" align="center"></el-table-column>
        <el-table-column label="备注" align="center" fixed="right">
          <template slot-scope="scope">
            {{ scope.row.remarks }}<br>
            <el-tooltip content="查看备注">
              <el-button size="mini" icon="fa fa-ellipsis-h"
                         @click="handleNoteDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="250">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetFinishDetail'"
                        content="查看">
              <el-button size="small" icon="fa fa-eye"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <!--下期需求-->
            <!--<el-tooltip v-action="'AssetFinishDetail'"-->
            <!--content="还款计划">-->
            <!--<el-button size="small"-->
            <!--@click="handlePlanDetail(scope.row)">还款计划</el-button>-->
            <!--</el-tooltip>-->
            <el-tooltip v-if="canClearAdvance(scope.row.status)"
                        v-action="'AssetFinishClearAdvanced'"
                        content="提前结清">
              <el-button size="small"
                         type="warning"
                         @click="handleEarlySettlement(scope.row)">提前结清
              </el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetFinishContinue'"
                        content="续贷">
              <el-button size="small"
                         type="success"
                         @click="handleRenew(scope.row)">续贷
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>

    <!--续贷-->
    <el-dialog title="续贷"
               :visible.sync="showRenewDialog"
               width="600px"
               @open="handleDialogOpen"
               @close="handleDialogClose">
      <renew-loan ref="renewLoan"
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
    earlySettle
  } from '../../api/asset'
  import RenewLoan from '../../../modules/assets/RenewLoan.vue'

  export default {
    data() {
      return {
        showRenewDialog: false,
        search: {
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          paymentStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          paymentEndTime: this.$dateStringify(new Date()),
          statusCount: this.$arrayToBinary([10,12, 15]),
          pageSize: 20,
          pageNumber: 1
        },
        renewDetail: {},
        searchDateType: this.$enum.SEARCH_DATE_TYPE_APPLY,
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          }, {
            label: '资金端',
            prop: 'raisePartyOrgName'
          }, {
            label: '协议编号',
            prop: 'contract'
          }, {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          }, {
            label: '客户姓名/企业名称',
            prop: 'loanPartyName'
          }, {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          }, {
            label: '项目名称',
            prop: 'loanKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_TYPE, row.assetKind)
          }, {
            label: '借款金额(元)',
            prop: 'loanAmount'
          }, {
            label: '借款利率(年化利率)',
            prop: 'repayIntRate',
            formatter: (row, col, value) => this.$floatToPercentage(value)
          }, {
            label: '借款期数',
            prop: 'repayTerms'
          }, {
            label: '期数单位',
            prop: 'repayTimeType',
            formatter: (row, col, value) => `${row.repayTime}${this.$filter(value, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          }, {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, value) => this.$filter(value, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          }, {
            label: '募集期',
            prop: 'raiseFromDate',
            width: 100,
            formatter: (row, col, value) => (value || row.raiseThruDate) ? `${value || '?'} - ${row.raiseThruDate || '?'}` : '不限'
          }, {
            label: '状态',
            prop: 'status',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_STATUS, this.$enum.LOAN_STATUS_GROUP)
          }, {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          }, {
            label: '放款时间',
            prop: 'paymentDate',
            width: 85
          }
        ]
      };
    },
    computed: {
      searchDate: {
        get() {
          const type = this.searchDateType;
          if (type === this.$enum.SEARCH_DATE_TYPE_APPLY) {
            if (this.search.appliedStartTime && this.search.appliedEndTime) {
              const dateRange = [];
              dateRange[0] = this.search.appliedStartTime;
              dateRange[1] = this.search.appliedEndTime;
              return dateRange
            } else {
              return null;
            }
          } else if (type === this.$enum.SEARCH_DATE_TYPE_LOAN) {
            if (this.search.paymentStartTime && this.search.paymentEndTime) {
              const dateRange = [];
              dateRange[0] = this.search.paymentStartTime;
              dateRange[1] = this.search.paymentEndTime;
              return dateRange
            } else {
              return null;
            }
          } else {
            return null;
          }
        },
        set(val) {
          const type = this.searchDateType;
          if (val && type === this.$enum.SEARCH_DATE_TYPE_APPLY) {
            this.search.appliedStartTime = val[0];
            this.search.appliedEndTime = val[1];
            this.search.paymentStartTime = '';
            this.search.paymentEndTime = ''
          } else if (val && type === this.$enum.SEARCH_DATE_TYPE_LOAN) {
            this.search.appliedStartTime = '';
            this.search.appliedEndTime = '';
            this.search.paymentStartTime = val[0];
            this.search.paymentEndTime = val[1]
          } else {
            this.search.appliedStartTime = '';
            this.search.appliedEndTime = '';
            this.search.paymentStartTime = '';
            this.search.paymentEndTime = ''
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
            this.assetStatusList = [10, 12, 15]
          }
        }
      }
    },
    created() {
      this.getData(1)
    },
    methods: {
      canClearAdvance(status) {
        if (status === 'LOANED') {
          return true;
        } else {
          return false;
        }
        // return this.$enum.LOAN_STATUS_CLEARED !== status;
      },
      handleSearch() {
        this.getData(1)
      },
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadFinishedLoanList(search), this.$store)
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
      // handlePlanDetail(row) {
      //   this.$router.push({
      //     name: 'AssetFinishPlanDetail',
      //     params: {
      //       id: row.id
      //     }
      //   })
      // },
      handleRenew(row) {
        this.renewDetail = {
          oldContract: row.contract
        };
        this.showRenewDialog = true;
      },
      handleEarlySettlement(row) {
        this.$confirm('确定提前结清?', '提示', {
          type: 'warning'
        }).then(() => {
          earlySettle(row.id).then(({data}) => {
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: '提前结清成功'
              });
              setTimeout(() => {
                this.getData(this.search.pageNumber);
              }, 1000);
            }
          })
        }).catch(() => {
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
        this.renewDetail = {};
        this.$refs.renewLoan.clearValidate();
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getFinishedLoanApplicationList(search).then(response => {
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
      }
    },
    components: {
      RenewLoan
    }
  };
</script>
