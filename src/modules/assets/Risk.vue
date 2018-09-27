<template>
  <el-form class="risk" label-width="150px">
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-form-item label="资产风险等级">
          <ats-select v-model="currentValue.assetRiskLevel" :disabled="true"
                      :kind="this.$enum.RISK_LEVEL" :group="this.$enum.RISK_LEVEL_GROUP"></ats-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-button type="text" @click="handleReport">查看报告</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    props: {
      value: Object
    },
    data() {
      return {
        currentValue: {
          assetRiskLevel: '',
          riskAssessmentUrl: ''
        }
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.setCurrentValue(val)
        }
      }
    },
    methods: {
      setCurrentValue(val) {
        this.currentValue = Object.assign(this.currentValue, val)
      },
      handleReport() {
        const link = this.currentValue.riskAssessmentUrl;
        if (link) {
          if (!window.open(link)) {
            location.href = link;
          }
        } else {
          this.$message({
            message: '暂无报告',
            type: 'warning'
          })
        }
      }
    }
  }
</script>
