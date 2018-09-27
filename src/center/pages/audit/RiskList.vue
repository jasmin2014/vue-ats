<!--riskRate 风险评级-->
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
        <el-col :span="5">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetChannel"
                        :org="this.$enum.BUSINESS_ASSET"
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
      <el-table :data="list" border>
        <el-table-column v-for="col in table"
                         align="center"
                         :key="col.prop"
                         :label="col.label"
                         :prop="col.prop"
                         :width="col.width"
                         :formatter="col.formatter"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="150"
                         fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看">
              <el-button icon="fa fa-eye"
                         size="mini"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="获取风控数据">
              <el-button type="success"
                         size="mini"
                         :loading="scope.row.$loading"
                         @click="handleRisk(scope.row)">风控</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @current-change="getData"
                     :page-size="search.pageSize"
                     layout="prev, next"
                     :total="totalRecord"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getRiskLst, generateData} from '../../api/audit'
  let loadingList = [];

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
          assetKind: '',
          loanKind: '',
          subjectNature: '',
          assetChannel: '',
          otherParams: ''
        },
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
            formatter: (row, col, val) => this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '项目名称',
            prop: 'loanKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind)
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
          }
        ]
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
      handleDetail(row) {
        this.$router.push({
          name: 'AuditRiskDetail',
          params: { id: row.id }
        })
      },
      handleRisk(row) {
        this.generateReportData(row);
      },
      generateReportData(row) {
        generateData(row.id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(row, '$loading', true);
            loadingList.push(row.id);
            this.$message({
              message: '数据获取成功',
              type: 'success'
            });
            setTimeout(() => {
              loadingList = loadingList.filter(_ => _ !== row.id);
              this.getData(this.search.pageNumber);
            }, 60000);
          } else {
            this.getData(this.search.pageNumber);
          }
        }).catch(() => {
          this.getData(this.search.pageNumber);
        })
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getRiskLst(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            res.body.list.forEach(_ => {
              if (loadingList.includes(_.id)) {
                _.$loading = true;
              }
            });
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
