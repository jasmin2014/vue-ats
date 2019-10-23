<template>
  <org ref="MyOrg" :mode="mode"
       v-model="detail"
       :business="this.$enum.BUSINESS_CENTER"
       :error="error"
       @save="handleSave"></org>
</template>

<script>
  import Org from '../../../modules/org/Org.vue'
  import {editOrg, getOrg} from '../../api/org'

  export default {
    data() {
      return {
        mode: 'EDIT',
        detail: {},
        error: {},
        id: this.$route.params.id
      }
    },
    created() {
      this.getData(this.id);
    },
    methods: {
      handleSave(data) {
        this.editOrg(data);
      },
      editOrg(val) {
        editOrg(val).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
            this.$router.go(-1);
          } else {
            this.$message.error('保存失败');
          }
        }).catch(({ status, data }) => {
          if (status === 400 && data.type === 'object') {
            this.error = data.body
          }
        })
      },
      getData(partyId) {
        this.getDetail(partyId);
      },
      getDetail(partyId) {
        getOrg(partyId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.detail = res.body;
          }
        }, () => {})
      }
    },
    components: {
      Org
    }
  }
</script>
