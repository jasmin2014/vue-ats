<template>
  <el-form ref="form"
           :model="currentValue"
           :rules="mode === 'VIEW' ? {} : rules"
           label-width="150px">
    <el-row>
      <el-col :span="22">
        <el-form-item label="业务端" prop="appId">
          <ats-input v-if="business !== this.$enum.BUSINESS_CENTER && mode !== 'CREATE'"
                     v-model="currentValue.appName"
                     disabled></ats-input>
          <ats-select v-else-if="business !== this.$enum.BUSINESS_CENTER"
                      v-model="currentValue.appId"
                      :kind="this.$enum.BUSINESS" :group="this.$enum.BUSINESS"
                      disabled></ats-select>
          <ats-input v-else-if="mode !== 'CREATE'"
                     v-model="currentValue.appName"
                     :mode="'VIEW'"></ats-input>
          <ats-select v-else
                      v-model="currentValue.appId" :mode="mode"
                      :kind="this.$enum.BUSINESS" :group="this.$enum.BUSINESS"
                      @change="handleAppChange"></ats-select>
        </el-form-item>
        <el-form-item label="机构" prop="orgManagerId">
          <ats-input v-if="business !== this.$enum.BUSINESS_CENTER"
                     v-model="currentValue.orgName"
                     disabled></ats-input>
          <ats-input v-else-if="mode !== 'CREATE'"
                     v-model="currentValue.orgName"
                     :mode="'VIEW'"></ats-input>
          <ats-select v-else
                      v-model="currentValue.orgManagerId"
                      :mode="mode"
                      :org="currentValue.appId || this.$enum.BUSINESS_ALL"
                      placeholder="选择机构">
          </ats-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <ats-input v-model.trim="currentValue.roleName"
                     :mode="mode"></ats-input>
        </el-form-item>
        <el-form-item label="权限分配" prop="actionCodeList">
          <el-checkbox-group v-model="currentValue.actionCodeList"
                             :disabled="mode === 'VIEW'">
            <el-table :data="currentAuthList.children || []"
                      :show-header="false" border>
              <el-table-column label="一级菜单" width="120px">
                <template slot-scope="scope">
                  <el-checkbox :label="scope.row.actionCode"
                               @change="handleAuthChange($event, scope.row, currentAuthList)">{{ scope.row.tname }}</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="二级菜单">
                <template slot-scope="scope">
                  <el-row v-for="(item, index) in scope.row.children" :key="index">
                    <el-col :span="6">
                      <el-checkbox :label="item.actionCode"
                                   @change="handleAuthChange($event, item, scope.row, currentAuthList)">{{ item.tname }}</el-checkbox>
                    </el-col>
                    <el-col :span="18">
                      <el-checkbox v-for="(op, index) in item.children" :key="index"
                                   :label="op.actionCode"
                                   @change="handleAuthChange($event, op, item, scope.row, currentAuthList)">{{ op.tname }}</el-checkbox>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <div v-if="mode !== 'VIEW'">
        <el-button type="primary" @click="handleSave">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
      <div v-else>
        <el-button type="primary" @click="handleCancel">关 闭</el-button>
      </div>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    props: {
      mode: String,
      business: String,
      authList: Object,
      value: {
        'default': {}
      }
    },
    data() {
      return {
        currentAuthList: {},
        currentValue: Object.assign({
          roleId: '',
          appId: '',
          appName: '',
          orgManagerId: '',
          orgName: '',
          roleName: '',
          actionCodeList: []
        }, this.value),
        rules: {
          orgManagerId: [
            { required: true, message: '请选择机构', trigger: 'change' }
          ],
          appId: [
            { required: true, message: '请选择业务端', trigger: 'change' }
          ],
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          actionCodeList: [
            { required: true, min: 2, message: '至少选择一个模块', trigger: 'change', type: 'array'}
          ]
        }
      }
    },
    computed: {
      availableActionCode() {
        return this.computedActionCodeMap(this.currentAuthList);
      },
      filteredActionCodeList() {
        return this.currentValue.actionCodeList.filter(_ => this.availableActionCode[_]);
      }
    },
    watch: {
      authList(val) {
        this.currentAuthList = this.$deepcopy(val);
      },
      value(val) {
        this.setCurrentValue(this.$deepcopy(val))
      },
      'value.actionCodeList'(val) {
        this.currentValue.actionCodeList = val;
      }
    },

    created() {
      this.currentAuthList = this.$deepcopy(this.authList);
    },

    methods: {
      computedActionCodeMap(auths) {
        const map = {};
        if (auths.actionCode) {
          map[auths.actionCode] = true;
          this.$dfs(auths.children, _ => {
            map[_.actionCode] = true;
          })
        }
        return map;
      },
      clearValidate() {
        this.$refs.form.clearValidate();
      },
      resetFields() {
        this.$refs.form.resetFields();
      },
      setCurrentValue(val) {
        this.currentValue.roleId = val.roleId;
        this.currentValue.appId = val.appId;
        this.currentValue.appName = val.appName;
        this.currentValue.orgManagerId = val.orgManagerId;
        this.currentValue.orgName = val.orgName;
        this.currentValue.roleName = val.roleName;
        this.currentValue.actionCodeList = val.actionCodeList;
      },
      handleAppChange(value) {
        this.currentValue.actionCodeList = [];
        this.$emit('app-change', value);
      },
      handleAuthChange(val, action, parent, grandparent, ggp) {
        if (val) {
          this.$dfs(action.children, (item) => {
            this.currentValue.actionCodeList.push(item.actionCode)
          });
          if (parent) {
            this.currentValue.actionCodeList.push(parent.actionCode);
          }
          if (grandparent) {
            this.currentValue.actionCodeList.push(grandparent.actionCode)
          }
          if (ggp) {
            this.currentValue.actionCodeList.push(ggp.actionCode)
          }
          this.currentValue.actionCodeList = this.currentValue.actionCodeList.distinct();
        } else {
          this.$dfs(action.children, (item) => {
            this.currentValue.actionCodeList = this.currentValue.actionCodeList.filter(_ => _ !== item.actionCode)
          });
        }
        this.currentValue.actionCodeList = this.filteredActionCodeList;
      },
      handleSave() {
        this.currentValue.actionCodeList = this.filteredActionCodeList;
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('save', this.currentValue)
          } else {
            return false;
          }
        })
      },
      handleCancel() {
        this.$emit('cancel')
      }
    }
  }
</script>
