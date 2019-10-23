<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="5">
          <el-form-item label="业务端">
            <ats-select v-model="appId"
                        :kind="this.$enum.BUSINESS"
                        :group="this.$enum.BUSINESS"
                        placeholder="选择业务端"
                        clearable>
            </ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="机构">
            <ats-select v-model="search.orgId"
                        :org="appId || this.$enum.BUSINESS_ALL"
                        :disabled-method="() => false"
                        placeholder="选择机构"
                        clearable>
            </ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="关键词">
            <el-input v-model="search.realName" placeholder="真实姓名"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
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
      <el-pagination :total="pageTotal" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>
    <!-- 账号操作：添加，编辑，查看 -->
    <el-dialog :title="dialogTitle"
               :visible.sync="showDialog"
               @open="handleDialogOpen"
               @close="handleDialogClose"
               width="800px">
      <user ref="user"
            v-model="detail"
            :mode="mode"
            :business="this.$enum.BUSINESS_CENTER"
            :role-list="roleList"
            @save="handleSave"
            @cancel="handleCancel"
            @org-change="handleOrgChange"></user>
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
        appId: '',
        search: {
          pageSize: 20,
          currentPage: 1
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '业务端',
            prop: 'orgType',
            formatter: (row, col, val) => (val == 1 ? '资金端' : (val == 2 ? '资产端' : '资产中心'))
          },
          {
            label: '机构名',
            prop: 'orgName'
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
        detail: {},
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
    watch: {
      appId(val, oldVal) {
        if (val !== oldVal) {
          switch (val) {
            case this.$enum.BUSINESS_FUND:
              this.search.orgType = 1;
              break;
            case this.$enum.BUSINESS_ASSET:
              this.search.orgType = 2;
              break;
            case this.$enum.BUSINESS_CENTER:
              this.search.orgType = 4;
              break;
            default:
              this.search.orgType = null;
              break;
          }
        }
      }
    },

    created() {
      this.getData(1)
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.currentPage)
      },
      handleDetail(row) {
        this.mode = 'VIEW';
        this.getDetail(row.id);
      },
      handleEdit(row) {
        this.mode = 'EDIT';
        this.getDetail(row.id);
      },
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteUser(row.id).then(({status}) => {
            if (status === 204) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getData(this.search.currentPage);
            }
          }).catch(() => {
            this.getData(this.search.currentPage);
          })
        })
      },
      handleCreate() {
        this.mode = 'CREATE';
        this.showDialog = true;
      },
      handleSave(val) {
        console.log(val);
        let promise = {};
        if (this.mode === 'EDIT') {
          promise = editUser(val.id, val)
        } else if (this.mode === 'CREATE') {
          promise = createUser(val)
        }
        promise.then(({status, data}) => {
          if (status === 200) {
            if (!data.code) {
              saveUserRole(val.id, val.roleIdList,
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
            saveUserRole(data.body.id, val.roleIdList,
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
      handleOrgChange(orgId) {
        this.getRoleList(orgId).then(({data}) => {
          if (data.code === 200) {
            this.roleList = data.body;
          }
        }).catch(() => {})
      },
      handleCancel() {
        this.showDialog = false;
      },
      handleDialogClose() {
        this.detail = {};
        this.roleList = [];
        this.$refs.user.clearValidate();
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.$refs.user && this.$refs.user.clearValidate();
        })
      },
      getDetail(id) {
        this.showDialog = true;
        getUserDetail(id, this.$store.state.buttons[this.mode === 'EDIT' ? 'AccountUserEdit' : 'AccountUserDetail']).then(({data}) => {
          if (data.code === 200) {
            getRoleListByUser(data.body.id, this.$store.state.buttons[this.mode === 'EDIT' ? 'AccountUserEdit' : 'AccountUserDetail']).then((response1) => {
              const res1 = response1.data;
              if (res1.code === 200) {
                data.body.roleIdList = res1.body.map(_ => _.roleId);
                this.getRoleList(data.body.orgId).then((response) => {
                  const res = response.data;
                  if (res.code === 200) {
                    this.roleList = res.body;
                    this.detail = data.body;
                  }
                }, () => {
                  this.roleList = [];
                  this.detail = {};
                })
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
      getRoleList(orgId) {
        return new Promise((resolve, reject) => {
          getRoleListByOrg(orgId, this.$enum.BUSINESS_CENTER).then((response1) => {
            const centerData = response1.data;
            if (centerData.code === 200) {
              getRoleListByOrg(orgId, this.$enum.BUSINESS_ASSET).then((response2) => {
                const assetData = response2.data;
                if (assetData.code === 200) {
                  getRoleListByOrg(orgId, this.$enum.BUSINESS_FUND).then((response3) => {
                    const fundData = response3.data;
                    if (fundData.code === 200) {
                      response3.data.body = [
                        {
                          appId: this.$enum.BUSINESS_CENTER,
                          roles: [{
                            roleId: undefined,
                            roleName: '无'
                          }].concat(centerData.body)
                        },
                        {
                          appId: this.$enum.BUSINESS_ASSET,
                          roles: [{
                            roleId: undefined,
                            roleName: '无'
                          }].concat(assetData.body)
                        },
                        {
                          appId: this.$enum.BUSINESS_FUND,
                          roles: [{
                            roleId: undefined,
                            roleName: '无'
                          }].concat(fundData.body)
                        }
                      ];
                      resolve(response3);
                    } else {
                      reject(response3)
                    }
                  }).catch((error3) => {
                    reject(error3)
                  })
                } else {
                  reject(response2)
                }
              }).catch(error2 => {
                reject(error2)
              })
            } else {
              reject(response1)
            }
          }).catch(error1 => {
            reject(error1)
          })
        })
      }
    },
    components: {
      User
    }
  };
</script>
