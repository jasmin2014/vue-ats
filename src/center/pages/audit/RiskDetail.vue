<!--appraisalDetails 资产评估详情-->
<template>
  <div class="risk-detail">
    <el-table :data="detail" border>
      <el-table-column v-for="col in table"
                       align="center"
                       :key="col.prop"
                       :label="col.label"
                       :prop="col.prop"
                       :width="col.width"
                       :formatter="col.formatter"></el-table-column>
    </el-table>

    <el-row class="mgt20">
      <el-button v-action="'CustomerDetail'"
                 @click="handleCustomerDetail">查看客户信息</el-button>
      <el-button v-action="'AssetDetail'"
                 @click="handleLoanDetail">查看借贷申请信息</el-button>
    </el-row>
    <el-row class="mgt20">
    </el-row>

    <!--<h4><span>资产评估</span></h4>-->
    <!--<el-table :data="reportList" border>-->
      <!--<el-table-column label="评估信息"-->
                       <!--prop="auditDataKind"-->
                       <!--align="center"-->
                       <!--:formatter="(row, col, val) => $filter(val, $enum.AUDIT_TYPE, row.auditKind)"></el-table-column>-->
      <!--<el-table-column label="渠道结果"-->
                       <!--prop="channelResult"-->
                       <!--align="center"-->
                       <!--:formatter="(row, col, val) => reportFilter[row.auditDataKind] ?-->
                       <!--$filter(val, reportFilter[row.auditDataKind].kind, reportFilter[row.auditDataKind].group) : val"></el-table-column>-->
      <!--<el-table-column label="查询网址"-->
                       <!--prop="searchWebsite"-->
                       <!--align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<a :href="'http://'+ scope.row.searchWebsite" target="_blank">{{scope.row.searchWebsite}}</a>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="渠道报告"-->
                       <!--prop="dataReport"-->
                       <!--align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<a v-if="scope.row.dataReport"-->
             <!--:href="scope.row.dataReport" target="_blank">查看报告</a>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="估值"-->
                       <!--prop="artificalValue"-->
                       <!--align="center"-->
                       <!--:formatter="(row, col, val) => val || '暂无'"></el-table-column>-->
    <!--</el-table>-->
  </div>
</template>

<script>
  import {getRiskDetail, getReportList} from '../../api/audit'

  export default {
    data() {
      return {
        table: [
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '协议编号',
            prop: 'contract'
          },
          {
            label: '资产渠道',
            prop: 'assetChannel'
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
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '项目名称',
            prop: 'loanKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_TYPE, row.assetKind)
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
            label: '证件号码',
            prop: 'loanIdent'
          },
          {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          },
          {
            label: '审核节点',
            prop: 'auditStep',
            formatter: (row, col, val) => this.$filter(val, this.$enum.AUDIT_STEP, this.$enum.AUDIT_STEP_GROUP)
          }
        ],
        detail: [],
        reportList: [],
        id: this.$route.params.id,
        reportFilter: {
          chsi: {
            kind: this.$enum.EDUCATION,
            group: this.$enum.EDUCATION_GROUP
          }
        }
      };
    },
    created() {
      this.getRiskDetail(this.id);
      this.getReportList(this.id, this.$enum.AUDIT_TYPE_POSITIVE_ASSET);
    },
    methods: {
      handleCustomerDetail() {
        const id = this.detail[0].loanParty;
        const type = this.detail[0].loanPartyKind;
        window.open(`/center.html#/customer/detail/${id}?type=${type}`)
        // this.$router.push({
        //   name: 'CustomerDetail',
        //   params: { id },
        //   query: { type }
        // })
      },
      handleLoanDetail() {
        window.open(`/center.html#/asset/detail/${this.id}`)
        // this.$router.push({
        //   name: 'AssetDetail',
        //   params: { id: this.id }
        // });
      },
      // 审核详情
      getRiskDetail(id) {
        getRiskDetail(id).then(({ data }) => {
          if (data.code === 200) {
            this.detail.push(data.body);
          }
        }).catch(() => {})
      },
      // 审核详情列表
      getReportList(loanApplicationNo, auditKind) {
        getReportList(loanApplicationNo, auditKind).then(({ data }) => {
          if (data.code === 200) {
            this.reportList = data.body || [];
          }
        }).catch(() => {})
      }
    }
  };
</script>
