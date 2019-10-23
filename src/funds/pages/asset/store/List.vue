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
          <el-form-item label="业务类型">
            <ats-select v-model="search.projectType"
                        :kind="this.$enum.PROJECT_TYPE"
                        :group="this.$enum.PROJECT_TYPE"
                        placeholder="全部"
                        clearable></ats-select>
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
                        :sequence="statusSequence">
            </ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetChannel"
                        :org="this.$enum.BUSINESS_REL_ASSET"
                        placeholder="全部"
                        :disabled-method="() => false"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams"
                      placeholder="姓名/协议编号/借款编号"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" title="查找"
                       @click="handleSearch"></el-button>
            <el-button v-action="'AssetStorePush'"
                       icon="fa fa-upload"
                       type="success"
                       @click="handleBatchPush">&nbsp;批量推送</el-button>
            <stat-loan-amount v-action="'AssetStoreStat'"
                              :list="list.map(_ => _.loanAmount)"
                              :search="oldSearch"
                              :get-total="getTotal"
                              style="margin-left: 10px;"></stat-loan-amount>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-row>
      <el-table :data="list" border
                @selection-change="handleSelectionChange">
        <el-table-column v-for="col in table"
                         v-bind="col"
                         :key="col.prop" align="center"></el-table-column>
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
                         @click="handleRemarks(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="260">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetStoreDetail'"
                        content="查看">
              <el-button size="mini" icon="fa fa-eye"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetStoreFeedback'"
                        v-if="canFeedback(scope.row)" content="反馈问题">
              <el-button size="mini"
                         type="success"
                         @click="handleFeedback(scope.row)">反馈</el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetStoreQuery'"
                        v-if="canQuery(scope.row)"
                        content="查询开户">
              <el-button size="mini"
                         icon="fa fa-search"
                         type="info"
                         :loading="scope.row.$loading"
                         @click="handleQuery(scope.row, scope.$index)">&nbsp;查询开户</el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetStorePush'"
                        v-if="canPush(scope.row)"
                        content="处理图片并推送">
              <el-button size="mini"
                         icon="fa fa-upload"
                         type="success"
                         @click="handlePush(scope.row)"></el-button>
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
  </div>
</template>

<script>
  import {
    getStoreList,
    getStoreTotal,
    getLoanRemark,
    feedback,
    queryOpenStatus,
    batchPushLoan
  } from '../../../api/assetMgt';
  import StatLoanAmount from '../../../../modules/stat/StatLoanAmount'

  let loadingList = [];
  const statusSequence = [5, 6, 10, 12, 14, 15];

  export default {
    components: {
      StatLoanAmount
    },
    data() {
      return {
        statusSequence,
        getTotal: getStoreTotal,
        pageTotal: 0,
        search: {
          assetKind: '',
          loanKind: '',
          assetRiskLevel: '',
          statusCount: this.$arrayToBinary([14]),
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          assetChannel: '',
          otherParams: '',
          pageNumber: 1,
          pageSize: 20
        },
        oldSearch: {},
        paymentVoucher: '',
        list: [],
        loading: [],
        selected: [],
        loanTermOptions: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        table: [
          {
            type: 'selection',
            width: 55,
            fixed: 'left',
            selectable: (row) => this.canPush(row)
          },
          {
            label: '借款编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '协议编号',
            prop: 'contract'
          },
          {
            label: '资产渠道',
            prop: 'assetOrgName'
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
            label: '资产风险等级',
            prop: 'assetRiskLevel',
            formatter: (row, col, val) => row.riskSwitch ? this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP) : '-'
          },
          {
            label: '信用评分',
            prop: 'creditScore',
            formatter: (row, col, val) => row.riskSwitch ? val : '-'
          },
          {
            label: '机构资产风险等级',
            prop: 'channelRiskLevel',
            formatter: (row, col, val) => !row.riskSwitch ? this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP) : '-'
          },
          {
            label: '机构信用评分',
            prop: 'channelCreditScore',
            formatter: (row, col, val) => !row.riskSwitch ? val : '-'
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, value) => this.$filter(value, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '借款利率(年化利率)',
            prop: 'repayYearRate',
            formatter: (row, col, val) => this.$floatToPercentage(val)
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
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          }
        ]
      };
    },
    created() {
      this.getData(1);
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
            this.assetStatusList = statusSequence
          }
        }
      }
    },
    methods: {
      canQuery(row) {
        return [this.$enum.LOAN_STATUS_NO_SET_REPAYMENT].includes(row.status) && this.$store.state.user.isQueryAccount === 1 && row.accountQueryStatus !== 1;
      },
      canPush(row) {
        return [this.$enum.LOAN_STATUS_FEEDBACK, this.$enum.LOAN_STATUS_NO_SET_REPAYMENT].includes(row.status) && (this.$store.state.user.isQueryAccount === 0 || row.accountQueryStatus === 1);
      },
      canFeedback(row) {
        return [this.$enum.LOAN_STATUS_NO_SET_REPAYMENT].includes(row.status);
      },

      handleSearch() {
        this.getData(1);
      },
      handleBatchPush() {
        if (this.selected.length === 0) {
          this.$message.error('没有可推送的资产');
          this.getData(this.search.pageNumber)
        } else {
          this.$confirm('确定要批量推送?', '提示', {
            type: 'warning'
          }).then(() => {
            batchPushLoan(this.selected).then(({ data }) => {
              if (data.code === 200) {
                setTimeout(() => {
                  this.$message({
                    message: `${data.body.successCount}条推送成功` + (data.body.failCount > 0 ? `，${data.body.failCount}条推送失败` : ''),
                    type: data.body.successCount === 0 ? 'error' : 'success'
                  });
                  this.getData(this.search.pageNumber)
                }, 1000);
              }
            }).catch(() => {})
          })
        }
      },
      handleSelectionChange(selected) {
        this.selected = selected.map(_ => _.id)
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },

      handleDetail(row) {
        this.$router.push({
          name: 'AssetStoreDetail',
          params: { id: row.id }
        });
      },
      handlePush(row) {
        this.$router.push({
          name: 'AssetStorePush',
          params: { id: row.id }
        });
      },
      handleFeedback(row) {
        this.$prompt('具体描述', '反馈问题').then(({ value }) => {
          feedback(row.id, value).then(({ data }) => {
            if (data.code === 200) {
              setTimeout(() => {
                this.$message.success('反馈成功');
                this.getData(this.search.pageNumber);
              }, 1000);
            } else {
              this.getData(this.search.pageNumber);
              this.$message.error(data.message)
            }
          }).catch(() => {
            this.getData(this.search.pageNumber);
          })
        })
      },
      handleQuery(row) {
        this.$set(row, '$loading', true);
        loadingList.push(row.id);
        queryOpenStatus(row.id).then(({ data }) => {
          loadingList = loadingList.filter(_ => _ !== row.id);
          if (data.code === 200) {
            setTimeout(() => {
              this.$message.success('已开户，请直接推送');
              this.getData(this.search.pageNumber);
            }, 1000);
          } else {
            this.getData(this.search.pageNumber);
            this.$message.error(data.message);
          }
        }).catch(() => {
          loadingList = loadingList.filter(_ => _ !== row.id);
          this.getData(this.search.pageNumber);
        })
      },
      handleRemarks(row) {
        this.getRemarkList(row.id);
      },

      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getStoreList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.oldSearch = search;
            res.body.list.forEach(_ => {
              if (loadingList.includes(_.id)) {
                _.$loading = true;
              }
            });
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
      getRemarkList(id) {
        getLoanRemark(id).then(({ data }) => {
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
