<!--审核进度查询-->
<template>
  <div class="progress-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请日期">
            <ats-date-picker-query v-model="appliedDate"></ats-date-picker-query>
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
      </el-row>
      <el-row>
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
        <el-col :span="6">
          <el-form-item label="关键词">
            <ats-input v-model="search.otherParams"
                       placeholder="姓名/协议编号/借贷编号"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="搜索"
                     @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter" :width="col.width"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button class="el-dropdown-link">查看审核当前进度</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in scope.row.auditFlowCharts" :key="item.id">{{item.name}} <span>{{item.pass==true?'通过':'未审核'}}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @current-change="getData"
                     :page-size="search.pageSize"
                     layout="prev, next"
                     :total="totalRecord"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getAuditPlanLst} from '../../api/audit'

  export default {
    data() {
      return {
        search: {
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          assetChannel: '',
          subjectNature: '',
          assetKind: '',
          loanKind: '',
          otherParams: '',
          pageNumber: 1,
          pageSize: 20
        },
        totalRecord: 0,
        list: [],
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
            formatter: (row, col, value) => this.$filter(value, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          },
          {
            label: '客户姓名/法人姓名',
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
            label: '担保公司',
            prop: 'assuredPartyName'
          },
          {
            label: '身份证号/统一社会信用代码',
            prop: 'loanIdent'
          },
          {
            label: '申请日期',
            prop: 'appliedTime',
            width: 85
          }
        ]
      }
    },
    computed: {
      appliedDate: {
        get() {
          if (this.search.appliedStartTime && this.search.appliedEndTime) {
            const dateRange = [];
            dateRange[0] = this.search.appliedStartTime;
            dateRange[1] = this.search.appliedEndTime;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.appliedStartTime = val[0];
            this.search.appliedEndTime = val[1]
          } else {
            this.search.appliedStartTime = '';
            this.search.appliedEndTime = ''
          }
        }
      }
    },
    created() {
      this.getData(1)
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getAuditPlanLst(search).then(({data}) => {
          if (data.code === 200 && data.body) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord;
            this.search.pageNumber = data.body.pageNumber;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.list = [];
          this.pageTotal = 0;
        })
      }
    }
  }
</script>
<style>
</style>
