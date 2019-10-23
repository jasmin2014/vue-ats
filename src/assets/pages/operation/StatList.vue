<template>
  <div class="stat-list">
    <el-form label-width="90px">
      <el-form-item label="申请时间：">
        <ats-date-picker-query v-model="applyDate"
                               style="width: 230px !important;"
                               align="center"></ats-date-picker-query>
      </el-form-item>

      <el-form-item label="资金端：">
        <el-checkbox v-model="fundOrgCheckAll" :indeterminate="search.fundOrgIds.length > 0 && search.fundOrgIds.length < fundOrgOptions.length">全选</el-checkbox>
        <el-checkbox-group v-model="search.fundOrgIds">
          <el-checkbox v-for="option in fundOrgOptions"
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
    </el-form>

    <el-card class="chart-wrap">
      <div class="chart">
        <div v-if="!chartBind.series.data || !chartBind.series.data.length" class="null">无数据信息</div>
        <ve-pie v-bind="chartBind"></ve-pie>
      </div>
    </el-card>
  </div>
</template>

<script>
  import 'v-charts/lib/style.min.css';
  import 'echarts/lib/component/title';
  import 'echarts/lib/chart/pie';
  import VePie from 'v-charts/lib/pie.common'
  import { getFundListFromAsset } from '../../../api/enum'
  import { getAssetStat } from '../../api/operation'

  export default {
    components: {
      VePie
    },
    data() {
      return {
        search: {
          beginTime: this.$dateStringify(this.$lastNMonth(new Date(), 1)),
          endTime: this.$dateStringify(new Date()),
          fundOrgIds: [],
          loanPartyKinds: [],
          repayWays: [],
          loanStatuss: []
        },

        chartBind: {
          loading: false,
          height: '400px',
          title: { text: '资产各期限份额占比图', left: '220px', textStyle: { fontSize: 22 } },
          legend: { left: 'right', top: 'middle', orient: 'vertical' },
          'series.0.label': {
            formatter: (params) => {
              console.log(params);
            }
          },
          series: {
            type: 'pie',
            data: [],
            center: ['45%', 220],
            tooltip: {
              formatter: (params) => {
                return `${params.marker} ${params.name}: ${this.$floatToThousands(this.$floatDivide(params.value, 10000).toFixed(2))}万 (${params.percent}%)`;
              }
            }
          }
        },

        fundOrgOptions: [],
        loanStatusOptions: [
          { text: '已收纳', value: this.$enum.LOAN_STATUS_NO_SET_REPAYMENT },
          { text: '待放款', value: this.$enum.LOAN_STATUS_WAIT_LEND },
          { text: '已放款', value: this.$enum.LOAN_STATUS_LOANED },
          { text: '已结清', value: this.$enum.LOAN_STATUS_CLEARED },
          { text: '提前结清申请中', value: this.$enum.LOAN_STATUS_APPLY_ADVANCE }
        ]
      }
    },

    computed: {
      applyDate: {
        get() {
          if (this.search.beginTime || this.search.endTime) {
            const dateRange = [];
            dateRange[0] = this.search.beginTime;
            dateRange[1] = this.search.endTime;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.search.beginTime = range[0];
            this.search.endTime = range[1];
          } else {
            this.search.beginTime = '';
            this.search.endTime = '';
          }
        }
      },
      fundOrgCheckAll: {
        get() {
          return this.search.fundOrgIds.length > 0;
        },
        set(val) {
          this.search.fundOrgIds = val ? this.fundOrgOptions.map(_ => _.orgId) : [];
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
        const search = {...this.search};
        if (!search.loanStatuss.length) {
          search.loanStatuss = this.loanStatusOptions.map(_ => _.value)
        }
        this.chartBind.loading = true;
        getAssetStat(search).then(({ data }) => {
          this.chartBind.loading = false;
          if (data.code === 200) {
            this.chartBind.series.data = data.body.map(_ => ({
              name: this.$filter(_.monthsSection.toString(), this.$enum.REPAY_TIME_RANGE, this.$enum.REPAY_TIME_RANGE),
              value: _.loanAmounts
            }))
          } else {
            this.chartBind.series.data = [];
          }
        }).catch(() => {
          this.chartBind.loading = false;
          this.chartBind.series.data = [];
        })
      },
      getAssetOrgList() {
        const orgId = this.$getLocalStorage('user').orgId;
        getFundListFromAsset(orgId).then(({ data }) => {
          if (data.code === 200) {
            this.fundOrgOptions = data.body
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

  .chart-wrap {
    position: relative;
    margin: 40px auto 0;
    width: 1000px;

    .chart {
      position: relative;
      margin: 0 auto;
      width: 700px;
    }

    .null {
      position: absolute;
      text-align: center;
      top: 70px;
      left: 50%;
      margin-left: -150px;
      padding-top: 130px;
      width: 300px;
      height: 300px;
      font-size: 18px;
      border-radius: 50%;
      background: #c7c7c7;
    }
  }
</style>
