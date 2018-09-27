<!--异常放款-->
<template>
  <div class="loan">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="异常时间">
            <ats-date-picker-query v-model="mistakeDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.searchKeyword"
                      placeholder="姓名/协议编号/借贷编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="fa fa-search" title="搜索"
                     @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width" :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope" v-if="scope.row.displayType != '2'">
            <el-tooltip  v-if="scope.row.displayType == '1' || scope.row.displayType == '0'"
              v-action="'OperationLoanExceptionReloan'"
                        content="重新放款">
              <el-button size="small"
                         @click="handleReloan(scope.row)">重新放款</el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.displayType == '1'"
                        v-action="'OperationLoanExceptionFeedback'"
                        content="信息问题反馈">
              <el-button size="small" type="info"
                         @click="handleFeedback(scope.row)">信息问题反馈</el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.displayType == '3'"
                        v-action="'OperationLoanExceptionFeedback'"
                        content="处理中">
              <el-button size="small" type="info"
                         plain disabled>处理中</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getLoanExceptionList, mistakeReloan, mistakeFeedback} from '../../api/operation'

  export default {
    data() {
      return {
        search: {
          mistakeDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          mistakeDateEnd: this.$dateStringify(new Date()),
          searchKeyword: '',
          pageNumber: 1,
          pageSize: 20
        },
        pageTotal: 0,
        list: [],
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
            label: '异常原因',
            prop: 'mistakeMessage',
            width: 200
          },
          {
            label: '异常时间',
            prop: 'createdTime'
          }
        ]
      }
    },
    computed: {
      mistakeDate: {
        get() {
          if (this.search.mistakeDateStart && this.search.mistakeDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.mistakeDateStart;
            dateRange[1] = this.search.mistakeDateEnd;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.mistakeDateStart = val[0];
            this.search.mistakeDateEnd = val[1]
          } else {
            this.search.mistakeDateStart = '';
            this.search.mistakeDateEnd = ''
          }
        }
      }
    },
    created() {
      this.getData(1)
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handleReloan(row) {
        this.$confirm('确定重新放款吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.doReloan(row.paymentId);
        });
      },
      handleFeedback(row) {
        this.$confirm('确定反馈异常原因吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.doFeedback(row.paymentId);
        });
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getLoanExceptionList(search).then(({ data }) => {
          if (data.code === 200 && data.body) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord;
            this.search.pageNumber = data.body.pageNumber;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.list = [];
          this.pageTotal = 0;
        })
      },
      // 重新放款
      doReloan(id) {
        mistakeReloan(id).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            setTimeout(() => {
              this.getData(this.search.pageNumber);
            }, 1000);
          }
        }, () => {})
      },
      // 信息反馈
      doFeedback(id) {
        mistakeFeedback(id).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
          setTimeout(() => {
            this.getData(this.search.pageNumber);
          }, 1000);
        })
      }
    }
  }
</script>


