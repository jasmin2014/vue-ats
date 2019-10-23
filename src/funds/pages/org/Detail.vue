<template>
  <org v-model="detail"
       :mode="mode"
       :business="this.$enum.BUSINESS_FUND"></org>
</template>

<script>
  import Org from '../../../modules/org/Org.vue'
  import {getLoginOrg} from '../../api/org';

  export default {
    data() {
      return {
        mode: 'VIEW',
        detail: {}
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.getDetail();
      },
      getDetail() {
        getLoginOrg().then(({ data }) => {
          if (data.code === 200) {
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
