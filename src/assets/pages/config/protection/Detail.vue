<template>
  <div class="protection-config-edit">
    <protection-config v-model="detail"
                       :mode="mode"></protection-config>
  </div>
</template>

<script>
  import {
    getProtectionConfig
  } from '../../../api/asset';
  import ProtectionConfig from '../../../../modules/protection-config/ProtectionConfig'

  export default {
    components: {
      ProtectionConfig
    },
    data() {
      return {
        id: this.$route.params.id,
        detail: {},
        mode: 'VIEW'
      }
    },

    created() {
      this.getData(this.id);
    },

    methods: {
      getData(id) {
        getProtectionConfig(id).then(({ data }) => {
          if (data.code === 200) {
            this.detail = data.body;
          } else {
            this.$message.error(data.message)
          }
        })
      }
    }
  }
</script>
