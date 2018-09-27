<template>
  <div class="upload">
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-form >
          <el-form-item :error="error.type">
            <div class="upload-input">
              <el-col :span="17">
                <ats-select v-model="formData.type"
                            :kind="$enum.SUBJECT_PROP"
                            :group="$enum.SUBJECT_PROP"
                            placeholder="请选择客户主体性质"
                            @change="handleTypeChange"
                            clearable></ats-select>
              </el-col>
              <el-col :span="7">
                <el-button style="width: 100%;"
                           @click="handleDownload">下载模板</el-button>
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
                         :label="col.label" :prop="col.prop" :type="col.type" :formatter="col.formatter"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.finish < 5" type="info" size="small"
                       :loading="scope.row.finish === 0"
                       :disabled="scope.row.finish === 2 || scope.row.finish === 5"
                       @click="handlePreviewList(scope.row)">预览</el-button>
            <el-tooltip content="上传资产">
              <el-button v-if="scope.row.finish === 1 || scope.row.finish > 2"
                         type="success" size="small" icon="fa fa-upload"
                         :loading="scope.row.finish === 4"
                         :disabled="scope.row.finish === 5"
                         @click="handleUploadList(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除">
              <el-button type="danger" size="small" icon="fa fa-trash" title="删除"
                         @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import {getUploadedZipList, uploadZipList, deleteUploadedZip} from '../../api/asset';

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
          type: ''
        },
        error: {
          type: '',
          upload: ''
        },
        accept: '.zip',
        action: '/api/common/v1/loan/upload',
        headers: {
          'Authorization': this.$getLocalStorage('token')
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
            prop: 'uploadNo'
          },
          {
            label: '文件名',
            prop: 'fileName'
          },
          {
            label: '上传时间',
            prop: 'createdTime'
          },
          {
            label: '状态',
            prop: 'finish',
            formatter: (row, col, val) => FINISH_STATUS[val]
          }
        ]
      }
    },
    mounted() {
      this.getData();
    },
    destroyed() {
      this.timer !== null && clearTimeout(this.timer)
    },
    methods: {
      handleTypeChange(type) {
        if (type) {
          this.error.type = '';
        } else {
          this.error.type = '请先选择导入的主体性质';
        }
      },
      handleDownload() {
        const type = this.formData.type;
        if (type) {
          this.error.type = '';
          let url = '/static/doc';
          url += type === this.$enum.SUBJECT_PROP_PERSON ? '/PersonalReferenceTemplate.zip' : '/EnterpriseReferenceTemplate.zip';
          location.href = url;
        } else {
          this.error.type = '请先选择导入的主体性质';
        }
      },
      handlePreviewList(row) {
        this.$router.push({
          name: 'AssetUploadAfter',
          params: {
            id: row.uploadNo
          }
        })
      },
      handleUploadList(row) {
        this.$confirm('确定上传所有资产数据?', '提示', {
          type: 'warning'
        }).then(() => {
          uploadZipList(row.uploadNo).then(({data}) => {
            this.getData();
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
              this.getData();
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
        this.getData();
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
      getData() {
        this.timer !== null && clearTimeout(this.timer);
        getUploadedZipList().then(({data}) => {
          if (data.code === 200) {
            // data.body = data.body.filter(_ => _.finish !== 5);
            this.zipList = data.body;
            // const uploadingZipList = data.body.filter(_ => _.finish === 4).map(_ => _.uploadNo);
            // if (this.uploadingZipList.some(_ => !uploadingZipList.includes(_))) {
            //   if (data.body.findIndex(_ => this.uploadingZipList.includes(_.uploadNo)) === -1) {
            //     this.$message({
            //       message: '上传成功',
            //       type: 'success'
            //     })
            //   }
            // }
            if (data.body.some(_ => _.finish === 0 || _.finish === 4)) {
              // this.uploadingZipList = uploadingZipList;
              this.timer = setTimeout(() => {
                this.getData();
              }, 5000)
            }
          } else {
            this.zipList = []
          }
        }).catch(() => {
          this.zipList = []
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
