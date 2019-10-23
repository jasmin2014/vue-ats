<template>
  <el-form class="prop-device"
           ref="form"
           :model="currentValue"
           :rules="mode !== 'VIEW' ? rules : {}"
           label-width="0" size="small">
    <el-row type="flex" justify="space-between" align="middle">
      <h5>设备信息</h5>
    </el-row>
    <table class="el-table el-table--border" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>设备名称</th>
        <th>品牌</th>
        <th>数量</th>
        <th>购置年月</th>
        <th>附件</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <el-form-item prop="deviceName">
            <ats-input v-model.trim="currentValue.deviceName"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="brand">
            <ats-input v-model.trim="currentValue.brand"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="number">
            <ats-input v-model="currentValue.number"
                       :mode="mode"
                       type="number" :min="0"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="buyDate">
            <ats-date-picker v-model="currentValue.buyDate"
                             :picker-options="datePickerOptions"
                             value-format="yyyy-MM-dd"
                             :mode="mode"></ats-date-picker>
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
          deviceName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
          brand: [
            { required: true, message: '请输入设备品牌', trigger: 'blur' }
          ],
          number: [
            { message: '请输入设备数量', trigger: 'blur', type: 'number' },
            { min: 0, max: 999999999, message: '请输入正确的数量', trigger: 'blur', type: 'number' }
          ],
          buyDate: [
            { required: true, message: '请选择设备购置年月', trigger: 'change' }
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
            kind: this.$enum.CUSTOMER_PROP_DEVICE
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
          kind: this.$enum.CUSTOMER_PROP_DEVICE
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
