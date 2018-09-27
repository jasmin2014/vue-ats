<!-- 个人 数据报告-->
<template>
  <div class="report">
    <el-form label-width="150px">
      <el-row>
        <h4>
          <span>客户信息校验</span>
        </h4>
        <el-row class="report-inr">
          <el-table :data="detail.baseList" class='table-center table-custom' border tooltip-effect="dark"
                    style="width: 100%;">
            <el-table-column prop="auditDataKind" label="验证内容"
                             :formatter="(row, col, val) => (this.$filter(val, this.$enum.AUDIT_TYPE, this.$enum.AUDIT_TYPE_CLIENT_INFO))"></el-table-column>
            <el-table-column prop="dataReport" label="数据报告">
              <template slot-scope="scope">
                <a v-if="scope.row.dataReport"
                   :href="scope.row.dataReport"
                   class="el-button el-button--default"
                   target="_blank">查看报告</a>
              </template>
            </el-table-column>
            <el-table-column prop="channelResult" label="渠道提供结果">
              <template slot-scope="scope">
                {{ reportFilter[scope.row.auditDataKind]
                ? $filter(scope.row.channelResult, reportFilter[scope.row.auditDataKind].kind,
                reportFilter[scope.row.auditDataKind].group)
                : scope.row.channelResult }}
              </template>
            </el-table-column>
            <el-table-column prop="sysResult" label="系统评估结果"></el-table-column>
            <el-table-column prop="searchWebsite" label="查询网址">
              <template slot-scope="scope">
                <a :href="'http://'+scope.row.searchWebsite" class="urllink"
                   target="_blank">{{scope.row.searchWebsite}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="operateType" label="验证结果" :formatter="formaterStatus"></el-table-column>
          </el-table>
        </el-row>
      </el-row>
      <el-row>
        <h4><span>正资产</span>
        </h4>
        <el-row class="report-inr">
          <el-table :data="detail.assetData" class='table-center' border tooltip-effect="dark" style="width: 100%;">
            <el-table-column prop="auditDataKind" label="验证内容"
                             :formatter="(row, col, val) => (this.$filter(val, this.$enum.AUDIT_TYPE, row.auditKind))"></el-table-column>
            <el-table-column prop="dataReport" label="数据报告">
              <template slot-scope="scope">
                <a v-if="scope.row.dataReport"
                   :href="scope.row.dataReport"
                   class="el-button el-button--default"
                   target="_blank">查看报告</a>
              </template>
            </el-table-column>
            <el-table-column prop="channelResult" label="渠道提供结果"></el-table-column>
            <el-table-column prop="sysResult" label="系统评估结果"></el-table-column>
            <el-table-column prop="searchWebsite" label="查询网址">
              <template slot-scope="scope">
                <a :href="'http://'+ scope.row.searchWebsite" target="_blank">{{scope.row.searchWebsite}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="valuationValue" label="人工估值"></el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      value: Object,
      customerName: String
    },
    data() {
      return {
        detail: {
          baseList: [],
          assetData: []
        },
        reportFilter: {
          chsi: {
            kind: this.$enum.EDUCATION,
            group: this.$enum.EDUCATION_GROUP
          }
        }
      }
    },
    watch: {
      'value.baseList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'baseList')
      },
      'value.assetData'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'assetData')
      }
    },
    methods: {
      setCurrentValue(val, key) {
        if (this.detail.hasOwnProperty(key)) {
          if (typeof val === 'object' && val instanceof Array) {
            this.detail[key] = val;
          } else if (typeof val === 'object') {
            for (const k in val) {
              if (this.detail[key].hasOwnProperty(k)) {
                this.detail[key][k] = val[k];
              }
            }
          } else {
            this.detail[key] = val;
          }
        }
      },
      formaterStatus(row, col, val) {
        switch (val) {
          case 0:
            return '未验证';
            break;
          case 1:
            return '已验证';
            break;
          default:
            break;
        }
      },
      reportDetail(row) {
        this.$emit('report', row);
      }
    }
  };
</script>

