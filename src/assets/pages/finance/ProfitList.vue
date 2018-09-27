<!--收益明细-->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="结算日期">
            <ats-date-picker-query v-model="settlementDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.searchKeyword"
                      placeholder="借贷编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="搜索"
                     @click="handleSearch"></el-button>
          <el-button v-action="'FinanceProfitDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownload"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="col in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :key="col.prop" align="center"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getProfitList, downloadProfitList} from '../../api/finance'

  export default {
    data() {
      return {
        search: {
          settlementDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          settlementDateEnd: this.$dateStringify(new Date()),
          searchKeyword: '',
          pageNumber: 1,
          pageSize: 20
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '客户姓名/企业名称',
            prop: 'loanPartyName'
          },
          {
            label: '资金端',
            prop: 'fundName'
          },
          {
            label: '会计期间',
            prop: 'fiscalPeriod',
            formatter: (row, col, value) => this.$filter(value, this.$enum.FISCAL_PERIOD, this.$enum.FISCAL_PERIOD)
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
            label: '借款利率(年化利率)',
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
            label: '还款金额(元)',
            prop: 'repayAmount'
          },
          {
            label: '手续费(元)',
            prop: 'feeAmount'
          },
          {
            label: '返点利率',
            prop: 'rebateRate',
            formatter: (row, col, value) => this.$floatToPercentage(value)
          },
          {
            label: '收益(元)',
            prop: 'settleAmount'
          },
          {
            label: '结算日期',
            prop: 'settlementDate'
          }
        ]
      }
    },
    computed: {
      settlementDate: {
        get() {
          if (this.search.settlementDateStart && this.search.settlementDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.settlementDateStart;
            dateRange[1] = this.search.settlementDateEnd;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.settlementDateStart = val[0];
            this.search.settlementDateEnd = val[1]
          } else {
            this.search.settlementDateStart = '';
            this.search.settlementDateEnd = ''
          }
        }
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadProfitList(search), this.$store)
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getProfitList(search).then(({data}) => {
          if (data.code === 200 && data.body) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord;
            this.search.pageNumber = data.body.pageNumber;
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
