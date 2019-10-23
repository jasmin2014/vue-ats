<!--资产标信息列表-->
<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="申请日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetChannel"
                        :org="this.$enum.BUSINESS_ASSET"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <ats-select v-model="assetStatus"
                        :kind="this.$enum.LOAN_STATUS"
                        :group="this.$enum.LOAN_STATUS_GROUP"
                        :sequence="statusSequence"
                        placeholder="全部"
                        clearable></ats-select>
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
          <el-form-item label="风险等级">
            <ats-select v-model="search.assetRiskLevel"
                        :kind="this.$enum.RISK_LEVEL"
                        :group="this.$enum.RISK_LEVEL_GROUP"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams"
                      placeholder="姓名/协议编号/借款编号"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" @click="handleSearch" title="查询"></el-button>
          <el-button v-action="'AssetDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownload"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" class='table-center' border>
        <el-table-column prop="loanApplicationNo" label="借款编号"></el-table-column>
        <el-table-column prop="assetOrgName" label="资产渠道"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/企业名称"></el-table-column>
        <el-table-column prop="creditScore" label="信用评分"></el-table-column>
        <el-table-column prop="assetRiskLevel" label="风险等级"
                         :formatter="(row, col, val) => this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP)"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="projectType" label="业务类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE))"></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="loanAmount" label="借款金额（元）"></el-table-column>
        <el-table-column prop="repayIntRate" label="借款利率(年化利率)"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column prop="repayTerms" label="期数"></el-table-column>
        <el-table-column prop="repayTimeType" label="期数单位"
                         :formatter="(row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`"></el-table-column>
        <el-table-column prop="repayWay" label="还款方式"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY))"></el-table-column>
        <el-table-column prop="appliedTime" label="申请日期" width="85"></el-table-column>
        <el-table-column label="状态" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tag :type="$enum.LOAN_STATUS_COLOR_MAP[scope.row.status]">
              {{ $filter(scope.row.status, $enum.LOAN_STATUS, $enum.LOAN_STATUS_GROUP) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" fixed="right">
          <template slot-scope="scope">
            {{ scope.row.remarks ? scope.row.remarks.split(':')[0] : '' }}<br>
            <el-tooltip content="查看备注">
              <el-button size="mini" icon="fa fa-ellipsis-h"
                         @click="handleNoteDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetDetail'"
                        content="查看">
              <el-button icon="fa fa-eye" size="mini"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <!--<el-tooltip v-action="'AssetDetail'"-->
                        <!--content="还款计划">-->
              <!--<el-button size="mini"-->
                         <!--@click="handlePlanDetail(scope.row)">还款计划</el-button>-->
            <!--</el-tooltip>-->
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
  import { getAssetInfoList, getRemarkList, downloadAssetInfoList } from '../../api/asset';

  const statusSequence = [1, 3, 5, 6, 8, 10, 12, 14, 15];

  export default {
    data() {
      return {
        statusSequence,
        list: [],
        totalRecord: 0,
        search: {
          assetChannel: '',
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          assetRiskLevel: '',
          assetKind: '',
          statusCount: this.$arrayToBinary(statusSequence),
          otherParams: '',
          pageNumber: 1,
          pageSize: 20
        }
      };
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.appliedStartTime || this.search.appliedEndTime) {
            let dateRange = [];
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
      },
      assetStatusList: {
        get() {
          return this.$binaryToArray(this.search.statusCount || 0)
        },
        set(val) {
          this.search.statusCount = this.$arrayToBinary(val)
        }
      },
      assetStatus: {
        get() {
          if (this.assetStatusList && this.assetStatusList.length === 1) {
            return this.$enum.LOAN_STATUS_LIST[this.assetStatusList[0]]
          } else {
            return ''
          }
        },
        set(val) {
          if (val) {
            this.assetStatusList = [this.$enum.LOAN_STATUS_LIST.indexOf(val)]
          } else {
            this.assetStatusList = statusSequence
          }
        }
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      handleDownload() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadAssetInfoList(search), this.$store);
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
          name: 'AssetDetail',
          params: { id: row.id }
        });
      },
      // handlePlanDetail(row) {
      //   this.$router.push({
      //     name: 'AssetPlanDetail',
      //     params: {
      //       id: row.id
      //     }
      //   })
      // },
      handleNoteDetail(row) {
        getRemarkList(row.id).then(({ data }) => {
          if (data.code === 200) {
            const note = data.body.map((_, i) => `${i + 1}. ${_.remarks}[${_.createdTime}]`).join('\n');
            const h = this.$createElement;
            const message = note.length ? h('div', null, note.split('\n').map(_ => h('p', null, _))) : '无';
            this.$msgbox({
              title: '备注',
              message
            }).catch(() => {
            })
          }
        }, () => {
        })
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getAssetInfoList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.totalRecord = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.list = [];
            this.totalRecord = 0;
          }
        })
      }
    }
  };
</script>
