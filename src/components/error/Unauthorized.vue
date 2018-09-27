<template>
  <div>
    <p>没有操作权限</p>
    <el-button icon="el-icon-refresh" round
               @click="handleRefresh">点击刷新</el-button>
  </div>
</template>

<script>
  export default {
    methods: {
      handleRefresh() {
        location.href = location.pathname;
      }
    }
  }
</script>
