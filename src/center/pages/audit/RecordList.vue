<template>
  <div class="record-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="审批日期">
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
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="姓名/协议编号/借款编号/审核记录ID"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" @click="handleSearch" title="查询"></el-button>
          <el-button v-action="'AuditRecordDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownload"></el-button>
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
                         width="100"
                         fixed="right">
          <template slot-scope="scope">
            <el-tooltip v-action="'AuditRecordDetail'"
                        content="查看">
              <el-button icon="fa fa-eye"
                         size="mini"
                         @click="handleDetail(scope.row)"></el-button>
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
    getAuditRecordList,
    downloadAuditRecord
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
          applyDateEnd: this.$dateStringify(new Date())
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
            label: '审批时间',
            prop: 'updatedTime',
            width: 85
          }
        ]
      }
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
        const availableStatus = [this.$enum.AUDIT_STATUS_PASS, this.$enum.AUDIT_STATUS_NOT_PASS];
        return (this.$store.state.enums[`${this.$enum.AUDIT_STATUS}.${this.$enum.AUDIT_STATUS}`] || []).filter(_ => availableStatus.includes(_.value))
      }
    },

    created() {
      this.getData(1)
    },

    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadAuditRecord(search), this.$store)
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleDetail(row) {
        this.$router.push({
          name: 'AuditRecordDetail',
          params: { id: row.id }
        })
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getAuditRecordList(search).then(response => {
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
