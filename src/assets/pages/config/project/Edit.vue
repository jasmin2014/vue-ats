<template>
  <project-config v-model="detail"
                  :risk-strategy-list="riskStrategyList"
                  :mode="mode"
                  @save="handleSave"
                  @project-name-change="handleProjectNameChange"></project-config>
</template>

<script>
  import {
    getProjectConfigDetail,
    applyProjectConfig,
    checkProjectNameExisted
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
    },

    methods: {
      handleProjectNameChange({ value, callback }) {
        checkProjectNameExisted(value, this.id).then(({ data }) => {
          if (data.code === 200) {
            callback(data.body);
          } else {
            callback(true, data.message)
          }
        }).catch(() => {
          callback(true, '服务器错误')
        });
      },
      handleSave(val) {
        applyProjectConfig(this.id, val).then(({ data }) => {
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
      }
    }
  }
</script>
