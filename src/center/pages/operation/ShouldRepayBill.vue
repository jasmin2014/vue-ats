<!--ReturnBill 应还账单-->
<template>
  <div class="loan">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="应还日期">
            <ats-date-picker-query v-model="applyDate"
                                   :shortcuts="shortcuts"
                                   :disable-future="false"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资产渠道" prop="sources">
            <ats-select v-model="search.assetOrg"
                        placeholder="全部" :clearable="true"
                        :org="this.$enum.BUSINESS_ASSET"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资金端" prop="sources">
            <ats-select v-model="search.fundOrg"
                        :org="this.$enum.BUSINESS_FUND"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="账单状态" prop="sources">
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
            <el-input v-model="search.searchKeyword" placeholder="借款编号/客户姓名/协议编号"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="搜索"
                     @click="handleSearch"></el-button>
          <el-button v-action="'OperationPlannedBillDownload'"
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
      <el-pagination :total="totalRecord" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getShouldRepayBillList, downloadShouldRepayBillList} from '../../api/operation'

  export default {
    data() {
      return {
        list: [], // 列表数据
        totalRecord: 0, // 总条数
        search: {
          searchKeyword: '',
          repayStatus: '',
          assetOrg: '',
          planedRepayDateStart: this.$dateStringify(new Date()),
          planedRepayDateEnd: this.$dateStringify(this.$lastNMonth(new Date(), -6)),
          pageNumber: 1,
          pageSize: 20,
          fundOrg: ''
        },
        table: [
          {
            label: '借款编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '资金端',
            prop: 'fundOrgName'
          },
          {
            label: '协议编号',
            prop: 'contract'
          },
          {
            label: '资产渠道',
            prop: 'assetOrgName'
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
            prop: 'repayYearRate',
            formatter: (row, col, value) => this.$floatToPercentage(value)
          },
          {
            label: '期数单位',
            prop: 'repayTimeType',
            formatter: (row, col, value) => `${row.repayTime}${this.$filter(value, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          // {
          //   label: '借款金额(元)',
          //   prop: 'loanAmount'
          // },
          {
            label: '期数',
            prop: 'term',
            formatter: (row, col, value) => `${value}/${row.repayTerms}`
          },
          {
            label: '应还日期',
            prop: 'planedRepayDate'
          },
          {
            label: '应还金额(元)',
            prop: 'totalAmount'
          },
          {
            label: '应还本金(元)',
            prop: 'planedCapAmount'
          },
          {
            label: '应还利息(元)',
            prop: 'planedIntAmount'
          },
          {
            label: '应还手续费(元)',
            prop: 'planedFeeAmount'
          },
          {
            label: '账单状态',
            prop: 'repayStatus',
            formatter: (row, col, value) => this.$filter(value, this.$enum.BILL_STATUS, this.$enum.BILL_STATUS)
          }
        ],
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
    computed: {
      applyDate: {
        get() {
          if (this.search.planedRepayDateStart || this.search.planedRepayDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.planedRepayDateStart;
            dateRange[1] = this.search.planedRepayDateEnd;
            return dateRange;
          } else {
            return '';
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
    created() {
      this.getData(1);
    },
    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadShouldRepayBillList(search), this.$store);
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getShouldRepayBillList(search).then(response => {
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

