<template>
  <el-form v-if="type === this.$enum.BUSINESS_CENTER"
           class="doc">
    <span class="pic-title">资料原图:</span>
    <el-row type="flex" justify="center">
      <ats-upload v-model="currentValue.originals" :mode="'VIEW'"></ats-upload>
    </el-row>
    <span class="pic-title">保存的原图:</span>
    <el-row type="flex" justify="center">
      <ats-upload v-model="currentValue.mosaics" :mode="'VIEW'"></ats-upload>
    </el-row>
  </el-form>
  <el-form v-else
           class="doc">
    <el-row type="flex" justify="center">
      <ats-upload v-model="currentValue"
                  :mode="mode"
                  @success="handleSuccess"
                  @remove="handleRemove"></ats-upload>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    props: {
      value: [Array, Object],
      type: String,
      mode: String,
      isUpload: Boolean
    },
    data() {
      return {
        currentValue: this.type === this.$enum.BUSINESS_CENTER ? {
          originals: [],
          mosaics: []
        } : []
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.setCurrentValue(val)
        }
      }
    },
    methods: {
      save() {
        this.$emit('save', this.$deepcopy(this.currentValue))
      },
      setCurrentValue(val) {
        if (val instanceof Array) {
          this.currentValue = val.map(_ => ({name: _.name, url: _.uri, id: _.proofMaterial}))
        } else {
          this.currentValue.originals = val.originals ? val.originals.map(_ => ({
            name: _.name,
            url: _.uri,
            id: _.proofMaterial
          })) : [];
          this.currentValue.mosaics = val.mosaics ? val.mosaics.map(_ => ({
            name: _.name,
            url: _.uri,
            id: _.proofMaterial
          })) : []
        }
      },
      handleSuccess(file) {
        if (this.isUpload) {
          this.currentValue.push({
            name: file.name,
            url: file.key,
            id: Date.now()
          })
        } else {
          this.$emit('upload', {
            fileUri: file.key,
            fileType: file.type,
            name: file.name
          })
        }
      },
      handleRemove(file) {
        if (this.isUpload) {
          const index = this.currentValue.findIndex(_ => _.id === file.id);
          this.currentValue.splice(index, 1);
        } else {
          this.$emit('remove', file)
        }
      }
    }
  }
</script>
