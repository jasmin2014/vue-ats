<!-- 资产标列表 -->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="生成日期">
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
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKeyword"
                      placeholder="原始借款人/协议编号/借贷编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" title="查找" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-row>
      <el-table :data="list" class='table-center' border tooltip-effect="dark">
        <el-table-column prop="candidateNo" label="标的编号"></el-table-column>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="原始借款人"></el-table-column>
        <el-table-column prop="creditor" label="债权转让人"></el-table-column>
        <el-table-column prop="lendPartyName" label="债权人"></el-table-column>
        <el-table-column prop="creditScore" label="信用评分"></el-table-column>
        <el-table-column prop="assetRiskLevel" label="资产风险等级"
                         :formatter="(row, col, val) => this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP)"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="amount" label="标的金额(元)"></el-table-column>
        <el-table-column prop="repayYearRate" label="年利率"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column prop="repayTerms" label="期数"></el-table-column>
        <el-table-column prop="repayTimeType" label="期数单位"
                         :formatter="(row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`"></el-table-column>
        <el-table-column prop="repayWay" label="还款方式"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY))"></el-table-column>
        <el-table-column prop="createdTime" label="生成日期"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="handleCurrentChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getAssetList} from '../../../api/assetMgt';

  export default {
    data() {
      return {
        pageTotal: 0,
        search: {
          createdTimeStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          createdTimeEnd: this.$dateStringify(new Date()),
          searchKeyword: '',
          assetKind: '',
          loanKind: '',
          assetRiskLevel: '',
          pageNumber: 1,
          pageSize: 20
        },
        list: []
      };
    },
    created() {
      this.getAssetList(1);
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.createdTimeStart || this.search.createdTimeEnd) {
            const dateRange = [];
            dateRange[0] = this.search.createdTimeStart;
            dateRange[1] = this.search.createdTimeEnd;
            return dateRange;
          } else {
            return null;
          }
        },
        set(range) {
          if (range) {
            this.search.createdTimeStart = range[0];
            this.search.createdTimeEnd = range[1];
          } else {
            this.search.createdTimeStart = '';
            this.search.createdTimeEnd = '';
          }
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.getAssetList(val);
      },
      statusFormat(row, col, val) {
        return this.$filter(val, this.$enum.LOAN_STATUS, this.$enum.LOAN_STATUS_GROUP)
      },
      getAssetList(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getAssetList(search).then(response => {
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
          name: 'assDetail',
          params: { id: scope.$index + 1 }
        });
      }
    }
  };
</script>
