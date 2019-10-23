<template>
  <div class="audit-setting">
    <el-table :data="list"
              :span-method="spanMethod"
              border>
      <el-table-column v-for="col in table" :key="col.prop"
                       :label="col.label"
                       :prop="col.prop"
                       :formatter="col.formatter"
                       align="center"></el-table-column>
      <el-table-column label="自动审核机构" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.auditOrg">{{ item.assetOrgName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="info"
                     size="small"
                     icon="fa fa-cog"
                     @click="handleConfig(scope.row, scope.$index)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="showConfigDialog"
               :title="`修改自动审核机构 - ${currentRow.projectTypeName || ''} - ${currentRow.loanPropName || ''}`"
               width="700px"
               @close="handleDialogClose">
      <el-form ref="form"
               :model="currentOrgRow"
               label-width="120px"
               style="width: 90%;">

        <el-row type="flex" justify="space-between">
          <h5 style="margin: 0;">自动审核机构</h5>
          <div>
            <el-button type="primary"
                       size="mini"
                       icon="fa fa-plus"
                       @click="handleAddOrg"></el-button>
          </div>
        </el-row>
        <el-table style="margin-top: 10px;"
                  :data="currentRow.auditOrg"
                  border>
          <el-table-column label="关系机构" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit"
                            prop="assetOrg"
                            :rules="rules.assetOrg"
                            label-width="0">
                <ats-select v-model="currentOrgRow.assetOrg"
                            :value-text.sync="currentOrgRow.assetOrgName"
                            :org="$enum.BUSINESS_ASSET"></ats-select>
              </el-form-item>
              <span v-else>{{ scope.row.assetOrgName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.$edit">
                <el-button type="primary" size="mini"
                           @click="handleOrgRowConfirm(scope.row)">确定</el-button>
                <el-button size="mini"
                           @click="handleOrgRowCancel(scope.row)">取消</el-button>
              </div>
              <div v-else>
                <el-button type="danger" size="mini" icon="fa fa-trash"
                           @click="handleOrgRowDelete(scope.row)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getAuditSetting,
    createAuditOrg,
    deleteAuditOrg
  } from '../../api/audit';

  export default {
    data() {
      return {
        currentRow: {},
        currentOrgRow: {},
        showConfigDialog: false,
        list: [],
        table: [
          {
            label: '业务类型',
            prop: 'projectTypeName'
          },
          {
            label: '资产属性',
            prop: 'loanPropName'
          }
        ],
        rules: {
          assetOrg: [
            { required: true, message: '请选择机构', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      isEditing() {
        if (this.currentRow.auditOrg) {
          return this.currentRow.auditOrg.some(_ => _.$edit);
        } else {
          return false;
        }
      }
    },

    mounted() {
      this.getData();
    },

    methods: {
      handleConfig(row, index) {
        this.currentRow = this.$deepcopy(row);
        this.showConfigDialog = true;
      },

      handleDialogClose() {
        this.currentRow = {};
        this.currentOrgRow = {};
      },
      handleAddOrg() {
        if (this.isEditing) return;
        this.currentRow.auditOrg.push({
          $edit: true
        })
      },
      handleOrgRowConfirm(row) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const obj = Object.assign(this.$deepcopy(this.currentOrgRow), {
              loanProp: this.currentRow.loanProp,
              projectType: this.currentRow.projectType
            });
            createAuditOrg(obj).then(({ data }) => {
              if (data.code === 201) {
                this.$message.success('创建成功');
                this.updateCurrentRow();
              } else {
                this.$message.error(data.message)
              }
            })
          }
        });
      },
      handleOrgRowCancel(row) {
        this.currentOrgRow = {};
        this.currentRow.auditOrg.splice(this.currentRow.auditOrg.length - 1)
      },
      handleOrgRowDelete(row) {
        deleteAuditOrg(row.id).then(({ data }) => {
          if (data.code === 204) {
            this.$message.success('删除成功');
            this.updateCurrentRow();
          } else {
            this.$message.error(data.message)
          }
        })
      },

      updateCurrentRow() {
        this.getData().then(list => {
          const currentRow = list.find(_ => _.loanProp === this.currentRow.loanProp && _.projectType === this.currentRow.projectType);
          if (currentRow) {
            this.currentRow = this.$deepcopy(currentRow);
            this.currentOrgRow = {};
          }
        });
      },

      getData() {
        return new Promise((resolve, reject) => {
          getAuditSetting().then(({ data }) => {
            if (data.code === 200) {
              this.list = [];
              data.body.forEach((item) => {
                this.list.push({
                  ...item.auditSet[0],
                  projectType: item.projectType,
                  projectTypeName: item.projectTypeName
                });
                this.list.push({
                  ...item.auditSet[1],
                  projectType: item.projectType,
                  projectTypeName: item.projectTypeName
                });
              });
              resolve(this.list)
            } else {
              this.$message.error(data.message);
              reject()
            }
          }).catch(() => {
            this.list = [];
            reject();
          })
        })
      },

      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    }
  }
</script>
