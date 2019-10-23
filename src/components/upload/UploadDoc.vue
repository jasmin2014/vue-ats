<template>
  <el-upload v-if="mode === 'VIEW' && currentValue && currentValue.length"
             ref="upload"
             class="upload-view"
             :action="''"
             :file-list="fileList"
             :show-file-list="true"
             :auto-upload="false"
             :list-type="listType"
             :on-preview="handlePreview"
             :disabled="true">
  </el-upload>
  <div v-else-if="mode === 'VIEW'"
       class="upload no-pic">
    <div class="text">无{{ text }}</div>
  </div>
  <el-upload v-else
             ref="upload"
             :class="customClass"
             :action="action"
             :file-list="fileList"
             :limit="limit"
             :accept="accept"
             :data="postData"
             :show-file-list="true"
             :list-type="listType"
             :multiple="multiple"
             :before-upload="handleBeforeUpload"
             :on-remove="handleRemove"
             :on-success="handleSuccess"
             :on-error="handleError"
             :on-change="handleChange"
             :on-preview="handlePreview">
    <el-button size="small" type="primary">点击上传</el-button>
    <slot name="tip">
      <div slot="tip" class="el-upload__tip">请提供doc, docx或pdf格式文件</div>
    </slot>
    <!--<template>-->
      <!--<div class="text">-->
        <!--<i class="el-icon-plus"></i>-->
        <!--<div class="el-upload__text"><i v-if="required" class="required"></i>{{ text }}</div>-->
        <!--<div class="el-upload__placeholder">{{ placeholder }}</div>-->
      <!--</div>-->
    <!--</template>-->
  </el-upload>
</template>

<script>
  import {getPicUrls, getQiniuToken} from '../../api/common'
  const VALID_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];

  export default {
    name: 'AtsUploadDoc',
    props: {
      mode: String,
      value: [String, Array],
      kind: String,
      text: String,
      accept: {
        type: String,
        default: '.doc,.docx,.pdf'
      },
      listType: {
        type: String,
        default: 'text'
      },
      action: {
        type: String,
        default: QINIU_UPLOAD_URL
      },
      limit: {
        type: Number,
        default: Infinity
      },
      placeholder: String,
      noDelete: Boolean,
      required: Boolean,
      multiple: Boolean,
      beforeUpload: Function
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value),
        fileList: [],
        hideUploadButtonClass: 'upload-view',
        defaultClass: 'upload',
        postData: {
          token: this.$store.state.qiniu
        },
        size: this.value ? this.value.length : 0
      }
    },
    computed: {
      customClass() {
        let ret = this.size >= this.limit ? this.hideUploadButtonClass : this.defaultClass;
        if (this.noDelete) {
          ret += ' no-delete'
        }
        return ret;
      }
    },
    watch: {
      value: 'setCurrentValue'
    },
    methods: {
      setCurrentValue(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(this.currentValue)) return;
        this.currentValue = this.$deepcopy(val);
        if (this.currentValue.length) {
          if (this.currentValue.every(_ => this.$isUrl(_.url))) {
            this.fileList = this.$deepcopy(this.currentValue);
          } else {
            const urls = this.currentValue.map(_ => _.url);
            this.getPicUrls(urls).then(({data}) => {
              this.fileList = data.body.map((_, i) => ({
                url: this.$isUrl(this.currentValue[i]) ? _ : _ + '&attname=' + encodeURIComponent(this.currentValue[i].name),
                id: this.currentValue[i].id,
                name: this.currentValue[i].name
              }));
            }, () => {})
          }
        } else {
          this.fileList = [];
          if (this.$refs.upload) {
            this.$refs.upload.uploadFiles = [];
          }
        }
        this.size = val.length;
      },
      handlePreview(file) {
        // const fileList = this.$refs.upload.uploadFiles;
        // const index = fileList.map(_ => _.uid).indexOf(file.uid);
        // this.$preview(fileList, index);
        window.open(file.url);
        // location.href = file.url;
      },
      handleRemove(file, fileList) {
        this.size = fileList.length;
        this.$emit('input', this.currentValue.filter((_, i) => this.fileList[i].uid !== file.uid));
        this.$emit('remove', file)
      },
      handleChange(file, fileList) {
        this.size = fileList.length;
      },
      handleSuccess(response, file, fileList) {
        const fileName = file.raw.name.split('.');
        const suffix = fileName.length > 1 ? fileName[fileName.length - 1] : '';
        const uploaded = {
          id: Date.now(),
          url: response.key,
          type: suffix.toLowerCase(),
          name: file.raw.name && file.raw.name.length > 100 ? file.raw.name.slice(0, 100) + '.' + suffix : file.raw.name
        };
        this.$emit('input', this.currentValue.concat(uploaded));
        this.$emit('success', {
          uid: file.uid,
          ...uploaded
        })
      },
      handleError(response, file, fileList) {
        const status = response.status;
        if (status === 400) {
          this.$message.error('无上传凭证，请重试');
          getQiniuToken().then(({data}) => {
            if (data.code === 200) {
              this.$store.commit('saveQiniuToken', data.body);
            }
          }, () => {})
        } else if (status === 401) {
          this.$message.error('上传凭证过期，请重试');
          getQiniuToken().then(({data}) => {
            if (data.code === 200) {
              this.$store.commit('saveQiniuToken', data.body);
            }
          }, () => {})
        }
        this.$emit('error', response)
      },
      handleBeforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        const isMt0 = file.size > 0;
        const isDoc = (this.accept === '.pdf' ? file.type === VALID_FILE_TYPES[0] : VALID_FILE_TYPES.includes(file.type)) || (
          file.type === '' && this.accept === '.pdf' ? /.+\.(pdf)$/i.test(file.name) : /.+\.(doc|docx|pdf)$/i.test(file.name)
        );
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB');
        }
        if (!isMt0) {
          this.$message.error('上传文件无内容');
        }
        if (!isDoc) {
          this.$message.error(`只能上传${this.accept}格式的文件`)
        }
        this.postData.token = this.$store.state.qiniu;
        if (isDoc && isLt2M) {
          this.$emit('start');
        }

        if (typeof this.beforeUpload === 'function') {
          return isDoc && isLt2M && isMt0 && this.beforeUpload(file);
        } else {
          return isDoc && isLt2M && isMt0;
        }
      },
      getPicUrls(urls) {
        return getPicUrls(urls)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .upload {
    margin-right: 8px;
    margin-bottom: 8px;

    &.no-pic {
      border: 1px dashed #c0ccda;
      width: 148px;
      height: 40px;
    }

    .text {
      box-sizing: border-box;
      color: #8c939d;
      width: 100%;
      height: 100%;
      line-height: 40px;
      text-align: center;
      i {
        font-size: 28px;
      }
    }
  }
</style>
