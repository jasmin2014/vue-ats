<template>
  <project-config v-model="detail"
                  :mode="mode"></project-config>
</template>

<script>
  import {getProjectConfigDetail} from '../../../api/asset';
  import ProjectConfig from '../../../../modules/project-config/ProjectConfig'

  export default {
    components: {
      ProjectConfig
    },
    data() {
      return {
        id: this.$route.params.id,
        mode: 'VIEW',
        detail: {}
      }
    },

    created() {
      this.getData(this.id);
    },

    methods: {
      getData(id) {
        getProjectConfigDetail(id).then(({ data }) => {
          if (data.code === 200) {
            this.detail = data.body;
          } else {
            this.$message.error(data.message)
          }
        }).catch(() => {})
      }
    }
  }
</script>
