<!-- 合同列表 -->
<template>
  <el-form class="doc">
    <el-row type="flex" justify="center">
      <ats-upload v-model="protocol" accept="image/*" :mode="'VIEW'"></ats-upload>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    props: {
      protocolList: Array
    },
    data() {
      return {
        protocol: this.protocolList
      }
    },
    watch: {
      protocolList(val) {
        if (val) {
          this.protocol = val.map(_ => ({ name: _.fileName, url: _.fileUri, type: _.fileType }));
        }
      }
    }
  }
</script>
