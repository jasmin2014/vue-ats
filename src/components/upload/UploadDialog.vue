<template>
  <el-dialog :visible="currentVisible"
             :title="mode === 'VIEW'? '查看附件':'上传附件'"
             width="700"
             @close="handleClose">
    <el-row type="flex" justify="center">
      <ats-upload ref="upload"
                  v-model="currentValue"
                  :mode="mode"
                  :accept="accept"
                  :no-delete="noDelete"
                  @start="handleUploadStart"
                  @success="handleUploadSuccess"
                  @error="handleUploadError"
                  @remove="handleUploadRemove"></ats-upload>
    </el-row>
    <el-row slot="footer">
      <el-row v-if="mode !== 'VIEW'">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </el-row>
      <el-row v-else>
        <el-button @click="handleCancel">关 闭</el-button>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    name: 'AtsUploadDialog',
    props: {
      visible: Boolean,
      value: Array,
      mode: String,
      accept: String,
      noDelete: Boolean
    },
    data() {
      return {
        currentValue: this.value || [],
        currentVisible: this.visible,
        isUploading: false
      }
    },
    watch: {
      value(val, oldVal) {
        this.currentValue = this.$deepcopy(val).map((_, i) => ({
          url: _.url,
          name: _.name,
          id: i
        }));
      },
      visible(val, oldVal) {
        if (this.isUploading && !val && oldVal) {
          this.$emit('update:visible', true);
          this.currentVisible = true;
          this.$message({
            message: '正在上传，请稍后',
            type: 'warning'
          })
        } else {
          this.currentVisible = val;
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false);
        this.$emit('close')
      },
      handleCancel() {
        this.$emit('cancel')
      },
      handleConfirm() {
        this.$emit('confirm', this.$deepcopy(this.currentValue))
      },
      handleUploadStart() {
        this.isUploading = true;
      },
      handleUploadSuccess(file) {
        this.isUploading = false;
        this.currentValue.push(file);
        this.$emit('upload', file);
      },
      handleUploadError(response) {
        this.isUploading = false;
      },
      handleUploadRemove(file) {
        this.currentValue = this.currentValue.filter(_ => _.id !== file.id).map((_, i) => ({
          url: _.url,
          name: _.name,
          id: _.id || i
        }));
        this.$emit('remove', file, this.$deepcopy(this.currentValue));
      }
    }
  }
</script>
