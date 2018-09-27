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
          <el-form-item label="项目名称">
            <ats-select v-model="search.loanKind" placeholder="全部" :clearable="true"
                        :kind="this.$enum.LOAN_TYPE" :group="search.assetKind"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <ats-select v-model="assetStatus" placeholder="全部" :clearable="true"
                        :kind="this.$enum.LOAN_STATUS" :group="this.$enum.LOAN_STATUS_GROUP"
                        :sequence="[0,1,2,3,4,5,6,7,8,9,13,14]"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.otherParams" placeholder="借贷编号/协议编号/客户姓名/企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'AssetApplyCreate'"
                     type="primary" icon="fa fa-plus" title="添加"
                     @click="handleCreate"></el-button>
          <el-button v-action="'AssetApplyBatchSubmit'"
                     type="success" icon="fa fa-check-square"
                     @click="handleBatchSubmit">&nbsp;提交</el-button>
          <el-button v-action="'AssetApplyRevoke'"
                     type="warning" icon="fa fa-undo"
                     @click="handleBatchRevoke">&nbsp;撤贷</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :width="col.width" :key="index" align="center"></el-table-column>
        <el-table-column label="备注" align="center" fixed="right">
          <template slot-scope="scope">
            {{ scope.row.remarks }}<br>
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
            <!--下期需求-->
            <!--<el-tooltip v-action="'AssetApplyPlanDetail'"-->
                        <!--content="查看还款计划">-->
              <!--<el-button size="small"-->
                         <!--@click="handlePlanDetail(scope.row)">还款计划</el-button>-->
            <!--</el-tooltip>-->
            <el-tooltip v-action="'AssetApplyEdit'"
                        v-if="canEdit(scope.row.status)"
                        content="编辑">
              <el-button size="small" type="info" icon="fa fa-edit"
                         @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetApplyDelete'"
                        v-if="canDelete(scope.row.status)"
                        content="删除">
              <el-button size="small" type="danger" icon="fa fa-trash"
                         @click="handleDelete(scope.row)"></el-button>
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
  import {
    getLoanApplicationList,
    getLoanRemark,
    batchSubmit,
    batchRevoke,
    deleteLoan} from '../../api/asset'

  export default {
    data() {
      return {
        activeName: 'personal',
        search: {
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          statusCount: this.$arrayToBinary([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14]),
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        list: [],
        selected: [],
        table: [
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
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '借款利率区间',
            prop: 'loanYearRateMin',
            formatter: (row, col, val) => !val && !row.loanYearRateMax ? '--' : `${this.$floatToPercentage(val) || ''} - ${this.$floatToPercentage(row.loanYearRateMax) || ''}`
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
            label: '募集期',
            prop: 'raiseFromDate',
            width: 100,
            formatter: (row, col, value) => (value || row.raiseThruDate) ? `${value.slice() || '?'} - ${row.raiseThruDate || '?'}` : '不限'
          },
          {
            label: '状态',
            prop: 'status',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_STATUS, this.$enum.LOAN_STATUS_GROUP)
          },
          {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
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
            this.assetStatusList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14]
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
      handleBatchSubmit() {
        const selectedIds = this.selected.filter(_ => this.canSubmit(_.status)).map(_ => _.id);
        if (selectedIds.length === 0) {
          this.$message.error('没有可提交的借贷申请')
        } else {
          this.doSubmit(this.$deepcopy(selectedIds), true);
        }
      },
      handleBatchRevoke() {
        const selectedIds = this.selected.filter(_ => this.canRevoke(_.status)).map(_ => _.id);
        if (selectedIds.length === 0) {
          this.$message.error('没有可撤销的借贷申请')
        } else {
          this.doRevoke(this.$deepcopy(selectedIds), true);
        }
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
      canEdit(status) {
        return this.canSubmit(status)
      },
      canSubmit(status) {
        return [this.$enum.LOAN_STATUS_SUBMITTING, this.$enum.LOAN_STATUS_REJECTED, this.$enum.LOAN_STATUS_WAIT_FEEDBACK].includes(status)
      },
      canRevoke(status) {
        return ![this.$enum.LOAN_STATUS_IN_LOAN,
          this.$enum.LOAN_STATUS_WITHDRAWAL,
          this.$enum.LOAN_STATUS_LOAN_FAIL].includes(status);
      },
      canDelete(status) {
        return [this.$enum.LOAN_STATUS_SUBMITTING, this.$enum.LOAN_STATUS_REJECTED, this.$enum.LOAN_STATUS_RAISE_FAIL].includes(status)
      },
      doSubmit(idList, isBatch = false) {
        batchSubmit(idList).then(({data}) => {
          if (data.code === 200) {
            if (isBatch) {
              data.body.failCount = this.selected.length - data.body.successCount;
            }
            setTimeout(() => {
              this.$message({
                message: `${data.body.successCount}条提交成功` + (data.body.failCount > 0 ? `，${data.body.failCount}条提交失败 ${data.detail}` : ''),
                type: data.body.successCount === 0 ? 'error' : 'success'
              });
              this.getData(this.search.pageNumber)
            }, 1000);
          }
        }).catch(() => {
          setTimeout(() => {
            this.getData(this.search.pageNumber)
          }, 1000);
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
          setTimeout(() => {
            this.getData(this.search.pageNumber)
          }, 1000);
        })
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getLoanApplicationList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
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
