<!--收益明细-->
<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="结算日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="借贷编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查询"
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
    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @current-change="getList"
                     :page-size="search.pageSize"
                     layout="prev, next"
                     :total="totalRecord"></el-pagination>
    </el-row>
  </div>

</template>

<script>
  import { getProfitList, downloadProfitList } from '../../api/finance'

  export default {
    data() {
      return {
        list: [], // 列表数据
        totalRecord: 0, // 总条数
        search: {
          settlementDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          settlementDateEnd: this.$dateStringify(new Date()),
          searchKeyword: '',
          pageSize: 20,
          pageNumber: 1
        },
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
            label: '资产渠道',
            prop: 'assetChannel'
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
            label: '返点利率',
            prop: 'rebateRate',
            formatter: (row, col, value) => this.$floatToPercentage(value)
          },
          {
            label: '手续费(元)',
            prop: 'feeAmount'
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
      };
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.settlementDateStart || this.search.settlementDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.settlementDateStart;
            dateRange[1] = this.search.settlementDateEnd;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.search.settlementDateStart = range[0];
            this.search.settlementDateEnd = range[1];
          } else {
            this.search.settlementDateStart = '';
            this.search.settlementDateEnd = '';
          }
        }
      }
    },
    created() {
      this.getList(1);
    },
    methods: {
      handleSearch() {
        this.getList(1);
      },
      handleDownload(){
        const search = this.$deepcopy(this.search);
        this.$download(downloadProfitList(search), this.$store);
      },
      getList(index){
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getProfitList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.totalRecord = res.body.totalRecord;
            this.search.pageNumber = index;
          } else {
            this.list = [];
            this.totalRecord = 0;
          }
        }).catch(() => {
          this.list = [];
          this.totalRecord = 0;
        })
      }
    }
  };
</script>





