<template>
  <el-tabs v-model="activeTab" class="upload-before" type="border-card">
    <el-tab-pane :name="$enum.LOAN_PROP_NEW" label="新借上传">
      <upload-before-new></upload-before-new>
    </el-tab-pane>
    <el-tab-pane :name="$enum.LOAN_PROP_CONTINUE" label="续借上传">
      <upload-before-renew></upload-before-renew>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import UploadBeforeNew from './BeforeNew'
  import UploadBeforeRenew from './BeforeRenew'

  export default {
    components: {
      UploadBeforeNew,
      UploadBeforeRenew
    },
    data() {
      return {
        activeTab: this.$route.query.type || this.$enum.LOAN_PROP_NEW
      }
    },
    watch: {
      activeTab(val, oldVal) {
        if (val !== oldVal) {
          this.$router.replace({
            name: this.$route.name,
            query: {
              type: val
            }
          })
        }
      }
    }
  }
</script>
