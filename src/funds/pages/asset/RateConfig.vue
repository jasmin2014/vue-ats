<template>
  <div class="fee-config">
    <el-table :data="list"
              :span-method="spanMethod"
              border>
      <el-table-column v-for="col in table" :key="col.prop"
                       :label="col.label"
                       :prop="col.prop"
                       :formatter="col.formatter"
                       align="center"></el-table-column>
      <el-table-column label="关系机构" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.serviceFeeRates">{{ item.assetOrgName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="费率" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.serviceFeeRates">{{ `${$floatMultiply(item.feeRate, 100)}%` }}</div>
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
               :title="`服务费率设置 - ${currentRow.projectTypeName || ''} - ${currentRow.loanpropName || ''}`"
               width="700px"
               @close="handleDialogClose">
      <el-form ref="form"
               :model="currentRow"
               :rules="rules"
               label-width="120px">
        <el-row type="flex" justify="space-between">
          <el-form-item label="默认费率" prop="feeRate">
            <ats-input v-model="feeRate" type="number" unit="%" :disabled="!isEditDefault"></ats-input>
          </el-form-item>
          <div class="btn-group">
            <el-button v-if="!isEditDefault"
                       type="info" size="small" icon="fa fa-edit" @click="handleDefaultRateEdit"></el-button>
            <div v-else>
              <el-button type="primary" size="small"
                         @click="handleDefaultRateConfirm()">确定</el-button>
              <el-button size="small"
                         @click="handleDefaultRateCancel()">取消</el-button>
            </div>
          </div>
        </el-row>
      </el-form>

      <el-form ref="tableForm"
               :model="currentRateRow"
               :rules="rules"
               label-width="0">
        <el-row type="flex" justify="space-between">
          <h5 style="margin: 0;">机构服务费率</h5>
          <div>
            <el-button type="primary"
                       size="mini"
                       icon="fa fa-plus"
                       @click="handleAddRate"></el-button>
          </div>
        </el-row>

        <el-table style="margin-top: 10px;"
                  :data="currentRow.serviceFeeRates"
                  border>
          <el-table-column label="关系机构" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit && !scope.row.hasOwnProperty('id')"
                            prop="assetOrg">
                <ats-select v-model="currentRateRow.assetOrg"
                            :org="$enum.BUSINESS_REL_ASSET"
                            :value-text.sync="currentRateRow.assetOrgName"></ats-select>
              </el-form-item>
              <span v-else>{{ scope.row.assetOrgName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="年化服务费率" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit"
                            prop="feeRate">
                <ats-input v-model="currentFeeRate"
                           type="number" unit="%"></ats-input>
              </el-form-item>
              <span v-else>{{ `${$floatMultiply(scope.row.feeRate, 100)}%` }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.$edit">
                <el-button type="primary" size="mini"
                           @click="handleRateRowConfirm(scope.row)">确定</el-button>
                <el-button size="mini"
                           @click="handleRateRowCancel(scope.row)">取消</el-button>
              </div>
              <div v-else>
                <el-button type="info" size="mini" icon="fa fa-edit"
                           @click="handleRateRowEdit(scope.row)"></el-button>
                <el-button type="danger" size="mini" icon="fa fa-trash"
                           @click="handleRateRowDelete(scope.row)"></el-button>
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
    getRateConfig,
    editRateConfig,
    createRateConfig,
    deleteRateConfig
  } from '../../api/assetMgt';

  let currentDefaultRate = null;

  export default {
    data() {
      return {
        currentRow: {},
        currentRateRow: {},
        isEditDefault: false,
        showConfigDialog: false,
        list: [],
        table: [
          {
            label: '业务类型',
            prop: 'projectTypeName'
          },
          {
            label: '资产属性',
            prop: 'loanpropName'
          },
          {
            label: '默认费率',
            prop: 'feeRate',
            formatter: (row, col, val) => typeof val === 'number' ? `${this.$floatMultiply(val, 100)}%` : ''
          }
        ],
        rules: {
          assetOrg: [
            { required: true, message: '请选择机构', trigger: 'change' }
          ],
          feeRate: [
            { required: true, message: '请输入服务费率', trigger: 'blur', type: 'number' },
            { min: 0, max: 1, message: '利率范围为0-100%', trigger: 'blur', type: 'number' },
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
      feeRate: {
        get() {
          if (typeof this.currentRow.feeRate === 'number') {
            return this.$floatMultiply(this.currentRow.feeRate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentRow.feeRate = null;
          } else {
            this.currentRow.feeRate = this.$floatDivide(val, 100);
          }
        }
      },
      currentFeeRate: {
        get() {
          if (typeof this.currentRateRow.feeRate === 'number') {
            return this.$floatMultiply(this.currentRateRow.feeRate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.$set(this.currentRateRow, 'feeRate', null);
          } else {
            this.$set(this.currentRateRow, 'feeRate', this.$floatDivide(val, 100));
          }
        }
      },
      isEditing() {
        if (this.currentRow.serviceFeeRates) {
          return this.currentRow.serviceFeeRates.some(_ => _.$edit);
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
        row.serviceFeeRates = row.serviceFeeRates || [];
        this.currentRow = this.$deepcopy(row);
        this.showConfigDialog = true;
      },

      handleDefaultRateEdit() {
        this.isEditDefault = true;
        currentDefaultRate = this.currentRow.feeRate;
      },
      handleDefaultRateConfirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            editRateConfig(this.currentRow.id, this.currentRow.feeRate).then(({ data }) => {
              if (data.code === 200) {
                this.$message.success('修改成功');
                this.updateCurrentRow();
                this.isEditDefault = false;
              } else {
                this.$message.error(data.message)
              }
            })
          }
        });
      },
      handleDefaultRateCancel() {
        this.$refs.form.clearValidate();
        this.isEditDefault = false;
        this.currentRow.feeRate = currentDefaultRate;
      },

      handleAddRate() {
        if (this.isEditing) {
          this.$alert('请先保存', '提示');
          return;
        }
        this.currentRow.serviceFeeRates.push({
          $edit: true
        })
      },
      handleRateRowConfirm(row) {
        this.$refs.tableForm.validate((valid) => {
          if (valid) {
            if (row.hasOwnProperty('id')) {
              editRateConfig(row.id, this.currentRateRow.feeRate).then(({ data }) => {
                if (data.code === 200) {
                  this.$message.success('修改成功');
                  this.updateCurrentRow();
                } else {
                  this.$message.error(data.message)
                }
              }).catch(({ data }) => {
                if (data && data.code === 4001101) {
                  this.getData();
                  this.showConfigDialog = false;
                }
              })
            } else {
              const obj = Object.assign(this.$deepcopy(this.currentRateRow), {
                loanProp: this.currentRow.loanprop,
                projectType: this.currentRow.projectType
              });
              createRateConfig(obj).then(({ data }) => {
                if (data.code === 201) {
                  this.$message.success('创建成功');
                  this.updateCurrentRow();
                } else {
                  this.$message.error(data.message)
                }
              })
            }
          }
        })
      },
      handleRateRowCancel(row) {
        this.currentRateRow = {};
        if (row.hasOwnProperty('id')) {
          this.$set(row, '$edit', false)
        } else {
          this.currentRow.serviceFeeRates.splice(this.currentRow.serviceFeeRates.length - 1)
        }
      },
      handleRateRowDelete(row) {
        deleteRateConfig(row.id).then(({ data }) => {
          if (data.code === 204) {
            this.$message.success('删除成功');
            this.updateCurrentRow();
          } else {
            this.$message.error(data.message)
          }
        })
      },
      handleRateRowEdit(row) {
        if (this.isEditing) {
          this.$alert('请先保存', '提示');
          return;
        }
        this.currentRateRow = this.$deepcopy(row);
        this.$set(row, '$edit', true)
      },

      updateCurrentRow() {
        this.getData().then(list => {
          const currentRow = list.find(_ => _.loanprop === this.currentRow.loanprop && _.projectType === this.currentRow.projectType);
          if (currentRow) {
            this.currentRow = this.$deepcopy(currentRow);
            this.currentRateRow = {};
          }
        });
      },

      handleDialogClose() {
        this.currentRow = {};
        this.currentRateRow = {};
        this.isEditDefault = false;
      },

      getData() {
        return new Promise((resolve, reject) => {
          getRateConfig().then(({ data }) => {
            if (data.code === 200) {
              this.list = [];
              data.body.forEach((item) => {
                this.list.push({
                  ...item.loanProps[0],
                  projectType: item.projectType,
                  projectTypeName: item.projectTypeName
                });
                this.list.push({
                  ...item.loanProps[1],
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

<style lang="scss" scoped>

</style>
