<!-- 监控预警列表 -->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="结算日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="借贷编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'FinanceProfitDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownloadExcel"></el-button>
        </el-col>
      </el-row>
    </el-form>


    <el-row>
      <el-table :data="earningsData" class='table-center' border>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/企业名称"></el-table-column>
        <el-table-column prop="assetChannel" label="资产渠道"></el-table-column>
        <el-table-column prop="fiscalPeriod" label="会计期间"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.FISCAL_PERIOD, this.$enum.FISCAL_PERIOD))"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="repayWay" label="还款方式"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY))"></el-table-column>
        <el-table-column prop="repayYearRate" label="借款利率(年化利率)"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column prop="currentTerms" label="期数"></el-table-column>
        <el-table-column prop="repayTimeType" label="期数单位"
                         :formatter="(row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`"></el-table-column>
        <el-table-column prop="loanAmount" label="放款金额(元)"></el-table-column>
        <el-table-column prop="repayAmount" label="还款金额(元)"></el-table-column>
        <el-table-column prop="feeAmount" label="手续费(元)"></el-table-column>
        <el-table-column prop="rebateRate" label="返点利率"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column prop="settleAmount" label="收益(元)"></el-table-column>
        <el-table-column prop="settlementDate" label="结算日期"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getEarningsDetailList"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getEarningsDetailList, downloadSettlementList} from '../../api/finance'

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
        earningsData: []
      }
    },
    created() {
      this.getEarningsDetailList();
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
            return null;
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
    methods: {
      handleDownloadExcel() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadSettlementList(search), this.$store);
      },
      getEarningsDetailList(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getEarningsDetailList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.earningsData = (res.body.list || []).map(_ => ({
              ..._,
              currentTerms: `${_.term}/${_.repayTerms}`
            }));
            this.pageTotal = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.earningsData = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.earningsData = [];
          this.pageTotal = 0;
        })
      },
      handleSearch() {
        this.getEarningsDetailList(1);
      }

    }
  }

</script>
