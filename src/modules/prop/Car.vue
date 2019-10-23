<template>
  <el-form class="prop-car"
           ref="form"
           :model="currentValue"
           :rules="mode !== 'VIEW' ? rules : {}"
           label-width="0" size="small">
    <el-row type="flex" justify="space-between" align="middle">
      <h5>车辆信息</h5>
    </el-row>
    <table class="el-table el-table--border" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>车辆品牌</th>
        <th>车辆型号</th>
        <th>购置年月</th>
        <th>使用性质</th>
        <th>车牌照</th>
        <th>评估金额</th>
        <th>附件</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <el-form-item prop="brand">
            <ats-input v-model.trim="currentValue.brand"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="modelNumber">
            <ats-input v-model.trim="currentValue.modelNumber"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="buyCarDate">
            <ats-date-picker v-model="currentValue.buyCarDate"
                             :picker-options="datePickerOptions"
                             value-format="yyyy-MM-dd"
                             :mode="mode"></ats-date-picker>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="nature">
            <ats-select v-model="currentValue.nature"
                        :kind="$enum.CAR_NATURE"
                        :group="$enum.CAR_NATURE"
                        :mode="mode"></ats-select>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="licencePlate">
            <ats-input v-model.trim="currentValue.licencePlate"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="amount">
            <ats-input v-model="currentValue.amount"
                       :mode="mode"
                       type="number" :min="0" :step="0.01" unit="元"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="materials">
            <el-button v-if="mode === 'VIEW'"
                       @click="handleUploadFiles">
              查看附件
            </el-button>
            <el-button v-else
                       type="success"
                       @click="handleUploadFiles">上传附件
            </el-button>
          </el-form-item>
        </td>
      </tr>
      </tbody>
    </table>
    <ats-upload-dialog :visible.sync="showDialog"
                       v-model="materials"
                       :mode="mode"
                       @upload="handleDialogUpload"
                       @remove="handleDialogRemove"
                       @close="handleDialogClose"
                       @cancel="handleDialogCancel"
                       @confirm="handleDialogConfirm"></ats-upload-dialog>
  </el-form>
</template>

<script>
  export default {
    props: {
      value: Object,
      mode: String
    },
    data() {
      return {
        currentValue: this.$deepcopy({
          materials: [],
          ...this.value
        }),
        materials: [],
        showDialog: false,
        datePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },
        rules: {
          brand: [
            { required: true, message: '请输入车辆品牌', trigger: 'blur' }
          ],
          modelNumber: [
            { required: true, message: '请输入车辆型号', trigger: 'blur' }
          ],
          buyCarDate: [
            { required: true, message: '请选择新车购置年月', trigger: 'change' }
          ],
          nature: [
            { required: true, message: '请选择车辆使用性质', trigger: 'change' }
          ],
          licencePlate: [
            { required: true, message: '请输入车牌照', trigger: 'blur' }
          ],
          amount: [
            { message: '请输入车辆金额', trigger: 'blur', type: 'number' },
            { min: 0, max: Number.MAX_SAFE_INTEGER, message: '请输入正确的金额', trigger: 'blur', type: 'number' },
            {
              trigger: 'blur',
              type: 'number',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 2)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ],
          materials: [
            {
              required: true, message: '请上传附件', trigger: 'change',
              type: 'array', min: 1
            }
          ]
        },
        deletedMaterials: [],
        addedMaterials: []
      }
    },
    watch: {
      value(val) {
        val.materials = val.materials || [];
        this.currentValue = this.$deepcopy(val || {})
      }
    },
    methods: {
      validate(callback) {
        this.$refs.form.validate((valid) => {
          typeof callback === 'function' && callback(valid);
          if (valid) {
            this.$emit('input', this.$deepcopy(this.currentValue));
          } else {
            return false;
          }
        })
      },
      handleUploadFiles() {
        this.showDialog = true;
        this.$nextTick(() => {
          this.materials = (this.currentValue.materials || []).map(_ => ({
            id: _.id,
            url: _.fileUri,
            name: _.fileName,
            type: _.fileType
          }))
        })
      },
      handleDialogUpload(file) {
        this.materials = this.materials.concat({
          id: file.uid,
          url: file.key,
          name: file.name,
          type: file.type
        });
        if (this.mode === 'EDIT') {
          this.addedMaterials.push({
            uid: file.uid,
            fileUri: file.key,
            fileName: file.name,
            fileType: file.type,
            kind: this.$enum.CUSTOMER_PROP_CAR
          })
        }
      },
      handleDialogRemove(file, fileList) {
        this.materials = fileList;
        if (this.mode === 'EDIT') {
          this.deletedMaterials.push({
            id: file.id
          })
        }
      },
      handleDialogClose() {
        this.materials = [];
        this.deletedMaterials = [];
        this.addedMaterials = [];
      },
      handleDialogCancel() {
        this.showDialog = false;
        this.$refs.form.validateField('materials');
      },
      handleDialogConfirm(files) {
        this.currentValue.materials = files.map(_ => ({
          id: _.id,
          fileUri: _.url,
          fileName: _.name,
          fileType: _.type,
          kind: this.$enum.CUSTOMER_PROP_CAR
        }));
        this.showDialog = false;
        this.$refs.form.validateField('materials');
        if (this.mode === 'EDIT') {
          this.$store.dispatch('material/batch', {
            deleted: this.deletedMaterials,
            added: this.addedMaterials
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table {
    th, td {
      text-align: center;
      padding: 12px 10px;
    }
  }
</style>
