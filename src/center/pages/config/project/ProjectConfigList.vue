<template>
  <div class="config-list">
    <el-form :model="search" class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.orgId"
                        :org="$enum.BUSINESS_ASSET"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="业务类型">
            <ats-select v-model="search.projectType"
                        :kind="$enum.PROJECT_TYPE"
                        :group="$enum.PROJECT_TYPE"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="审核状态">
            <ats-select v-model="search.auditStatus"
                        :kind="$enum.PROJECT_CONFIG_AUDIT_STATUS"
                        :group="$enum.PROJECT_CONFIG_AUDIT_STATUS"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" border>
      <el-table-column v-for="(col, index) in table"
                       :prop="col.prop"
                       :label="col.label"
                       :formatter="col.formatter"
                       :width="col.width"
                       :key="index"
                       align="center"></el-table-column>
      <el-table-column label="产品说明附件" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.fileUri"
             :href="scope.row.fileUri" target="_blank">查看附件</a>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="相关操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-tooltip v-action="'ConfigProjectDetail'"
                      content="查看">
            <el-button size="small" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-if="canEdit(scope.row.auditStatus)"
                      v-action="'ConfigProjectEdit'"
                      content="编辑风控配置">
            <el-button size="small" icon="fa fa-edit" type="info"
                       @click="handleEdit(scope.row)"> 配置</el-button>
          </el-tooltip>
          <el-tooltip v-if="canAudit(scope.row.auditStatus)"
                      v-action="'ConfigProjectAudit'"
                      content="审核">
            <el-button size="small" icon="fa fa-check" type="success"
                       @click="handleAudit(scope.row)"> 审核</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="pageTotal" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getProjectConfigList} from '../../../api/asset';
  import {getPicUrls} from '../../../../api/common';
  import PROJECT_TYPE_PROP_MAP from '../../../../modules/project-config/project_type_prop_map'

  export default {
    data() {
      return {
        search: {
          pageNumber: 1,
          pageSize: 20
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '资产渠道',
            prop: 'orgName'
          },
          {
            label: '项目编号',
            prop: 'id'
          },
          {
            label: '项目名称',
            prop: 'projectName'
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, val) => this.$filter(val, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
          },
          {
            label: '资产信息',
            prop: 'projectType',
            formatter: (row, col, val) => this.propListMap(val)
          },
          {
            label: '风控开关',
            prop: 'riskSwitch',
            formatter: (row, col, val) => this.$filterBoolean(val, '开启', '关闭')
          },
          {
            label: '风控产品策略',
            prop: 'riskStrategyName',
            formatter: (row, col, val) => (val || '--')
          },
          {
            label: '审核状态',
            prop: 'auditStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.PROJECT_CONFIG_AUDIT_STATUS, this.$enum.PROJECT_CONFIG_AUDIT_STATUS)
          }
        ]
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleDetail(row) {
        this.$router.push({
          name: 'ConfigProjectDetail',
          params: {
            id: row.id
          }
        })
      },
      handleEdit(row) {
        this.$router.push({
          name: 'ConfigProjectEdit',
          params: {
            id: row.id
          }
        })
      },
      handleAudit(row) {
        this.$router.push({
          name: 'ConfigProjectAudit',
          params: {
            id: row.id
          }
        })
      },

      canEdit(status) {
        return status === this.$enum.PROJECT_CONFIG_AUDIT_STATUS_PASS
      },
      canAudit(status) {
        return status === this.$enum.PROJECT_CONFIG_AUDIT_STATUS_WAIT_AUDIT
      },

      propListMap(projectType) {
        if (projectType && PROJECT_TYPE_PROP_MAP[projectType].length > 0) {
          return PROJECT_TYPE_PROP_MAP[projectType].map(_ => _.name).join('、')
        } else {
          return '暂无'
        }
      },

      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getProjectConfigList(search).then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord;
            this.search.pageNumber = data.body.pageNumber;

            const keys = this.list.map(_ => _.projectUri);
            this.getFiles(keys)
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.list = [];
          this.pageTotal = 0;
        })
      },
      getFiles(keys) {
        getPicUrls(keys).then(({ data }) => {
          if (data.code === 200) {
            this.list.forEach((item, i) => {
              if (item.projectUri) {
                if (item.fileName) {
                  this.$set(item, 'fileUri', data.body[i] + '&attname=' + encodeURIComponent(item.fileName));
                } else {
                  this.$set(item, 'fileUri', data.body[i]);
                }
              }
            })
          }
        })
      }
    }
  }
</script>
