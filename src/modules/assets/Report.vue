<template>
  <div class="report" style="margin-bottom: 20px;">
    <el-table :data="currentValue" border>
      <el-table-column v-for="col in table" :key="col.prop"
                       align="center"
                       :prop="col.prop"
                       :label="col.label"
                       :width="col.width"
                       :formatter="col.formatter"></el-table-column>
    </el-table>

    <div v-if="currentValue[0] && currentValue[0].riskSwitch !== 0">
      <h4><span>第三方风控数据</span></h4>
      <div class="links">
        <template v-if="currentValue[0].reportUrl">
          <el-button size="small" type="primary" plain @click="handleReport">风控报告</el-button>
        </template>
        <template v-else-if="person">
          <a v-for="report in reportList"
             :href="report.getUrl(person)" target="_blank"
             style="margin-left: 20px;">
            <el-tag>{{ report.name }}</el-tag>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { getReportUrlSuffix } from '../../api/common';

  export default {
    props: {
      value: Object,
      person: Object
    },
    data() {
      return {
        currentValue: [],
        table: [
          {
            label: '借款编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '协议编号',
            prop: 'contract'
          },
          {
            label: '资产渠道',
            prop: 'assetOrgName'
          },
          {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          },
          {
            label: '客户姓名/企业名称',
            prop: 'loanPartyName'
          },
          {
            label: '证件号码',
            prop: 'loanIdent'
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, value) => this.$filter(value, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '信用评分',
            prop: 'creditScore'
          },
          {
            label: '资产风险评级',
            prop: 'assetRiskLevel',
            formatter: (row, col, val) => this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP)
          },
          {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          }
        ],
        reportList: [
          {
            name: '同盾',
            getUrl: (person) => {
              return `https://fk.360fengdai.com/report.html?type=td&name=${person.name || person.realName}&idCard=${person.ident}&phone=${person.mobile}`
            }
          },
          {
            name: 'NFCS',
            getUrl: (person) => {
              return `https://fk.360fengdai.com/report.html?type=nfcs&name=${person.name || person.realName}&idCard=${person.ident}&phone=${person.mobile}`
            }
          },
          {
            name: '致诚共享',
            getUrl: (person) => {
              return `https://fk.360fengdai.com/report.html?type=cxaf&name=${person.name || person.realName}&idCard=${person.ident}&phone=${person.mobile}`
            }
          }
        ]
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.currentValue = [val]
        } else {
          this.currentValue = []
        }
      }
    },

    methods: {
      handleReport() {
        getReportUrlSuffix().then(({ data }) => {
          if (data.code === 200) {
            // console.log(this.currentValue[0].reportUrl + data.body)
            window.open(this.currentValue[0].reportUrl + data.body)
          }
        })
      }
    }
  }
</script>
