<template>
  <org :mode="mode"
       v-model="detail"
       :business="this.$enum.BUSINESS_CENTER"></org>
</template>

<script>
  import Org from '../../../modules/org/Org.vue'
  import {getOrg} from '../../api/org'

  export default {
    data() {
      return {
        mode: 'VIEW',
        detail: {},
        id: this.$route.params.id
      }
    },
    created() {
      this.getData(this.id);
    },
    methods: {
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
