<template>
  <div>
    <el-form ref="form"
             :model="search"
             :rules="rules"
             class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="协议编号" prop="contract">
            <el-input v-model="search.contract"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" title="查找"
                       @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" border>
      <el-table-column v-for="(col, index) in table" :key="index + col.prop"
                       :prop="col.prop"
                       :label="col.label"
                       :formatter="col.formatter"
                       :width="col.width"
                       align="center"></el-table-column>
      <el-table-column label="状态" align="center" fixed="right" width="100">
        <template slot-scope="scope">
          <el-tag :type="$enum.LOAN_STATUS_COLOR_MAP[scope.row.status]">
            {{ $filter(scope.row.status, $enum.LOAN_STATUS, $enum.LOAN_STATUS_GROUP) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" fixed="right" align="center">
        <template slot-scope="scope">
          {{ scope.row.remarks ? scope.row.remarks.split(':')[0] : '' }}<br>
          <el-tooltip content="查看备注">
            <el-button size="mini" icon="fa fa-ellipsis-h"
                       @click="handleRemarks(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="260" align="center">
        <template slot-scope="scope">
          <el-tooltip v-action="'AssetStoredDetail'"
                      content="查看">
            <el-button size="mini" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'AssetStoredFeedback'"
                      v-if="canFeedback(scope.row)" content="反馈问题">
            <el-button size="mini"
                       type="success"
                       @click="handleFeedback(scope.row)">反馈</el-button>
          </el-tooltip>
          <el-tooltip v-action="'AssetStoredQuery'"
                      v-if="canQuery(scope.row)"
                      content="查询开户">
            <el-button size="mini"
                       icon="fa fa-search"
                       type="info"
                       :loading="scope.row.$loading"
                       @click="handleQuery(scope.row, scope.$index)">&nbsp;查询开户</el-button>
          </el-tooltip>
          <el-tooltip v-action="'AssetStoredPush'"
                      v-if="canPush(scope.row)"
                      content="处理图片并推送">
            <el-button size="mini"
                       icon="fa fa-upload"
                       type="success"
                       @click="handlePush(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    getStoredList,
    getLoanRemark,
    feedback,
    queryOpenStatus
  } from '../../../api/assetMgt';

  let loadingList = [];

  export default {
    data() {
      return {
        search: {
          contract: null
        },
        list: [],
        table: [
          {
            label: '借款编号',
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
            label: '资产风险等级',
            prop: 'assetRiskLevel',
            formatter: (row, col, val) => row.riskSwitch ? this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP) : '-'
          },
          {
            label: '信用评分',
            prop: 'creditScore',
            formatter: (row, col, val) => row.riskSwitch ? val : '-'
          },
          {
            label: '机构资产风险等级',
            prop: 'channelRiskLevel',
            formatter: (row, col, val) => !row.riskSwitch ? this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP) : '-'
          },
          {
            label: '机构信用评分',
            prop: 'channelCreditScore',
            formatter: (row, col, val) => !row.riskSwitch ? val : '-'
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, value) => this.$filter(value, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '借款金额(元)',
            prop: 'loanAmount'
          },
          {
            label: '借款利率(年化利率)',
            prop: 'repayYearRate',
            formatter: (row, col, val) => this.$floatToPercentage(val)
          },
          {
            label: '期数',
            prop: 'repayTerms'
          },
          {
            label: '期数单位',
            prop: 'repayTimeType',
            formatter: (row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`
          },
          {
            label: '还款方式',
            prop: 'repayWay',
            formatter: (row, col, val) => this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY)
          },
          {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          }
        ],
        rules: {
          contract: [
            { required: true, message: '请输入协议编号', trigger: 'change' }
          ]
        }
      }
    },

    methods: {
      canQuery(row) {
        return [this.$enum.LOAN_STATUS_NO_SET_REPAYMENT].includes(row.status) && this.$store.state.user.isQueryAccount === 1 && row.accountQueryStatus !== 1;
      },
      canPush(row) {
        return [this.$enum.LOAN_STATUS_FEEDBACK, this.$enum.LOAN_STATUS_NO_SET_REPAYMENT].includes(row.status) && (this.$store.state.user.isQueryAccount === 0 || row.accountQueryStatus === 1);
      },
      canFeedback(row) {
        return [this.$enum.LOAN_STATUS_NO_SET_REPAYMENT].includes(row.status);
      },

      handleSearch() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.getData();
          }
        })
      },

      handleDetail(row) {
        this.$router.push({
          name: 'AssetStoredDetail',
          params: { id: row.id }
        });
      },
      handlePush(row) {
        this.$router.push({
          name: 'AssetStoredPush',
          params: { id: row.id }
        });
      },
      handleFeedback(row) {
        this.$prompt('具体描述', '反馈问题').then(({ value }) => {
          feedback(row.id, value).then(({ data }) => {
            if (data.code === 200) {
              setTimeout(() => {
                this.$message.success('反馈成功');
                this.getData(this.search.pageNumber);
              }, 1000);
            } else {
              this.getData(this.search.pageNumber);
              this.$message.error(data.message)
            }
          }).catch(() => {
            this.getData(this.search.pageNumber);
          })
        })
      },
      handleQuery(row) {
        this.$set(row, '$loading', true);
        loadingList.push(row.id);
        queryOpenStatus(row.id).then(({ data }) => {
          loadingList = loadingList.filter(_ => _ !== row.id);
          if (data.code === 200) {
            setTimeout(() => {
              this.$message.success('已开户，请直接推送');
              this.getData(this.search.pageNumber);
            }, 1000);
          } else {
            this.getData(this.search.pageNumber);
            this.$message.error(data.message);
          }
        }).catch(() => {
          loadingList = loadingList.filter(_ => _ !== row.id);
          this.getData(this.search.pageNumber);
        })
      },
      handleRemarks(row) {
        this.getRemarkList(row.id);
      },

      getData() {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        getStoredList(search).then(({ data }) => {
          if (data.code === 200 && data.body) {
            data.body.forEach(_ => {
              if (loadingList.includes(_.id)) {
                _.$loading = true;
              }
            });
            this.list = data.body || [];
          } else {
            this.list = [];
          }
        }, () => {
          this.list = [];
        })
      },
      getRemarkList(id) {
        getLoanRemark(id).then(({ data }) => {
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
        }, (response) => {
        })
      }
    }
  }
</script>
