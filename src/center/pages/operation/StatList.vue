<template>
  <div class="stat-list">
    <el-form label-width="90px">
      <el-row>
        <el-form-item label="资产渠道：">
          <el-checkbox v-model="assetOrgCheckAll" :indeterminate="search.assetOrgIds.length > 0 && search.assetOrgIds.length < assetChannelOptions.length">全选</el-checkbox>
          <el-checkbox-group v-model="search.assetOrgIds">
            <el-checkbox v-for="option in assetChannelOptions"
                         :key="option.orgId"
                         :label="option.orgId">{{ option.orgName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="主体性质：">
          <el-checkbox v-model="loanPartyKindCheckAll" :indeterminate="search.loanPartyKinds.length > 0 && search.loanPartyKinds.length < $store.state.enums[`${$enum.SUBJECT_PROP}.${$enum.SUBJECT_PROP}`].length">全选</el-checkbox>
          <ats-checkbox v-model="search.loanPartyKinds"
                        :kind="$enum.SUBJECT_PROP"
                        :group="$enum.SUBJECT_PROP"></ats-checkbox>
        </el-form-item>
        <el-form-item label="还款方式：">
          <el-checkbox v-model="repayWayCheckAll" :indeterminate="search.repayWays.length > 0 && search.repayWays.length < $store.state.enums[`${$enum.REPAY_WAY}.${$enum.REPAY_WAY}`].length">全选</el-checkbox>
          <ats-checkbox v-model="search.repayWays"
                        :kind="$enum.REPAY_WAY"
                        :group="$enum.REPAY_WAY"></ats-checkbox>
        </el-form-item>
        <el-form-item label="资产状态：">
          <el-checkbox v-model="loanStatusCheckAll" :indeterminate="search.loanStatuss.length > 0 && search.loanStatuss.length < loanStatusOptions.length">全选</el-checkbox>
          <el-checkbox-group v-model="search.loanStatuss">
            <el-checkbox v-for="option in loanStatusOptions"
                         :key="option.value"
                         :label="option.value">{{ option.text }}
            </el-checkbox>
          </el-checkbox-group>
          <el-button style="margin-left: 20px;" type="primary" icon="fa fa-search" @click="handleSearch" title="查询"></el-button>
        </el-form-item>
      </el-row>

      <el-card class="pie">
        <div class="title">
          资产借款属性份额/数量占比图
        </div>
        <el-row type="flex" justify="end" style="margin-top: 20px;">
          <div class="date">
            <el-form-item label="申请日期">
              <ats-date-picker-query v-model="amountDate"
                                     style="width: 230px !important;"
                                     align="center"
                                     @change="getData"></ats-date-picker-query>
            </el-form-item>
          </div>
        </el-row>
        <div class="chart amount">
          <div v-if="!amountBind.series.data || !amountBind.series.data.length" class="null">无数据信息</div>
          <ve-pie v-bind="amountBind"></ve-pie>
        </div>
        <div class="chart count">
          <div v-if="!countBind.series.data || !countBind.series.data.length" class="null">无数据信息</div>
          <ve-pie v-bind="countBind"></ve-pie>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
  import 'v-charts/lib/style.min.css';
  import 'echarts/lib/component/title';
  import VePie from 'v-charts/lib/pie.common'
  import { getAssetStat } from '../../api/operation';
  import { getOrgListFromCenter } from '../../../api/enum'

  export default {
    components: {
      VePie
    },
    data() {
      return {
        search: {
          assetOrgIds: [],
          loanPartyKinds: [],
          repayWays: [],
          loanStatuss: []
        },
        dateSearch: {
          beginTime: this.$dateStringify(this.$lastNMonth(new Date(), 1)),
          endTime: this.$dateStringify(new Date())
        },
        assetChannelOptions: [],
        loanStatusOptions: [
          { text: '已放款', value: this.$enum.LOAN_STATUS_LOANED },
          { text: '已结清', value: this.$enum.LOAN_STATUS_CLEARED },
          { text: '提前结清申请中', value: this.$enum.LOAN_STATUS_APPLY_ADVANCE }
        ],
        amountBind: {
          loading: false,
          height: '320px',
          legend: { left: 'right', top: 'middle', orient: 'vertical' },
          series: {
            type: 'pie',
            data: [],
            tooltip: {
              formatter: (params) => {
                return `${params.marker} ${params.name}: ${this.$floatToThousands(this.$floatDivide(params.value, 10000).toFixed(2))}万 (${params.percent}%)`;
              }
            }
          }
        },
        countBind: {
          loading: false,
          height: '320px',
          legend: { left: 'right', top: 'middle', orient: 'vertical' },
          series: {
            type: 'pie',
            data: []
          }
        }
      }
    },
    computed: {
      assetOrgCheckAll: {
        get() {
          return this.search.assetOrgIds.length > 0;
        },
        set(val) {
          this.search.assetOrgIds = val ? this.assetChannelOptions.map(_ => _.orgId) : [];
        }
      },
      loanPartyKindCheckAll: {
        get() {
          return this.search.loanPartyKinds.length > 0
        },
        set(val) {
          this.search.loanPartyKinds = val ? this.$store.state.enums[`${this.$enum.SUBJECT_PROP}.${this.$enum.SUBJECT_PROP}`].map(_ => _.value) : [];
        }
      },
      repayWayCheckAll: {
        get() {
          return this.search.repayWays.length > 0
        },
        set(val) {
          this.search.repayWays = val ? this.$store.state.enums[`${this.$enum.REPAY_WAY}.${this.$enum.REPAY_WAY}`].map(_ => _.value) : [];
        }
      },
      loanStatusCheckAll: {
        get() {
          return this.search.loanStatuss.length > 0
        },
        set(val) {
          this.search.loanStatuss = val ? this.loanStatusOptions.map(_ => _.value) : [];
        }
      },

      amountDate: {
        get() {
          if (this.dateSearch.beginTime || this.dateSearch.endTime) {
            const dateRange = [];
            dateRange[0] = this.dateSearch.beginTime;
            dateRange[1] = this.dateSearch.endTime;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.dateSearch.beginTime = range[0];
            this.dateSearch.endTime = range[1];
          } else {
            this.dateSearch.beginTime = '';
            this.dateSearch.endTime = '';
          }
        }
      },
      countDate: {
        get() {
          if (this.countSearch.beginTime || this.countSearch.endTime) {
            const dateRange = [];
            dateRange[0] = this.countSearch.beginTime;
            dateRange[1] = this.countSearch.endTime;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.countSearch.beginTime = range[0];
            this.countSearch.endTime = range[1];
          } else {
            this.countSearch.beginTime = '';
            this.countSearch.endTime = '';
          }
        }
      }
    },

    created() {
      this.getAssetOrgList();
      this.getData();
    },

    methods: {
      handleSearch() {
        this.getData();
      },

      getData() {
        const search = {
          ...this.search,
          ...this.dateSearch
        };
        if (!search.loanStatuss.length) {
          search.loanStatuss = this.loanStatusOptions.map(_ => _.value)
        }
        this.amountBind.loading = true;
        this.countBind.loading = true;
        getAssetStat(search).then(({ data }) => {
          this.amountBind.loading = false;
          this.countBind.loading = false;
          if (data instanceof Array) {
            this.amountBind.series.data = data.map(_ => ({
              name: this.$filter(_.kind, this.$enum.LOAN_PROP, this.$enum.LOAN_PROP),
              value: _.totalAmount
            }));

            this.countBind.series.data = data.map(_ => ({
              name: this.$filter(_.kind, this.$enum.LOAN_PROP, this.$enum.LOAN_PROP),
              value: _.loanNumber
            }))
          }
        }).catch(() => {
          this.amountBind.loading = false;
          this.countBind.loading = false;
        })
      },
      getAssetOrgList() {
        getOrgListFromCenter(this.$enum.BUSINESS_ASSET).then(({ data }) => {
          if (data.code === 200) {
            this.assetChannelOptions = data.body
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 0;
  }

  .el-tag {
    & + .el-tag {
      margin-left: 10px;
    }
  }

  .el-checkbox-group {
    display: inline;
  }

  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }

  .pie {
    position: relative;
    margin: 40px auto 0;
    width: 1000px;

    .date {
      width: 330px;
    }

    .chart {
      position: relative;
      display: inline-block;
      width: 460px;

      .null {
        position: absolute;
        text-align: center;
        font-size: 18px;
        line-height: 240px;
        top: 50%;
        left: 50%;
        margin-top: -120px;
        margin-left: -120px;
        width: 240px;
        height: 240px;
        border-radius: 50%;
        background: #c7c7c7;
      }
    }
  }
</style>
