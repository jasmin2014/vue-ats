<!--ActualBill 实还账单-->
<template>
  <div class="loan">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="实还日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资金端" prop="sources">
            <ats-select v-model="search.fundOrg"
                        :org="this.$enum.BUSINESS_CHAIN_FUND"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="账单状态" prop="sources">
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
            <el-input v-model="search.searchKeyword" placeholder="借贷编号/客户姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="搜索"
                     @click="handleSearch"></el-button>
          <!--<el-button type="warning" icon="fa fa-download" title="导出数据到Excel"-->
                     <!--@click="handleDownload"></el-button>-->
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :key="index" align="center"></el-table-column>
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
  import {getActualBillList, downloadActualBillList} from '../../api/operation'

  export default {
    data() {
      return {
        list: [],
        totalRecord: 0,
        search: {
          fundOrg: '',
          actRepayDateStart: this.$dateStringify(this.$lastNMonth(new Date())),
          actRepayDateEnd: this.$dateStringify(new Date()),
          pageNumber: 1,
          pageSize: 20,
          searchKeyword: '',
          repayStatus: ''
        },
        table: [
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '资金端',
            prop: 'fundName'
          },
          {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          },
          {
            label: '客户姓名',
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
            label: '应还日期',
            prop: 'planedRepayDate'
          },
          {
            label: '实还日期',
            prop: 'actRepayDate'
          },
          {
            label: '实还金额(元)',
            prop: 'repayAmount'
          },
          {
            label: '剩余应还金额(元)',
            prop: 'restAmount'
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
            label: '实还违约金(元)',
            prop: 'actDefaultsFee'
          },
          {
            label: '实还罚息(元)',
            prop: 'actPenaltyFee'
          },
          {
            label: '账单状态',
            prop: 'repayStatus',
            formatter: (row, col, value) => this.$filter(value, this.$enum.BILL_STATUS, this.$enum.BILL_STATUS)
          }
        ]
      }
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
            return '';
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
    created() {
      this.getList(1);
    },
    methods: {
      handleSearch() {
        this.getList(1);
      },
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadActualBillList(search), this.$store)
      },
      getList(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getActualBillList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.totalRecord = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
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
  }

</script>

