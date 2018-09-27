<template>
  <div class="role">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="5">
          <el-form-item label="关键词">
            <el-input v-model="search.roleName" placeholder="角色名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'AccountRoleCreate'"
                     type="primary" icon="fa fa-plus" title="添加角色"
                     @click="handleCreate"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="list" border>
      <el-table-column v-for="(col, index) in table" :label="col.label" :prop="col.prop"
                       :key="index" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip v-action="'AccountRoleDetail'"
                      content="详情">
            <el-button size="small" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'AccountRoleEdit'"
                      content="修改">
            <el-button size="small" type="info" icon="fa fa-edit"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'AccountRoleDelete'"
                      content="删除">
            <el-button size="small" type="danger" icon="fa fa-trash"
                       @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>
    <el-dialog :visible.sync="showDialog"
               :title="dialogTitle"
               @open="handleDialogOpen"
               @close="handleDialogClose"
               width="1000px">
      <role ref="role"
            v-model="detail"
            :auth-list="authList"
            :mode="mode"
            :business="business"
            @save="handleSave"
            @cancel="handleCancel"></role>
    </el-dialog>
  </div>
</template>

<script>
  import Role from '../../../modules/account/Role.vue'
  import {
    getAuthList,
    getRoleList,
    getRoleDetail,
    createRole,
    editRole,
    deleteRole
  } from '../../api/account'
  import {checkRoleBinded} from '../../../api/account';

  export default {
    data() {
      return {
        search: {
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '机构名',
            prop: 'orgName'
          },
          {
            label: '业务端',
            prop: 'appName'
          },
          {
            label: '角色名称',
            prop: 'roleName'
          }
        ],
        showDialog: false,
        mode: 'VIEW',
        business: this.$enum.BUSINESS_FUND,
        authList: {},
        detail: {
          orgName: this.$getLocalStorage('user').companyName,
          orgManagerId: this.$getLocalStorage('user').orgMgrPartyId,
          appId: this.$enum.BUSINESS_FUND,
          actionCodeList: []
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
        return (titleMap[this.mode] || '') + '角色'
      }
    },
    created() {
      this.getData(1);
      this.getAuthList();
    },
    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleCreate() {
        this.mode = 'CREATE';
        this.showDialog = true;
      },
      handleDetail(row) {
        this.mode = 'VIEW';
        this.getDetail(row.roleId);
      },
      handleEdit(row) {
        this.mode = 'EDIT';
        this.getDetail(row.roleId);
      },
      handleDelete(row) {
        checkRoleBinded(row.roleId).then(({data}) => {
          let message = '确定删除？';
          if (data.body) {
            message = this.$createElement('div', null, [
              this.$createElement('p', null, '确定删除？'),
              this.$createElement('p', null, '如若删除，绑定该角色的账号权限也将被关闭')
            ])
          }
          this.$confirm(message, '提示', {
            type: 'warning'
          }).then(() => {
            deleteRole(row.roleId).then(({status}) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getData(this.search.currentPage)
              }
            }, () => {})
          }).catch(() => {})
        }, () => {})
      },
      handleSave(val) {
        let promise = {};
        delete val.appName;
        if (this.mode === 'EDIT') {
          promise = editRole(val.roleId, val)
        } else if (this.mode === 'CREATE') {
          promise = createRole(val)
        }
        promise.then(({status, data}) => {
          if (status === 200) {
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.showDialog = false;
              this.getData(this.search.pageNumber);
            } else {
              this.$message.error(data.message)
            }
          } else if (status === 201) {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.showDialog = false;
            this.getData(1)
          }
        })
      },
      handleCancel() {
        this.showDialog = false;
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.$refs.role && this.$refs.role.clearValidate();
          if (!this.authList.children) {
            this.getAuthList();
          }
        })
      },
      handleDialogClose() {
        this.mode = 'VIEW';
        this.detail = {
          orgName: this.$getLocalStorage('user').companyName,
          orgManagerId: this.$getLocalStorage('user').orgMgrPartyId,
          appId: this.business,
          actionCodeList: []
        };
        this.$refs.role.clearValidate();
      },
      getDetail(id) {
        getRoleDetail(id, this.$store.state.buttons[this.mode === 'EDIT' ? 'AccountRoleEdit' : 'AccountRoleDetail']).then(({data}) => {
          if (data.code === 200) {
            this.showDialog = true;
            this.detail = data.body;
          }
        });
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getRoleList(search).then(({data}) => {
          if (data.code === 200 && data.body) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord;
            this.search.pageNumber = data.body.pageNumber;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }).catch(() => {
          this.list = [];
          this.pageTotal = 0;
        })
      },
      getAuthList() {
        getAuthList().then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.authList = res.body;
          }
        })
      }
    },
    components: {
      Role
    }
  }
</script>
