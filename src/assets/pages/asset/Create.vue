<template>
  <div class="create">
    <asset :info="detail"
           :material="material"
           :fee="fee"
           :mode="mode"
           :error="error"
           :type="this.$enum.BUSINESS_ASSET"
           @save="handleSave"
           @select-customer="handleSelectCustomer"
           @customer-type-change="handleCustomerTypeChange"></asset>
    <!-- 选择客户弹出框 -->
    <el-dialog title="选择客户" width="1000px"
               :visible.sync="showDialog"
               @open="handleDialogOpen"
               @close="handleDialogClose">
      <customer-choose ref="choose"
                       :list="customerList"
                       :table="customerTable"
                       :total="customerPageTotal"
                       :type="customerType"
                       @search="handleSearchCustomer"
                       @confirm="handleConfirmCustomer"
                       @cancel="showDialog = false"></customer-choose>
    </el-dialog>
  </div>
</template>

<script>
  import Asset from '../../../modules/assets/Asset.vue'
  import CustomerChoose from '../../../modules/assets/Choose.vue'
  import {
    getIndividualCustomerList,
    getEnterpriseCustomerList,
    getIndividualDetail,
    getEnterpriseDetail,
    getCustomerBindCardList} from '../../api/customer'
  import {createLoan} from '../../api/asset'

  export default {
    data() {
      return {
        mode: 'CREATE',
        showDialog: false,
        detail: {
          loanPartyKind: this.$enum.SUBJECT_PROP_PERSON
        },
        material: null,
        fee: null,
        error: {},
        customerType: '',
        customerPageTotal: 0,
        customerList: [],
        customerTable: [],
        selectedCustomer: {},
        individualTable: [
          {
            label: '客户编号',
            prop: 'personNo'
          }, {
            label: '客户姓名',
            prop: 'customerName'
          }, {
            label: '证件号码',
            prop: 'customerIdent'
          }, {
            label: '手机号码',
            prop: 'mobile'
          }
        ],
        enterpriseTable: [
          {
            label: '客户编号',
            prop: 'partyNo'
          }, {
            label: '企业名称',
            prop: 'enterpriseName'
          }, {
            label: '统一社会信用代码',
            prop: 'uscCode'
          }, {
            label: '企业法人代表姓名',
            prop: 'realName'
          }
        ]
      }
    },
    mounted() {
      this.$set(this.detail, 'kind', this.$enum.LOAN_PROP_NEW)
    },
    methods: {
      handleSave(val) {
        createLoan(val).then(({ data }) => {
          if (data.code === 201) {
            const id = data.message;
            this.$router.replace({
              name: 'AssetApplyEdit',
              params: { id, from: 'create' }
            })
          } else {
            this.$message.error(data.message);
          }
        }).catch(({status, data}) => {
          if (status === 400 && data.type === 'object') {
            this.error = data.body
          }
        })
      },
      handleCustomerTypeChange(type) {
        this.$set(this.detail, 'cardList', []);
        this.$set(this.detail, 'loanParty', '');
        this.$set(this.detail, 'loanPartyName', '');
        this.$set(this.detail, 'loanIdent', '');
      },
      handleSelectCustomer(type) {
        if (!type) {
          this.$alert('请先选择主体性质', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return;
        }
        this.customerType = type;
        this.customerTable = type === this.$enum.SUBJECT_PROP_PERSON ? this.individualTable : this.enterpriseTable;
        this.showDialog = true
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.$refs.choose.handleSearch();
        })
      },
      handleDialogClose() {
        this.$refs.choose.clear();
        this.customerList = [];
        this.customerPageTotal = 0;
      },
      handleSearchCustomer(search) {
        this.getCustomerList(search).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.customerList = res.body.list;
            this.customerPageTotal = res.body.totalRecord;
          }
        }, () => {})
      },
      handleConfirmCustomer(customer) {
        this.showDialog = false;
        this.getCustomerDetail(customer.partyId).then(({data}) => {
          if (data.code === 200) {
            getCustomerBindCardList(customer.partyId).then(response => {
              const res = response.data;
              if (res.code === 200) {
                this.$set(this.detail, 'cardList', res.body);
                this.$set(this.detail, 'loanParty', customer.partyId);
                this.$set(this.detail, 'loanPartyName', customer.customerName || customer.enterpriseName);
                this.$set(this.detail, 'loanIdent', data.body.ident || data.body.uscCode); // 列表中有脱敏处理，此处用详情接口返回的
              }
            })
          }
        }, () => {});
      },
      getCustomerDetail(id) {
        if (this.customerType === this.$enum.SUBJECT_PROP_ORGANIZE) {
          return getEnterpriseDetail(id)
        } else {
          return getIndividualDetail(id)
        }
      },
      getCustomerList(search) {
        if (this.customerType === this.$enum.SUBJECT_PROP_ORGANIZE) {
          return getEnterpriseCustomerList(search)
        } else {
          return getIndividualCustomerList(search)
        }
      }
    },
    components: {
      Asset,
      CustomerChoose
    }
  }
</script>
