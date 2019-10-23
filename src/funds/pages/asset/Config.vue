<template>
  <div class="config">
    <h4><span>验证内容</span></h4>
    <el-table :data="list" border>
      <el-table-column label="业务类型" prop="projectDesc" align="center" width="300"></el-table-column>
      <el-table-column label="验证内容" align="center">
        <template slot-scope="scope">
          <div v-for="col in scope.row.columns">{{ col.fieldName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="info"
                     icon="fa fa-edit"
                     @click="handleEdit(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="验证内容编辑" width="700px"
               :visible.sync="showDialog"
               @close="handleDialogClose">
      <el-form size="mini">
        <el-table :data="dialog.columns" class="mgt20" border>
          <el-table-column label="验证内容" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="isEditing(scope.row)"
                            prop="fieldName"
                            :error="fieldError">
                <el-input v-model.trim="scope.row.fieldName"></el-input>
              </el-form-item>
              <span v-else>{{ scope.row.fieldName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <div v-if="isEditing(scope.row)">
                <el-button size="mini"
                           type="primary"
                           @click="handleConfirmField(scope.row)">确定</el-button>
                <el-button size="mini"
                           @click="handleCancelField(scope.row)">取消</el-button>
              </div>
              <div v-else>
                <el-button size="mini"
                           type="danger"
                           icon="fa fa-trash"
                           @click="handleDeleteField(scope.row)"></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-row type="flex" justify="center" slot="footer">
        <el-button type="primary"
                   @click="handleCreateField">新增</el-button>
        <el-button @click="showDialog = false">关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getCustomizedParams,
    getCustomizedParamsByProjectName,
    createCustomizedParams,
    deleteCustomizedParam} from '../../api/assetMgt';

  export default {
    data() {
      return {
        list: [],
        showDialog: false,
        dialog: {
          projectName: '',
          columns: []
        },
        fieldError: ''
      }
    },
    created() {
      this.getData();
    },
    methods: {
      isEditing(row) {
        return !row.id;
      },
      handleEdit(row) {
        this.showDialog = true;
        this.getParamsByProjectName(row.projectName)
      },
      handleCreateField() {
        this.dialog.columns.push({
          projectName: this.dialog.projectName
        });
      },
      handleDeleteField(row) {
        deleteCustomizedParam(row.id).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getParamsByProjectName(this.dialog.projectName);
          } else {
            this.$message.error(data.message)
          }
        })
      },
      handleConfirmField(row) {
        if (!row.fieldName) {
          this.fieldError = '请输入验证内容';
        } else if (row.fieldName.length > 50) {
          this.fieldError = '50字以内'
        } else {
          this.fieldError = null;
          createCustomizedParams(this.$deepcopy(row)).then(({ data }) => {
            if (data.code === 200) {
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              this.getParamsByProjectName(this.dialog.projectName);
            } else {
              this.$message.error(data.message)
            }
          }).catch(() => {})
        }
      },
      handleCancelField(row) {
        this.dialog.columns.pop();
        this.fieldError = null;
      },
      handleDialogClose() {
        this.dialog.projectName = '';
        this.dialog.columns = [];
        this.fieldError = null;
        this.getData();
      },
      getData() {
        getCustomizedParams().then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body || [];
          } else {
            this.list = [];
          }
        }).catch(() => {
          this.list = [];
        })
      },
      getParamsByProjectName(projectName) {
        getCustomizedParamsByProjectName(projectName).then(({ data }) => {
          if (data.code === 200) {
            this.dialog.projectName = projectName;
            this.dialog.columns = data.body;
          } else {
            this.dialog.projectName = '';
            this.dialog.columns = [];
          }
        }).catch(() => {
          this.dialog.projectName = '';
          this.dialog.columns = [];
        })
      }
    }
  }
</script>
