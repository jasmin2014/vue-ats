<template>
  <div class="task-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="任务类型">
            <ats-select v-model="search.type"
                        :kind="$enum.TASK_TYPE"
                        :group="$enum.TASK_TYPE"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="执行状态">
            <ats-select v-model="search.status"
                        :kind="$enum.TASK_STATUS"
                        :group="$enum.TASK_STATUS"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="执行时间">
            <el-date-picker v-model="date"
                            :picker-options="{ shortcuts: dateShortcuts }"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            clearable>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查询"
                     @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" border>
      <el-table-column v-for="(col, i) in table"
                       :key="i"
                       v-bind="col"
                       align="center"></el-table-column>
      <el-table-column label="执行日志" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.exeResult" size="small"
                     @click="handleExeResult(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="pageTotal" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>

    <el-dialog :visible.sync="dialog.visible" title="执行日志" width="1000px">
      <code v-html="dialog.exeResult"></code>
    </el-dialog>
  </div>
</template>

<script>
  import { getTaskList } from '../../api/system';

  export default {
    data() {
      return {
        search: {
          type: '',
          status: this.$enum.TASK_STATUS_FAILURE,
          startDate: this.$dateStringify(new Date(Date.now() - 3600 * 1000 * 24), 'yyyy-MM-dd HH:mm:ss'),
          endDate: this.$dateStringify(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        list: [],
        dialog: {
          visible: false,
          exeResult: ''
        },
        table: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '任务名称',
            prop: 'taskName'
          },
          {
            label: '执行时间',
            prop: 'exeTime'
          },
          {
            label: '执行状态',
            prop: 'status',
            formatter: (row, col, val) => this.$filter(val, this.$enum.TASK_STATUS, this.$enum.TASK_STATUS)
          },
          {
            label: '执行备注',
            prop: 'remarks'
          }
        ],
        dateShortcuts: [
          {
            text: '最近一小时',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 1);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    },
    computed: {
      date: {
        get() {
          if (this.search.startDate || this.search.endDate) {
            let dateRange = [];
            dateRange[0] = this.search.startDate;
            dateRange[1] = this.search.endDate;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.search.startDate = range[0];
            this.search.endDate = range[1];
          } else {
            this.search.startDate = '';
            this.search.endDate = '';
          }
        }
      }
    },

    created() {
      this.getData(1);
    },

    methods: {
      handleSearch() {
        this.getData(1)
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleExeResult(row) {
        this.dialog.exeResult = row.exeResult;
        this.dialog.visible = true;
      },

      getData(index) {
        const search = this.$objFilter({
          ...this.search,
          pageNumber: index
        }, _ => !!_);
        getTaskList(search).then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body.list || [];
            this.search.pageNumber = data.body.pageNumber;
            this.pageTotal = data.body.totalRecord;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }).catch(() => {
          this.list = [];
          this.pageTotal = 0;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  code {
    overflow: auto;
    display: block;
    width: 100%;
    padding: 16px;
    border-radius: 4px;
    background: #1b2426;
    color: white;
    font-family: "Consolas", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace;
  }
</style>
