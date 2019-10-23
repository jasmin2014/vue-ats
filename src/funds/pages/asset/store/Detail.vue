<template>
  <asset :loan-customer="loanCustomer"
         :loan-application="loanApplication"
         :proof-materials="proofMaterials"
         :fee="fee"
         :mode="mode"
         show-report></asset>
</template>

<script>
  import Asset from '../../../../modules/assets/Asset.vue'
  import {
    getStoreDetail,
    getLoanRemark,
    getProofMaterialList,
    getPicDetail,
    getFeeList,
    getProtection
  } from '../../../api/assetMgt'
  import {
    getIndividualDetail,
    getEnterpriseDetail
  } from '../../../api/customer';

  export default {
    data() {
      return {
        mode: 'VIEW',
        id: this.$route.params.id,
        loanCustomer: {
          applicantPerson: {},
          propCarDTO: {},
          propHouseDTO: {},
          propDeviceDTO: {},
          propShopDTO: {},
          propElectronicCommerceDTO: {},
          propPublicReserveFunds: [],
          relationships: [],
          friendships: [],
          materials: []
        },
        loanApplication: {
          loanPartyKind: this.$enum.SUBJECT_PROP_PERSON,
          assetKind: '',
          projectName: '',
          repayWay: '',
          loanModel: '',
          repayModel: ''
        },
        proofMaterials: {
          pdfs: [],
          originals: [],
          mosaics: []
        },
        fee: {}
      }
    },
    mounted() {
      this.getData(this.id)
    },
    methods: {
      getData(id) {
        this.getLoanDetail(id);
        this.getFeeList(id);
      },
      getLoanDetail(loanId) {
        getStoreDetail(loanId).then(({ data }) => {
          if (data.code === 200) {
            this.loanApplication = data.body;
            if (data.body.planId) {
              this.getProtectionPlan(data.body.planId);
            }
            this.getRemarkList(loanId);
            this.getCustomerDetail(loanId, data.body.loanPartyKind);
          } else if (data.code === 204) {
            this.$message({
              message: '借贷申请不存在',
              type: 'error'
            });
            this.$router.go(-1)
          } else {
            this.$message({
              message: data.message,
              type: 'error'
            });
          }
        }, () => {});
      },
      getCustomerDetail(loanId, type) {
        let promise = {};
        switch (type) {
          case this.$enum.SUBJECT_PROP_PERSON:
            promise = getIndividualDetail(loanId);
            break;
          case this.$enum.SUBJECT_PROP_ORGANIZE:
            promise = getEnterpriseDetail(loanId);
            break;
        }
        promise.then(({ data }) => {
          if (data.code === 200) {
            this.loanCustomer = data.body;
            this.getMaterialList(loanId, type);
          } else {
            this.$message.error(data.message);
          }
        }).catch(() => {});
      },
      getMaterialList(loanId, type) {
        getProofMaterialList(loanId).then(({ data }) => {
          if (data.code === 200) {
            const materials = data.body && data.body.loanMaterials;
            if (materials) {
              // this.proofMaterials = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP] || [];
              let origins = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP] || [];

              switch (type) {
                case this.$enum.SUBJECT_PROP_PERSON:
                  if (materials[this.$enum.PROOF_MATERIAL_P_ID_CARD]) {
                    this.$set(this.loanCustomer, 'materials', materials[this.$enum.PROOF_MATERIAL_P_ID_CARD] || []);
                    origins = origins.concat(materials[this.$enum.PROOF_MATERIAL_P_ID_CARD]);
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
                  origins = origins.concat(list);
                  this.$set(this.loanCustomer, 'materials', list);
                  break;
              }

              if (this.loanCustomer.propCarDTO && materials[this.$enum.CUSTOMER_PROP_CAR]) {
                this.$set(this.loanCustomer.propCarDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_CAR] || []);
                origins = origins.concat(materials[this.$enum.CUSTOMER_PROP_CAR]);
              }

              if (this.loanCustomer.propHouseDTO && materials[this.$enum.CUSTOMER_PROP_HOUSE]) {
                this.$set(this.loanCustomer.propHouseDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_HOUSE] || []);
                origins = origins.concat(materials[this.$enum.CUSTOMER_PROP_HOUSE]);
              }

              if (this.loanCustomer.propDeviceDTO && materials[this.$enum.CUSTOMER_PROP_DEVICE]) {
                this.$set(this.loanCustomer.propDeviceDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_DEVICE] || []);
                origins = origins.concat(materials[this.$enum.CUSTOMER_PROP_DEVICE]);
              }

              if (this.loanCustomer.propShopDTO && materials[this.$enum.CUSTOMER_PROP_SHOP]) {
                this.$set(this.loanCustomer.propShopDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_SHOP] || []);
                origins = origins.concat(materials[this.$enum.CUSTOMER_PROP_SHOP]);
              }

              if (this.loanCustomer.propElectronicCommerceDTO && materials[this.$enum.CUSTOMER_PROP_ESHOP]) {
                this.$set(this.loanCustomer.propElectronicCommerceDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_ESHOP] || []);
                origins = origins.concat(materials[this.$enum.CUSTOMER_PROP_ESHOP]);
              }

              this.$set(this.proofMaterials, 'originals', origins);
              this.$set(this.proofMaterials, 'pdfs', materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF]);

              // 过滤历史马赛克图片
              let mosaic = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP_MOSAIC] || [];
              mosaic = mosaic.filter(file => origins.some(_ => _.mosaicId === file.id));
              this.$set(this.proofMaterials, 'mosaics', mosaic)
            }
          }
        }, () => {})
      },
      getRemarkList(loanId) {
        getLoanRemark(loanId).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.loanApplication, 'remarkList', data.body)
          }
        }, () => {});
      },
      getFeeList(loanId) {
        getFeeList(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$set(this.fee, 'allList', res.body);
          }
        }, () => {})
      },
      getProtectionPlan(planId) {
        getProtection(planId).then(({ data }) => {
          if (data.code === 200 && data.body) {
            const list = [];
            list.push(data.body);
            this.$store.commit('application/updateProtectionPlanList', list);
          }
        })
      }
    },
    components: {
      Asset
    }
  }
</script>
