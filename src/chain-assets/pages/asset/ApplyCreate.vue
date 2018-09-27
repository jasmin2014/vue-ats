<template>
  <asset :mode="mode"
         :business="business"
         @save="handleSave"></asset>
</template>

<script>
  import Asset from '../../../modules/chain/Asset'
  import {createLoanApplication} from '../../api/asset';

  export default {
    data() {
      return {
        mode: 'CREATE',
        business: this.$enum.BUSINESS_ASSET
      }
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
        this.save(this.$objClean(data))
      },
      save(val) {
        createLoanApplication(val).then(({ data }) => {
          if (data.code === 201) {
            this.$message({
              message: '创建成功',
              type: 'success'
            });
            this.$router.go(-1);
          }
        }).catch(() => {})
      }
    },
    components: {
      Asset
    }
  }
</script>
