<template>
  <div v-if="currentValue" class="doc">
    <div v-if="currentValue.pdfs">
      <h4>
        <span>资料文件</span>
      </h4>
      <el-row type="flex" justify="center">
        <ats-upload-doc v-model="currentValue.pdfs"
                        :limit="5"
                        accept=".pdf"
                        :mode="mode"
                        @success="handleSuccess($event, $enum.PROOF_MATERIAL_P_LOAN_APP_PDF)"
                        @remove="handleRemove($event, $enum.PROOF_MATERIAL_P_LOAN_APP_PDF)">
          <div slot="tip" class="el-upload__tip">请提供pdf格式文件</div>
        </ats-upload-doc>
      </el-row>
    </div>
    <div v-if="currentValue.originals">
      <h4>
        <span>资料原图</span>
      </h4>
      <el-row type="flex" justify="center">
        <ats-upload-pic v-model="currentValue.originals"
                        :mode="mode"
                        @success="handleSuccess($event, $enum.PROOF_MATERIAL_P_LOAN_APP)"
                        @remove="handleRemove($event, $enum.PROOF_MATERIAL_P_LOAN_APP)"></ats-upload-pic>
      </el-row>
    </div>
    <div v-if="currentValue.mosaics">
      <h4>
        <span>处理后</span>
      </h4>
      <el-row type="flex" justify="center">
        <ats-upload-pic v-model="currentValue.mosaics"
                        :mode="mode"></ats-upload-pic>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: [Array, Object],
      mode: String,
      isUpload: Boolean
    },
    data() {
      return {
        currentValue: null
      }
    },
    computed: {
      materials: {
        get() {
          if (this.currentValue instanceof Array) {
            return this.currentValue.map((_, i) => ({
              id: _.id,
              name: _.fileName,
              url: _.fileUri,
              type: _.fileType
            }))
          }
          return []
        },
        set(val) {
          if (this.currentValue instanceof Array) {
            this.currentValue = val.map(_ => ({
              id: _.id,
              fileName: _.name,
              fileType: _.type,
              fileUri: _.url,
              kind: this.$enum.PROOF_MATERIAL_P_LOAN_APP
            }))
          }
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          if (val) {
            this.setCurrentValue(val)
          }
        },
        deep: true
      }
    },

    created() {
      this.setCurrentValue(this.value)
    },

    methods: {
      save() {
        const val = this.currentValue;
        this.$emit('input', {
          pdfs: val.pdfs ? val.pdfs.map(_ => ({
            fileName: _.name,
            fileUri: _.url,
            fileType: _.type,
            id: _.id,
            kind: this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF
          })) : null,
          originals: val.originals ? val.originals.map(_ => ({
            fileName: _.name,
            fileUri: _.url,
            fileType: _.type,
            id: _.id,
            kind: this.$enum.PROOF_MATERIAL_P_LOAN_APP
          })) : null,
          mosaics: val.mosaics ? val.mosaics.map(_ => ({
            fileName: _.name,
            fileUri: _.url,
            fileType: _.type,
            id: _.id,
            kind: this.$enum.PROOF_MATERIAL_P_LOAN_APP_MOSAIC
          })) : null
        })
      },
      setCurrentValue(val) {
        this.currentValue = {
          pdfs: val.pdfs ? val.pdfs.map(_ => ({
            name: _.fileName,
            url: _.fileUri,
            type: _.fileType,
            id: _.id
          })) : null,
          originals: val.originals ? val.originals.map(_ => ({
            name: _.fileName,
            url: _.fileUri,
            type: _.fileType,
            id: _.id
          })) : null,
          mosaics: val.mosaics ? val.mosaics.map(_ => ({
            name: _.fileName,
            url: _.fileUri,
            type: _.fileType,
            id: _.id
          })) : null
        };
      },
      handleSuccess(file, kind) {
        if (this.isUpload) {
          // this.currentValue.push({
          //   name: file.name,
          //   url: file.key,
          //   id: Date.now()
          // })
        } else {
          // this.materials = this.materials.concat({
          //   id: file.uid,
          //   name: file.name,
          //   url: file.key,
          //   type: file.type
          // });
          this.$emit('upload', {
            fileUri: file.url,
            fileType: file.type,
            name: file.name
          });
          if (this.mode === 'EDIT') {
            console.log('ADD ' + kind + ': ' + file.id);
            this.$store.commit('material/add', {
              id: file.id,
              uid: file.uid,
              fileUri: file.url,
              fileName: file.name,
              fileType: file.type,
              kind
            })
          }
        }
      },
      handleRemove(file, kind) {
        if (this.isUpload) {
          // const index = this.currentValue.findIndex(_ => _.id === file.id);
          // this.currentValue.splice(index, 1);
        } else {
          // this.materials = this.materials.filter(_ => _.id !== file.id);
          this.$emit('remove', file);
          if (this.mode === 'EDIT') {
            console.log('DELETE ' + kind + ': ' + file.id);
            this.$store.commit('material/delete', {
              id: file.id,
              uid: file.uid,
              kind
            })
          }
        }
      }
    }
  }
</script>
