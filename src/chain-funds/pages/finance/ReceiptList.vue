<!-- 还款明细 -->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="应还日期">
            <ats-date-picker-query v-model="planedDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="实还日期">
            <ats-date-picker-query v-model="actualDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetOrg"
                        :org="this.$enum.BUSINESS_CHAIN_ASSET"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.searchKeyword"
                      placeholder="借贷编号/还款编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="搜索"
                     @click="handleSearch"></el-button>
          <el-button type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownload"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="col in table" :label="col.label" :prop="col.prop" :formatter="col.formatter"
                         :key="col.prop" align="center">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getRepayList, downloadRepayList} from '../../api/finance'

  export default {
    data() {
      return {
        search: {
          planedRepayDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          planedRepayDateEnd: this.$dateStringify(new Date()),
          actualRepayDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          actualRepayDateEnd: this.$dateStringify(new Date()),
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '还款编号',
            prop: 'repayNo'
          },
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '资产渠道',
            prop: 'assetChannel'
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
            label: '项目名称',
            prop: 'loanKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_TYPE, row.assetKind)
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, value) => this.$filter(value, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '年利率',
            prop: 'repayYearRate',
            formatter: (row, col, value) => this.$floatToPercentage(value)
          },
          {
            label: '期数',
            prop: 'term',
            formatter: (row, col, value) => `${value}/${row.repayTerms}`
          },
          {
            label: '期数单位',
            prop: 'repayTimeType',
            formatter: (row, col, value) => `${row.repayTime}${this.$filter(value, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          {
            label: '放款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '放款时间',
            prop: 'paymentDate'
          },
          {
            label: '应还日期',
            prop: 'planedRepayDate'
          },
          {
            label: '应还金额(元)',
            prop: 'totalAmount'
          },
          {
            label: '应还本金(元)',
            prop: 'planedCapAmount'
          },
          {
            label: '应还利息(元)',
            prop: 'planedIntAmount'
          },
          {
            label: '应还手续费(元)',
            prop: 'planedFeeAmount'
          },
          {
            label: '逾期天数',
            prop: 'penaltyDays'
          },
          {
            label: '逾期本金(元)',
            prop: 'penaltyCapAmount'
          },
          {
            label: '逾期利息(元)',
            prop: 'penaltyIntAmount'
          },
          {
            label: '应还罚息(元)',
            prop: 'planedPenaltyFee'
          },
          {
            label: '实还日期',
            prop: 'actRepayDate'
          },
          {
            label: '实还本金(元)',
            prop: 'actCapAmount'
          },
          {
            label: '实还利息(元)',
            prop: 'actIntAmount'
          },
          {
            label: '实还手续费(元)',
            prop: 'actFeeAmount'
          },
          {
            label: '实还罚息(元)',
            prop: 'actPenaltyFee'
          }
        ]
      }
    },
    computed: {
      planedDate: {
        get() {
          if (this.search.planedRepayDateStart && this.search.planedRepayDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.planedRepayDateStart;
            dateRange[1] = this.search.planedRepayDateEnd;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.planedRepayDateStart = val[0];
            this.search.planedRepayDateEnd = val[1]
          } else {
            this.search.planedRepayDateStart = '';
            this.search.planedRepayDateEnd = ''
          }
        }
      },
      actualDate: {
        get() {
          if (this.search.actualRepayDateStart && this.search.actualRepayDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.actualRepayDateStart;
            dateRange[1] = this.search.actualRepayDateEnd;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.actualRepayDateStart = val[0];
            this.search.actualRepayDateEnd = val[1]
          } else {
            this.search.actualRepayDateStart = '';
            this.search.actualRepayDateEnd = ''
          }
        }
      }
    },
    created() {
      this.getData(1)
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadRepayList(search), this.$store)
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getRepayList(search).then(response => {
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
    }
  }
</script>
