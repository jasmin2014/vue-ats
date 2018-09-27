<!--账户流水-->
<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="流水号">
            <ats-input v-model="search.assetKind"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="交易时间">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="交易类型">
            <ats-select v-model="search.assetKind"
                        :kind="this.$enum.BLOCK_CHAIN_TOKEN_CHANGE"
                        :group="this.$enum.BLOCK_CHAIN_TOKEN_CHANGE"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="fa fa-search" @click="handleSearch" title="查询"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :key="index" align="center"></el-table-column>
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
  // import {getAccountFlowList} from '../../../api/chain'

  export default {
    data() {
      return {
        nonAudit: false,
        totalRecord: 0,
        search: {
          pageNumber: 1,
          pageSize: 20,
          appliedStartTime: '',
          appliedEndTime: '',
          subjectNature: '',
          assetKind: '',
          loanKind: '',
          otherParams: ''
        },
        id: this.$route.params.id,
        list: [],
        table: [
          {
            label: '流水号',
            prop: 'tokenFlowID'
          },
          {
            label: '交易时间',
            prop: 'time'
          },
          {
            label: '交易类型',
            prop: 'balanceChangeReason',
            formatter: (row, col, value) => this.$filter(value, this.$enum.BLOCK_CHAIN_TOKEN_CHANGE, this.$enum.BLOCK_CHAIN_TOKEN_CHANGE)
          },
          {
            label: '收入（TLC）',
            prop: 'amount',
            formatter:(row,col,val) =>(row.isAdd ==true?val:0)
          },
          {
            label: '支出（TLC)',
            prop: 'amount',
            formatter:(row,col,val) =>(row.isAdd ==false?val:0)
          },
          {
            label: '账户余额（TLC）',
            prop: 'balance'
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
      this.getData();
    },
    methods: {
      handleSearch() {
        this.getData();
      },
      // getData(index) {
      //   const search = this.$deepcopy(this.search);
      //   search.pageNumber = index;
      //   getAccountFlowList(search).then(response => {
      //     const res = response.data;
      //     if (res.code === 200) {
      //       this.list = res.body.list;
      //       this.totalRecord = res.body.totalRecord;
      //       this.search.pageNumber = index;
      //     }
      //   }, () => {})
      // }
      getData() {
        // getAccountFlowList(this.id).then(response => {
        //   const res = response.data;
        //   if (res.list) {
        //     this.list = res.list;
        //     this.totalRecord = res.totalRecord;
        //   }
        // }, () => {})
      }
    }
  };
</script>
