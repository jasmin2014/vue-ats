<template>
  <div class="upload-edit">
    <upload-asset :customer="customer"
                  :apply="apply"
                  :material="material"
                  :fee="fee"
                  :mode="mode"
                  :end="this.$enum.BUSINESS_ASSET"
                  :error-msg="errorMsg"
                  @save="handleSave"></upload-asset>
  </div>
</template>

<script>
  import {getUploadAssetDetail, editUploadAssetDetail} from '../../api/asset';
  import UploadAsset from '../../../modules/assets/UploadAsset';
  let uploadNo = '';
  let partyCustomer = {};

  export default {
    data() {
      return {
        id: this.$route.params.id,
        errorMsg: [],
        customer: {},
        apply: {},
        material: [],
        fee: {},
        mode: 'CREATE'
      }
    },
    created() {
      this.getData(this.id)
    },
    methods: {
      handleSave(val) {
        this.$confirm('上传成功后，客户姓名、证件号码、手机号码、所在省份和所在城市将不能修改，确定保存上传?', '提示', {
          type: 'warning',
          confirmButtonText: '保存并上传'
        }).then(() => {
          val.apply.cardBank = val.customer.bankList.length ? val.customer.bankList[0].bankName : null;
          val.apply.loanCard = val.customer.bankList.length ? val.customer.bankList[0].bankCard : null;
          val.apply.loanMobile = val.customer.bankList.length ? val.customer.bankList[0].reservedMobile : null;
          val.apply.openBank = val.customer.bankList.length ? val.customer.bankList[0].issuingBank : null;

          // 筛选收费信息
          const initialFeeList = val.fee.filter(_ => _.phase === this.$enum.FEE_PHASE_INITIAL);
          const midtermFeeList = val.fee.filter(_ => _.phase === this.$enum.FEE_PHASE_MIDTERM);
          const terminalFeeList = val.fee.filter(_ => _.phase === this.$enum.FEE_PHASE_TERMINAL);

          const detail = {
            uploadNo,
            loanPartyKind: val.apply.base.loanPartyKind,
            assetImportModel: {
              propBankDTO: val.customer.bankList.length ? val.customer.bankList[0] : null,
              propHouseDTO: val.customer.houseList.length ? val.customer.houseList[0] : null,
              propShopDTO: val.customer.shopList.length ? val.customer.shopList[0] : null,
              propElectronicCommerceDTO: val.customer.eshopList.length ? val.customer.eshopList[0] : null,
              personDebtInformationDTO: val.customer.debtList.length ? val.customer.debtList[0] : null,
              loanApplicationDTO: val.apply.base,
              initialFee: initialFeeList.length ? initialFeeList[0] : null,
              midtermFee: midtermFeeList.length ? midtermFeeList[0] : null,
              terminalFee: terminalFeeList.length ? terminalFeeList[0] : null
            },
            pics: {
              USER_IDENTITY: (val.customer.materialList || []).map(_ => ({
                id: _.id,
                fileType: _.kind,
                name: _.name,
                fileUri: _.fileUri
              })),
              LOAN_APPLICATION_PRROF_MATERIAL: (val.material || []).map(_ => ({
                id: _.proofMaterial,
                name: _.name,
                fileUri: _.url
              }))
            }
          };
          if (detail.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
            detail.assetImportModel.partyPersonBaseDTO = Object.assign(partyCustomer, val.customer.base);
            detail.assetImportModel.propCarDTO = val.customer.carList.length ? val.customer.carList[0] : null;
            detail.assetImportModel.propPublicReserveFundsDTO = val.customer.publicList.length ? val.customer.publicList[0] : null;
            detail.assetImportModel.propSocialSecurityDTO = val.customer.insuranceList.length ? val.customer.insuranceList[0] : null;
            detail.assetImportModel.partyPersonWorkHisDTO = val.customer.orgList.length ? val.customer.orgList[0] : null;
            detail.assetImportModel.relationship = val.customer.familyList.length ? val.customer.familyList[0] : null;
            detail.assetImportModel.friendship = val.customer.friendList.length ? val.customer.friendList[0] : null;
          } else if (detail.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
            detail.assetImportModel.partyEnterpriseDTO = Object.assign(partyCustomer, val.customer.base, val.customer.business);
            detail.assetImportModel.legalPerson = val.customer.legal;
            detail.assetImportModel.propDeviceDTO = val.customer.equipmentList.length ? val.customer.equipmentList[0] : null;
            detail.assetImportModel.propStocks = val.customer.stockList || null;
          }
          this.saveInfo(detail);
        }, () => {})
      },
      saveInfo(detail) {
        this.errorMsg = [];
        editUploadAssetDetail(this.id, detail).then(({data}) => {
          if (data.code === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.$router.back();
          } else if (data.code === 400 && data.type === 'array') {
            this.errorMsg = data.body.errorInfo;
          } else {
            this.$message.error(data.message);
          }
        }).catch(() => {})
      },
      getData(id) {
        getUploadAssetDetail(id).then(({data}) => {
          if (data.code === 200) {
            uploadNo = data.body.uploadNo;
            this.errorMsg = data.body.errorInfo;
            const pics = data.body.pics;
            const model = data.body.assetImportModel;

            // 图片
            if (pics) {
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
              this.material = (pics['LOAN_APPLICATION_PROOF_MATERIAL'] || []).map(_ => ({
                proofMaterial: _.id,
                name: _.name,
                uri: _.fileUri,
                type: _.name && _.name.split('.').length >= 2 ? `.${_.name.split('.')[1]}` : null
              }));
            }

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
                partyCustomer = model.partyPersonBaseDTO;
                model.partyPersonBaseDTO.identKind = this.$enum.IDENT_TYPE_IDENTITY;
                this.$set(this.customer, 'base', model.partyPersonBaseDTO || {});
                this.$set(this.customer, 'carList', model.propCarDTO ? [model.propCarDTO] : []);
                this.$set(this.customer, 'publicList', model.propPublicReserveFundsDTO ? [model.propPublicReserveFundsDTO] : []);
                this.$set(this.customer, 'insuranceList', model.propSocialSecurityDTO ? [model.propSocialSecurityDTO] : []);
                this.$set(this.customer, 'orgList', model.partyPersonWorkHisDTO ? [model.partyPersonWorkHisDTO] : []);
                this.$set(this.customer, 'familyList', model.relationship ? [model.relationship] : []);
                this.$set(this.customer, 'friendList', model.friendship ? [model.friendship] : []);
              } else if (apply.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
                partyCustomer = model.partyEnterpriseDTO;
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
  .upload-edit {
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
