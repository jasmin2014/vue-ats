<!-- 已放款列表详情页 -->
<template>
  <div class="loan">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="放款时间">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetChannel"
                        placeholder="全部" :clearable="true"
                        :org="this.$enum.BUSINESS_ASSET"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams"
                      placeholder="借贷编号/协议编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'OperationPlanDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownloadExcel"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="planData" class='table-center' border>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/企业名称"></el-table-column>
        <el-table-column prop="assetChannel" label="资产渠道"></el-table-column>
        <el-table-column prop="raisePartyOrgName" label="资金端"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="repayWay" label="还款方式"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY))"></el-table-column>
        <el-table-column prop="repayIntRate" label="借款利率(年化利率)"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column prop="repayTerms" label="借款期数"></el-table-column>
        <el-table-column prop="repayTimeType" label="期数单位
                         :formatter="(row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`"></el-table-column>
        <el-table-column prop="paymentDate" label="放款时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip v-action="'OperationPlanDetail'"
                        content="查看">
              <el-button size="small" icon="fa fa-eye"
                         @click="goDetail(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getRepayList"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getRepayList, downloadRepayPlanList} from '../../api/operation';

  export default {
    data() {
      return {
        pageTotal: 0,
        search: {
          paymentStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          paymentEndTime: this.$dateStringify(new Date()),
          assetChannel: '',
          otherParams: '',
          pageNumber: 1,
          pageSize: 20
        },
        planData: []
      }
    },
    created() {
      this.getRepayList(1);
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.paymentStartTime || this.search.paymentEndTime) {
            const dateRange = [];
            dateRange[0] = this.search.paymentStartTime;
            dateRange[1] = this.search.paymentEndTime;
            return dateRange;
          } else {
            return null;
          }
        },
        set(range) {
          if (range) {
            this.search.paymentStartTime = range[0];
            this.search.paymentEndTime = range[1];
          } else {
            this.search.paymentStartTime = '';
            this.search.paymentEndTime = '';
          }
        }
      }
    },
    methods: {
      handleDownloadExcel() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadRepayPlanList(search), this.$store);
      },
      getRepayList(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getRepayList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.planData = res.body.list;
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
      goDetail(id) {
        this.$router.push({ name: 'OperationPlanDetail', params: { id } })
      },
      handleSearch() {
        this.getRepayList(1);
      }
    }
  }

</script>
