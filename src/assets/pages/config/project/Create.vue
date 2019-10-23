<template>
  <project-config v-model="detail"
                  :mode="mode"
                  @save="handleSave"
                  @project-name-change="handleProjectNameChange"></project-config>
</template>

<script>
  import ProjectConfig from '../../../../modules/project-config/ProjectConfig'
  import {
    createProjectConfig,
    checkProjectNameExisted
  } from '../../../api/asset';

  export default {
    components: {
      ProjectConfig
    },
    data() {
      return {
        mode: 'CREATE',
        detail: {}
      }
    },

    methods: {
      handleProjectNameChange({ value, callback }) {
        checkProjectNameExisted(value).then(({ data }) => {
          if (data.code === 200) {
            callback(data.body);
          } else {
            callback(true, data.message)
          }
        }).catch(() => {
          callback(true, '服务器错误')
        });
      },
      handleSave(detail) {
        createProjectConfig(detail).then(({ data }) => {
          if (data.code === 200) {
            this.$message.success('提交审核成功');
            this.$router.go(-1)
          } else {
            this.$message.error(data.message)
          }
        }).catch(() => {})
      }
    }
  }
</script>
