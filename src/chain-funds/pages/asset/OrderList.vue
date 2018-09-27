<template>
  <div class="order-list">
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
          <el-form-item label="审核状态">
            <ats-select v-model="search.auditStatus" placeholder="全部" clearable
                        type="boolean" true-text="通过" false-text="拒绝"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="下单状态">
            <ats-select v-model="search.confirmStatus" placeholder="全部" clearable
                        :kind="this.$enum.BLOCK_CHAIN_CONFIRM_STATUS"
                        :group="this.$enum.BLOCK_CHAIN_CONFIRM_STATUS"></ats-select>
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
      <el-table-column label="操作" align="center" fixed="right" width="130">
        <template slot-scope="scope">
          <el-tooltip content="查看">
            <el-button class="btn-operation"
                       size="mini" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="下单">
            <el-button class="btn-operation"
                       size="mini" type="success" icon="fa fa-check-square"
                       :disabled="!canOrder(scope.row)"
                       @click="handleOrder(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="资产输出">
            <el-button class="btn-operation"
                       size="mini" type="warning" icon="fa fa-upload"
                       :disabled="!canOutput(scope.row)"
                       @click="handleOutput(scope.row)"></el-button>
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

    <el-dialog :visible.sync="showDialog"
               title="参与反馈" width="700px"
               @open="handleDialogOpen"
               @close="handleDialogClose">
      <el-row>
        <el-col :span="20">
          <el-form ref="order"
                   :model="orderDetail"
                   :rules="orderRules"
                   label-width="150px">
            <el-form-item label="参与额度" prop="confirmTakeInLimit">
              <ats-input v-model="orderDetail.confirmTakeInLimit"
                         :disabled="isFinance"
                         type="number" unit="元"></ats-input>
            </el-form-item>
            <el-form-item label="参与利率(年化)" prop="confirmTakeInRate">
              <ats-input v-model="confirmTakeInRate"
                         type="number" unit="%"></ats-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="primary"
                   @click="handleDialogConfirm">确 定</el-button>
        <el-button @click="showDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getStorageList, orderLoan, outputAsset} from '../../api/asset';

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
            label: '用户等级',
            prop: 'userRating'
          },
          {
            label: '风险评级',
            prop: 'riskRating'
          },
          {
            label: '审核状态',
            prop: 'auditStatus',
            formatter: (row, col, val) => this.$filterBoolean(val, '通过', '拒绝')
          },
          {
            label: '下单状态',
            prop: 'confirmStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.BLOCK_CHAIN_CONFIRM_STATUS, this.$enum.BLOCK_CHAIN_CONFIRM_STATUS)
          },
          {
            label: '下单额度(元)',
            prop: 'confirmAmount'
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
        ],
        isFinance: this.$getLocalStorage('user').finance === 1,
        showDialog: false,
        orderDetail: {},
        orderRules: {
          confirmTakeInLimit: [
            { required: true, message: '请输入参与额度', trigger: 'blur', type: 'number' },
            { min: 0, max: 9999999999999, message: '范围0-9999999999999', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 2)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ],
          confirmTakeInRate: [
            { required: true, message: '请输入参与利率', trigger: 'blur', type: 'number' },
            { min: 0, max: 1, message: '范围0-100%', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 4)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ]
        }
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
      },
      confirmTakeInRate: {
        get() {
          if (typeof this.orderDetail.confirmTakeInRate === 'number') {
            return this.$floatMultiply(this.orderDetail.confirmTakeInRate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.orderDetail.confirmTakeInRate = null;
          } else {
            this.orderDetail.confirmTakeInRate = this.$floatDivide(val, 100);
          }
        }
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      canOrder(row) {
        return row.auditStatus === true && row.confirmStatus !== this.$enum.BLOCK_CHAIN_CONFIRM_STATUS_SUCCESS && row.confirmStatus !== this.$enum.BLOCK_CHAIN_CONFIRM_STATUS_PROCESSING;
      },
      canOutput(row) {
        return row.confirmStatus === this.$enum.BLOCK_CHAIN_CONFIRM_STATUS_SUCCESS;
      },
      handleSearch() {
        this.getData(1);
      },
      handleDetail(row) {
        this.$router.push({
          name: 'AssetOrderDetail',
          params: { id: row.assetId }
        })
      },
      handleOrder(row) {
        this.showDialog = true;
        if (this.isFinance) {
          this.orderDetail = {
            assetId: row.assetId,
            confirmTakeInLimit: row.shareAmount
          }
        } else {
          this.orderDetail = {
            assetId: row.assetId
          }
        }
      },
      handleOutput(row) {
        outputAsset(row.assetId).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$message.error(data.detail || data.message)
          }
          this.getData(this.search.pageNumber);
        }).catch(() => {})
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.$set(this.orderDetail, 'confirmTakeInRate', null);
          this.$refs['order'].clearValidate();
        })
      },
      handleDialogClose() {
        this.orderDetail = {};
      },
      handleDialogConfirm() {
        this.$refs['order'].validate((valid) => {
          if (valid) {
            orderLoan(this.$deepcopy(this.orderDetail)).then(({ data }) => {
              if (data.code === 200) {
                this.$message({
                  message: '下单成功',
                  type: 'success'
                });
                this.showDialog = false;
              } else {
                this.$message.error(data.detail || data.message)
              }
              this.getData(this.search.pageNumber);
            }).catch(() => {})
          } else {
            return false;
          }
        })
      },
      getData(index) {
        const search = this.$objFilter(this.search, _ => _ !== '');
        search.pageNumber = index;
        getStorageList(search).then(({ data }) => {
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

<style lang="scss" scoped>
  .btn-operation {
    padding: 7px 10px;

    & + .btn-operation {
      margin-left: 2px;
    }
  }
</style>
