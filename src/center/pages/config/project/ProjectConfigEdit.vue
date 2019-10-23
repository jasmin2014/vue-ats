<template>
  <project-config v-model="detail"
                  :risk-strategy-list="riskStrategyList"
                  :mode="mode"
                  @config="handleConfig"></project-config>
</template>

<script>
  import {
    getProjectConfigDetail,
    getRiskConfigList,
    editProjectConfigRisk
  } from '../../../api/asset';
  import ProjectConfig from '../../../../modules/project-config/ProjectConfig'

  export default {
    components: {
      ProjectConfig
    },
    data() {
      return {
        id: this.$route.params.id,
        mode: 'EDIT',
        detail: {},
        riskStrategyList: []
      }
    },

    created() {
      this.getData(this.id);
      this.getRiskConfigs();
    },

    methods: {
      handleConfig(val) {
        editProjectConfigRisk(this.id, val).then(({ data }) => {
          if (data.code === 200) {
            this.$message.success('修改风控配置成功');
            this.$router.go(-1);
          } else {
            this.$message.error(data.message)
          }
        })
      },

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
