<template>
  <div>
    <el-form ref="form"
             :model="search"
             :rules="rules"
             class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="协议编号" prop="contract">
            <el-input v-model="search.contract"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" title="查找"
                       @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
                       width="100"
                       fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-action="'AuditAssetDetail'"
                      content="查看">
            <el-button icon="fa fa-eye"
                       size="mini"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    getAuditAssetList
  } from '../../api/audit';

  export default {
    data() {
      return {
        search: {
          contract: null
        },
        list: [],
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
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, val) => this.$filter(val, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '项目名称',
            prop: 'projectName'
          },
          {
            label: '借款金额',
            prop: 'loanAmount'
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
            prop: 'createdTime',
            width: 85
          }
        ],
        rules: {
          contract: [
            { required: true, message: '请输入协议编号', trigger: 'change' }
          ]
        }
      }
    },

    methods: {
      handleSearch() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.getData();
          }
        })
      },

      handleDetail(row) {
        this.$router.push({
          name: 'AuditAssetDetail',
          params: { id: row.id }
        })
      },

      getData() {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        getAuditAssetList(search).then(({ data }) => {
          if (data.code === 200 && data.body) {
            this.list = data.body || [];
          } else {
            this.list = [];
          }
        }, () => {
          this.list = [];
        })
      },
      getAuditStatusTagType(auditStatus) {
        if (auditStatus === this.$enum.AUDIT_STATUS_WAIT_AUDIT) return '';
        else if (auditStatus === this.$enum.AUDIT_STATUS_WAIT_EVALUATE) return 'info';
        else if (auditStatus === this.$enum.AUDIT_STATUS_EVALUATING) return 'warning';
        else if (auditStatus === this.$enum.AUDIT_STATUS_PASS) return 'success';
        else if (auditStatus === this.$enum.AUDIT_STATUS_NOT_PASS) return 'error';
      }
    }
  }
</script>
