<template>
  <div class="upload-new-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.name" placeholder="协议编号/客户姓名/企业名称"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </el-form>

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
          <el-tooltip content="查看">
            <el-button v-action="'AssetUploadDetail'"
                       size="small" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="$store.state.user.id === scope.row.createdBy" content="编辑">
            <el-button v-action="'AssetUploadEdit'" :disabled="scope.row.flag"
                       size="small" icon="fa fa-edit" type="info"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="$store.state.user.id === scope.row.createdBy" content="删除">
            <el-button v-action="'AssetUploadDelete'" :disabled="scope.row.flag"
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
  </div>
</template>

<script>
  import {getUploadAssetList, uploadSingleAsset, deleteUploadAsset} from '../../../api/asset';

  export default {
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
            label: '项目编号',
            prop: 'projectId'
          },
          {
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '利率类型',
            prop: 'repayRateType',
            formatter: (row, col, val) => (this.$filter(val, this.$enum.LOAN_RATES, this.$enum.LOAN_RATES))
          },
          {
            label: '利率',
            prop: 'loanIntRate',
            formatter: (row, col, val) => (this.$floatToPercentage(val))
          },
          {
            label: '借款期数',
            prop: 'repayTerms'
          },
          {
            label: '期数单位',
            prop: 'repayTimeType',
            formatter: (row, col, value) => `${row.repayTime || ''}${this.$filter(value || '', this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, value) => this.$filter(value, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          }
        ]
      }
    },
    mounted() {
      this.getData(1)
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.currentPage)
      },
      // handleUpload() {
      //   this.$confirm('确定上传所有资产数据?', '提示', {
      //     type: 'warning'
      //   }).then(() => {
      //     uploadZipList(this.search.uploadNo).then(({data}) => {
      //       if (data.code === 200) {
      //         this.$message({
      //           message: '上传成功',
      //           type: 'success'
      //         });
      //         this.$router.replace({
      //           name: 'AssetUploadBefore'
      //         })
      //       } else {
      //         this.$alert('有资产未上传成功，请在编辑页面查看失败原因，修改后再次上传。', '错误提示', {
      //           type: 'error',
      //           customClass: 'wide-box'
      //         });
      //         this.getData(1)
      //       }
      //     })
      //   }).catch(() => {})
      // },
      handleDetail(row) {
        this.$router.push({
          name: 'AssetUploadDetail',
          params: {
            id: row.id
          }
        });
      },
      handleEdit(row) {
        this.$router.push({
          name: 'AssetUploadEdit',
          params: {
            id: row.id
          }
        });
      },
      handleSingleUpload(row) {
        this.$confirm('确定上传?', '提示', {
          type: 'warning'
        }).then(() => {
          uploadSingleAsset(row._id).then(({data}) => {
            if (data.code === 200) {
              this.getData(this.search.currentPage);
              this.$message({
                message: '上传成功',
                type: 'success'
              })
            } else {
              this.$alert(`协议编号${row.loanApplicationDTO.contract}未上传成功，请在编辑页面查看失败原因，修改后再次上传。`, '提交失败', {
                type: 'error'
              })
            }
          })
        })
      },
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteUploadAsset(row.id).then(({status}) => {
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
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.currentPage = index;
        getUploadAssetList(search).then(({data}) => {
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
      }
    }
  }
</script>
