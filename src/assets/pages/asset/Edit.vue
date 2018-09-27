<template>
  <asset :info="detail"
         :material="material"
         :fee="fee"
         :mode="mode"
         :error="error"
         :type="this.$enum.BUSINESS_ASSET"
         @save="handleSave"
         @save-protection="handleSaveProtection"
         @delete-protection="handleDeleteProtection"
         @fee-edit="handleFeeEdit"
         @fee-create="handleFeeCreate"
         @fee-delete="handleFeeDelete"
         @material-upload="handleMaterialUpload"
         @material-remove="handleMaterialRemove"></asset>
</template>

<script>
  import Asset from '../../../modules/assets/Asset.vue'
  import {
    getLoanApplication,
    getLoanRemark,
    getProofMaterialList,
    getFeeList,
    editLoan,
    createProtectionPlan,
    editProtectionPlan,
    deleteProtectionPlan,
    createFee,
    editFee,
    deleteFee,
    uploadProofMaterial,
    removeProofMaterial
  } from '../../api/asset'
  import {getCustomerBindCardList} from '../../api/customer'
  import {getProtectionPlanByLoanId} from '../../../api/enum'

  export default {
    data() {
      return {
        mode: 'EDIT',
        id: this.$route.params.id,
        detail: {},
        material: [],
        fee: {},
        error: {}
      }
    },
    mounted() {
      if (this.$route.params && this.$route.params.from === 'create') {
        this.$alert('您可以继续添加「保障方案」、「证明材料」和「收费信息」', '提示', {
          type: 'warning'
        })
      }
      this.getData(this.id)
    },
    methods: {
      handleSave(val, isBack) {
        const id = val.id;
        delete val.id;
        editLoan(id, val).then(({status, data}) => {
          if (status === 200) {
            setTimeout(() => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              if (isBack) {
                this.$router.go(-1)
              }
            }, 1000)
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
            } else {
              this.$router.go(-1);
            }
          }
        })
      },
      handleSaveProtection(val) {
        if (val.id) {
          editProtectionPlan(this.id, val.id, val).then(({status}) => {
            if (status === 200) {
              this.getProtectionPlanByLoanId(this.id)
            }
          }, () => {})
        } else {
          createProtectionPlan(this.id, val).then(({status}) => {
            if (status === 201) {
              this.getProtectionPlanByLoanId(this.id)
            }
          }, () => {})
        }
      },
      handleDeleteProtection(id) {
        deleteProtectionPlan(id).then(({status}) => {
          if (status === 204) {
            this.getProtectionPlanByLoanId(this.id)
          }
        }, () => {})
      },
      handleMaterialUpload(file) {
        uploadProofMaterial(this.id, file).then(({status, data}) => {
          if (status === 201) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
          } else {
            this.$message.error(data.message)
          }
          this.getMaterialList(this.id);
        }, () => {
          this.getMaterialList(this.id);
        })
      },
      handleMaterialRemove(file) {
        if (!file.id) return;
        removeProofMaterial(file.id).then(({status, data}) => {
          if (status === 204) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.getMaterialList(this.id);
            this.$message.error(data.message)
          }
        }, () => {
          this.getMaterialList(this.id);
        })
      },
      handleFeeEdit(val) {
        val.loanApplication = this.id;
        editFee(val.id, val).then(() => {
          this.$message({
            message: '收费信息保存成功',
            type: 'success'
          });
          this.getFeeList(this.id, val.phase)
        })
      },
      handleFeeCreate(val) {
        val.loanApplication = this.id;
        createFee(val).then(({status}) => {
          if (status === 201) {
            this.$message({
              message: '收费信息保存成功',
              type: 'success'
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
              this.$message({
                message: '收费信息删除成功',
                type: 'success'
              });
              this.getFeeList(this.id, phase)
            }
          })
        }).catch(() => {})
      },
      getData(id) {
        this.getLoanDetail(id);
        this.getFeeList(id);
        this.getMaterialList(id);
      },
      getLoanDetail(loanId) {
        getLoanApplication(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.detail = res.body;
            this.$set(this.fee, 'loanAmount', res.body.loanAmount);
            getLoanRemark(loanId).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'remarkList', data.body)
              }
            }, () => {});
            getCustomerBindCardList(res.body.loanParty).then(({data}) => {
              if (data.code === 200) {
                this.$set(this.detail, 'cardList', data.body);
                if (res.body.loanCard && !data.body.some(_ => _.bankCard === res.body.loanCard)) {
                  this.$set(this.detail, 'cardBank', null);
                  this.$set(this.detail, 'loanCard', null);
                  this.$set(this.detail, 'loanMobile', null);
                  this.$set(this.detail, 'openBank', null);
                }
              }
            }, () => {});
            this.getProtectionPlanByLoanId(loanId);
          } else if (res.code === 204) {
            this.$message({
              message: '借贷申请不存在',
              type: 'error'
            });
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
        }, () => {});
      },
      getProtectionPlanByLoanId(loanId) {
        getProtectionPlanByLoanId(loanId).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.detail, 'protectionList', data.body)
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
      getMaterialList(loanId) {
        getProofMaterialList(loanId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.material = res.body;
          }
        }, () => {})
      }
    },
    components: {
      Asset
    }
  }
</script>
