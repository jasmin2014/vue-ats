<template>
  <customer v-model="detail"
            :customer="customer"
            :props="props"
            :type="type"
            :dialog="dialog"
            :page-size="params.pageSize"
            :page-number="params.pageNumber"
            :total-record="pageTotal"
            encode
            @loan-change="handleLoanChange"
            @stat="handleStat"
            @stat-close="handleStatClose"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentChange"></customer>
</template>

<script>
  import Customer from '../../../modules/customer/Customer.vue'
  import {
    getCustomerLoanList,
    getPerson,
    getOrg,
    getIndividualDetail,
    getEnterpriseDetail,
    getLoanStat
  } from '../../api/customer'
  import {
    getProofMaterialList
  } from '../../api/asset'

  export default {
    data() {
      return {
        mode: 'VIEW',
        detail: {},
        customer: {},
        props: {},
        loanPartyId: this.$route.params.id, // unique
        customerNo: this.$route.query.id, // 客户编号
        type: this.$route.query.type,
        params: {
          assetOrg: this.$route.query.org,
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        dialog: {
          visible: false,
          list: null
        }
      }
    },
    created() {
      this.getCustomerBase(this.customerNo);
    },
    methods: {
      handleLoanChange(loanId) {
        if (loanId) {
          this.getLoanCustomerDetail(loanId);
        } else {
          this.customer = {};
        }
      },
      handleStat({ assetOrgId, partyId }) {
        getLoanStat(assetOrgId, partyId).then(({ data }) => {
          if (data.code === 200) {
            this.dialog.list = data.body;
            this.dialog.visible = true;
          } else {
            this.$message.error(data.message);
          }
        }).catch(() => {});
      },
      handleStatClose() {
        this.dialog.list = null;
      },
      handleCurrentChange(index) {
        this.getCustomerLoanList(index, this.loanPartyId);
      },
      handlePageSizeChange(pageSize) {
        this.params.pageSize = pageSize;
        this.getCustomerLoanList(this.params.pageNumber, this.loanPartyId)
      },

      getCustomerLoanList(index, id) {
        const search = this.$deepcopy(this.params);
        search.pageNumber = index;
        getCustomerLoanList(id, search).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'loanList', data.body.list);
            this.params.pageNumber = index;
            this.pageTotal = data.body.totalRecord;
          } else {
            this.$set(this.detail, 'loanList', []);
            this.pageTotal = 0;
          }
        }).catch((e) => {
          this.$set(this.detail, 'loanList', []);
          this.pageTotal = 0;
        })
      },
      getCustomerBase(id) {
        let promise = {};
        if (this.type === this.$enum.SUBJECT_PROP_PERSON) {
          promise = getPerson(id)
        } else if (this.type === this.$enum.SUBJECT_PROP_ORGANIZE) {
          promise = getOrg(id)
        }

        promise.then(({ data }) => {
          if (data.code === 200) {
            this.detail = data.body;
            this.getCustomerLoanList(1, this.loanPartyId);
          }
        })
      },
      getLoanCustomerDetail(loanId) {
        let promise = {};
        switch (this.type) {
          case this.$enum.SUBJECT_PROP_PERSON:
            promise = getIndividualDetail(loanId);
            break;
          case this.$enum.SUBJECT_PROP_ORGANIZE:
            promise = getEnterpriseDetail(loanId);
            break;
        }
        promise.then(({ data }) => {
          if (data.code === 200) {
            if (data.body) {
              this.customer = data.body;
              this.$set(this.props, 'propCarDTO', data.body.propCarDTO);
              this.$set(this.props, 'propHouseDTO', data.body.propHouseDTO);
              this.$set(this.props, 'propDeviceDTO', data.body.propDeviceDTO);
              this.$set(this.props, 'propShopDTO', data.body.propShopDTO);
              this.$set(this.props, 'propElectronicCommerceDTO', data.body.propElectronicCommerceDTO);
              this.$set(this.props, 'propPublicReserveFunds', data.body.propPublicReserveFunds);
              this.getMaterialList(loanId, this.type);
            }
          } else {
            this.$message.error(data.message);
          }
        }).catch((e) => {
          console.error(e)
        });
      },
      getMaterialList(loanId, type) {
        getProofMaterialList(loanId).then(({ data }) => {
          if (data.code === 200) {
            const materials = data.body && data.body.loanMaterials;
            if (materials) {
              switch (type) {
                case this.$enum.SUBJECT_PROP_PERSON:
                  if (materials[this.$enum.PROOF_MATERIAL_P_ID_CARD]) {
                    this.$set(this.customer, 'materials', materials[this.$enum.PROOF_MATERIAL_P_ID_CARD] || []);
                  }
                  break;
                case this.$enum.SUBJECT_PROP_ORGANIZE:
                  let list = [];
                  if (materials[this.$enum.PROOF_MATERIAL_O_LICENSE]) {
                    list = list.concat(materials[this.$enum.PROOF_MATERIAL_O_LICENSE])
                  }
                  if (materials[this.$enum.PROOF_MATERIAL_O_OTHER]) {
                    list = list.concat(materials[this.$enum.PROOF_MATERIAL_O_OTHER])
                  }
                  this.$set(this.customer, 'materials', list);
                  break;
              }

              if (this.props.propCarDTO && materials[this.$enum.CUSTOMER_PROP_CAR]) {
                this.$set(this.props.propCarDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_CAR] || []);
              }

              if (this.props.propHouseDTO && materials[this.$enum.CUSTOMER_PROP_HOUSE]) {
                this.$set(this.props.propHouseDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_HOUSE] || []);
              }

              if (this.props.propDeviceDTO && materials[this.$enum.CUSTOMER_PROP_DEVICE]) {
                this.$set(this.props.propDeviceDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_DEVICE] || []);
              }

              if (this.props.propShopDTO && materials[this.$enum.CUSTOMER_PROP_SHOP]) {
                this.$set(this.props.propShopDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_SHOP] || []);
              }

              if (this.props.propElectronicCommerceDTO && materials[this.$enum.CUSTOMER_PROP_ESHOP]) {
                this.$set(this.props.propElectronicCommerceDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_ESHOP] || []);
              }
            }
          }
        }, () => {})
      }
    },
    components: {
      Customer
    }
  }
</script>
