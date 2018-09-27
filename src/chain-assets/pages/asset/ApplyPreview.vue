<template>
  <asset :customer="detail.customer"
         :apply="detail.apply"
         :is-preview="true"
         :mode="mode"
         :business="business"
         @up-chain="handleUpChain"></asset>
</template>

<script>
  import Asset from '../../../modules/chain/Asset'
  import {previewLoanApplication, upChain} from '../../api/asset';

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
      handleUpChain() {
        upChain([this.id]).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.$router.go(-1);
          } else {
            this.$message.error(data.detail || data.message)
          }
        }).catch(() => {})
      },
      getDetail() {
        previewLoanApplication(this.id).then(({ data }) => {
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
