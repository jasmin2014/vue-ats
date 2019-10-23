<!-- 借贷申请列表 -->
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
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetChannel"
                        :org="this.$enum.BUSINESS_ASSET"
                        placeholder="全部"
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
        <el-col :span="7">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'AssetApplyDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownloadExcel"></el-button>
          <el-button v-action="'AssetApplyBatchStore'"
                     type="success" icon="fa fa-book" title="批量收纳"
                     @click="handleStoreBatch()">&nbsp;批量收纳</el-button>
          <stat-loan-amount v-action="'AssetApplyStat'"
                            :list="list.map(_ => _.loanAmount)"
                            :search="oldSearch"
                            :get-total="getTotal"
                            style="margin-left: 10px;"></stat-loan-amount>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" border
                @selection-change="handleSelectionChange">
        <el-table-column v-for="(col, index) in table"
                         :key="index + '_' + col.prop"
                         :label="col.label"
                         :prop="col.prop"
                         :type="col.type"
                         :width="col.width"
                         :formatter="col.formatter"
                         align="center">
        </el-table-column>
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
        <el-table-column v-if="$store.state.buttons['AssetApplyDetail'] || $store.state.buttons['AssetApplyStore']"
                         label="操作" align="center" fixed="right" width="120">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetApplyDetail'"
                        content="查看">
              <el-button size="small" icon="fa fa-eye"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetApplyStore'"
                        content="收纳">
              <el-button type="success" size="small" title="收纳" icon="fa fa-book"
                         @click="handleStore(scope.row)"></el-button>
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
    getAssetList,
    getLoanRemark,
    storeAsset,
    downloadLoanApplicationList,
    getAssetTotal
  } from '../../../api/assetMgt';
  import StatLoanAmount from '../../../../modules/stat/StatLoanAmount'

  export default {
    components: {
      StatLoanAmount
    },
    data() {
      return {
        pageTotal: 0,
        getTotal: getAssetTotal,
        search: {
          orientationFlag: '1',
          assetKind: '',
          loanKind: '',
          assetRiskLevel: '',
          statusCount: this.$arrayToBinary([3]),
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          assetChannel: '',
          otherParams: '',
          pageNumber: 1,
          pageSize: 20
        },
        oldSearch: {},
        list: [],
        selected: [],
        table: [
          {
            type: 'selection',
            width: 55
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
            formatter: (row, col, val) => this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
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
            formatter: (row, col, val) => this.$filter(val, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
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
            formatter: (row, col, val) => this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, val) => this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '申请日期',
            prop: 'appliedTime',
            width: 85
          }
        ]
      };
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
            this.assetStatusList = [3]
          }
        }
      }
    },

    created() {
      this.getData(1);
    },

    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleDownloadExcel() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadLoanApplicationList(search), this.$store);
      },
      handleStoreBatch() {
        if (this.selected.length === 0) {
          this.$message.warning('请先选择要收纳的借贷申请');
          return;
        }
        this.store(this.selected);
      },
      handleSelectionChange(value) {
        this.selected = (value || []).map(_ => _.id)
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleDetail(row) {
        this.$router.push({
          name: 'AssetApplyDetail',
          params: { id: row.id }
        });
      },
      handleStore(row) {
        this.store([row.id]);
      },
      handleNoteDetail(row) {
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
        }, (response) => {})
      },

      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        search.orientationFlag = Number(search.orientationFlag);

        getAssetList(search).then(response => {
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
      store(loanIds) {
        storeAsset(loanIds).then(({ data }) => {
          if (data.code === 200) {
            if (data.body.failCount > 0) {
              const failReason = data.body.failReason.map((_, i) => `（${i + 1}）${_}；`).join('');
              this.$message.error(failReason);
            } else {
              this.$message.success('收纳成功');
            }
            setTimeout(() => {
              this.getData(this.search.pageNumber);
            }, 1000);
          } else {
            this.$message.error(data.message);
          }
        }, () => {})
      }
    }
  };
</script>
