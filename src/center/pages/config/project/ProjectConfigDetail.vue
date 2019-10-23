<template>
  <project-config v-model="detail"
                  :risk-strategy-list="riskStrategyList"
                  :mode="mode"></project-config>
</template>

<script>
  import {getProjectConfigDetail, getRiskConfigList} from '../../../api/asset';
  import ProjectConfig from '../../../../modules/project-config/ProjectConfig'

  export default {
    components: {
      ProjectConfig
    },
    data() {
      return {
        id: this.$route.params.id,
        mode: 'VIEW',
        detail: {},
        riskStrategyList: []
      }
    },

    created() {
      this.getData(this.id);
      this.getRiskConfigs();
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
      },
      getRiskConfigs() {
        getRiskConfigList().then(({ data }) => {
          if (data.code === 200) {
            this.riskStrategyList = data.body;
          }
        })
      }
    }
  }
</script>
