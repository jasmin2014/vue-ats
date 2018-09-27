<template>
  <asset :customer="detail.customer"
         :apply="detail.apply"
         :mode="mode"
         :business="business"
         @save="handleSave"></asset>
</template>

<script>
  import Asset from '../../../modules/chain/Asset'
  import {getLoanApplication, editLoanApplication} from '../../api/asset';

  export default {
    data() {
      return {
        mode: 'EDIT',
        business: this.$enum.BUSINESS_ASSET,
        id: this.$route.params.id,
        detail: {}
      }
    },
    mounted() {
      this.getDetail();
    },
    methods: {
      handleSave({ customer, apply }) {
        const data = {
          partyPersonBaseDTO: customer.partyPersonBaseDTO,
          propBankDTOList: customer.propBankDTOList,
          propHouseDTOList: customer.propHouseDTOList,
          propCarDTOList: customer.propCarDTOList,
          personDebtInformationDTOList: customer.personDebtInformationDTOList,
          propPublicReserveFundsDTOList: customer.propPublicReserveFundsDTOList,
          partyPersonWorkHisDTOList: customer.partyPersonWorkHisDTOList,
          additionalPersonDTOList: customer.familyList.concat(customer.friendList),
          identPhoto: {
            identPositive: customer.materialList[0].fileUri,
            identOpposite: customer.materialList[1].fileUri
          },
          loanBankCard: Object.assign({
            authState: '2'
          }, customer.propBankDTOList[0]),
          loanApplicationDTO: apply.loanApplicationDTO,
          dataSources: apply.dataSources,
          riskControlResult: this.$objClean(apply.riskControlResult),
          joinLimit: this.$objClean(apply.joinLimit)
        };
        this.save(this.id, this.$objClean(data))
      },
      save(assetId, val) {
        editLoanApplication(assetId, val).then(({ data }) => {
          if (data.code === 201) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.$router.go(-1);
          } else {
            this.$message.error(data.detail || data.message)
          }
        }).catch(() => {})
      },
      getDetail() {
        getLoanApplication(this.id).then(({ data }) => {
          if (data.code === 200) {
            const customer = {
              partyPersonBaseDTO: data.body.partyPersonBaseDTO,
              propBankDTOList: data.body.propBankDTOList || [],
              propHouseDTOList: data.body.propHouseDTOList || [],
              propCarDTOList: data.body.propCarDTOList || [],
              personDebtInformationDTOList: data.body.personDebtInformationDTOList || [],
              propPublicReserveFundsDTOList: data.body.propPublicReserveFundsDTOList || [],
              partyPersonWorkHisDTOList: data.body.partyPersonWorkHisDTOList || [],
              familyList: data.body.additionalPersonDTOList.filter(_ => this.$enum.REL_RELATIVE_LIST.includes(_.kind)),
              friendList: data.body.additionalPersonDTOList.filter(_ => this.$enum.REL_FRIEND_LIST.includes(_.kind)),
              materialList: [
                {
                  fileUri: data.body.identPhoto.identPositive
                },
                {
                  fileUri: data.body.identPhoto.identPositive
                }
              ]
            };
            const apply = Object.assign(data.body.loanApplicationDTO, data.body.riskControlResult, data.body.joinLimit, {
              dataSources: data.body.dataSources,
              status: data.body.status
            });
            this.$set(this.detail, 'customer', customer);
            this.$set(this.detail, 'apply', apply);
          }
        })
      }
    },
    components: {
      Asset
    }
  }
</script>
