<template>
  <customer ref="customer"
            v-model="detail"
            :mode="mode"
            :type.sync="type"
            :end="this.$enum.BUSINESS_ASSET"
            :error="error"
            @org-name-blur="handleOrgNameBlur"
            @save-base="handleSave"></customer>
</template>

<script>
  import Customer from '../../../modules/customer/Customer.vue'
  import {createIndividualCustomer, createEnterpriseCustomer} from '../../api/customer';
  import {getOrgDetailByName} from '../../../api/common';

  export default {
    data() {
      return {
        detail: {},
        mode: 'CREATE',
        type: this.$route.query.type,
        error: {},
        orgName: '',
        hasSynced: false
      }
    },
    watch: {
      type(val, oldVal) {
        if (val !== oldVal) {
          this.$router.replace({
            name: 'CustomerCreate',
            query: { type: val }
          });
        }
      }
    },
    methods: {
      handleOrgNameBlur(orgName) {
        if (this.orgName !== orgName) {
          this.hasSynced = false;
        }
        this.orgName = orgName;
        if (!orgName || this.hasSynced) return;
        getOrgDetailByName(orgName).then(({ data }) => {
          if (data.code === 200 && data.body) {
            this.hasSynced = true;
            this.$message({
              type: 'success',
              message: '获取企业数据成功'
            });
            this.$refs['customer'].setUscCode(data.body);
          }
          this.hasSynced = true;
        }).catch(() => {});
      },
      handleSave({ type, data }) {
        if (type === this.$enum.SUBJECT_PROP_PERSON) {
          this.saveIndividualCustomer(data)
        } else if (type === this.$enum.SUBJECT_PROP_ORGANIZE) {
          this.saveEnterpriseCustomer(data);
        }
      },
      saveIndividualCustomer(val) {
        this.error = {};
        createIndividualCustomer(val).then(({ status, data }) => {
          if (status === 201) {
            this.$message({
              message: '创建成功',
              type: 'success'
            });
          }
          this.$router.replace({
            name: 'CustomerEdit',
            params: { id: data.body.partyId, from: 'create' },
            query: { type: this.type }
          });
        }).catch(({ status, data }) => {
          if (status === 400 && data.type === 'object') {
            this.error = data.body
          }
        })
      },
      saveEnterpriseCustomer(val) {
        this.error = {};
        createEnterpriseCustomer(val).then(({ status, data }) => {
          if (status === 201) {
            this.$message({
              message: '创建成功',
              type: 'success'
            });
            this.$router.replace({
              name: 'CustomerEdit',
              params: { id: data.body.partyId, from: 'create' },
              query: { type: this.type }
            });
          }
        }).catch(({ status, data }) => {
          if (status === 400 && data.type === 'object') {
            this.error = data.body
          }
        })
      }
    },
    components: {
      Customer
    }
  }
</script>
