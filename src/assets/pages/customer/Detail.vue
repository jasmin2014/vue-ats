<template>
  <customer v-model="detail"
            :mode="mode"
            :type="type"
            :end="this.$enum.BUSINESS_ASSET"></customer>
</template>

<script>
  import Customer from '../../../modules/customer/Customer.vue'
  import {
    getIndividualDetail,
    getEnterpriseDetail,
    getEnterpriseLegalDetail,
    getCustomerPropList,
    getCustomerEquipmentList,
    getCustomerShopList,
    getCustomerEshopList,
    getCustomerInsuranceList,
    getCustomerStockList,
    getCustomerDebtList,
    getCustomerOrgList,
    getCustomerRelList,
    getCustomerMaterialList
  } from '../../api/customer'

  export default {
    data() {
      return {
        mode: 'VIEW',
        detail: {},
        id: this.$route.params.id,
        type: this.$route.query.type
      }
    },
    created() {
      this.getData(this.id);
    },
    methods: {
      getData(id) {
        this.getCustomer(id).then(({ type, data }) => {
          if (type === this.$enum.SUBJECT_PROP_PERSON) {
            this.$set(this.detail, 'personNo', data.personNo);
            this.$set(this.detail, 'base', data);
            if (data.partyId) {
              this.getProps(id);
              this.getShops(id);
              this.getEshops(id);
              this.getDebts(id);
              this.getInsurances(id);
              this.getOrgs(id);
              this.getRels(id);
              this.getMaterials(id, type)
            }
          } else {
            this.$set(this.detail, 'partyNo', data.partyNo);
            this.$set(this.detail, 'base', data);
            if (data.partyId) {
              this.$set(this.detail, 'business', data);
              this.getLegalParty(id);
              this.getProps(id);
              this.getEquipments(id);
              this.getShops(id);
              this.getEshops(id);
              this.getStocks(id);
              this.getDebts(id);
              this.getMaterials(id, type)
            }
          }
        }, () => {})
      },
      getCustomer(id) {
        const type = this.type;
        if (type === this.$enum.SUBJECT_PROP_PERSON) {
          return new Promise((resolve) => {
            getIndividualDetail(id).then(({ data }) => {
              if (data.code === 200) {
                resolve({
                  type,
                  data: data.body
                });
              }
            }, () => {})
          })
        } else if (type === this.$enum.SUBJECT_PROP_ORGANIZE) {
          return new Promise((resolve) => {
            getEnterpriseDetail(id).then(({ data }) => {
              if (data.code === 200) {
                resolve({
                  type,
                  data: data.body
                });
              }
            }, () => {})
          })
        }
      },
      getLegalParty(partyId) {
        getEnterpriseLegalDetail(partyId).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'legal', data.body)
          }
        }, () => {})
      },
      getProps(id, type) {
        const typeMap = {
          bank: 'B',
          car: 'C',
          house: 'H',
          'public': 'G'
        };
        getCustomerPropList(id, type ? typeMap[type] : 'B,C,H,G').then(({ data }) => {
          if (data.code === 200) {
            if (type) {
              this.$set(this.detail, `${type}List`, data.body)
            } else {
              const props = data.body.reduce((result, item) => {
                result[item.propType].push(item);
                return result
              }, { CAR: [], BANK_CARD: [], HOUSE_ESTATE: [], PUBLIC_RESERVE_FUNDS: [] });
              this.$set(this.detail, 'bankList', props.BANK_CARD);
              this.$set(this.detail, 'houseList', props.HOUSE_ESTATE);
              if (this.type === this.$enum.SUBJECT_PROP_PERSON) {
                this.$set(this.detail, 'carList', props.CAR);
                this.$set(this.detail, 'publicList', props.PUBLIC_RESERVE_FUNDS);
              }
            }
          }
        }, () => {})
      },
      getEquipments(id) {
        getCustomerEquipmentList(id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'equipmentList', data.body);
          }
        }, () => {})
      },
      getShops(id) {
        getCustomerShopList(id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'shopList', data.body)
          }
        }, () => {})
      },
      getEshops(id) {
        getCustomerEshopList(id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'eshopList', data.body)
          }
        }, () => {})
      },
      getStocks(id) {
        getCustomerStockList(id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'stockList', data.body);
          }
        }, () => {})
      },
      getDebts(id) {
        getCustomerDebtList(id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'debtList', data.body)
          }
        }, () => {})
      },
      getInsurances(id) {
        getCustomerInsuranceList(id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'insuranceList', data.body)
          }
        }, () => {})
      },
      getOrgs(id) {
        getCustomerOrgList(id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'orgList', data.body)
          }
        }, () => {})
      },
      getRels(id) {
        getCustomerRelList(id).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'familyList', data.body.families || []);
            this.$set(this.detail, 'friendList', data.body.friends || []);
          }
        }, () => {})
      },
      getMaterials(id, type) {
        let kinds = [];
        if (type === this.$enum.SUBJECT_PROP_PERSON) {
          kinds = kinds.concat([this.$enum.PROOF_MATERIAL_P_ID_CARD, this.$enum.PROOF_MATERIAL_P_ID_CARD_BACK])
        } else {
          kinds = kinds.concat([this.$enum.PROOF_MATERIAL_O_LICENSE, this.$enum.PROOF_MATERIAL_O_OTHER])
        }
        getCustomerMaterialList(id, kinds).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'materialList', data.body)
          }
        }, () => {})
      }
    },
    components: {
      Customer
    }
  }
</script>
