<template>
  <project-config v-model="detail"
                  :risk-strategy-list="riskStrategyList"
                  :mode="mode"
                  @pass="handlePass"
                  @reject="handleReject"
                  is-audit></project-config>
</template>

<script>
  import {
    getProjectConfigDetail,
    getRiskConfigList,
    passProjectConfig,
    rejectProjectConfig
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
      handlePass(val) {
        passProjectConfig(this.id, val).then(({ data }) => {
          if (data.code === 200) {
            this.$message.success('审核通过成功');
            this.$router.go(-1);
          } else {
            this.$message.error(data.message)
          }
        })
      },
      handleReject() {
        rejectProjectConfig(this.id).then(({ data }) => {
          if (data.code === 200) {
            this.$message.success('审核拒绝成功');
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
