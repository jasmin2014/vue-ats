<template>
  <div class="upload-detail">
    <upload-asset :customer="customer"
                  :apply="apply"
                  :material="material"
                  :fee="fee"
                  :mode="mode"
                  :end="this.$enum.BUSINESS_ASSET"
                  :error-msg="errorMsg"></upload-asset>
  </div>
</template>

<script>
  import {getUploadAssetDetail} from '../../api/asset';
  import UploadAsset from '../../../modules/assets/UploadAsset';

  export default {
    data() {
      return {
        id: this.$route.params.id,
        errorMsg: [],
        customer: {},
        apply: {},
        material: [],
        fee: {},
        mode: 'VIEW'
      }
    },
    created() {
      this.getData(this.id)
    },
    methods: {
      getData(id) {
        getUploadAssetDetail(id).then(({data}) => {
          if (data.code === 200) {
            this.errorMsg = data.body.errorInfo;
            const pics = data.body.pics;
            const model = data.body.assetImportModel;

            // 图片
            // 银行卡证明信息
            if (model.loanApplicationDTO.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
              const bank = model.propBankDTO;
              if (bank && pics['BANK_CARD']) {
                bank.attachment = pics['BANK_CARD'].map(_ => _.fileUri).join(',')
              }
            }
            // 房产附件
            const house = model.propHouseDTO;
            if (house && pics['HOUSE']) {
              house.attachment = pics['HOUSE'].map(_ => _.fileUri).join(',')
            }
            // 车辆附件
            const car = model.propCarDTO;
            if (car && pics['CAR']) {
              car.attachment = pics['CAR'].map(_ => _.fileUri).join(',')
            }
            // 机械设备
            const equipment = model.propDeviceDTO;
            if (equipment && pics['DEVICE']) {
              equipment.attachment = pics['DEVICE'].map(_ => _.fileUri).join(',')
            }
            // 商铺信息
            const shop = model.propShopDTO;
            if (shop && pics['SHOP']) {
              shop.attachment = pics['SHOP'].map(_ => _.fileUri).join(',')
            }
            // 电商信息
            const eshop = model.propElectronicCommerceDTO;
            if (eshop && pics['ELECTRONIC_COMMERCE']) {
              eshop.attachment = pics['ELECTRONIC_COMMERCE'].map(_ => _.fileUri).join(',')
            }
            // 客户证件
            if (model.loanApplicationDTO.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
              this.$set(this.customer, 'materialList', pics['USER_IDENTITY'].map((_, index) => ({
                id: _.id,
                kind: _.fileType,
                name: _.name,
                fileType: _.name && _.name.split('.').length >= 2 ? _.name.split('.')[1] : null,
                fileUri: _.fileUri
              })));
            } else if (model.loanApplicationDTO.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
              this.$set(this.customer, 'materialList', pics['USER_IDENTITY'].map((_, index) => ({
                id: _.id,
                kind: index === 0 ? this.$enum.PROOF_MATERIAL_O_LICENSE : this.$enum.PROOF_MATERIAL_O_OTHER,
                name: _.name,
                fileType: _.name && _.name.split('.').length >= 2 ? _.name.split('.')[1] : null,
                fileUri: _.fileUri
              })));
            }
            // 证明材料
            this.material = pics['LOAN_APPLICATION_PROOF_MATERIAL'].map(_ => ({
              proofMaterial: _.id,
              name: _.name,
              uri: _.fileUri,
              type: _.name && _.name.split('.').length >= 2 ? `.${_.name.split('.')[1]}` : null
            }));

            // 详情
            // 申请信息
            const apply = model.loanApplicationDTO;
            apply.kind = this.$enum.LOAN_PROP_NEW; // 借贷属性默认新借
            apply.repayTime = apply.loanTime;
            apply.repayTerms = apply.loanTerms;
            apply.repayTimeType = apply.loanTimeType;
            this.apply = apply;
            // 费率信息
            const feeList = [];
            feeList.push(model.initialFee);
            feeList.push(model.midtermFee);
            feeList.push(model.terminalFee);
            this.$set(this.fee, 'allList', feeList.map((_, i) => ({
              ..._,
              id: i
            })));
            this.$set(this.fee, 'loanAmount', apply.loanAmount);
            // 客户信息
            this.$nextTick(() => {
              if (apply.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
                model.partyPersonBaseDTO.identKind = this.$enum.IDENT_TYPE_IDENTITY;
                this.$set(this.customer, 'base', model.partyPersonBaseDTO || {});
                this.$set(this.customer, 'carList', model.propCarDTO ? [model.propCarDTO] : []);
                this.$set(this.customer, 'publicList', model.propPublicReserveFundsDTO ? [model.propPublicReserveFundsDTO] : []);
                this.$set(this.customer, 'insuranceList', model.propSocialSecurityDTO ? [model.propSocialSecurityDTO] : []);
                this.$set(this.customer, 'orgList', model.partyPersonWorkHisDTO ? [model.partyPersonWorkHisDTO] : []);
                this.$set(this.customer, 'familyList', model.relationship ? [model.relationship] : []);
                this.$set(this.customer, 'friendList', model.friendship ? [model.friendship] : []);
              } else if (apply.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
                this.$set(this.customer, 'base', model.partyEnterpriseDTO || {});
                this.$set(this.customer, 'business', model.partyEnterpriseDTO || {});
                this.$set(this.customer, 'legal', model.legalPerson || {});
                this.$set(this.customer, 'equipmentList', model.propDeviceDTO ? [model.propDeviceDTO] : []);
                this.$set(this.customer, 'stockList', model.propStocks || []);
              }
              this.$set(this.customer, 'bankList', model.propBankDTO ? [model.propBankDTO] : []);
              this.$set(this.customer, 'houseList', model.propHouseDTO ? [model.propHouseDTO] : []);
              this.$set(this.customer, 'shopList', model.propShopDTO ? [model.propShopDTO] : []);
              this.$set(this.customer, 'eshopList', model.propElectronicCommerceDTO ? [model.propElectronicCommerceDTO] : []);
              this.$set(this.customer, 'debtList', model.personDebtInformationDTO ? [model.personDebtInformationDTO] : []);
            });
          }
        })
      }
    },
    components: {
      UploadAsset
    }
  }
</script>

<style lang="scss">
  .upload-detail {
    .individual {
      .el-card {
        box-shadow: none;
        border: none;

        .el-card__body {
          padding: 0;
        }
      }
    }
  }
</style>
