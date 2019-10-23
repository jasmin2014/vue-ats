<template>
  <div class="fee">
    <div class="fee-phase" v-for="phase in phaseList">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="4">
          <h4>
            <span>{{ $filter(phase, $enum.FEE_PHASE, $enum.FEE_PHASE)}}</span>
          </h4>
        </el-col>
        <el-col :span="3" v-if="mode !== 'VIEW'" align="right">
          <el-button title="新增收费信息" type="primary" icon="fa fa-plus" size="small"
                     v-if="!isUpload || list[phase].length === 0"
                     @click="handleCreate(phase)"></el-button>
          <el-button title="删除收费信息" type="danger" icon="fa fa-trash" size="small"
                     @click="handleDelete(phase)"></el-button>
        </el-col>
      </el-row>
      <el-table :data="list[phase]"
                class="mgt20"
                border
                show-summary
                :summary-method="getSummaries"
                @selection-change="handleSelectionChange">
        <el-table-column v-if="mode !== 'VIEW'"
                         type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column v-for="col in table" :label="col.label" :prop="col.prop" :formatter="col.formatter"
                         :key="col.prop" align="center"></el-table-column>
        <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="100">
          <template slot-scope="scope">
            <el-button title="编辑收费项" size="mini" type="info" icon="fa fa-edit"
                       @click="handleEdit(scope.row, scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle"
               :visible.sync="showDialog"
               width="1000px"
               @close="handleDialogClose">
      <el-form ref="form"
               :model="newRow"
               :rules="rules"
               label-width="150px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="计费类型" prop="kind">
              <ats-select v-model="newRow.kind"
                          :kind="this.$enum.FEE_CHARGE_TYPE"
                          :group="this.$enum.FEE_CHARGE_TYPE"
                          :disabled="detailMode === 'EDIT'"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item v-if="newRow.kind === this.$enum.FEE_CHARGE_TYPE_PERCENT"
                          label="收费比例" prop="rate">
              <ats-input v-model="rate"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01"></ats-input>
            </el-form-item>
            <el-form-item v-if="newRow.kind === this.$enum.FEE_CHARGE_TYPE_AMOUNT"
                          label="收费金额" prop="amount">
              <ats-input v-model="newRow.amount"
                         type="number" unit="元" :min="0" :step="0.01"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-row type="flex" justify="center">
          <el-button @click="handleSave" type="primary">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let totalAmount = 0;
  let totalRate = 0;

  export default {
    props: {
      value: Object,
      mode: String,
      isUpload: Boolean
    },
    data() {
      return {
        currentValue: {
          // phase: '',
          allList: [],
          loanAmount: 0
        },
        // list: {},
        phaseList: [
          // this.$enum.FEE_PHASE_INITIAL,
          this.$enum.FEE_PHASE_MIDTERM,
          this.$enum.FEE_PHASE_TERMINAL
        ],
        newRow: {
          amount: 0,
          rate: 0,
          kind: this.$enum.FEE_CHARGE_TYPE_PERCENT
        },
        idList: [],
        showDialog: false,
        detailMode: '',
        // totalAmount: 0,
        // totalRate: 0,
        table: [
          {
            prop: 'kind',
            label: '计费类型',
            formatter: (row, col, val) => this.$filter(val, this.$enum.FEE_CHARGE_TYPE, this.$enum.FEE_CHARGE_TYPE)
          },
          {
            prop: 'amount',
            label: '收费金额 / 比例',
            formatter: (row, col, val) => `${row.kind === this.$enum.FEE_CHARGE_TYPE_AMOUNT ? `${val}元` : this.$floatToPercentage(row.rate)}`
          }
        ],
        rules: {
          kind: [
            { required: true, message: '请选择计费类型', trigger: 'change'}
          ],
          rate: [
            { required: true, message: '请输入收费比例', trigger: 'blur', type: 'number' },
            { min: 0, max: 1, message: '收费比例范围为0-100%', trigger: 'blur', type: 'number'},
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                const total = isNaN(this.newRow.index) ? totalRate : this.$floatMinus(totalRate, this.list[this.newRow.phase][this.newRow.index].rate);
                if (this.$floatPlus(value, total) <= 1) {
                  if (this.$valid.floatValidator(value, 4)) {
                    callback()
                  } else {
                    callback('保留2位小数')
                  }
                } else {
                  callback('收费比例和不能超过100%')
                }
              }
            }
          ],
          amount: [
            { required: true, message: '请输入收费金额', trigger: 'blur', type: 'number' },
            { min: 0, max: Number.MAX_SAFE_INTEGER, message: '范围0-' + Number.MAX_SAFE_INTEGER, trigger: 'blur', type: 'number'},
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                const total = isNaN(this.newRow.index) ? totalAmount : this.$floatMinus(totalAmount, this.list[this.newRow.phase][this.newRow.index].amount);
                if (this.$floatPlus(value, total) <= this.currentValue.loanAmount) {
                  if (this.$valid.floatValidator(value, 2)) {
                    callback()
                  } else {
                    callback('保留2位小数')
                  }
                } else {
                  callback('收费金额总和不能超过本金')
                }
              }
            }
          ]
        }
      }
    },
    computed: {
      dialogTitle() {
        const titleMap = {
          'VIEW': '查看',
          'EDIT': '编辑',
          'CREATE': '添加'
        };
        return (titleMap[this.detailMode] || '') + '收费项'
      },
      rate: {
        get() {
          if (typeof this.newRow.rate === 'number') {
            return this.$floatMultiply(this.newRow.rate, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.newRow.rate = null;
          } else {
            this.newRow.rate = this.$floatDivide(val, 100);
          }
        }
      },
      list: {
        get() {
          const ret = {};
          this.phaseList.forEach(phase => {
            const list = this.currentValue.allList || [];
            ret[phase] = list.filter(_ => _.phase === phase)
          });
          return ret;
        }
      }
    },
    watch: {
      value(val) {
        this.currentValue = this.$deepcopy(val);
      },
      'value.allList'(val) {
        this.currentValue.allList = this.$deepcopy(val)
      }
    },
    methods: {
      save(callback) {
        // this.$emit('save', this.$deepcopy(this.currentValue.allList))
        if (typeof callback === 'function') {
          callback(this.$deepcopy(this.currentValue.allList))
        }
      },
      getSummaries({data}) {
        const sums = [];
        if (this.mode === 'VIEW') {
          sums[1] = '总计';
          totalAmount = data.map(_ => _.kind === this.$enum.FEE_CHARGE_TYPE_AMOUNT ? _.amount : 0).reduce((prev, curr) => this.$floatPlus(prev, curr), 0);
          totalRate = data.map(_ => _.kind === this.$enum.FEE_CHARGE_TYPE_PERCENT ? _.rate : 0).reduce((prev, curr) => this.$floatPlus(prev, curr), 0);
          sums[2] = `${totalAmount}元 / ${this.$floatToPercentage(totalRate)}`;
        } else {
          sums[2] = '总计';
          totalAmount = data.map(_ => _.kind === this.$enum.FEE_CHARGE_TYPE_AMOUNT ? _.amount : 0).reduce((prev, curr) => this.$floatPlus(prev, curr), 0);
          totalRate = data.map(_ => _.kind === this.$enum.FEE_CHARGE_TYPE_PERCENT ? _.rate : 0).reduce((prev, curr) => this.$floatPlus(prev, curr), 0);
          sums[3] = `${totalAmount}元 / ${this.$floatToPercentage(totalRate)}`;
        }
        return sums;
      },
      // handlePhaseChange(phase) {
      //   if (this.isUpload) {
      //     this.getFeeList(phase)
      //   } else {
      //     this.$emit('phase-change', phase)
      //   }
      // },
      handleSelectionChange(val) {
        this.idList = val.map(_ => _.id);
      },
      handleCreate(phase) {
        this.detailMode = 'CREATE';
        this.showDialog = true;
        this.newRow.phase = phase;
      },
      handleEdit(row, index) {
        this.detailMode = 'EDIT';
        this.newRow = this.$deepcopy(row);
        this.newRow.index = index;
        this.showDialog = true;
      },
      handleDelete(phase) {
        if (this.idList.length === 0) {
          this.$message.warning('没有可删除的收费项');
          return;
        }
        if (this.isUpload) {
          this.currentValue.allList = this.currentValue.allList.filter(_ => _.phase !== phase)
        } else {
          this.$emit('delete', this.$deepcopy(this.idList), phase)
        }
      },
      handleSave() {
        const val = this.$deepcopy(this.newRow);
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (val.kind === this.$enum.FEE_CHARGE_TYPE_AMOUNT) {
              val.rate = 0;
            } else {
              val.amount = 0;
            }
            if (this.detailMode === 'EDIT') {
              if (this.isUpload) {
                const index = this.currentValue.allList.findIndex(_ => _.id === this.newRow.id);
                this.$set(this.currentValue.allList, index, this.$deepcopy(this.newRow));
              } else {
                this.$emit('edit', val)
              }
            } else if (this.detailMode === 'CREATE') {
              if (this.isUpload) {
                this.currentValue.allList.push({
                  id: Date.now(),
                  ...this.newRow
                })
              } else {
                this.$emit('create', val)
              }
            }
            this.showDialog = false;
          } else {
            return false;
          }
        });
      },
      handleCancel() {
        this.showDialog = false;
      },
      handleDialogClose() {
        this.$refs.form.resetFields();
        this.detailMode = '';
        this.newRow = {
          amount: 0,
          rate: 0,
          kind: this.$enum.FEE_CHARGE_TYPE_PERCENT
        };
      }
      // getFeeList(phase) {
      //   this.currentValue.list = this.currentValue.allList.filter(_ => _.phase === phase)
      // }
    }
  }
</script>
