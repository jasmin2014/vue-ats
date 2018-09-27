<!-- 实收账单 -->
<template>
  <div class="loan">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="实收日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产渠道" prop="sources">
            <ats-select v-model="search.assetChannel"
                        placeholder="全部"
                        :org="this.$enum.BUSINESS_ASSET"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="账单状态" prop="status">
            <ats-select v-model="search.repayStatus"
                        :kind="this.$enum.BILL_STATUS"
                        :group="this.$enum.BILL_STATUS"
                        :sequence="[2,4,6,7]"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="借贷编号/客户姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'OperationActualBillDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownloadExcel"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="planData" class='table-center' border>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="assetChannel" label="资产渠道"></el-table-column>
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
        <el-table-column prop="planedRepayDate" label="应收日期"></el-table-column>
        <el-table-column prop="actRepayDate" label="实收日期"></el-table-column>
        <el-table-column prop="repayAmount" label="实收金额(元)"></el-table-column>
        <el-table-column prop="actCapAmount" label="实收本金(元)"></el-table-column>
        <el-table-column prop="actIntAmount" label="实收利息(元)"></el-table-column>
        <el-table-column prop="actFeeAmount" label="实收手续费(元)"></el-table-column>
        <el-table-column prop="actDefaultsFee" label="违约金(元)"></el-table-column>
        <el-table-column prop="actPenaltyFee" label="实收逾期罚息(元)"></el-table-column>
        <el-table-column prop="penaltyManageFee" label="实收逾期管理费(元)"></el-table-column>
        <el-table-column prop="badDebtFee" label="实收坏账罚息(元)"></el-table-column>
        <el-table-column prop="badDebtManageFee" label="实收坏账管理费(元)"></el-table-column>
        <el-table-column prop="repayStatus" label="账单状态"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.BILL_STATUS, this.$enum.BILL_STATUS))"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="handleGetAccountBill"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getAccountBill, downloadAccountBillList} from '../../api/operation';

  export default {
    data() {
      return {
        pageTotal: 0,
        search: {
          actRepayDateStart: this.$dateStringify(this.$lastNMonth(new Date())),
          actRepayDateEnd: this.$dateStringify(new Date()),
          assetChannel: '',
          repayStatus: '',
          searchKeyword: '',
          pageNumber: 1,
          pageSize: 20
        },
        planData: []
      }
    },
    created() {
      this.handleGetAccountBill(1);
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.actRepayDateStart || this.search.actRepayDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.actRepayDateStart;
            dateRange[1] = this.search.actRepayDateEnd;
            return dateRange;
          } else {
            return null;
          }
        },
        set(range) {
          if (range) {
            this.search.actRepayDateStart = range[0];
            this.search.actRepayDateEnd = range[1];
          } else {
            this.search.actRepayDateStart = '';
            this.search.actRepayDateEnd = '';
          }
        }
      }
    },
    methods: {
      handleDownloadExcel() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadAccountBillList(search), this.$store);
      },
      handleGetAccountBill(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getAccountBill(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.planData = (res.body.list || []).map(_ => ({
              ..._,
              currentTerms: `${_.term}/${_.repayTerms}`
            }));
            this.pageTotal = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.planData = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.planData = [];
          this.pageTotal = 0;
        })
      },
      handleSearch() {
        this.handleGetAccountBill(1);
      }
    }
  }

</script>
