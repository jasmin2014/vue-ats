<template>
  <div class="asset-list">
    <el-form :model="search" class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="申请时间">
            <ats-date-picker-query v-model="appliedTime"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind" placeholder="全部" :clearable="true"
                        :kind="this.$enum.ASSET_TYPE" :group="this.$enum.ASSET_TYPE"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="业务类型">
            <ats-select v-model="search.projectType" placeholder="全部" :clearable="true"
                        :kind="this.$enum.PROJECT_TYPE" :group="this.$enum.PROJECT_TYPE"></ats-select>
          </el-form-item>
        </el-col>
        <!--<el-col :span="5">-->
          <!--<el-form-item label="项目名称">-->
            <!--<ats-select v-model="search.loanKind" placeholder="全部" :clearable="true"-->
                        <!--:kind="this.$enum.LOAN_TYPE" :group="search.assetKind"></ats-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="5">
          <el-form-item label="状态">
            <ats-select v-model="assetStatus" placeholder="全部" :clearable="true"
                        :kind="this.$enum.LOAN_STATUS" :group="this.$enum.LOAN_STATUS_GROUP"
                        :sequence="statusSequence"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.otherParams" placeholder="借款编号/协议编号/客户姓名/企业名称"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'AssetApplyCreate'"
                     type="primary" icon="fa fa-plus" title="添加"
                     @click="handleCreate"></el-button>
          <el-button v-action="'AssetApplyBatchSubmit'"
                     type="success" icon="fa fa-check-square"
                     @click="handleBatchSubmit">&nbsp;提交</el-button>
          <el-button v-action="'AssetApplyRevoke'"
                     v-if="$store.state.user.repealSwitch === 1"
                     type="warning" icon="fa fa-undo"
                     @click="handleBatchRevoke">&nbsp;撤贷</el-button>
          <el-button v-action="'AssetApplyDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownload"></el-button>
          <stat-loan-amount v-action="'AssetApplyStat'"
                            :list="list.map(_ => _.loanAmount)"
                            :search="oldSearch"
                            :get-total="getTotal"
                            style="margin-left: 10px;"></stat-loan-amount>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border
                @selection-change="handleSelectionChange">
        <el-table-column v-for="(col, index) in table" :key="index"
                         v-bind="col"
                         align="center"></el-table-column>
        <el-table-column label="状态" align="center" fixed="right" width="100">
          <template slot-scope="scope">
            <el-tag v-if="isSubmitting(scope.row)"
                    :type="$enum.LOAN_STATUS_COLOR_MAP[scope.row.status]">提交中</el-tag>
            <el-tag v-else
                    :type="$enum.LOAN_STATUS_COLOR_MAP[scope.row.status]">
              {{ $filter(scope.row.status, $enum.LOAN_STATUS, $enum.LOAN_STATUS_GROUP) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" fixed="right">
          <template slot-scope="scope">
            {{ scope.row.remarks ? scope.row.remarks.split(':')[0] : '' }}<br>
            <el-tooltip content="查看备注">
              <el-button size="mini" icon="fa fa-ellipsis-h"
                         @click="handleNoteDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetApplyDetail'"
                        content="查看">
              <el-button size="small" icon="fa fa-eye"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetApplyEdit'"
                        v-if="canEdit(scope.row)"
                        content="编辑">
              <el-button size="small" type="info" icon="fa fa-edit"
                         @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetApplyDelete'"
                        v-if="canDelete(scope.row)"
                        content="删除">
              <el-button size="small" type="danger" icon="fa fa-trash"
                         @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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
  import {
    getLoanApplicationList,
    getLoanRemark,
    batchSubmit,
    batchRevoke,
    deleteLoan,
    downloadLoanApplicationList,
    getLoanApplicationTotal
  } from '../../api/asset'
  import StatLoanAmount from '../../../modules/stat/StatLoanAmount'

  const statusSequence = [0, 1, 3, 5, 6, 8, 14];

  export default {
    components: {
      StatLoanAmount
    },
    data() {
      return {
        statusSequence,
        getTotal: getLoanApplicationTotal,
        search: {
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          statusCount: this.$arrayToBinary(statusSequence),
          pageSize: 20,
          pageNumber: 1
        },
        oldSearch: {},
        pageTotal: 0,
        list: [],
        selected: [],
        table: [
          {
            type: 'selection',
            width: 55,
            fixed: 'left',
            selectable: (row) => (this.canSubmit(row) || this.canRevoke(row)) && !this.isSubmitting(row)
          },
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
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, value) => this.$filter(value, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '项目名称',
            prop: 'projectName'
          },
          {
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '借款利率(年化利率)',
            prop: 'repayYearRate',
            formatter: (row, col, val) => this.$floatToPercentage(val)
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
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, value) => this.$filter(value, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          },
          {
            label: '所属营业部',
            prop: 'creatorBusiness'
          }
        ]
      };
    },
    computed: {
      appliedTime: {
        get() {
          if (this.search.appliedStartTime && this.search.appliedEndTime) {
            const dateRange = [];
            dateRange[0] = this.search.appliedStartTime;
            dateRange[1] = this.search.appliedEndTime;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.appliedStartTime = val[0];
            this.search.appliedEndTime = val[1]
          } else {
            this.search.appliedStartTime = '';
            this.search.appliedEndTime = ''
          }
        }
      },
      assetStatusList: {
        get() {
          return this.$binaryToArray(this.search.statusCount || 0)
        },
        set(val) {
          this.search.statusCount = this.$arrayToBinary(val)
        }
      },
      assetStatus: {
        get() {
          if (this.assetStatusList && this.assetStatusList.length === 1) {
            return this.$enum.LOAN_STATUS_LIST[this.assetStatusList[0]]
          } else {
            return ''
          }
        },
        set(val) {
          if (val) {
            this.assetStatusList = [this.$enum.LOAN_STATUS_LIST.indexOf(val)]
          } else {
            this.assetStatusList = statusSequence
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
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleBatchSubmit() {
        const selectedIds = this.selected.filter(_ => this.canSubmit(_)).map(_ => _.id);
        if (selectedIds.length === 0) {
          this.$message.error('没有可提交的借贷申请');
          this.getData(this.search.pageNumber)
        } else {
          this.doSubmit(this.$deepcopy(selectedIds), true);
        }
      },
      handleBatchRevoke() {
        const selectedIds = this.selected.filter(_ => this.canRevoke(_)).map(_ => _.id);
        if (selectedIds.length === 0) {
          this.$message.error('没有可撤销的借贷申请');
          this.getData(this.search.pageNumber)
        } else {
          this.$confirm('确定对借款申请进行撤贷？', '提示').then(() => {
            this.doRevoke(this.$deepcopy(selectedIds), true);
          })
        }
      },
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadLoanApplicationList(search), this.$store)
      },
      handleCreate() {
        this.$router.push({
          name: 'AssetApplyCreate'
        });
      },
      handleSelectionChange(value) {
        this.selected = value;
      },
      handleDetail(row) {
        this.$router.push({
          name: 'AssetApplyDetail',
          params: { id: row.id }
        });
      },
      // handlePlanDetail(row) {
      //   this.$router.push({
      //     name: 'AssetApplyPlanDetail',
      //     params: {
      //       id: row.id
      //     }
      //   })
      // },
      handleEdit(row) {
        this.$router.push({
          name: 'AssetApplyEdit',
          params: { id: row.id }
        });
      },
      handleSubmit(row) {
        this.doSubmit([row.id])
      },
      handleDelete(row) {
        this.$confirm('确定删除借款申请?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteLoan(row.id).then(({status}) => {
            if (status === 204) {
              setTimeout(() => {
                this.$message({
                  message: '借款申请删除成功',
                  type: 'success'
                });
                this.getData(this.search.pageNumber)
              }, 1000);
            }
          }, () => {
            setTimeout(() => {
              this.getData(this.search.pageNumber)
            }, 1000);
          });
        }).catch(() => {})
      },
      handleNoteDetail(row) {
        getLoanRemark(row.id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            const note = res.body.map((_, i) => `${i + 1}. ${_.remarks}[${_.createdTime}]`).join('\n');
            const h = this.$createElement;
            const message = note.length ? h('div', null, note.split('\n').map(_ => h('p', null, _))) : '无';
            this.$msgbox({
              title: '备注',
              message
            }).catch(() => {})
          }
        }, () => {})
      },
      isSubmitting(row) {
        return row.autoSubmit === 1 && row.status === this.$enum.LOAN_STATUS_SUBMITTING; // 自动提交开 且 状态为待提交
      },
      canEdit(row) {
        return this.canSubmit(row)
      },
      canSubmit(row) {
        return [this.$enum.LOAN_STATUS_REJECTED, this.$enum.LOAN_STATUS_WAIT_FEEDBACK, this.$enum.LOAN_STATUS_SUBMITTING].includes(row.status) && !this.isSubmitting(row);
      },
      canRevoke(row) {
        return ![this.$enum.LOAN_STATUS_IN_LOAN,
          this.$enum.LOAN_STATUS_WITHDRAWAL,
          this.$enum.LOAN_STATUS_LOAN_FAIL].includes(row.status);
      },
      canDelete(row) {
        return [this.$enum.LOAN_STATUS_WITHDRAWAL].includes(row.status)
      },
      doSubmit(idList, isBatch = false) {
        batchSubmit(idList).then(({data}) => {
          if (data.code === 200) {
            if (isBatch) {
              data.body.failCount = this.selected.length - data.body.successCount;
            }
            setTimeout(() => {
              this.$message({
                message: `${data.body.successCount}条提交成功` + (data.body.failCount > 0 ? `，${data.body.failCount}条提交失败` : ''),
                type: data.body.successCount === 0 ? 'error' : 'success'
              });
              this.getData(this.search.pageNumber)
            }, 1000);
          }
        }).catch(() => {
          this.getData(this.search.pageNumber)
        })
      },
      doRevoke(idList) {
        batchRevoke(idList).then(({data}) => {
          if (data.code === 200) {
            data.body.failCount = this.selected.length - data.body.successCount;
            setTimeout(() => {
              this.$message({
                message: `${data.body.successCount}条撤贷请求提交成功` + (data.body.failCount > 0 ? `，${data.body.failCount}条撤贷请求提交失败 ${data.detail}` : ''),
                type: data.body.successCount === 0 ? 'error' : 'success'
              });
              this.getData(this.search.pageNumber)
            }, 1000);
          }
        }).catch(() => {
          this.getData(this.search.pageNumber)
        })
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getLoanApplicationList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.oldSearch = search;
            this.list = res.body.list || [];
            this.pageTotal = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.list = [];
          this.pageTotal = 0;
        })
      }
    }
  };
</script>
