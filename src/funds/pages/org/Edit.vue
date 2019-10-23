<template>
  <org v-model="detail"
       :mode="mode"
       :business="this.$enum.BUSINESS_FUND"
       :error="error"
       @save="handleSave"></org>
</template>

<script>
  import Org from '../../../modules/org/Org.vue'
  import {getLoginOrg, editOrg} from '../../api/org'

  export default {
    data() {
      return {
        mode: 'EDIT',
        detail: {},
        error: {}
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      handleSave(val) {
        editOrg(val).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
            this.$router.replace({
              name: 'OrgDetail'
            });
          } else {
            this.$message.error('保存失败');
          }
        }).catch(({ status, data }) => {
          if (status === 400 && data.type === 'object') {
            this.error = data.body
          }
        })
      },
      getData() {
        this.getDetail();
      },
      getDetail() {
        getLoginOrg().then(({ data }) => {
          if (data.code === 200) {
            data.body.partyOrgAssetDTO = data.body.partyOrgAssetDTO || {};
            this.detail = data.body;
          } else {
            this.$message.error(data.message)
          }
        }, () => {
        })
      }
    },
    components: {
      Org
    }
  }
</script>
