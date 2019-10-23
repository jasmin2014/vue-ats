<template>
  <div class="config-list">
    <el-form :model="search" class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="项目名称">
            <ats-select v-model="search.id"
                        :options="projectNameOptions"
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
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'ConfigProjectCreate'"
                     type="primary" icon="fa fa-plus" title="添加"
                     @click="handleCreate"></el-button>
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
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-tooltip v-action="'ConfigProjectDetail'"
                      content="查看">
            <el-button size="small" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'ConfigProjectEdit'"
                      v-if="canEdit(scope.row)"
                      content="修改">
            <el-button size="small" icon="fa fa-edit" type="info"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'ConfigProjectDelete'"
                      v-if="canDelete(scope.row)"
                      content="删除">
            <el-button size="small" icon="fa fa-trash" type="danger"
                       @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'ConfigProjectSetting'"
                      v-if="canSetting(scope.row)"
                      content="设置">
            <el-button size="small" icon="fa fa-cog" type="info"
                       @click="handleSetting(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="pageTotal" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>

    <el-dialog :visible.sync="dialog.visible"
               title="相关项目设置"
               width="500px"
               @close="handleDialogClose">
      <el-form ref="form"
               v-if="dialog.form"
               :model="dialog.form"
               :rules="dialog.rules"
               label-width="150px"
               style="width: 80%; margin: 0 auto;">
        <el-form-item label="自动提交功能" prop="autoSubmit">
          <ats-radio v-model="dialog.form.autoSubmit"
                     type="boolean-num"
                     true-text="开启"
                     false-text="关闭"></ats-radio>
        </el-form-item>
      </el-form>

      <el-row slot="footer" type="flex" justify="center">
        <el-button type="primary"
                   @click="handleDialogSave">保存</el-button>
        <el-button @click="handleDialogCancel">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getProjectNameList,
    getProjectConfigList,
    deleteProjectConfig,
    getProjectConfigDetail,
    updateProjectConfigAutoSubmit
  } from '../../../api/asset';
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
        projectNameOptions: [],
        dialog: {
          visible: false,
          form: null,
          rules: {
            autoSubmit: [
              { required: true, message: '请选择自动提交功能', trigger: 'change' }
            ]
          }
        },
        table: [
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
            label: '申请状态',
            prop: 'auditStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.PROJECT_CONFIG_AUDIT_STATUS, this.$enum.PROJECT_CONFIG_AUDIT_STATUS)
          }
        ]
      }
    },
    created() {
      this.getProjectList();
      this.getData(1);
    },
    methods: {
      canEdit(row) {
        return row.auditStatus === this.$enum.PROJECT_CONFIG_AUDIT_STATUS_NOT_PASS
      },
      canDelete(row) {
        return row.auditStatus === this.$enum.PROJECT_CONFIG_AUDIT_STATUS_NOT_PASS
      },
      canSetting(row) {
        return row.auditStatus === this.$enum.PROJECT_CONFIG_AUDIT_STATUS_PASS
      },

      handleSearch() {
        this.getData(1)
      },
      handleCreate() {
        this.$router.push({
          name: 'ConfigProjectCreate'
        })
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
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteProjectConfig(row.id).then(({ data }) => {
            if (data.code === 200) {
              setTimeout(() => {
                this.$message.success('删除成功');
                this.getData(this.search.pageNumber);
              }, 1000)
            } else {
              this.$message.error(data.message);
              this.getData(this.search.pageNumber);
            }
          }).catch(() => {
            this.getData(this.search.pageNumber);
          })
        })
      },
      handleSetting(row) {
        getProjectConfigDetail(row.id).then(({ data }) => {
          if (data.code === 200) {
            this.dialog.form = {
              id: row.id,
              autoSubmit: data.body.autoSubmit
            };
            this.dialog.visible = true;
          } else {
            this.$message.error(data.message);
          }
        })
      },
      handleDialogClose() {
        this.dialog.form = null;
      },
      handleDialogSave() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.saveAutoSubmitSetting(this.$deepcopy(this.dialog.form));
          }
        });
      },
      handleDialogCancel() {
        this.dialog.visible = false;
      },

      propListMap(projectType) {
        if (projectType && PROJECT_TYPE_PROP_MAP[projectType] && PROJECT_TYPE_PROP_MAP[projectType].length > 0) {
          return PROJECT_TYPE_PROP_MAP[projectType].map(_ => _.name).join('、')
        } else {
          return '暂无'
        }
      },

      saveAutoSubmitSetting(obj) {
        updateProjectConfigAutoSubmit(obj).then(({ data }) => {
          if (data.code === 200) {
            this.$message.success('设置成功');
            this.dialog.visible = false;
          } else {
            this.$message.error(data.message)
          }
        })
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
      getProjectList() {
        getProjectNameList().then(({ data }) => {
          if (data.code === 200) {
            this.projectNameOptions = data.body.map(_ => ({
              text: _.projectName,
              value: _.id
            }))
          }
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
