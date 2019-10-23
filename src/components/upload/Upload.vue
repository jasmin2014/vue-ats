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
    <template>
      <div class="text">
        <i class="el-icon-plus"></i>
        <div class="el-upload__text"><i v-if="required" class="required"></i>{{ text }}</div>
        <div class="el-upload__placeholder">{{ placeholder }}</div>
      </div>
    </template>
  </el-upload>
</template>

<script>
  import {getPicUrls, getQiniuToken} from '../../api/common'

  export default {
    name: 'AtsUpload',
    props: {
      mode: String,
      value: [String, Array],
      kind: String,
      text: String,
      accept: {
        type: String,
        default: 'image/*'
      },
      listType: {
        type: String,
        default: 'picture-card'
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
      multiple: Boolean
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
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return;
        this.currentValue = this.$deepcopy(val);
        if (this.currentValue.length) {
          if (this.$isUrl(this.currentValue[0].url)) {
            this.fileList = this.$deepcopy(this.currentValue);
          } else {
            const urls = this.currentValue.map(_ => _.url);
            this.getPicUrls(urls).then(({data}) => {
              this.fileList = data.body.map((_, i) => ({url: _, id: this.currentValue[i].id}));
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
        const fileList = this.$refs.upload.uploadFiles;
        const index = fileList.map(_ => _.uid).indexOf(file.uid);
        this.$preview(fileList, index);
      },
      handleRemove(file, fileList) {
        this.size = fileList.length;
        this.$emit('remove', file)
      },
      handleChange(file, fileList) {
        this.size = fileList.length;
      },
      handleSuccess(response, file, fileList) {
        const fileName = file.raw.name.split('.');
        const suffix = fileName.length > 1 ? fileName[fileName.length - 1] : '';
        this.$emit('success', {
          uid: file.uid,
          key: response.key,
          type: suffix.toLowerCase(),
          name: file.raw.name.slice(0, 100)
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
        const isIMG = /^image\/(png)|(jpeg)/i.test(file.type);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isIMG) {
          this.$message.error('只能上传jpg、png格式图片');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB');
        }
        this.postData.token = this.$store.state.qiniu;
        if (isIMG && isLt2M) {
          this.$emit('start');
        }
        return isIMG && isLt2M
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
      height: 148px;
    }

    .text {
      box-sizing: border-box;
      padding-top: 40%;
      color: #8c939d;
      width: 100%;
      height: 100%;
      line-height: 30px;
      text-align: center;
      i {
        font-size: 28px;
      }
    }
  }
</style>
