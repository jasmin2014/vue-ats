<!-- 已放款列表详情页 -->
<template>
  <div class="loan">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="应收日期">
            <ats-date-picker-query v-model="applyDate"
                                   :shortcuts="shortcuts"
                                   :disable-future="false"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产渠道" prop="sources">
            <ats-select v-model="search.assetChannel"
                        placeholder="全部" :clearable="true"
                        :org="this.$enum.BUSINESS_ASSET"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="账单状态" prop="status">
            <ats-select v-model="search.repayStatus"
                        :kind="this.$enum.BILL_STATUS"
                        :group="this.$enum.BILL_STATUS"
                        :sequence="[0,1,8]"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="借款编号/客户姓名/协议编号"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'OperationPlannedBillDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownloadExcel"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-alert title="注意: ATS暂时不计算逾期后的费用计算, 等后期系统完善后逐步补充."></el-alert>
    <el-row>
      <el-table :data="planData" class='table-center' border>
        <el-table-column prop="loanApplicationNo" label="借款编号"></el-table-column>
        <el-table-column prop="assetOrgName" label="资产渠道"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/企业名称"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="projectType" label="业务类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE))"></el-table-column>
        <el-table-column prop="repayWay" label="还款方式"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY))"></el-table-column>
        <el-table-column prop="repayYearRate" label="借款利率(年化利率)"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column prop="repayTimeType" label="期数单位"
                         :formatter="(row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`"></el-table-column>
        <!--<el-table-column prop="loanAmount" label="借款金额(元)"></el-table-column>-->
        <el-table-column prop="currentTerms" label="期数"></el-table-column>
        <el-table-column prop="planedRepayDate" label="应收日期"></el-table-column>
        <el-table-column prop="totalAmount" label="应收金额(元)"></el-table-column>
        <el-table-column prop="planedCapAmount" label="应收本金(元)"></el-table-column>
        <el-table-column prop="planedIntAmount" label="应收利息(元)"></el-table-column>
        <el-table-column prop="planedFeeAmount" label="应收手续费(元)"></el-table-column>
        <el-table-column prop="repayStatus" label="账单状态"
                         :formatter="(row, col, val) => ($filter(val, this.$enum.BILL_STATUS,this.$enum.BILL_STATUS))"></el-table-column>
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
  import {getReceivableBill, downloadReceivableBillList} from '../../api/operation';

  export default {
    data() {
      return {
        pageTotal: 0,
        search: {
          planedRepayDateStart: this.$dateStringify(new Date()),
          planedRepayDateEnd: this.$dateStringify(this.$lastNMonth(new Date(), -6)),
          assetChannel: '',
          repayStatus: '',
          searchKeyword: '',
          pageNumber: 1,
          pageSize: 20
        },
        planData: [],
        shortcuts: [
          {
            text: '未来一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 31);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '未来半年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 183);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '未来一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    },
    created() {
      this.getData(1);
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
      }
    },
    methods: {
      handleDownloadExcel() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadReceivableBillList(search), this.$store);
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getReceivableBill(search).then(response => {
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
        this.getData(1);
      }
    }
  }

</script>
