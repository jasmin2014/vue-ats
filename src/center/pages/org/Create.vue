<!-- 创建机构 -->
<template>
  <div class="create">
    <org v-model="detail"
         :mode="mode"
         :business="this.$enum.BUSINESS_CENTER"
         :error="error"
         @select-org="handleSelectOrg"
         @save="handleSave"
         @org-name-change="handleOrgNameChange"></org>
    <!-- 选择企业弹出框 -->
    <!--<el-dialog title="选择企业" :visible.sync="showDialog">-->
    <!--<org-choose :list="orgList"-->
    <!--@search="handleSearchOrg"-->
    <!--@confirm-org="handleConfirmOrg">-->
    <!--</org-choose>-->
    <!--</el-dialog>-->
  </div>
</template>
<script>
  import Org from '../../../modules/org/Org.vue'
  // import OrgChoose from '../../../modules/org/Choose.vue'
  import { createOrg } from '../../api/org'
  import { getOrgDetailByName } from '../../../api/common'

  export default {
    data() {
      return {
        mode: 'CREATE',
        showDialog: false,
        detail: {
          businessType: 0
        },
        error: {},
        hasSynced: false,
        orgName: ''
      }
    },
    methods: {
      handleSelectOrg() {
        this.showDialog = true
      },
      handleOrgNameChange(orgName) {
        if (this.orgName !== orgName) {
          this.hasSynced = false;
        }
        this.orgName = orgName;
        if (!orgName || this.hasSynced) return;
        getOrgDetailByName(orgName).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.hasSynced = true;
            this.$message({
              type: 'success',
              message: '获取企业数据!'
            });
            this.detail = Object.assign(this.$deepcopy(this.detail), {
              usciCode: res.body
            });
          }
          this.hasSynced = true;
        })
      },
      handleSave(data) {
        console.log(data);
        this.createOrg(data);
      },
      // handleSearchOrg(keyword) {
      // },
      // handleConfirmOrg(id) {
      //   this.getData(id);
      //   this.showDialog = false;
      // },
      createOrg(val) {
        createOrg(val).then(response => {
          const res = response.data;
          if (res.code === 201) {
            this.$message({
              type: 'success',
              message: '新增成功!'
            });
            this.$router.go(-1);
          }
        }).catch(({ status, data }) => {
          if (status === 400 && data.type === 'object') {
            this.error = data.body
          }
        })
      }
    },
    components: {
      // OrgChoose,
      Org
    }
  }
</script>
