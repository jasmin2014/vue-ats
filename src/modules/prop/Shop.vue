<template>
  <el-form class="prop-shop"
           ref="form"
           :model="currentValue"
           :rules="mode !== 'VIEW' ? rules : {}"
           label-width="0" size="small">
    <el-row type="flex" justify="space-between" align="middle">
      <h5>商铺信息</h5>
    </el-row>
    <table class="el-table el-table--border" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <th>商铺名称</th>
        <th>所在省份</th>
        <th>所在城市</th>
        <th>地址</th>
        <th>相关证件</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <el-form-item prop="shopName">
            <ats-input v-model.trim="currentValue.shopName"
                       :mode="mode"></ats-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="province">
            <ats-select v-model="currentValue.province"
                        region="86"
                        :mode="mode"
                        clearable></ats-select>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="city">
            <ats-select v-model="currentValue.city"
                        :region="currentValue.province"
                        :mode="mode"
                        clearable></ats-select>
          </el-form-item>
        </td>
        <td>
          <el-form-item prop="address">
            <ats-input v-model.trim="currentValue.address"
                       :mode="mode"></ats-input>
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
  import AtsSelect from '../../components/input/Select';

  export default {
    components: { AtsSelect },
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
        rules: {
          shopName: [
            { required: true, message: '请输入商铺名称', trigger: 'blur' }
          ],
          province: [
            { required: true, message: '请选择商铺所在省份', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择商铺所在城市', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入商铺地址', trigger: 'blur' },
            { min: 0, max: 100, message: '商铺地址过长', trigger: 'blur' }
          ],
          materials: [
            { required: true, message: '请上传附件', trigger: 'change',
              type: 'array', min: 1 }
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
        const val = this.currentValue;
        if (!val.shopName && !val.province && !val.city && !val.address) {
          typeof callback === 'function' && callback(true, true);
        } else {
          this.$refs.form.validate((valid) => {
            typeof callback === 'function' && callback(valid);
            if (valid) {
              this.$emit('input', this.$deepcopy(this.currentValue));
            } else {
              return false;
            }
          })
        }
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
            kind: this.$enum.CUSTOMER_PROP_SHOP
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
          kind: this.$enum.CUSTOMER_PROP_SHOP
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
