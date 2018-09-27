<!-- 借贷申请列表 -->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="申请日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind" placeholder="全部"
                        :clearable="true"
                        :kind="this.$enum.ASSET_TYPE"
                        :group="this.$enum.ASSET_TYPE">
            </ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="项目名称">
            <ats-select v-model="search.loanKind" placeholder="全部"
                        :clearable="true"
                        :kind="this.$enum.LOAN_TYPE"
                        :group="search.assetKind">
            </ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资产风险等级">
            <ats-select v-model="search.assetRiskLevel" placeholder="全部"
                        :clearable="true"
                        :kind="this.$enum.RISK_LEVEL"
                        :group="this.$enum.RISK_LEVEL_GROUP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams"
                      placeholder="姓名/协议编号/身份证"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'AssetApplyDownload'"
                     type="warning" icon="fa fa-download" title="导出数据到Excel"
                     @click="handleDownloadExcel"></el-button>
          <el-button v-action="'AssetApplyBatchStore'"
                     type="success" icon="fa fa-book" title="批量收纳"
                     @click="handleBorrowAcceptList(loanIds)">&nbsp;批量收纳</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" class='table-center' border tooltip-effect="dark"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/企业名称"></el-table-column>
        <el-table-column prop="creditScore" label="信用评分"></el-table-column>
        <el-table-column prop="assetRiskLevel" label="资产风险等级"
                         :formatter="(row, col, val) => this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP)"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="loanAmount" label="借款金额(元)"></el-table-column>
        <el-table-column prop="loanYearRateMin" label="借款利率区间"
                         :formatter="(row, col, val) => (`${this.$floatToPercentage(val) || ''} - ${this.$floatToPercentage(row.loanYearRateMax) || ''}`)"></el-table-column>
        <el-table-column prop="repayTerms" label="期数"></el-table-column>
        <el-table-column prop="repayTimeType" label="期数单位"
                         :formatter="(row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`"></el-table-column>
        <el-table-column prop="repayWay" label="还款方式"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY))"></el-table-column>
        <el-table-column label="募集期" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.raiseFromDate}}-{{scope.row.raiseThruDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_STATUS, this.$enum.LOAN_STATUS_GROUP))"></el-table-column>
        <el-table-column prop="appliedTime" label="申请日期" width="85"></el-table-column>
        <el-table-column label="备注" fixed="right">
          <template slot-scope="scope">
            {{scope.row.remarks}}<br>
            <el-tooltip content="查看备注">
              <el-button size="mini" icon="fa fa-ellipsis-h"
                         @click="toShowBackup(scope)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120px">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetApplyDetail'"
                        content="查看">
              <el-button size="small" icon="fa fa-eye"
                         @click="goDetail(scope)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetApplyStore'"
                        content="收纳">
              <el-button type="success" size="small" title="收纳" icon="fa fa-book"
                         @click="handleAcceptCurrent(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="handleChangePage"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getBorrowList, getLoanRemark, putBorrowAcceptList, downloadLoanApplicationList} from '../../../api/assetMgt';

  export default {
    data() {
      return {
        pageTotal: 0,
        search: {
          assetKind: '',
          loanKind: '',
          assetRiskLevel: '',
          statusCount: this.$arrayToBinary([3]),
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          otherParams: '',
          pageNumber: 1,
          pageSize: 20
        },
        currentPage: 1,
        list: [],
        loanIds: []
      };
    },
    created() {
      this.getAssetList(1);
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
            return null;
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
            this.assetStatusList = [3]
          }
        }
      }
    },
    methods: {
      handleDownloadExcel() {
        const search = this.$deepcopy(this.search);
        this.$download(downloadLoanApplicationList(search), this.$store);
      },
      handleChangePage(val) {
        this.currentPage = val;
        this.getAssetList(val);
      },
      getAssetList(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getBorrowList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.pageTotal = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.list = [];
          this.pageTotal = 0;
        })
      },
      handleSearch() {
        this.getAssetList(1);
      },
      goDetail(scope) {
        this.$router.push({
          name: 'AssetApplyDetail',
          params: { id: scope.row.id }
        });
      },
      handlePageChange() {
      },
      goHandLoan() {
        this.list = [];
      },
      handleSelectionChange(value) {
        if (value && value.length > 0) {
          this.loanIds = value.map(_ => _.id)
        } else {
          this.loanIds = []
        }
      },
      handleAcceptCurrent(loandId) {
        this.handleBorrowAcceptList([loandId], false);
      },
      handleBorrowAcceptList(loandIds) {
        if (loandIds.length === 0) {
          this.$message({
            message: '请先选择要收纳的借贷申请',
            type: 'warning'
          });
          return;
        }
        putBorrowAcceptList(loandIds).then(response => {
          const res = response.data;
          if (res.code === 200) {
            if (res.body.failCount > 0) {
              let _failReason = '';
              res.body.failReason.forEach((item, index) => {
                _failReason += '（' + (index + 1) + '）' + item + '；';
              });
              this.$message({
                message: _failReason,
                type: 'warning'
              });
            } else {
              this.$message({
                message: '收纳成功',
                type: 'success'
              });
            }

            setTimeout(() => {
              this.getAssetList(this.currentPage);
            }, 1000);
          }
        }, (response) => {})
      },
      toShowBackup(scope) {
        getLoanRemark(scope.row.id).then(({ data }) => {
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
        }, (response) => {})
      }
    }
  };
</script>
