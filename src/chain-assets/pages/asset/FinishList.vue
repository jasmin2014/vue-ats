<template>
  <div class="apply-list">
    <el-form :model="search" class="form-label flex fixed-width">
      <el-row>
        <el-col :span="8">
          <el-form-item label="时间">
            <el-row>
              <el-col :span="8">
                <ats-select v-model="search.timeType"
                            :kind="this.$enum.BLOCK_CHAIN_SEARCH_DATE"
                            :group="this.$enum.BLOCK_CHAIN_SEARCH_DATE"></ats-select>
              </el-col>
              <el-col :span="16">
                <ats-date-picker-query v-model="time"></ats-date-picker-query>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="借贷编号">
            <el-input v-model.trim="search.loanApplicationNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="主体性质">
            <ats-select v-model="search.customerType"
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
            <ats-select v-model="search.assetStatus" placeholder="全部" clearable
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
      <el-table-column type="selection" align="center" fixed="left" width="55"></el-table-column>
      <el-table-column v-for="col in table.slice(0, 3)" :key="col.prop" align="center"
                       :label="col.label" :prop="col.prop" :formatter="col.formatter"></el-table-column>
      <el-table-column label="资金端" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.funds && scope.row.funds.length > 0"
                     size="mini" icon="fa fa-ellipsis-h"
                     @click="handleFundOrgs(scope.row)"></el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column v-for="col in table.slice(3)" :key="col.prop" align="center"
                       :label="col.label" :prop="col.prop" :formatter="col.formatter"></el-table-column>
      <el-table-column label="备注" align="center" fixed="right">
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="查看">
            <el-button class="btn-operation"
                       size="mini" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
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
  import {getFinishList} from '../../api/asset';

  export default {
    data() {
      return {
        search: {
          timeType: this.$enum.BLOCK_CHAIN_SEARCH_DATE_UPPER_CHAIN,
          startTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          endTime: this.$dateStringify(new Date()),
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        list: [],
        selected: [],
        table: [
          {
            label: '上链时间',
            prop: 'upperChainTime'
          },
          {
            label: '下单时间',
            prop: 'confirmTime'
          },
          {
            label: '放款时间',
            prop: 'confirmLoanTime',
            formatter: (row, col, val) => val || '--'
          },
          {
            label: '放款额度(元)',
            prop: 'confirmLoanAmount'
          },
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
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
            label: '借款期数',
            prop: 'loanTerms'
          },
          {
            label: '期数单位',
            prop: 'loanTimeType',
            formatter: (row, col, val) => `${row.loanTime || ''}${this.$filter(val || '', this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, val) => this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '分享额度(元)',
            prop: 'shareAmount'
          },
          {
            label: '资产状态',
            prop: 'status',
            formatter: (row, col, val) => this.$filter(val, this.$enum.BLOCK_CHAIN_ASSET_STATUS, this.$enum.BLOCK_CHAIN_ASSET_STATUS)
          }
        ]
      }
    },
    computed: {
      time: {
        get() {
          if (this.search.startTime && this.search.endTime) {
            const dateRange = [];
            dateRange[0] = this.search.startTime;
            dateRange[1] = this.search.endTime;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.startTime = val[0];
            this.search.endTime = val[1]
          } else {
            this.search.startTime = '';
            this.search.endTime = ''
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
      handleFundOrgs(row) {
        const funds = row.funds;
        const h = this.$createElement;
        const headStyle = { style: 'border-bottom: 1px solid #ebeef5; border-right: 1px solid #ebeef5; color: #909399;' };
        const cellStyle = { style: 'border-bottom: 1px solid #ebeef5; border-right: 1px solid #ebeef5;' };
        const message = funds.length ? h('table', { style: 'width: 100%; text-align: center; line-height: 2.5; border-collapse: collapse; border: 1px solid #ebeef5;' }, [
          h('thead', null, [h('tr', null, [
            h('th', headStyle, '资金端'),
            h('th', headStyle, '放款额度(元)')
          ])]),
          h('tbody', null, funds.map(_ => h('tr', null, [
            h('td', cellStyle, _.partyName),
            h('td', cellStyle, _.confirmTakeInLimit)
          ])))
        ]) : '无';
        this.$msgbox({
          title: '资金端',
          message
        }).catch(() => {})
      },
      handleNoteDetail(row) {
        // getLoanRemark(row.id).then(response => {
        //   const res = response.data;
        //   if (res.code === 200) {
        //     const note = res.body.map((_, i) => `${i + 1}. ${_.remarks}[${_.createdTime}]`).join('\n');
        //     const h = this.$createElement;
        //     const message = note.length ? h('div', null, note.split('\n').map(_ => h('p', null, _))) : '无';
        //     this.$msgbox({
        //       title: '备注',
        //       message
        //     }).catch(() => {
        //     })
        //   }
        // }, () => {})
      },
      handleDetail(row) {
        this.$router.push({
          name: 'AssetFinishDetail',
          params: { id: row.assetId }
        })
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getFinishList(search).then(({ data }) => {
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
