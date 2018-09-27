<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="关键词搜索：">
        <el-input v-model="keyword" placeholder="请输入 企业名称/统一社会信用代码/法人姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fa fa-search" @click="handleSearch"></el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" @current-change="handleOrg" highlight-current-row>
      <el-table-column prop="orgName" label="企业名称">
      </el-table-column>
      <el-table-column prop="usciCode" label="统一社会信用代码">
      </el-table-column>
      <el-table-column prop="corpoation" label="法人">
      </el-table-column>
    </el-table>
    <el-row class="mgt20" type="flex" justify="center">
      <el-button type="success" @click="handleConfirmOrg">确定</el-button>
      <el-button type="danger" @click="showDialog = false">取消</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      list: Array
    },
    data() {
      return {
        keyword: '',
        selected: {}
      }
    },
    methods: {
      handleSearch() {
        this.$emit('search', this.keyword)
      },
      handleOrg(val) {
        this.selected = val
      },
      handleConfirmOrg() {
        this.$emit('confirm-org', this.selected.id)
      }
    }
  }
</script>
