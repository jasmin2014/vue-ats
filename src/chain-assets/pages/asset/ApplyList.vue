<template>
  <div class="apply-list">
    <el-form :model="search" class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="上传时间">
            <ats-date-picker-query v-model="uploadTime"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="借贷编号">
            <el-input v-model.trim="search.loanApplicationNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="主体性质">
            <ats-select v-model="search.loanPartyKind" placeholder="全部" clearable
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind" placeholder="全部" clearable
                        :kind="this.$enum.ASSET_TYPE"
                        :group="this.$enum.ASSET_TYPE"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="项目名称">
            <ats-select v-model="search.loanKind" placeholder="全部" clearable
                        :kind="this.$enum.LOAN_TYPE"
                        :group="search.assetKind"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产状态">
            <ats-select v-model="search.status" placeholder="全部" clearable
                        :kind="this.$enum.BLOCK_CHAIN_ASSET_STATUS"
                        :group="this.$enum.BLOCK_CHAIN_ASSET_STATUS"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="fa fa-search" title="查询"
                     @click="handleSearch"></el-button>
          <el-button type="primary" icon="fa fa-plus" title="新增资产"
                     @click="handleCreate"></el-button>
          <el-button type="success" icon="fa fa-check-square" title="批量上链"
                     @click="handleBatchSubmit">&nbsp;上链</el-button>
          <!--<el-button type="success" icon="fa fa-upload" title="导入数据"-->
                     <!--@click="handleUpload">&nbsp;导入</el-button>-->
          <!--<el-button type="warning" icon="fa fa-download" title="下载导入模板"-->
                     <!--@click="handleDownloadTpl">&nbsp;下载模板</el-button>-->
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" border
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" fixed="left" width="55"></el-table-column>
      <el-table-column v-for="col in table" :key="col.prop" align="center"
                       :label="col.label" :prop="col.prop" :formatter="col.formatter"></el-table-column>
      <el-table-column label="备注" align="center" fixed="right">
        <template slot-scope="scope">
          {{ scope.row.remarks }}<br>
          <!--<el-tooltip content="查看备注">-->
            <!--<el-button size="mini" icon="fa fa-ellipsis-h"-->
                       <!--@click="handleNoteDetail(scope.row)"></el-button>-->
          <!--</el-tooltip>-->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-tooltip content="查看">
            <el-button class="btn-operation"
                       size="mini" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="编辑">
            <el-button class="btn-operation"
                       size="mini" type="info" icon="fa fa-edit"
                       :disabled="!canEdit(scope.row)"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="上链">
            <el-button class="btn-operation"
                       size="mini" type="success" icon="fa fa-check-square"
                       :disabled="!canSubmit(scope.row)"
                       @click="handleSubmit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="撤回">
            <el-button class="btn-operation"
                       size="mini" type="warning" icon="fa fa-undo"
                       :disabled="!canRevoke(scope.row)"
                       @click="handleRevoke(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button class="btn-operation"
                       size="mini" type="danger" icon="fa fa-trash"
                       :disabled="!canDelete(scope.row)"
                       @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next"
                     :total="pageTotal"
                     :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getApplyList, checkUpChain, upChain, previewLoanApplication, deleteLoanApplication, revokeLoanApplication} from '../../api/asset';

  export default {
    data() {
      return {
        search: {
          uploadStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          uploadEndTime: this.$dateStringify(new Date()),
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        list: [],
        selected: [],
        table: [
          {
            label: '上传时间',
            prop: 'uploadTime'
          },
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '项目名称',
            prop: 'loanKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind)
          },
          {
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '年利率',
            prop: 'yearRate',
            formatter: (row, col, val) => this.$floatToPercentage(val)
          },
          {
            label: '借款期数',
            prop: 'loanTerms'
          },
          {
            label: '期数单位',
            prop: 'loanTimeType',
            formatter: (row, col, val) => `${row.loanTime || ''}${this.$filter(val || '', this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, val) => this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '分享额度(元)',
            prop: 'shareAmount'
          },
          {
            label: '资产状态',
            prop: 'status',
            formatter: (row, col, val) => this.$filter(val, this.$enum.BLOCK_CHAIN_ASSET_STATUS, this.$enum.BLOCK_CHAIN_ASSET_STATUS)
          }
        ]
      }
    },
    computed: {
      uploadTime: {
        get() {
          if (this.search.uploadStartTime && this.search.uploadEndTime) {
            const dateRange = [];
            dateRange[0] = this.search.uploadStartTime;
            dateRange[1] = this.search.uploadEndTime;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.uploadStartTime = val[0];
            this.search.uploadEndTime = val[1]
          } else {
            this.search.uploadStartTime = '';
            this.search.uploadEndTime = ''
          }
        }
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      canEdit(row) {
        return [this.$enum.BLOCK_CHAIN_ASSET_STATUS_WAIT_UPPER_CHAIN, this.$enum.BLOCK_CHAIN_ASSET_STATUS_ABORTIVE].includes(row.status);
      },
      canDelete(row) {
        return this.canEdit(row);
      },
      canSubmit(row) {
        return this.canEdit(row);
      },
      canRevoke(row) {
        return [this.$enum.BLOCK_CHAIN_ASSET_STATUS_WAIT_CLAIMABLE].includes(row.status);
      },
      handleDetail(row) {
        this.$router.push({
          name: 'AssetApplyDetail',
          params: { id: row.assetId }
        });
      },
      handleEdit(row) {
        this.$router.push({
          name: 'AssetApplyEdit',
          params: { id: row.assetId }
        });
      },
      handleSubmit(row) {
        previewLoanApplication(row.assetId).then(({ data }) => {
          if (data.code === 200) {
            this.$router.push({
              name: 'AssetApplyPreview',
              params: { id: row.assetId }
            });
          } else {
            this.$alert(data.detail || data.message, '提示', {
              type: 'error'
            })
          }
        })
      },
      handleRevoke(row) {
        this.$confirm('撤回资产将不再参与联盟共享，确定撤回?', '提示', {
          type: 'warning'
        }).then(() => {
          revokeLoanApplication([row.assetId]).then(({ data }) => {
            if (data.code === 200) {
              this.$message({
                message: '撤回成功',
                type: 'success'
              });
              this.getData(1);
            } else {
              this.$message.error(data.detail || data.message)
            }
          })
        }).catch(() => {})
      },
      handleDelete(row) {
        this.$confirm('确定删除借款申请?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteLoanApplication(row.assetId).then(({ data }) => {
            if (data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData(1);
            }
          })
        }).catch(() => {})
      },
      handleSearch() {
        this.getData(1);
      },
      handleCreate() {
        this.$router.push({
          name: 'AssetApplyCreate'
        })
      },
      handleBatchSubmit() {
        const ids = this.selected.filter(_ => this.canSubmit(_)).map(_ => _.assetId);
        checkUpChain(ids).then(({ data }) => {
          if (data.code === 200 && data.body && data.body.result) {
            this.upChain(ids)
          } else {
            this.$alert(data.detail || data.message)
          }
        }).catch(() => {})
      },
      handleUpload() {

      },
      handleDownloadTpl() {

      },
      handleSelectionChange(value) {
        this.selected = value;
      },
      handleNoteDetail(row) {
        // getLoanRemark(row.id).then(response => {
        //   const res = response.data;
        //   if (res.code === 200) {
        //     const note = res.body.map((_, i) => `${i + 1}. ${_.remarks}[${_.createdTime}]`).join('\n');
        //     const h = this.$createElement;
        //     const message = note.length ? h('div', null, note.split('\n').map(_ => h('p', null, _))) : '无';
        //     this.$msgbox({
        //       title: '备注',
        //       message
        //     }).catch(() => {
        //     })
        //   }
        // }, () => {})
      },
      upChain(idList) {
        upChain(idList).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: data.message,
              type: 'success'
            });
            this.getData(1);
          } else {
            this.$message.error(data.detail || data.message)
          }
        }).catch(() => {})
      },
      getData(index) {
        const search = this.$objFilter(this.search, _ => _ !== '');
        search.pageNumber = index;
        getApplyList(search).then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord || 0;
            this.search.pageNumber = index;
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
  .btn-operation {
    padding: 7px 10px;

    & + .btn-operation {
      margin-left: 2px;
    }
  }
</style>
