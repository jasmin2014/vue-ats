<!--assetsAppraisal 客户资产评估-->
<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="申请日期">
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
          <el-form-item label="项目名称">
            <ats-select v-model="search.loanKind"
                        :kind="this.$enum.LOAN_TYPE"
                        :group="search.assetKind"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="主体性质">
            <ats-select v-model="search.subjectNature"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams"
                      placeholder="姓名/协议编号/借贷编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="fa fa-search" @click="handleSearch" title="查询"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" class='table-center' border>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/法人姓名"></el-table-column>
        <el-table-column prop="loanIdent" label="身份证号/统一社会信用代码"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称"
                         :formatter="(row, col, value) => (this.$filter(value, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="assetSystemPrice" label="系统评估"></el-table-column>
        <el-table-column prop="assetArtificialPrice" label="人工评估"></el-table-column>
        <el-table-column prop="status" label="审核状态"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_STATUS, this.$enum.LOAN_STATUS_GROUP))"></el-table-column>
        <el-table-column prop="appliedTime" label="申请日期"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-action="'AuditEvalDetail'"
                       type="primary" size="small"
                       @click="handleAudit(scope.row)">审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @current-change="getData"
                     :current-page="search.pageNumber"
                     :page-size="search.pageSize"
                     layout="prev, next"
                     :total="totalRecord"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getAssessList, auditList} from '../../api/audit'

  export default {
    data() {
      return {
        nonAudit: false,
        list: [],
        totalRecord: 0,
        search: {
          pageNumber: 1,
          pageSize: 20,
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          subjectNature: '',
          assetKind: '',
          loanKind: '',
          otherParams: ''
        },
        // 审核不通过弹框
        nonAuditInfo: {
          info: '',
          grade: ''
        }
      };
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.appliedStartTime || this.search.appliedEndTime) {
            const dateRange = [];
            dateRange[0] = this.search.appliedStartTime;
            dateRange[1] = this.search.appliedEndTime;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.search.appliedStartTime = range[0];
            this.search.appliedEndTime = range[1];
          } else {
            this.search.appliedStartTime = '';
            this.search.appliedEndTime = '';
          }
        }
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleAudit(row) {
        this.auditList(row.id);
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getAssessList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.totalRecord = res.body.totalRecord;
            this.search.pageNumber = index;
          } else {
            this.list = [];
            this.totalRecord = 0;
          }
        }, () => {
          this.list = [];
          this.totalRecord = 0;
        })
      },
      // 表格数据
      auditList(id) {
        auditList(id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$router.push({
              name: 'AuditEvalDetail',
              params: { id }
            });
          }
        }, () => {
          this.getData(this.pageNumber);
        })
      }
    }
  };
</script>
