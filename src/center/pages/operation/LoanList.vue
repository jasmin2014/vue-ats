<!-- 放款记录 -->
<template>
  <div class="loan">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="放款时间">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetOrg"
                        :org="this.$enum.BUSINESS_ASSET"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资金端">
            <ats-select v-model="search.fundOrg"
                        :org="this.$enum.BUSINESS_FUND"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="借贷编号/协议编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search"
                     @click="handleSearch"></el-button>
          <el-button v-action="'OperationLoanDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownload"></el-button>
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
  import { getLoanList, downloadLoanList } from '../../api/operation'

  export default {
    data() {
      return {
        list: [], // 列表数据
        totalRecord: 0,
        search: {
          paymentDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          paymentDateEnd: this.$dateStringify(new Date()),
          searchKeyword: '',
          fundOrg: '',
          pageSize: 20,
          pageNumber: 1
        },
        table: [
          {
            label: '放款编号',
            prop: 'paymentNo'
          },
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
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
            label: '资产渠道',
            prop: 'assetChannel'
          },
          {
            label: '资金端',
            prop: 'fundName'
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
            label: '借款期数',
            prop: 'repayTerms'
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
            label: '到账金额(元)',
            prop: 'amount'
          },
          {
            label: '放款时间',
            prop: 'paymentDate'
          }
        ]
      }
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.paymentDateStart || this.search.paymentDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.paymentDateStart;
            dateRange[1] = this.search.paymentDateEnd;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.search.paymentDateStart = range[0];
            this.search.paymentDateEnd = range[1];
          } else {
            this.search.paymentDateStart = '';
            this.search.paymentDateEnd = '';
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
        this.$download(downloadLoanList(search), this.$store);
      },
      getList(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getLoanList(search).then(response => {
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
  }

</script>
