<template>
  <div class="upload-renew-list">
    <el-table :data="list" border>
      <el-table-column align="center" v-for="col in table" :key="col.prop" :fixed="col.fixed"
                       :label="col.label" :prop="col.prop" :formatter="col.formatter" :width="col.width"></el-table-column>
      <el-table-column align="center" label="状态" fixed="right" width="90">
        <template slot-scope="scope">
          <el-tag v-if="!scope.row.importStatus"
                  type="info" size="small">未上传</el-tag>
          <el-tag v-else-if="scope.row.importStatus === 1"
                  type="danger" size="small">上传失败</el-tag>
          <el-tag v-else-if="scope.row.importStatus === 2"
                  type="danger" size="small">解析失败</el-tag>
          <el-tooltip content="错误信息">
            <el-button v-if="scope.row.errorInfo && scope.row.errorInfo.length" size="mini" type="danger" plain icon="el-icon-warning" style="margin-top: 10px;"
                       @click="handleErrorInfo(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="190" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-if="$store.state.user.id === scope.row.userInfo.id" content="编辑">
            <el-button v-action="'AssetUploadEdit'"
                       size="small" icon="fa fa-edit" type="info"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="$store.state.user.id === scope.row.userInfo.id" content="删除">
            <el-button v-action="'AssetUploadDelete'"
                       size="small" icon="fa fa-trash" type="danger"
                       @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="pageTotal" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>

    <el-dialog :visible.sync="dialog.visible" title="编辑" width="700px"
               @close="handleDialogClose">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="20" :offset="2">
          <el-alert v-for="(msg, index) in dialog.errorList" :key="index"
                    class="error-msg"
                    :title="msg"
                    :closable="false"
                    type="error"></el-alert>
        </el-col>
      </el-row>
      <renew-loan v-if="dialog.form"
                  v-model="dialog.form"
                  mode="EDIT"
                  is-upload
                  @save="handleDialogConfirm"
                  @cancel="handleDialogCancel"></renew-loan>
    </el-dialog>
  </div>
</template>

<script>
  import RenewLoan from '../../../../modules/assets/RenewLoan'
  import {
    getRenewList,
    deleteRenew,
    getRenewDetail,
    saveRenew
  } from '../../../api/asset';

  export default {
    components: {
      RenewLoan
    },
    data() {
      return {
        search: {
          uploadNo: this.$route.params.id,
          currentPage: 1,
          pageSize: 20
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '原协议编号',
            prop: 'oldContract'
          },
          {
            label: '续借协议编号',
            prop: 'contract'
          },
          {
            label: '续借金额(元)',
            prop: 'amount'
          },
          {
            label: '续借期数',
            prop: 'loanTerms'
          },
          {
            label: '放款模式',
            prop: 'loanModel',
            formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_MODEL, this.$enum.LOAN_MODEL)
          },
          {
            label: '渠道借款利率',
            prop: 'repayRate',
            formatter: (row, col, val) => (this.$floatToPercentage(val))
          },
          {
            label: '利率类型',
            prop: 'repayRateType',
            formatter: (row, col, val) => (this.$filter(val, this.$enum.LOAN_RATES, this.$enum.LOAN_RATES))
          }
        ],
        dialog: {
          visible: false,
          id: null,
          form: null,
          errorList: []
        }
      }
    },
    mounted() {
      this.getData(1)
    },
    methods: {
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.currentPage)
      },
      handleEdit(row) {
        this.getDetail(row.id).then(({ body, attachments}) => {
          this.dialog.visible = true;
          this.dialog.id = row.id;
          this.dialog.form = body;
          this.dialog.errorList = body && body.errorInfo || [];
          this.$nextTick(() => {
            this.$set(this.dialog.form, 'attachments', attachments);
          });
        })
      },
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteRenew(row.id).then(({status}) => {
            if (status === 204) {
              this.getData(this.search.currentPage);
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          })
        })
      },
      handleErrorInfo(row) {
        const error = row.errorInfo;
        const h = this.$createElement;
        const message = error.length ? h('div', null, error.map(_ => h('p', null, _))) : '无';
        this.$msgbox({
          title: '错误信息',
          message
        }).catch(() => {})
      },

      handleDialogClose() {
        this.dialog.id = null;
        this.dialog.form = null;
        this.dialog.errorList = [];
      },
      handleDialogConfirm(val) {
        val.pics = {};
        val.pics[this.$enum.PROOF_MATERIAL_P_LOAN_APP] = (val.attachments || []).map(_ => ({
          id: _.id,
          kind: _.kind,
          fileName: _.name,
          fileUri: _.fileUrl
        }));
        delete val.attachments;

        this.save(this.dialog.id, this.search.uploadNo, val).then(() => {
          this.$message.success('上传成功');
          this.dialog.visible = false;
          this.getData(this.search.currentPage);
        }).catch((msg) => {
          msg && this.$message.error(msg);
          this.getDetail(this.dialog.id).then(({ body, attachments }) => {
            this.dialog.form = body;
            this.dialog.errorList = body.errorInfo || [];
            this.$nextTick(() => {
              this.$set(this.dialog.form, 'attachments', attachments);
            });
          });
          this.getData(this.search.currentPage);
        });
      },
      handleDialogCancel() {
        this.dialog.visible = false;
      },

      getData(index) {
        const search = this.$deepcopy(this.search);
        search.currentPage = index;
        getRenewList(search).then(({data}) => {
          if (data.code === 200 && data.body) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord || 0;
            this.search.currentPage = data.body.pageNumber || index;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }).catch(() => {
          this.list = [];
          this.pageTotal = 0;
        })
      },
      getDetail(id) {
        return new Promise((resolve, reject) => {
          getRenewDetail(id).then(({ data }) => {
            if (data.code === 200) {
              data.body.pics = data.body.pics || {};
              const attachments = (data.body.pics[this.$enum.PROOF_MATERIAL_P_LOAN_APP] || []).map(_ => ({
                id: _.id,
                kind: _.kind,
                name: _.fileName,
                fileType: _.fileType,
                fileUrl: _.fileUri
              }));
              delete data.body.pics;
              resolve({
                body: data.body,
                attachments: attachments
              });
            } else {
              reject()
            }
          }).catch(() => {
            reject()
          })
        })
      },
      save(mongodbId, uploadNo, val) {
        return new Promise((resolve, reject) => {
          saveRenew(mongodbId, uploadNo, val).then(({ data }) => {
            if (data.code === 200) {
              resolve()
            } else {
              reject(data.message)
            }
          }).catch(() => {
            reject()
          })
        })
      }
    }
  }
</script>
