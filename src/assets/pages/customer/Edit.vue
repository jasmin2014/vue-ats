<template>
  <div class="customer-edit">
    <customer v-model="detail"
              :mode="mode"
              :type="type"
              :from="from"
              :error="error"
              :end="this.$enum.BUSINESS_ASSET"
              @save-base="handleSaveBase"
              @save-contact="handleSaveContact"
              @save-business="handleSaveBusiness"
              @save-legal="handleSaveLegal"
              @save-prop="handleSaveProp"
              @bind-card="handleBindCard"
              @delete-prop="handleDeleteProp"
              @save-proof="handleSaveProof"
              @delete-proof="handleDeleteProof"></customer>
  </div>
</template>

<script>
  import Customer from '../../../modules/customer/Customer.vue';
  import {
    getIndividualDetail,
    getEnterpriseDetail,
    getEnterpriseLegalDetail,
    getCustomerPropList,
    getCustomerEquipmentList,
    getCustomerShopList,
    getCustomerEshopList,
    getCustomerDebtList,
    getCustomerInsuranceList,
    getCustomerStockList,
    getCustomerOrgList,
    getCustomerRelList,
    getCustomerMaterialList,
    editIndividualCustomer,
    editEnterpriseCustomer,
    editCustomerContact,
    editCustomerBusiness,
    createCustomerLegal,
    editCustomerLegal,
    createCustomerProp,
    editCustomerProp,
    deleteCustomerProp,
    createCustomerEquipment,
    editCustomerEquipment,
    deleteCustomerEquipment,
    createCustomereShop,
    createCustomereEshop,
    editCustomerShop,
    editCustomerEshop,
    deleteCustomerShop,
    deleteCustomerEshop,
    bindCustomerCard,
    createCustomerStock,
    editCustomerStock,
    deleteCustomerStock,
    createCustomerDebt,
    editCustomerDebt,
    deleteCustomerDebt,
    createCustomerInsurance,
    editCustomerInsurance,
    deleteCustomerInsurance,
    createCustomerWork,
    editCustomerWork,
    deleteCustomerWork,
    createCustomerRelation,
    editCustomerRelation,
    deleteCustomerRelation,
    saveCustomerMaterialList,
    deleteCustomerMaterial
  } from '../../api/customer'

  export default {
    data() {
      return {
        mode: 'EDIT',
        detail: {},
        error: {},
        from: this.$route.params.from,
        id: this.$route.params.id,
        type: this.$route.query.type
      }
    },
    created() {
      this.getData(this.id);
    },
    methods: {
      handleSaveBase({ type, data }) {
        const id = this.id;
        if (type === this.$enum.SUBJECT_PROP_PERSON) {
          editIndividualCustomer(id, data).then(() => {
            this.$message({
              message: '基本信息保存成功',
              type: 'success'
            });
            this.detail.base = Object.assign(this.detail.base, data)
          }).catch((response) => {
            if (response.status === 400 && response.data.type === 'object') {
              this.error = Object.assign(this.error, response.data.body)
            }
          })
        } else if (type === this.$enum.SUBJECT_PROP_ORGANIZE) {
          editEnterpriseCustomer(id, data).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.detail.base = Object.assign(this.detail.base, data)
          }).catch((response) => {
            if (response.status === 400 && response.data.type === 'object') {
              this.error = Object.assign(this.error, response.data.body)
            }
          })
        }
      },
      handleSaveContact({ type, data }) {
        const id = this.id;
        if (type === this.$enum.SUBJECT_PROP_PERSON) {
          editCustomerContact(id, data).then(() => {
            this.$message({
              message: '联系方式保存成功',
              type: 'success'
            });
            this.detail.base = Object.assign(this.detail.base, data)
          }).catch((response) => {
            if (response.status === 400 && response.data.type === 'object') {
              this.error = Object.assign(this.error, response.data.body)
            }
          })
        }
      },
      handleSaveBusiness({ type, data }) {
        const id = this.id;
        if (type === this.$enum.SUBJECT_PROP_ORGANIZE) {
          editCustomerBusiness(id, data).then(() => {
            this.$message({
              message: '工商信息保存成功',
              type: 'success'
            });
            this.detail.business = Object.assign(this.detail.business, data)
          }).catch((response) => {
            if (response.status === 400 && response.data.type === 'object') {
              this.error = Object.assign(this.error, response.data.body)
            }
          })
        }
      },
      handleSaveLegal({ type, data }) {
        const id = this.id;
        if (type === this.$enum.SUBJECT_PROP_ORGANIZE) {
          let promise = {};
          if (data.relId) {
            promise = editCustomerLegal(id, data);
          } else {
            promise = createCustomerLegal(id, data)
          }
          promise.then(() => {
            this.$message({
              message: '法人信息保存成功',
              type: 'success'
            });
            this.getLegalParty(id);
          }).catch((response) => {
            if (response.status === 400 && response.data.type === 'object') {
              this.error = Object.assign(this.error, response.data.body)
            }
          })
        }
      },
      handleSaveProp({ type, data }) {
        const id = this.id;
        switch (type) {
          case 'bank':
          case 'car':
          case 'house':
          case 'public':
            if (data.propId) {
              editCustomerProp(type, id, data.propId, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getProps(id, type)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomerProp(type, id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getProps(id, type)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
          case 'equipment':
            if (data.propId) {
              editCustomerEquipment(id, data.propId, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getEquipments(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomerEquipment(id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getEquipments(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
          case 'shop':
            if (data.propId) {
              editCustomerShop(id, data.propId, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getShops(id)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomereShop(id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getShops(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
          case 'eshop':
            if (data.propId) {
              editCustomerEshop(id, data.propId, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getEshops(id)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomereEshop(id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getEshops(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
          case 'stock':
            if (data.propId) {
              editCustomerStock(id, data.propId, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getStocks(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomerStock(id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getStocks(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
          case 'debt':
            if (data.id) {
              editCustomerDebt(id, data.id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getDebts(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomerDebt(id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getDebts(id)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
          case 'insurance':
            if (data.propId) {
              editCustomerInsurance(id, data.propId, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getInsurances(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomerInsurance(id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getInsurances(id)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
          case 'org':
            if (data.workId) {
              editCustomerWork(id, data.workId, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getOrgs(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomerWork(id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getOrgs(id)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
          case 'family':
          case 'friend':
            if (data.relId) {
              editCustomerRelation(id, data.relId, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 200 && !res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getRels(id);
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            } else {
              createCustomerRelation(id, data).then((response) => {
                const res = response.data;
                const status = response.status;
                if (status === 201) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.getRels(id)
                } else {
                  this.$message.error(res.message)
                }
              }).catch(() => {})
            }
            break;
        }
      },
      handleBindCard(propId) {
        const id = this.id;
        bindCustomerCard(id, propId).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '认证成功',
              type: 'success'
            })
          } else {
            this.$message.error(data.message)
          }
          this.getProps(id, 'bank');
        }).catch(() => {
          this.getProps(id, 'bank');
        })
      },
      handleDeleteProp({ type, itemId }) {
        const id = this.id;
        switch (type) {
          case 'bank':
          case 'car':
          case 'house':
          case 'public':
            deleteCustomerProp(type, itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getProps(id, type);
              }
            }).catch(() => {});
            break;
          case 'equipment':
            deleteCustomerEquipment(itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getEquipments(id);
              }
            }).catch(() => {});
            break;
          case 'shop':
            deleteCustomerShop(itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getShops(id);
              }
            }).catch(() => {});
            break;
          case 'eshop':
            deleteCustomerEshop(itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getEshops(id);
              }
            }).catch(() => {});
            break;
          case 'stock':
            deleteCustomerStock(itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getStocks(id);
              }
            }).catch(() => {});
            break;
          case 'debt':
            deleteCustomerDebt(itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getDebts(id);
              }
            }).catch(() => {});
            break;
          case 'insurance':
            deleteCustomerInsurance(itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getInsurances(id);
              }
            }).catch(() => {});
            break;
          case 'org':
            deleteCustomerWork(itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getOrgs(id);
              }
            }).catch(() => {});
            break;
          case 'family':
          case 'friend':
            deleteCustomerRelation(id, itemId).then(({ status }) => {
              if (status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.getRels(id);
              }
            }).catch(() => {});
            break;
          default:
            break;
        }
      },
      handleSaveProof({ type, file }) {
        const id = this.id;
        saveCustomerMaterialList(id, file).then(({ status, data }) => {
          if (status === 201) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
          } else {
            this.$message.error(data.message)
          }
          this.getMaterials(id, type)
        }).catch(() => {
          this.getMaterials(id, type)
        })
      },
      handleDeleteProof({ type, proofId }) {
        const id = this.id;
        deleteCustomerMaterial(proofId).then(({ status }) => {
          if (status === 204) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getMaterials(id, type)
          }
        }, () => {
          this.getMaterials(id, type)
        })
      },

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
            this.$set(this.detail, 'legal', data.body || {})
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
