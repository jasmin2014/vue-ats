<template>
  <div class="upload">
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-form>
          <el-form-item :error="error.type">
            <div class="upload-input">
              <el-col :span="17">
                <ats-select v-model="formData.type"
                            :kind="$enum.SUBJECT_PROP"
                            :group="$enum.SUBJECT_PROP"
                            placeholder="请选择客户主体性质"></ats-select>
              </el-col>
              <el-col :span="7">
                <a v-if="formData.type === $enum.SUBJECT_PROP_PERSON" href="/static/doc/PersonalReferenceTemplate.zip">
                  <el-button style="width: 100%;">个人模板</el-button>
                </a>
                <a v-else href="/static/doc/EnterpriseReferenceTemplate.zip">
                  <el-button style="width: 100%;">企业模板</el-button>
                </a>
              </el-col>
            </div>
          </el-form-item>
          <el-form-item :error="error.upload">
            <el-upload class="upload-input"
                       drag
                       :accept="accept"
                       :action="action"
                       :headers="headers"
                       :data="formData"
                       :multiple="false"
                       name="multipartFile"
                       :before-upload="handleBeforeUpload"
                       :on-success="handleSuccess"
                       :on-error="handleError">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传zip文件，且不超过100MB</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="mgt20">
      <el-table :data="zipList" border>
        <el-table-column align="center" v-for="col in table" :key="col.prop"
                         :label="col.label" :prop="col.prop" :type="col.type" :min-width="col.minWidth" :formatter="col.formatter"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.finish < 5" type="info" size="small"
                       :loading="scope.row.finish === 0"
                       :disabled="scope.row.finish === 2 || scope.row.finish === 5"
                       @click="handlePreviewList(scope.row)">预览</el-button>
            <el-tooltip v-if="$store.state.user.id === scope.row.createdBy" content="上传资产">
              <el-button v-if="scope.row.finish === 1 || (scope.row.finish > 2 && scope.row.finish < 5)"
                         type="success" size="small" icon="fa fa-upload"
                         :loading="scope.row.finish === 4"
                         :disabled="scope.row.finish === 5"
                         @click="handleUploadList(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-if="$store.state.user.id === scope.row.createdBy && scope.row.finish !== 0 && scope.row.finish !== 4" content="删除">
              <el-button type="danger" size="small" icon="fa fa-trash" title="删除"
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
    getUploadedZipList,
    uploadZipList,
    deleteUploadedZip
  } from '../../../api/asset';

  const FINISH_STATUS = {
    0: '解析中',
    1: '未上传',
    2: '解析失败',
    3: '部分未上传成功，请预览修改',
    4: '上传中',
    5: '全部上传成功'
  };
  export default {
    data() {
      return {
        formData: {
          type: this.$enum.SUBJECT_PROP_PERSON
        },
        error: {
          type: '',
          upload: ''
        },
        accept: '.zip',
        action: '/api/zuul/common/v1/loan/upload',
        headers: {
          'Authorization': this.$getLocalStorage('token')
        },
        pageTotal: 0,
        search: {
          pageSize: 10,
          pageNumber: 1,
          type: this.$enum.LOAN_PROP_NEW
        },
        zipList: [],
        uploadingZipList: [],
        timer: null,
        table: [
          {
            label: '序号',
            type: 'index'
          },
          {
            label: '上传编号',
            prop: 'uploadNo',
            minWidth: 60
          },
          {
            label: '文件名',
            prop: 'fileName'
          },
          {
            label: '上传时间',
            prop: 'createdTime',
            formatter: (row, col, val) => val.slice(0, -7),
            minWidth: 50
          },
          {
            label: '状态',
            prop: 'finish',
            formatter: (row, col, val) => FINISH_STATUS[val],
            minWidth: 40
          },
          {
            label: '创建人',
            prop: 'createdByName',
            minWidth: 35
          }
        ]
      }
    },
    mounted() {
      this.getData(1);
    },
    destroyed() {
      this.timer !== null && clearTimeout(this.timer)
    },
    methods: {
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handlePreviewList(row) {
        this.$router.push({
          name: 'AssetUploadAfter',
          params: {
            id: row.uploadNo
          },
          query: {
            type: this.search.type
          }
        })
      },
      handleUploadList(row) {
        this.$confirm('确定上传所有资产数据?', '提示', {
          type: 'warning'
        }).then(() => {
          uploadZipList(row.id).then(({data}) => {
            this.getData(this.search.pageNumber);
            if (data.code !== 200) {
              this.$alert('有资产未上传成功，请在预览页面查看失败原因，修改后再次上传。', '错误提示', {
                type: 'error',
                customClass: 'wide-box'
              });
            }
          })
        }).catch(() => {})
      },
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteUploadedZip(row.id).then(({status}) => {
            if (status === 204) {
              this.getData(this.search.pageNumber);
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            }
          }).catch(() => {})
        })
      },
      handleBeforeUpload(file) {
        if (!this.formData.type) {
          this.error.type = '请先选择导入的主体性质';
          return false;
        }
        const fileNames = file.name.split('.');
        const suffix = fileNames[fileNames.length - 1];
        const isZip = file.type ? file.type.indexOf('zip') !== -1 : suffix === 'zip';
        const isLt100M = file.size / 1024 / 1024 <= 100;
        if (!isZip) {
          this.error.upload = '只支持zip文件';
          // this.$message.error('上传失败，只支持zip文件');
        } else if (!isLt100M) {
          this.error.upload = '上传文件大小不能超过 100MB';
          // this.$message.error('上传文件大小不能超过 100MB');
        } else {
          this.error.upload = '';
        }
        return isZip && isLt100M;
      },
      handleSuccess() {
        this.getData(1);
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      },
      handleError(error) {
        const data = error && error.message && JSON.parse(error.message);
        if (error && error.status === 401 && data && data.code === 4001003) {
          this.$router.replace({name: 'ErrorUnauthorized'})
        } else {
          this.$message.error('上传失败')
        }
      },
      getData(index) {
        this.timer !== null && clearTimeout(this.timer);
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getUploadedZipList(search).then(({data}) => {
          if (data.code === 200) {
            this.zipList = data.body.list || [];
            this.search.pageNumber = data.body.pageNumber;
            this.pageTotal = data.body.totalRecord || 0;
            // const uploadingZipList = data.body.filter(_ => _.finish === 4).map(_ => _.uploadNo);
            // if (this.uploadingZipList.some(_ => !uploadingZipList.includes(_))) {
            //   if (data.body.findIndex(_ => this.uploadingZipList.includes(_.uploadNo)) === -1) {
            //     this.$message({
            //       message: '上传成功',
            //       type: 'success'
            //     })
            //   }
            // }
            if (data.body.list.some(_ => _.finish === 0 || _.finish === 4)) {
              // this.uploadingZipList = uploadingZipList;
              this.timer = setTimeout(() => {
                this.getData(this.search.pageNumber);
              }, 5000)
            }
          } else {
            this.zipList = [];
            this.pageTotal = 0;
          }
        }).catch(() => {
          this.zipList = [];
          this.pageTotal = 0;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .upload {
    .upload-input {
      width: 360px !important;
      line-height: normal;
    }

    .el-upload__tip {
      text-align: center;
    }
  }
</style>
