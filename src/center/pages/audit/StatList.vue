<template>
  <div class="stat-list">
    <el-form label-width="90px">
      <!--<el-row v-if="searchTagList && searchTagList.length > 0">-->
        <!--<el-form-item label="筛选条件：">-->
          <!--<el-tag v-for="tag in searchTagList" :key="tag.value"-->
                  <!--disable-transitions-->
                  <!--closable-->
                  <!--@close="handleTagClose(tag)">{{ tag.text }}-->
          <!--</el-tag>-->
        <!--</el-form-item>-->
      <!--</el-row>-->

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
        <div class="chart">
          <div v-if="!pieData.rows || !pieData.rows.length" class="null">无数据信息</div>
          <ve-pie :data="pieData" v-bind="pieBind"></ve-pie>
        </div>
        <div class="date">
          <el-form-item label="申请日期">
            <ats-date-picker-query v-model="pieDate"
                                   style="width: 230px !important;"
                                   align="center"
                                   @change="handlePieDateChange"></ats-date-picker-query>
          </el-form-item>
        </div>
      </el-card>

      <el-card class="line">
        <div class="chart">
          <div v-if="!lineData.rows || !lineData.rows.length" class="null">无数据信息</div>
          <ve-line :data="lineData" v-bind="lineBind"></ve-line>
        </div>
        <div class="date">
          <el-form-item label="申请日期">
            <el-date-picker v-model="lineDate"
                            type="month"
                            :picker-options="linePickerOptions"
                            :clearable="false"
                            @change="handleLineDateChange"></el-date-picker>
          </el-form-item>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
  import 'v-charts/lib/style.min.css';
  import 'echarts/lib/component/title';
  import VePie from 'v-charts/lib/pie.common'
  import VeLine from 'v-charts/lib/line.common'
  import { getRiskPie, getRiskLine } from '../../api/audit';
  import { getOrgListFromCenter } from '../../../api/enum'

  const SEARCH_PROP_MAP = {
    assetOrgIds: '资产渠道',
    loanPartyKinds: '主体性质',
    loanStatuss: '资产状态'
  };
  let timer = null;

  export default {
    components: {
      VePie,
      VeLine
    },
    data() {
      return {
        searchTagList: [],
        search: {
          assetOrgIds: [],
          loanPartyKinds: [],
          loanStatuss: []
        },
        pieSearch: {
          beginTime: this.$dateStringify(this.$lastNMonth(new Date(), 1)),
          endTime: this.$dateStringify(new Date())
        },
        lineSearch: {
          beginTime: this.$firstDayOfMonth(new Date()),
          endTime: this.$lastDayOfMonth(new Date())
        },
        linePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },
        assetChannelOptions: [],
        loanStatusOptions: [
          { text: '待收纳', value: this.$enum.LOAN_STATUS_PENDING_STORAGE },
          { text: '已收纳', value: this.$enum.LOAN_STATUS_NO_SET_REPAYMENT },
          { text: '待放款', value: this.$enum.LOAN_STATUS_WAIT_LEND },
          { text: '已放款', value: this.$enum.LOAN_STATUS_LOANED },
          { text: '已结清', value: this.$enum.LOAN_STATUS_CLEARED },
          { text: '提前结清申请中', value: this.$enum.LOAN_STATUS_APPLY_ADVANCE }
        ],
        pieData: {
          columns: ['riskLevelText', 'num'],
          rows: []
        },
        pieBind: {
          loading: false,
          height: '400px',
          settings: { offsetY: 220, radius: 150 },
          title: { text: '资产风险等级占比图', left: '240px', textStyle: { fontSize: 22 } },
          legend: { left: 'right', top: 'middle', orient: 'vertical' }
        },
        lineData: {
          columns: [],
          rows: []
        },
        lineBind: {
          loading: false,
          height: '500px',
          settings: { labelMap: {} },
          title: { text: '资产风险等级每日分布图', left: '240px', textStyle: { fontSize: 22 } },
          legend: { left: 'right', top: 'middle', orient: 'vertical' },
          extend: { 'xAxis.0.axisLabel.rotate': 60 },
          yAxis: { minInterval: 1 },
          grid: { show: true, left: 30, right: 90, borderColor: 'transparent' }
        }
      }
    },
    computed: {
      // assetOrgIds: {
      //   get() {
      //     return this.search.assetOrgIds ? this.search.assetOrgIds.split(',') : []
      //   },
      //   set(val) {
      //     this.search.assetOrgIds = val.join(',')
      //   }
      // },
      // loanPartyKinds: {
      //   get() {
      //     return this.search.loanPartyKinds ? this.search.loanPartyKinds.split(',') : []
      //   },
      //   set(val) {
      //     this.search.loanPartyKinds = val.join(',')
      //   }
      // },
      // loanStatuss: {
      //   get() {
      //     return this.search.loanStatuss ? this.search.loanStatuss.split(',') : []
      //   },
      //   set(val) {
      //     this.search.loanStatuss = val.join(',')
      //   }
      // },
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
      loanStatusCheckAll: {
        get() {
          return this.search.loanStatuss.length > 0
        },
        set(val) {
          this.search.loanStatuss = val ? this.loanStatusOptions.map(_ => _.value) : [];
        }
      },

      pieDate: {
        get() {
          if (this.pieSearch.beginTime || this.pieSearch.endTime) {
            const dateRange = [];
            dateRange[0] = this.pieSearch.beginTime;
            dateRange[1] = this.pieSearch.endTime;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.pieSearch.beginTime = range[0];
            this.pieSearch.endTime = range[1];
          } else {
            this.pieSearch.beginTime = '';
            this.pieSearch.endTime = '';
          }
        }
      },
      lineDate: {
        get() {
          return new Date(this.lineSearch.beginTime)
        },
        set(date) {
          if (date) {
            this.lineSearch.beginTime = this.$firstDayOfMonth(new Date(date));
            this.lineSearch.endTime = this.$lastDayOfMonth(new Date(date));
          } else {
            this.lineSearch.beginTime = '';
            this.lineSearch.endTime = '';
          }
        }
      }
    },
    // watch: {
    //   search: {
    //     deep: true,
    //     handler() {
    //       this.getData();
    //     }
    //   }
    // },

    created() {
      this.getAssetOrgList();
      this.getData();
    },

    methods: {
      handleSearch() {
        this.getData();
      },
      handleTagClose(tag) {
        this.search[tag.value] = '';
        this.searchTagList.splice(this.searchTagList.indexOf(tag), 1);
        this.getData();
      },
      handlePieDateChange() {
        this.getPieData();
      },
      handleLineDateChange() {
        this.getLineData();
      },

      getData() {
        this.getPieData();
        this.getLineData();
        // clearTimeout(timer);
        // timer = setTimeout(() => {
        //   this.searchTagList = [];
        //   for (const key in this.search) {
        //     if (this.search.hasOwnProperty(key) && this.search[key]) {
        //       this.searchTagList.push({
        //         text: SEARCH_PROP_MAP[key],
        //         value: key
        //       })
        //     }
        //   }
        //   console.log('search: ' + new Date());
        // }, 800);
      },
      getPieData() {
        const search = {
          ...this.search,
          ...this.pieSearch
        };
        if (!search.loanStatuss.length) {
          search.loanStatuss = this.loanStatusOptions.map(_ => _.value)
        }
        this.pieBind.loading = true;
        getRiskPie(search).then(({ data }) => {
          this.pieBind.loading = false;
          if (data instanceof Array) {
            this.pieData.rows = data.map(_ => ({
              riskLevelText: this.$filter(_.riskLevel, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP) || '无等级',
              riskLevel: _.riskLevel,
              num: _.num
            }))
          }
        }).catch(() => {
          this.pieBind.loading = false;
        })
      },
      getLineData() {
        const search = {
          ...this.search,
          ...this.lineSearch
        };
        if (!search.loanStatuss.length) {
          search.loanStatuss = this.loanStatusOptions.map(_ => _.value)
        }
        this.lineBind.loading = true;
        getRiskLine(search).then(({ data }) => {
          this.lineBind.loading = false;
          if (data instanceof Array) {
            this.lineData.columns = ['date'];
            this.lineBind.settings.labelMap = {};
            const dayList = [];
            data.forEach(level => {
              const riskLevelText = this.$filter(level.riskLevel, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP) || '无等级';
              this.lineData.columns.push(level.riskLevel);
              this.lineBind.settings.labelMap[level.riskLevel] = riskLevelText;
              level.numList && level.numList.forEach((day, j) => {
                if (!dayList[j]) {
                  dayList.push({ date: day.dateStr });
                }
                dayList[j][level.riskLevel] = day.num;
              });
            });
            this.lineData.rows = dayList;
          }
        }).catch(() => {
          this.lineBind.loading = false;
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

  .pie, .line {
    position: relative;
    margin: 40px auto 0;
    width: 1000px;

    .date {
      position: absolute;
      margin: 0 auto;
    }

    .chart {
      position: relative;

      .null {
        position: absolute;
        text-align: center;
        font-size: 18px;
      }
    }
  }

  .pie {
    .date {
      right: 30px;
      top: 20px;
      width: 330px;
    }

    .chart {
      width: 720px;

      .null {
        top: 70px;
        left: 50%;
        margin-left: -150px;
        padding-top: 130px;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: #c7c7c7;
      }
    }
  }

  .line {
    .date {
      right: 30px;
      top: 20px;
      width: 250px;
    }
    .chart {
      .null {
        top: 200px;
        width: 720px;
      }
    }
  }
</style>
