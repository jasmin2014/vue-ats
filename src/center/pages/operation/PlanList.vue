<!-- 还款计划 -->
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
          <el-form-item label="资金端">
            <ats-select v-model="search.raisePartyOrg"
                        :org="this.$enum.BUSINESS_FUND"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetChannel"
                        placeholder="全部"
                        :org="this.$enum.BUSINESS_ASSET"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams"
                      placeholder="借款编号/协议编号/客户姓名/企业名称"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search"
                     @click="handleSearch"></el-button>
          <el-button v-action="'OperationPlanDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownload"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip v-action="'OperationPlanDetail'"
                        content="查看">
              <el-button size="small" icon="fa fa-eye"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="totalRecord" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import { getRepayList, downloadRepayList } from '../../api/operation'

  export default {
    data() {
      return {
        list: [], // 列表数据
        totalRecord: 0, // 总条数
        search: {
          paymentStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          paymentEndTime: this.$dateStringify(new Date()),
          otherParams: '',
          raisePartyOrg: '',
          assetChannel: '',
          pageSize: 20,
          pageNumber: 1
        },
        table: [
          {
            label: '借款编号',
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
            prop: 'assetOrgName'
          },
          {
            label: '资金端',
            prop: 'fundOrgName'
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '项目名称',
            prop: 'projectName',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_TYPE, row.assetKind)
          },
          {
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, value) => this.$filter(value, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, value) => this.$filter(value, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '借款利率(年化利率)',
            prop: 'repayIntRate',
            formatter: (row, col, value) => this.$floatToPercentage(value)
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
            label: '放款时间',
            prop: 'paymentDate'
          }
        ]
      }
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
            return '';
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
    created() {
      this.getData(1);
    },
    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadRepayList(search), this.$store);
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleDetail(row) {
        this.$router.push({ name: 'OperationPlanDetail', params: { id: row.id } });
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getRepayList(search).then(response => {
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
