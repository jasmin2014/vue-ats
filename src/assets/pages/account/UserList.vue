<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="5">
          <el-form-item label="关键词">
            <el-input v-model="search.realName" placeholder="真实姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'AccountUserCreate'"
                     type="primary" icon="fa fa-plus" title="添加用户"
                     @click="handleCreate"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="list" border>
      <el-table-column v-for="(col, index) in table"
                       :label="col.label"
                       :prop="col.prop"
                       :formatter="col.formatter"
                       :key="index"
                       align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-tooltip v-action="'AccountUserDetail'"
                      content="查看">
            <el-button size="small" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'AccountUserEdit'"
                      content="编辑">
            <el-button size="small" type="info" icon="fa fa-edit"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'AccountUserDelete'"
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
    <!-- 账号操作：添加，编辑，查看 -->
    <el-dialog :visible.sync="showDialog"
               :title="dialogTitle"
               @open="handleDialogOpen"
               @close="handleDialogClose"
               width="800px">
      <user ref="user"
            v-model="detail"
            :mode="mode"
            :business="business"
            :role-list="roleList"
            @save="handleSave"
            @cancel="handleCancel"></user>
    </el-dialog>
  </div>
</template>

<script>
  import User from '../../../modules/account/User.vue';
  import {
    getUserList,
    getUserDetail,
    createUser,
    editUser,
    deleteUser,
    getRoleListByOrg,
    getRoleListByUser,
    saveUserRole
  } from '../../api/account';

  export default {
    data() {
      return {
        search: {
          pageSize: 20,
          currentPage: 1
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '机构名',
            prop: 'orgMgrName'
          },
          {
            label: '真实姓名',
            prop: 'realName'
          },
          {
            label: '手机号',
            prop: 'mobile'
          },
          {
            label: '邮箱',
            prop: 'email'
          },
          {
            label: '创建时间',
            prop: 'createdTime'
          },
          {
            label: '状态',
            prop: 'isActivate',
            formatter: (row, col, val) => (this.$filterBoolean(val, '已激活', '未激活'))
          }
        ],
        showDialog: false,
        mode: '',
        business: this.$enum.BUSINESS_ASSET,
        detail: {
          orgMgrName: this.$getLocalStorage('user').companyName
        },
        roleList: []
      }
    },
    computed: {
      dialogTitle() {
        const titleMap = {
          'VIEW': '查看',
          'EDIT': '编辑',
          'CREATE': '添加'
        };
        return (titleMap[this.mode] || '') + '用户'
      }
    },
    created() {
      this.getData(1);
      this.getRoleList();
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handleDetail(row) {
        this.mode = 'VIEW';
        this.getDetail(row.partyId);
      },
      handleEdit(row) {
        this.mode = 'EDIT';
        this.getDetail(row.partyId);
      },
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteUser(row.partyId).then(({status}) => {
            if (status === 204) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getData(this.search.currentPage)
            }
          }, () => {})
        }).catch(() => {})
      },
      handleCreate() {
        this.mode = 'CREATE';
        this.showDialog = true;
      },
      handleSave(val) {
        let promise = {};
        delete val.orgMgrPartyId;
        if (this.mode === 'EDIT') {
          promise = editUser(val.partyId, val)
        } else if (this.mode === 'CREATE') {
          promise = createUser(val)
        }
        promise.then(({status, data}) => {
          if (status === 200) {
            if (!data.code) {
              saveUserRole(val.partyId, val.roleIdList,
                this.$store.state.buttons['AccountUserEdit']).then(() => {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.showDialog = false;
                this.getData(this.search.currentPage);
              }, () => {});
            } else {
              this.$message.error(data.message)
            }
          } else if (status === 201) {
            saveUserRole(data.body.partyId, val.roleIdList,
              this.$store.state.buttons['AccountUserCreate']).then(() => {
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.showDialog = false;
              this.getData(1)
            }, () => {});
          }
        })
      },
      handleCancel() {
        this.showDialog = false;
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.$refs.user && this.$refs.user.clearValidate();
          if (!this.roleList.length) {
            this.getRoleList()
          }
        })
      },
      handleDialogClose() {
        this.mode = '';
        this.detail = {
          orgMgrName: this.$getLocalStorage('user').companyName
        };
        this.$refs.user.clearValidate();
      },
      getDetail(id) {
        this.showDialog = true;
        getUserDetail(id, this.$store.state.buttons[this.mode === 'EDIT' ? 'AccountUserEdit' : 'AccountUserDetail']).then(({data}) => {
          if (data.code === 200) {
            getRoleListByUser(data.body.partyId, this.$store.state.buttons[this.mode === 'EDIT' ? 'AccountUserEdit' : 'AccountUserDetail']).then((response) => {
              const res = response.data;
              if (res.code === 200) {
                data.body.roleIdList = res.body.map(_ => _.roleId);
                this.detail = data.body;
              }
            }, () => {})
          }
        }, () => {})
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.currentPage = index;
        getUserList(search).then(({data}) => {
          if (data.code === 200 && data.body) {
            this.list = data.body.list || [];
            this.pageTotal = data.body.totalRecord;
            this.search.currentPage = index;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }).catch(() => {
          this.list = [];
          this.pageTotal = 0;
        })
      },
      getRoleList() {
        getRoleListByOrg().then(({data}) => {
          if (data.code === 200) {
            this.roleList = [{
              appId: this.business,
              roles: [{
                roleId: undefined,
                roleName: '无'
              }].concat(data.body)
            }];
          }
        }, () => {})
      }
    },
    components: {
      User
    }
  };
</script>
