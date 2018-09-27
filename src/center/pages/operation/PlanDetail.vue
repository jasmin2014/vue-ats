<template>
  <plan v-model="detail"
        :mode="mode"></plan>
</template>

<script>
  import Plan from '../../../modules/plan/Plan.vue'
  import {repayDetail} from '../../api/operation'

  export default {
    data() {
      return {
        mode: 'VIEW',
        detail: {}
      }
    },
    created() {
      this.getData(this.$route.params.id)
    },
    methods: {
      getData(id) {
        repayDetail(id).then(({data}) => {
          if (data.code === 200) {
            this.detail = data.body;
          }
        }, () => {})
      }
    },
    components: {
      Plan
    }
  }

</script>
