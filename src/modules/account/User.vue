<template>
  <el-form ref="form"
           :model="currentValue"
           :rules="mode === 'VIEW' ? {} : formRules"
           label-width="120px"
           style="width: 90%;">
    <el-form-item label="机构" prop="orgMgrPartyId">
      <ats-input v-if="business !== this.$enum.BUSINESS_CENTER"
                 v-model="currentValue.orgMgrName"
                 disabled></ats-input>
      <ats-input v-else-if="mode !== 'CREATE'"
                 v-model="currentValue.orgMgrName"
                 :mode="'VIEW'"></ats-input>
      <ats-select v-else
                  v-model="currentValue.orgMgrPartyId"
                  :mode="mode"
                  :org="this.$enum.BUSINESS_ALL"
                  placeholder="选择机构"
                  @change="handleOrgChange">
      </ats-select>
    </el-form-item>
    <el-form-item label="真实姓名" prop="realName">
      <ats-input v-model.trim="currentValue.realName"
                 :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <ats-input v-model.trim="currentValue.mobile"
                 :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <ats-input v-model.trim="currentValue.email"
                 :mode="mode"></ats-input>
    </el-form-item>
    <el-form-item label="角色分配" prop="roleIdList">
      <el-table :data="roleList" :show-header="false" border>
        <el-table-column label="业务端" prop="appId" width="100px" align="center"
                         :formatter="(row, col, val) => ($filter(val, $enum.BUSINESS, $enum.BUSINESS))"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <el-radio-group v-model="roles[scope.row.appId]"
                            :disabled="mode === 'VIEW'">
              <el-radio v-for="role in scope.row.roles" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
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
      value: Object,
      mode: String,
      business: String,
      roleList: Array
    },
    data() {
      const rules = this.business === this.$enum.BUSINESS_CENTER ? {
        orgMgrPartyId: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ]
      } : {};
      return {
        roles: {},
        currentValue: Object.assign({
          partyId: '',
          orgMgrPartyId: '',
          orgMgrName: '',
          realName: '',
          mobile: '',
          email: '',
          roleIdList: []
        }, this.$deepcopy(this.value)),
        formRules: Object.assign(rules, {
          realName: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          // roleIdList: [
          //   { required: true, min: 1, message: '至少选择一个角色', trigger: 'change', type: 'array'}
          // ]
        })
      }
    },
    watch: {
      value(val) {
        this.setCurrentValue(this.$deepcopy(val))
      },
      roles: {
        handler(val) {
          this.setRoleIdList(val);
        },
        deep: true
      }
    },
    methods: {
      resetFields() {
        this.$refs.form.clearValidate();
      },
      clearValidate() {
        this.$refs.form.clearValidate();
      },
      setCurrentValue(val) {
        this.currentValue.partyId = val.partyId;
        this.currentValue.orgMgrPartyId = val.orgMgrPartyId;
        this.currentValue.orgMgrName = val.orgMgrName;
        this.currentValue.realName = val.realName;
        this.currentValue.mobile = val.mobile;
        this.currentValue.email = val.email;
        this.currentValue.roleIdList = val.roleIdList || [];
        this.roles = this.computedRoles();
      },
      setRoleIdList(val) {
        const userRoles = [];
        for (const appId in val) {
          if (val.hasOwnProperty(appId) && val[appId]) {
            userRoles.push(val[appId])
          }
        }
        this.currentValue.roleIdList = userRoles;
      },
      computedRoles() {
        const roles = {};
        for (const item of this.roleList) {
          for (const roleId of this.currentValue.roleIdList) {
            if (item.roles.some(_ => _.roleId === roleId)) {
              roles[item.appId] = roleId;
            }
          }
        }
        return roles;
      },
      handleOrgChange(orgId) {
        this.$emit('org-change', orgId)
      },
      handleSave() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('save', this.currentValue);
          } else {
            return false;
          }
        });
      },
      handleCancel() {
        this.$emit('cancel')
      }
    }
  }
</script>
