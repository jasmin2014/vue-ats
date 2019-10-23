<template>
  <asset :loan-customer="loanCustomer"
         :loan-application="loanApplication"
         :proof-materials="proofMaterials"
         :fee="fee"
         :mode="mode"
         :error="error"
         @save="handleSave"
         @fee-edit="handleFeeEdit"
         @fee-create="handleFeeCreate"
         @fee-delete="handleFeeDelete"></asset>
</template>

<script>
  import Asset from '../../../modules/assets/Asset.vue'
  import {
    getLoanApplication,
    getLoanRemark,
    getProofMaterialList,
    getFeeList,
    editLoan,
    createFee,
    editFee,
    deleteFee,
    batchUploadMaterial,
    batchDeleteMaterial,
    batchDeletePdfMaterial,
    getProjectNameOptions,
    getServiceFeeRateByIntentionFund,
    getProtectionPlanListByModel
  } from '../../api/asset'
  import {
    getIndividualDetail,
    getEnterpriseDetail,
    editIndividualCustomer,
    editEnterpriseCustomer
  } from '../../api/customer';
  import { getCollectionCardList } from '../../api/finance';
  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        mode: 'EDIT',
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
          materials: [],
          fee: {}
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
          originals: [],
          pdfs: []
        },
        fee: {},
        error: {}
      }
    },
    computed: {
      ...mapState({
        intentionFund: state => state.application.intentionFund,
        projectType: state => state.application.projectType,
        protectionModel: state => state.application.protectionModel,
        assetOrg: state => state.user.orgId
      }),
      deletedMaterials: {
        get() {
          return this.$store.state.material.deleted.filter(_ => _.kind !== this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF).map(_ => _.id);
        }
      },
      deletedPdfMaterials: {
        get() {
          return this.$store.state.material.deleted.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF).map(_ => _.id);
        }
      },
      addedMaterials: {
        get() {
          return this.$store.state.material.added.map(_ => ({
            fileName: _.fileName,
            fileType: _.fileType,
            fileUri: _.fileUri,
            kind: _.kind
          }))
        }
      }
    },
    watch: {
      intentionFund(val, oldVal) {
        if (val !== oldVal) {
          this.getCollectionCardList(val);
          this.getProtectionPlanList(this.protectionModel, val);

          if (oldVal !== undefined) {
            this.getServiceFeeRate(this.projectType, val, this.loanApplication.kind);
          }
        }
      },
      projectType(val, oldVal) {
        if (val !== oldVal) {
          if (oldVal !== undefined) {
            this.getServiceFeeRate(val, this.intentionFund, this.loanApplication.kind);
          }
        }
      },
      protectionModel(val, oldVal) {
        if (val !== oldVal) {
          this.getProtectionPlanList(val, this.intentionFund);
        }
      }
    },

    mounted() {
      this.$store.commit('material/reset');
      if (this.$route.params && this.$route.params.from === 'create') {
        this.$alert('您可以继续添加「收费信息」', '提示', {
          type: 'warning'
        })
      }
      this.getData(this.id)
    },
    destroyed() {
      this.$store.commit('material/reset');
    },

    methods: {
      handleSave(val) {
        const type = val.loanApplication.loanPartyKind;
        const customer = type === this.$enum.SUBJECT_PROP_PERSON ? val.loanPersonCustomer : val.loanOrgCustomer;

        // 同时修改申请信息中冗余的省市字段
        val.loanApplication.loanPartyProvince = type === this.$enum.SUBJECT_PROP_PERSON ? customer.province : customer.businessProvince;
        val.loanApplication.loanPartyCity = type === this.$enum.SUBJECT_PROP_PERSON ? customer.city : customer.businessCity;

        this.editLoanApp(val.loanApplication.id, val.loanApplication, () => {
          // this.$notify({
          //   title: '申请信息保存成功',
          //   type: 'success',
          //   duration: 6000
          // });

          this.editCustomer(type, this.id, customer, () => {
            // this.$notify({
            //   title: '客户信息保存成功',
            //   type: 'success',
            //   duration: 6000
            // });
            // this.$nextTick(() => {
            //   this.$notify({
            //     title: '资产信息保存成功',
            //     type: 'success',
            //     duration: 6000
            //   });
            // });

            this.editMaterials(this.id, this.deletedMaterials, this.deletedPdfMaterials, this.addedMaterials, () => {
              this.$store.commit('material/reset');
              this.$nextTick(() => {
                this.$notify({
                  title: '保存成功',
                  type: 'success',
                  duration: 6000
                });
              });
              this.$router.go(-1);
            });
          });
        });
      },
      handleFeeEdit(val) {
        val.loanApplication = this.id;
        editFee(val.id, val).then(() => {
          this.$notify({
            title: '收费信息保存成功',
            type: 'success',
            duration: 6000
          });
          this.getFeeList(this.id, val.phase)
        })
      },
      handleFeeCreate(val) {
        val.loanApplication = this.id;
        createFee(val).then(({status}) => {
          if (status === 201) {
            this.$notify({
              title: '收费信息创建成功',
              type: 'success',
              duration: 6000
            });
            this.getFeeList(this.id, val.phase)
          }
        })
      },
      handleFeeDelete(val, phase) {
        this.$confirm('确定删除收费信息?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteFee(val).then(({status}) => {
            if (status === 204) {
              this.$notify({
                title: '收费信息删除成功',
                type: 'success',
                duration: 6000
              });
              this.getFeeList(this.id, phase)
            }
          })
        }).catch(() => {})
      },

      editLoanApp(id, val, cbOk) {
        editLoan(id, val).then(({status, data}) => {
          if (status === 200) {
            cbOk && cbOk();
          } else {
            this.$message({
              message: data.detail,
              type: 'error'
            })
          }
        }).catch(({status, data}) => {
          if (status === 400) {
            if (data.type === 'object') {
              this.error = data.body
            }
          }
        })
      },
      editCustomer(type, loanId, val, cbOk) {
        let promise = {};
        if (type === this.$enum.SUBJECT_PROP_PERSON) {
          promise = editIndividualCustomer(loanId, val)
        } else if (type === this.$enum.SUBJECT_PROP_ORGANIZE) {
          promise = editEnterpriseCustomer(loanId, val)
        }
        promise.then(({ status }) => {
          if (status === 201) {
            cbOk && cbOk();
          }
        }).catch(() => {});
      },
      editMaterials(loanId, deleteList, deletePdfList, uploadList, cbOk) {
        this.deleteMaterials(deleteList).then(() => {
          this.deleteMaterials(deletePdfList, true).then(() => {
            this.uploadMaterials(loanId, uploadList).then(() => {
              cbOk && cbOk();
            }).catch((msg) => {});
          }).catch((msg) => {})
        }).catch((msg) => {})
      },
      deleteMaterials(idList, isPdf = false) {
        return new Promise((resolve, reject) => {
          if (idList.length > 0) {
            let promise = {};
            if (isPdf) {
              promise = batchDeletePdfMaterial(idList);
            } else {
              promise = batchDeleteMaterial(idList);
            }
            promise.then(() => {
              resolve();
            }).catch(() => {
              reject('删除证件照片错误')
            })
          } else {
            resolve();
          }
        })
      },
      uploadMaterials(loanId, materials) {
        return new Promise((resolve, reject) => {
          if (materials.length > 0) {
            batchUploadMaterial(loanId, materials).then(() => {
              resolve();
            }).catch(() => {
              reject('上传证件照片错误')
            })
          } else {
            resolve();
          }
        })
      },

      getData(id) {
        this.getLoanDetail(id);
        this.getFeeList(id);
      },
      getLoanDetail(loanId) {
        getLoanApplication(loanId).then(({ data }) => {
          if (data.code === 200) {
            if (!data.body.fundProfitRateService) {
              this.getServiceFeeRate(data.body.projectType, data.body.intentionFund, data.body.kind, true).then(fee => {
                data.body.fundProfitRateService = fee;
                this.loanApplication = data.body;
              }).catch(() => {
                this.loanApplication = data.body;
              });
            } else {
              this.loanApplication = data.body;
            }

            this.$set(this.fee, 'loanAmount', data.body.loanAmount);
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
              this.proofMaterials.originals = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP] || [];
              this.proofMaterials.pdfs = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF] || [];

              switch (type) {
                case this.$enum.SUBJECT_PROP_PERSON:
                  if (materials[this.$enum.PROOF_MATERIAL_P_ID_CARD]) {
                    this.$set(this.loanCustomer, 'materials', materials[this.$enum.PROOF_MATERIAL_P_ID_CARD] || []);
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
                  this.$set(this.loanCustomer, 'materials', list);
                  break;
              }

              if (this.loanCustomer.propCarDTO && materials[this.$enum.CUSTOMER_PROP_CAR]) {
                this.$set(this.loanCustomer.propCarDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_CAR] || []);
              }

              if (this.loanCustomer.propHouseDTO && materials[this.$enum.CUSTOMER_PROP_HOUSE]) {
                this.$set(this.loanCustomer.propHouseDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_HOUSE] || []);
              }

              if (this.loanCustomer.propDeviceDTO && materials[this.$enum.CUSTOMER_PROP_DEVICE]) {
                this.$set(this.loanCustomer.propDeviceDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_DEVICE] || []);
              }

              if (this.loanCustomer.propShopDTO && materials[this.$enum.CUSTOMER_PROP_SHOP]) {
                this.$set(this.loanCustomer.propShopDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_SHOP] || []);
              }

              if (this.loanCustomer.propElectronicCommerceDTO && materials[this.$enum.CUSTOMER_PROP_ESHOP]) {
                this.$set(this.loanCustomer.propElectronicCommerceDTO, 'materials', materials[this.$enum.CUSTOMER_PROP_ESHOP] || []);
              }
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

      getCollectionCardList(intentionFund) {
        if (!intentionFund) {
          this.$store.commit('application/updateCollectionCardList', []);
          return;
        }
        getCollectionCardList(intentionFund, this.$enum.BANK_USE_TYPE_COLLECTION).then(({ data }) => {
          if (data.code === 200 && data.body) {
            const list = data.body.map(_ => ({
              text: `${_.bankCard}（${_.name}）`,
              value: _.bankCard,
              extraData: {
                collectionAccount: _.name,
                collectionAccountId: _.bankUserId
              }
            }));
            this.$store.commit('application/updateCollectionCardList', list)
          }
        })
      },
      getServiceFeeRate(projectType, intentionFund, loanProp, init = false) {
        return new Promise((resolve, reject) => {
          if (!projectType || !intentionFund) {
            if (init) {
              reject();
            } else {
              this.$store.commit('application/updateServiceFeeRate', undefined);
            }
            return;
          }
          getServiceFeeRateByIntentionFund({
            assetOrg: this.assetOrg,
            loanProp,
            projectType,
            ownerOrg: intentionFund
          }).then(({ data }) => {
            if (data.code === 200) {
              if (init) {
                resolve(data.body);
              } else {
                this.$store.commit('application/updateServiceFeeRate', data.body)
              }
            } else {
              reject();
            }
          }).catch(() => {
            reject();
          })
        })
      },
      getProtectionPlanList(protectionModel, fundOrg) {
        if (!protectionModel || !fundOrg) {
          this.$store.commit('application/updateProtectionPlanList', []);
          return;
        }
        getProtectionPlanListByModel({
          protectionModel,
          fundOrg
        }).then(({ data }) => {
          if (data.code === 200) {
            this.$store.commit('application/updateProtectionPlanList', data.body || [])
          }
        })
      }
    },
    components: {
      Asset
    }
  }
</script>
