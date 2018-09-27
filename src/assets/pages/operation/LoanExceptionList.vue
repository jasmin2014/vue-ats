<!--异常放款-->
<template>
  <div class="loan">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="异常时间">
            <ats-date-picker-query v-model="mistakeDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.searchKeyword"
                      placeholder="姓名/协议编号/借贷编号"></el-input>
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
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip v-action="'OperationLoanExceptionCorrection'"
                        content="信息修正">
              <el-button size="small" type="info"
                         @click="handleInfoCorrect(scope.row)">信息修正</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>

    <!--信息修正-->
    <el-dialog title="银行卡信息修正" width="1000px"
               :visible.sync="showDialog">
      <card-correction v-model="currentCardList"
                       @create-card="handleCreateCard"
                       @auth-card="handleAuthCard"
                       @change-card="handleChangeCard"></card-correction>
    </el-dialog>
  </div>
</template>

<script>
  import {getLoanExceptionList, getLoanExceptionCardList, changeBindCard} from '../../api/operation'
  import {bindCustomerCard, createCustomerProp} from '../../api/customer';
  import CardCorrection from '../../../modules/operation/CardCorrection.vue'

  export default {
    data() {
      return {
        showDialog: false,
        currentCardList: [],
        currentPaymentId: '',
        search: {
          mistakeDateStart: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          mistakeDateEnd: this.$dateStringify(new Date()),
          pageNumber: 1,
          pageSize: 20
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '放款编号',
            prop: 'paymentNo'
          },
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '协议编号',
            prop: 'contract'
          },
          {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          },
          {
            label: '客户姓名/企业名称',
            prop: 'loanPartyName'
          },
          {
            label: '资金端',
            prop: 'fundName'
          },
          {
            label: '异常原因',
            prop: 'mistakeMessage'
          },
          {
            label: '异常时间',
            prop: 'createdTime'
          }
        ]
      }
    },
    computed: {
      mistakeDate: {
        get() {
          if (this.search.mistakeDateStart && this.search.mistakeDateEnd) {
            const dateRange = [];
            dateRange[0] = this.search.mistakeDateStart;
            dateRange[1] = this.search.mistakeDateEnd;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.search.mistakeDateStart = val[0];
            this.search.mistakeDateEnd = val[1]
          } else {
            this.search.mistakeDateStart = '';
            this.search.mistakeDateEnd = ''
          }
        }
      }
    },
    created() {
      this.getData(1)
    },
    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleInfoCorrect(row) {
        this.currentPaymentId = row.paymentId;
        this.getCardList(row.paymentId);
      },
      handleCreateCard(card) {
        createCustomerProp('bank', card.partyId, card).then(({status}) => {
          if (status === 201) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.getCardList(this.currentPaymentId)
          } else {
            this.getCardList(this.currentPaymentId)
          }
        })
      },
      handleAuthCard(card) {
        bindCustomerCard(card.partyId, card.propId).then(({data}) => {
          if (data.code === 200) {
            this.$message({
              message: '认证成功',
              type: 'success'
            })
          } else {
            this.$message.error(data.message)
          }
          this.getCardList(this.currentPaymentId)
        }).catch(() => {
          this.getCardList(this.currentPaymentId)
        })
      },
      handleChangeCard(card) {
        changeBindCard(this.currentPaymentId, card.bankCard).then(() => {
          setTimeout(() => {
            this.$message({
              message: '新卡使用成功',
              type: 'success'
            });
            this.showDialog = false;
            this.getData(this.search.pageNumber);
          }, 1000)
        }).catch(() => {})
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        getLoanExceptionList(search).then(({ data }) => {
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
      },
      getCardList(paymentId) {
        getLoanExceptionCardList(paymentId).then(({data}) => {
          if (data.code === 200) {
            if (data.body && data.body.length > 0) {
              data.body[0].isUsed = true;
            }
            this.currentCardList = data.body || [];
            this.showDialog = true;
          }
        }).catch(() => {})
      }
    },
    components: {
      CardCorrection
    }
  }
</script>


