<!-- 收款明细 -->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="应还日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="实还日期">
            <ats-date-picker-query v-model="applyDate2"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetOrg"
                        placeholder="全部"
                        :org="this.$enum.BUSINESS_ASSET"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="借贷编号/协议编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'FinanceReceiveCreate'"
                     type="primary" icon="fa fa-plus" title="添加还款明细"
                     @click="addRefund"></el-button>
          <el-button v-action="'FinanceReceiveDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownloadExcel"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>

      <el-table :data="refundData" class='table-center' border>
        <el-table-column prop="repayNo" label="还款编号"></el-table-column>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="assetChannel" label="资产渠道"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/企业名称"></el-table-column>
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
        <el-table-column prop="paymentDate" label="放款时间"></el-table-column>

        <el-table-column prop="planedRepayDate" label="应还日期"></el-table-column>
        <el-table-column prop="totalAmount" label="应还金额(元)"></el-table-column>
        <el-table-column prop="planedCapAmount" label="应还本金(元)"></el-table-column>
        <el-table-column prop="planedIntAmount" label="应还利息(元)"></el-table-column>
        <el-table-column prop="planedFeeAmount" label="应还手续费(元)"></el-table-column>
        <el-table-column prop="penaltyDays" label="逾期天数"></el-table-column>
        <el-table-column prop="penaltyCapAmount" label="逾期本金(元)"></el-table-column>
        <el-table-column prop="penaltyIntAmount" label="逾期利息(元)"></el-table-column>
        <el-table-column prop="planedPenaltyFee" label="应还逾期罚息(元)"></el-table-column>

        <el-table-column prop="actRepayDate" label="实还日期"></el-table-column>
        <el-table-column prop="actCapAmount" label="实还本金(元)"></el-table-column>
        <el-table-column prop="actIntAmount" label="实还利息(元)"></el-table-column>
        <el-table-column prop="actFeeAmount" label="实还手续费(元)"></el-table-column>
        <el-table-column prop="actPenaltyFee" label="实还逾期罚息(元)"></el-table-column>

        <!--<el-table-column prop="repayStatus" label="还款状态"-->
                         <!--:formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_STATUS, this.$enum.REPAY_STATUS))"></el-table-column>-->

      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getRepayDetailList"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getRepayDetailList, downloadRepayList} from '../../api/finance'

  export default {
    data() {
      return {
        search: {
          planedRepayDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          planedRepayDateEnd: this.$dateStringify(new Date()),
          actualRepayDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          actualRepayDateEnd: this.$dateStringify(new Date()),
          pageNumber: 1,
          pageSize: 20
        },
        pageTotal: 0,
        refundData: []
      }
    },
    created() {
      this.getRepayDetailList(1);
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.planedRepayDateStart || this.search.planedRepayDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.planedRepayDateStart;
            dateRange[1] = this.search.planedRepayDateEnd;
            return dateRange;
          } else {
            return null;
          }
        },
        set(range) {
          if (range) {
            this.search.planedRepayDateStart = range[0];
            this.search.planedRepayDateEnd = range[1];
          } else {
            this.search.planedRepayDateStart = '';
            this.search.planedRepayDateEnd = '';
          }
        }
      },
      applyDate2: {
        get() {
          if (this.search.actualRepayDateStart || this.search.actualRepayDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.actualRepayDateStart;
            dateRange[1] = this.search.actualRepayDateEnd;
            return dateRange;
          } else {
            return null;
          }
        },
        set(range) {
          if (range) {
            this.search.actualRepayDateStart = range[0];
            this.search.actualRepayDateEnd = range[1];
          } else {
            this.search.actualRepayDateStart = '';
            this.search.actualRepayDateEnd = '';
          }
        }
      }
    },
    methods: {
      handleDownloadExcel(){
        const search = this.$deepcopy(this.search);
        this.$download(downloadRepayList(search), this.$store);
      },
      getRepayDetailList(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getRepayDetailList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.refundData = (res.body.list || []).map(_ => ({
              ..._,
              currentTerms: `${_.term}/${_.repayTerms}`
            }));
            this.pageTotal = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.refundData = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.refundData = [];
          this.pageTotal = 0;
        })
      },
      addRefund() {
        this.$router.push({ name: 'FinanceReceiveCreate' });
      },
      handleSearch() {
        this.getRepayDetailList(1);
      }

    }
  }

</script>
