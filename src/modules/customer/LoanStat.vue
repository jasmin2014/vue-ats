<template>
  <el-form v-if="value"
           class="loan-stat"
           label-width="120px">
    <div v-for="item in value" class="item">
      <h4><span>{{ item.fundOrgName }}</span></h4>
      <el-form-item label="借款总额">
        <ats-input v-model="item.loanAmount" mode="VIEW"></ats-input>
      </el-form-item>
      <el-form-item label="借款次数">
        <ats-input v-model="item.loanCount" mode="VIEW"></ats-input>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
  export default {
    props: {
      value: Array
    }
  }
</script>
