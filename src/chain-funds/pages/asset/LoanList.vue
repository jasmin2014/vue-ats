<template>
  <div class="loan-list">
    <el-form :model="search" class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="上链时间">
            <ats-date-picker-query v-model="upperChainTime"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="借贷编号">
            <el-input v-model.trim="search.loanApplicationNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetChannel"
                        :org="this.$enum.BUSINESS_CHAIN_ASSET"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="主体性质">
            <ats-select v-model="search.loanPartyKind" placeholder="全部" clearable
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind" placeholder="全部" clearable
                        :kind="this.$enum.ASSET_TYPE"
                        :group="this.$enum.ASSET_TYPE"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="项目名称">
            <ats-select v-model="search.loanKind" placeholder="全部" clearable
                        :kind="this.$enum.LOAN_TYPE"
                        :group="search.assetKind"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产状态">
            <ats-select v-model="search.status" placeholder="全部" clearable
                        :kind="this.$enum.BLOCK_CHAIN_ASSET_STATUS"
                        :group="this.$enum.BLOCK_CHAIN_ASSET_STATUS"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="fa fa-search" title="查询"
                     @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" border>
      <el-table-column v-for="col in table" :key="col.prop" align="center"
                       :label="col.label" :prop="col.prop" :width="col.width"
                       :formatter="col.formatter"></el-table-column>
      <el-table-column label="备注" align="center" fixed="right">
        <template slot-scope="scope">
          {{ scope.row.remarks }}<br>
          <!--<el-tooltip content="查看备注">-->
          <!--<el-button size="mini" icon="fa fa-ellipsis-h"-->
          <!--@click="handleNoteDetail(scope.row)"></el-button>-->
          <!--</el-tooltip>-->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="100">
        <template slot-scope="scope">
          <el-tooltip content="查看">
            <el-button class="btn-operation"
                       size="mini" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <!--<el-tooltip content="放款">-->
            <!--<el-button class="btn-operation"-->
                       <!--size="mini" type="success" icon="fa fa-check-square"-->
                       <!--:disabled="!canLoan(scope.row)"-->
                       <!--@click="handleLoan(scope.row)"></el-button>-->
          <!--</el-tooltip>-->
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next"
                     :total="pageTotal"
                     :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getLoanList} from '../../api/asset';

  export default {
    data() {
      return {
        search: {
          upperChainStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          upperChainEndTime: this.$dateStringify(new Date()),
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '上链时间',
            prop: 'upperChainTime',
            width: 95
          },
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '资产渠道',
            prop: 'assetChannel'
          },
          {
            label: '分享额度(元)',
            prop: 'shareAmount'
          },
          {
            label: '下单额度(元)',
            prop: 'confirmAmount'
          },
          {
            label: '资产状态',
            prop: 'status',
            formatter: (row, col, val) => this.$filter(val, this.$enum.BLOCK_CHAIN_ASSET_STATUS, this.$enum.BLOCK_CHAIN_ASSET_STATUS)
          },
          {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
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
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '年利率',
            prop: 'yearRate',
            formatter: (row, col, val) => this.$floatToPercentage(val)
          },
          {
            label: '还款期数',
            prop: 'loanTerms'
          },
          {
            label: '期限单位',
            prop: 'loanTimeType',
            formatter: (row, col, val) => `${row.loanTime || ''}${this.$filter(val || '', this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, val) => this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          }
        ]
      }
    },
    computed: {
      upperChainTime: {
        get() {
          if (this.search.upperChainStartTime && this.search.upperChainEndTime) {
            const dateRange = [];
            dateRange[0] = this.search.upperChainStartTime;
            dateRange[1] = this.search.upperChainEndTime;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.upperChainStartTime = val[0];
            this.search.upperChainEndTime = val[1]
          } else {
            this.search.upperChainStartTime = '';
            this.search.upperChainEndTime = ''
          }
        }
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      canLoan(row) {
        return true
      },
      handleDetail(row) {
        this.$router.push({
          name: 'AssetLoanDetail',
          params: { id: row.assetId }
        })
      },
      handleLoan(row) {

      },
      handleSearch() {
        this.getData(1);
      },
      getData(index) {
        const search = this.$objFilter(this.search, _ => _ !== '');
        search.pageNumber = index;
        getLoanList(search).then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord || 0;
            this.search.pageNumber = index;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }).catch(() => {
          this.list = [];
          this.pageTotal = 0;
        })
      }
    }
  }
</script>
