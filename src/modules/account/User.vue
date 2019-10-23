<template>
  <el-form ref="form"
           :model="currentValue"
           :rules="mode === 'VIEW' ? {} : formRules"
           label-width="120px"
           style="width: 90%;">
    <el-form-item label="机构" prop="orgId">
      <ats-input v-if="business !== this.$enum.BUSINESS_CENTER"
                 v-model="currentValue.orgName"
                 disabled></ats-input>
      <ats-input v-else-if="mode !== 'CREATE'"
                 v-model="currentValue.orgName"
                 :mode="'VIEW'"></ats-input>
      <ats-select v-else
                  v-model="currentValue.orgId"
                  :mode="mode"
                  :org="this.$enum.BUSINESS_ALL"
                  :org-type.sync="currentValue.orgType"
                  :value-text.sync="currentValue.orgName"
                  placeholder="选择机构"
                  @change="handleOrgChange">
      </ats-select>
    </el-form-item>
    <el-form-item label="真实姓名" prop="realName">
      <ats-input v-model.trim="currentValue.realName"
                 :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-input>
    </el-form-item>
    <el-form-item v-if="mode === 'CREATE'" label="邮箱" prop="email">
      <el-row>
        <el-col :span="12">
          <ats-input v-model.trim="emailName"></ats-input>
        </el-col>
        <el-col :span="12">
          <el-select v-model="emailSuffix"
                     ref="suffix"
                     placeholder="@"
                     clearable>
            <el-option v-for="suffix in emailSuffixList"
                       :label="`@${suffix}`"
                       :value="suffix"
                       :key="suffix"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item v-else label="邮箱" prop="email">
      <ats-input v-model.trim="currentValue.email"
                 mode="VIEW"></ats-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <ats-input v-model.trim="currentValue.mobile"
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
  import EMAIL_SUFFIX from '../../lib/email-suffix'

  export default {
    props: {
      value: Object,
      mode: String,
      business: String,
      roleList: Array
    },
    data() {
      const rules = this.business === this.$enum.BUSINESS_CENTER ? {
        orgId: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ]
      } : {};
      return {
        emailSuffixList: EMAIL_SUFFIX,
        roles: {},
        currentValue: Object.assign({
          id: '',
          orgId: '',
          orgName: '',
          orgType: '',
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
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入正确的邮箱地址' }
          ]
          // roleIdList: [
          //   { required: true, min: 1, message: '至少选择一个角色', trigger: 'change', type: 'array'}
          // ]
        })
      }
    },
    computed: {
      emailName: {
        get() {
          const email = this.currentValue.email;
          if (email) {
            const list = email.split('@');
            if (list.length > 1) {
              return list.slice(0, list.length - 1).join('@');
            }
          }
          return '';
        },
        set(val) {
          this.currentValue.email = `${val}@${this.emailSuffix}`;
        }
      },
      emailSuffix: {
        get() {
          const email = this.currentValue.email;
          if (email) {
            const list = email.split('@');
            if (list.length > 1) {
              return list[list.length - 1];
            }
          }
          return '';
        },
        set(val) {
          this.currentValue.email = `${this.emailName}@${val}`;
        }
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
        this.currentValue.id = val.id;
        this.currentValue.orgId = val.orgId;
        this.currentValue.orgName = val.orgName;
        this.currentValue.orgType = val.orgType;
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
