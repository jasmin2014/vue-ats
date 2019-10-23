<!--riskRate 风险评级-->
<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="提交日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind"
                        :kind="this.$enum.ASSET_TYPE"
                        :group="this.$enum.ASSET_TYPE"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="业务类型">
            <ats-select v-model="search.projectType"
                        :kind="this.$enum.PROJECT_TYPE"
                        :group="this.$enum.PROJECT_TYPE"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="主体性质">
            <ats-select v-model="search.loanPartyKind"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="审核状态">
            <ats-select v-model="search.auditStatus"
                        :options="auditStatusOptions"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetOrg"
                        :org="this.$enum.BUSINESS_ASSET"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="借款期数">
            <ats-input v-model="search.repayTerms" type="number" clearable></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="姓名/协议编号/借款编号/审核记录ID"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="fa fa-search" @click="handleSearch" title="查询"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="col in table"
                         align="center"
                         :key="col.prop"
                         :label="col.label"
                         :prop="col.prop"
                         :width="col.width"
                         :formatter="col.formatter"></el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="getAuditStatusTagType(row.auditStatus)" :key="`audit-status-${row.id}`">{{ $filter(row.auditStatus, $enum.AUDIT_STATUS, $enum.AUDIT_STATUS) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="200"
                         fixed="right">
          <template slot-scope="scope">
            <el-tooltip v-action="'AuditRiskDetail'"
                        content="查看">
              <el-button icon="fa fa-eye"
                         size="mini"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AuditRiskExecute'"
                        v-if="canRisk(scope.row)"
                        content="获取风控数据">
              <el-button type="info"
                         size="mini"
                         @click="handleRisk(scope.row)">风控</el-button>
            </el-tooltip>
            <el-tooltip v-if="canPass(scope.row)"
                        v-action="'AuditRiskCheck'"
                        content="审核通过">
              <el-button type="success"
                         size="mini"
                         @click="handlePass(scope.row)">通过</el-button>
            </el-tooltip>
            <el-tooltip v-if="canFeedback(scope.row)"
                        v-action="'AuditRiskCheck'"
                        content="反馈">
              <el-button type="error"
                         size="mini"
                         @click="handleFeedback(scope.row)">反馈</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="totalRecord" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {
    getRiskLst,
    executeRisk,
    pass,
    feedback
  } from '../../api/audit'

  export default {
    data() {
      return {
        list: [],
        totalRecord: 0,
        search: {
          pageNumber: 1,
          pageSize: 20,
          applyDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          applyDateEnd: this.$dateStringify(new Date()),
          assetKind: '',
          projectType: '',
          loanPartyKind: '',
          auditStatus: '',
          assetOrg: '',
          searchKeyword: ''
        },
        table: [
          {
            label: '审核记录ID',
            prop: 'id',
            width: 90
          },
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
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '项目名称',
            prop: 'projectName'
          },
          {
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, val) => this.$filter(val, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '借款金额',
            prop: 'loanAmount'
          },
          {
            label: '借款期数',
            prop: 'repayTerms'
          },
          {
            label: '期数单位',
            prop: 'repayTimeType',
            formatter: (row, col, value) => `${row.repayTime || ''}${this.$filter(value || '', this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
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
            label: '提交时间',
            prop: 'createdTime',
            width: 85
          }
        ]
      };
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.applyDateStart || this.search.applyDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.applyDateStart;
            dateRange[1] = this.search.applyDateEnd;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.search.applyDateStart = range[0];
            this.search.applyDateEnd = range[1];
          } else {
            this.search.applyDateStart = '';
            this.search.applyDateEnd = '';
          }
        }
      },
      auditStatusOptions() {
        const availableStatus = [this.$enum.AUDIT_STATUS_WAIT_EVALUATE, this.$enum.AUDIT_STATUS_EVALUATING, this.$enum.AUDIT_STATUS_WAIT_AUDIT];
        return (this.$store.state.enums[`${this.$enum.AUDIT_STATUS}.${this.$enum.AUDIT_STATUS}`] || []).filter(_ => availableStatus.includes(_.value))
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      canRisk(row) { // 待评估：自动风控失败了，可以手动风控/反馈
        return row.auditStatus === this.$enum.AUDIT_STATUS_WAIT_EVALUATE
      },
      canPass(row) { // 待审核：非自动审核的可以进行审核操作
        return row.auditStatus === this.$enum.AUDIT_STATUS_WAIT_AUDIT && row.auditType !== this.$enum.AUDIT_TYPE_AUTO_CHECK
      },
      canFeedback(row) { // 待审核：非自动审核的可以进行审核操作
        return this.canPass(row) || row.auditStatus === this.$enum.AUDIT_STATUS_WAIT_EVALUATE
      },

      getAuditStatusTagType(auditStatus) {
        if (auditStatus === this.$enum.AUDIT_STATUS_WAIT_AUDIT) return '';
        else if (auditStatus === this.$enum.AUDIT_STATUS_WAIT_EVALUATE) return 'info';
        else if (auditStatus === this.$enum.AUDIT_STATUS_EVALUATING) return 'warning';
        else if (auditStatus === this.$enum.AUDIT_STATUS_PASS) return 'success';
        else if (auditStatus === this.$enum.AUDIT_STATUS_NOT_PASS) return 'error';
      },

      handleSearch() {
        this.getData(1);
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleDetail(row) {
        this.$router.push({
          name: 'AuditRiskDetail',
          params: { id: row.loanId },
          query: {
            id: row.id,
            auditType: row.auditType
          }
        })
      },
      handleRisk(row) {
        this.$set(row, '$loading', true);
        executeRisk(row.id).then(({ data }) => {
          if (data.code === 200) {
            setTimeout(() => {
              this.$message.success('风控数据获取中');
              this.getData(this.search.pageNumber);
            }, 1000)
          } else {
            this.getData(this.search.pageNumber);
          }
        }).catch(() => {
          this.getData(this.search.pageNumber);
        })
      },
      handlePass(row) {
        pass(row.id, row.loanId).then(({ data }) => {
          if (data.code === 200) {
            setTimeout(() => {
              this.$message.success('审核通过成功');
              this.getData(this.search.pageNumber);
            }, 1000);
          }
        }).catch(() => {
          this.getData(this.search.pageNumber);
        })
      },
      handleFeedback(row) {
        this.$prompt('具体描述', '反馈问题').then(({ value }) => {
          feedback(row.id, row.loanId, value).then(({ data }) => {
            if (data.code === 200) {
              setTimeout(() => {
                this.$message.success('反馈成功');
                this.getData(this.search.pageNumber);
              }, 1000);
            }
          }).catch(() => {
            this.getData(this.search.pageNumber);
          })
        })
      },

      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getRiskLst(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.totalRecord = res.body.totalRecord;
            this.search.pageNumber = index;
          } else {
            this.list = [];
            this.totalRecord = 0;
          }
        }).catch(() => {
          this.list = [];
          this.totalRecord = 0;
        })
      }
    }
  };
</script>
