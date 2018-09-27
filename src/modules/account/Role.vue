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
        <el-form-item v-if="currentValue.appId !== $enum.BUSINESS_CHAIN_ASSET && currentValue.appId !== $enum.BUSINESS_CHAIN_FUND"
                      label="权限分配" prop="actionCodeList">
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
                                   v-show="!hiddenActionList.includes(op.actionCode)"
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
  const ACTION_MAP = {
    /** 资产中心 **/
    CENTER: {
      'M1003': 'P1004',
      'M1010': 'P1011',
      'M1017': 'P1018',
      'M1021': 'P1022',
      'M1024': 'P1025',
      'M1027': 'P1028',
      'M1030': 'P1031',
      'M1033': 'P1034',
      'M1085': 'P1086',
      'M1036': 'P1037',
      'M1039': 'P1040',
      'M1042': 'P1043',
      'M1051': 'P1052',
      'M1055': 'P1056',
      'M1058': 'P1059',
      'M1060': 'P1061',
      'M1063': 'P1064',
      'M1066': 'P1067',
      'M1073': 'P1074',
      'M1079': 'P1080'
    },
    /** 资产端 **/
    ASSET: {
      'M2003': 'P2004',
      'M2006': 'P2007',
      'M2012': 'P2013',
      'B2019': 'B2020',
      'M2065': ['P2066', 'P2067'],
      'M2021': 'P2022',
      'P2075': 'P2076',
      'M2026': 'P2027',
      'M2030': 'P2031',
      'M2033': 'P2034',
      'M2035': 'P2036',
      'M2079': 'P2080',
      'M2038': 'P2039',
      'M2041': 'P2042',
      'M2044': 'P2045',
      'P2049': 'P2047',
      'M2051': 'M2052',
      'M2057': 'P2058'
    },
    /** 资金端 **/
    FUND: {
      'M3003': 'P3004',
      'M3006': 'P3007',
      'M3012': 'P3013',
      'B3016': 'B3015',
      'M3017': 'P3018',
      'M3022': 'P3023',
      'M3070': 'P3072',
      'P2075': 'P2076',
      'M3026': 'P3027',
      'M3030': 'P3031',
      'M3033': 'P3034',
      'M3035': 'P3036',
      'M3074': 'P3075',
      'M3040': 'P3041',
      'M3044': 'P3045',
      'M3047': 'P3048',
      'P3052': 'P3067',
      'M3054': 'P3055',
      'M3060': 'P3061'
    }
  };
  const ACTION_HIDDEN = {
    CENTER: ['P1004', 'P1011', 'P1018', 'P1022', 'P1025', 'P1028', 'P1031', 'P1034', 'P1086', 'P1037', 'P1040', 'P1043', 'P1052', 'P1056', 'P1059', 'P1061', 'P1064', 'P1067', 'P1074', 'P1080'],
    ASSET: ['P2004', 'P2007', 'P2013', 'B2020', 'P2066', 'P2067', 'P2022', 'P2076', 'P2027', 'P2031', 'P2034', 'P2036', 'P2080', 'P2039', 'P2042', 'P2045', 'P2047', 'M2052', 'P2058'],
    FUND: ['P3004', 'P3007', 'P3013', 'B3015', 'P3018', 'P3023', 'P3072', 'P2076', 'P3027', 'P3031', 'P3034', 'P3036', 'P3075', 'P3041', 'P3045', 'P3048', 'P3067', 'P3055', 'P3061']
  };

  const tempHidden = ['M2074'];

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
        },
        hiddenActionList: ACTION_HIDDEN[this.value.appId],
        actionMap: ACTION_MAP[this.value.appId]
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
        if (this.authList.children) {
          this.currentAuthList.children = val.children.filter(_ => !tempHidden.includes(_.actionCode))
        }
      },
      value(val) {
        this.setCurrentValue(this.$deepcopy(val))
      },
      'value.actionCodeList'(val) {
        this.currentValue.actionCodeList = val;
      },
      'currentValue.appId'(val) {
        this.actionMap = ACTION_MAP[val];
        this.hiddenActionList = ACTION_HIDDEN[val];
      }
    },
    created() {
      this.currentAuthList = this.$deepcopy(this.authList);
      if (this.authList.children) {
        this.currentAuthList.children = this.authList.children.filter(_ => !tempHidden.includes(_.actionCode))
      }
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
        const relCodes = this.actionMap[action.actionCode];
        if (val) {
          this.$dfs(action.children, (item) => {
            this.currentValue.actionCodeList.push(item.actionCode)
          });
          if (relCodes) {
            if (relCodes instanceof Array) {
              this.currentValue.actionCodeList = this.currentValue.actionCodeList.concat(relCodes);
            } else {
              this.currentValue.actionCodeList.push(relCodes);
            }
          }
          if (parent) {
            this.currentValue.actionCodeList.push(parent.actionCode);
            const pRelCodes = this.actionMap[parent.actionCode];
            if (pRelCodes) {
              if (pRelCodes instanceof Array) {
                this.currentValue.actionCodeList = this.currentValue.actionCodeList.concat(pRelCodes);
              } else {
                this.currentValue.actionCodeList.push(pRelCodes);
              }
            }
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
          if (relCodes) {
            this.currentValue.actionCodeList = this.currentValue.actionCodeList.filter(_ => (relCodes instanceof Array ? !relCodes.includes(_) : relCodes !== _))
          }
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
