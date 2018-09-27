<template>
  <asset :customer="detail.customer"
         :apply="detail.apply"
         :mode="mode"
         :business="business"></asset>
</template>

<script>
  import Asset from '../../../modules/chain/Asset'
  import {getOrderLoanDetail} from '../../api/asset';

  export default {
    data() {
      return {
        mode: 'VIEW',
        business: this.$enum.BUSINESS_ASSET,
        id: this.$route.params.id,
        detail: {}
      }
    },
    mounted() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        getOrderLoanDetail(this.id).then(({ data }) => {
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
              status: data.body.status,
              createdTime: data.body.createdTime,
              appliedTime: data.body.appliedTime
            });
            this.$set(this.detail, 'customer', customer);
            this.$set(this.detail, 'apply', apply);
          } else {
            this.$message.error(data.detail || data.message)
          }
        }).catch(() => {})
      }
    },
    components: {
      Asset
    }
  }
</script>
