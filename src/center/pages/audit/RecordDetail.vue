<!--appraisalDetails 资产评估详情-->
<template>
  <div class="record-detail">
    <asset :loan-customer="loanCustomer"
           :loan-application="loanApplication"
           :proof-materials="proofMaterials"
           :fee="fee"
           :mode="mode"
           show-report
           is-audit></asset>
  </div>
</template>

<script>
  import Asset from '../../../modules/assets/Asset'
  import {
    getRecordDetail
  } from '../../api/audit'

  export default {
    components: {
      Asset
    },
    data() {
      return {
        id: this.$route.params.id,
        auditId: this.$route.query.id,
        mode: 'VIEW',
        detail: [],
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
          originals: []
        },
        fee: {},
        table: [
          {
            label: '借款编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '协议编号',
            prop: 'contract'
          },
          {
            label: '资产渠道',
            prop: 'assetOrgName'
          },
          {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          },
          {
            label: '客户姓名/企业名称',
            prop: 'loanPartyName'
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '项目名称',
            prop: 'projectName',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_TYPE, row.assetKind)
          },
          {
            label: '信用评分',
            prop: 'creditScore'
          },
          {
            label: '资产风险评级',
            prop: 'assetRiskLevel',
            formatter: (row, col, val) => this.$filter(val, this.$enum.RISK_LEVEL, this.$enum.RISK_LEVEL_GROUP)
          },
          {
            label: '证件号码',
            prop: 'loanIdent'
          },
          {
            label: '申请时间',
            prop: 'appliedTime',
            width: 85
          }
        ]
      };
    },
    created() {
      this.getData(this.id);
    },
    methods: {
      getData(id) {
        this.getLoanDetail(id);
      },
      getLoanDetail(loanId) {
        getRecordDetail(loanId).then(({ data }) => {
          if (data.code === 200) {
            if (data.body === null) {
              this.$message.warning('无借款申请快照信息');
              this.$router.go(-1);
              return;
            }
            // 基本信息
            this.loanApplication = data.body.loanApplicationDTO;
            // 保障方案
            if (data.body.loanApplicationDTO && data.body.loanApplicationDTO.planId && data.body.loanProtectionPlanDTO) {
              this.$store.commit('application/updateProtectionPlanList', [data.body.loanProtectionPlanDTO]);
            }
            // 备注
            this.$set(this.loanApplication, 'remarkList', data.body.loanAuditRecordDTOList || []);
            // 客户信息
            const type = data.body.loanApplicationDTO.loanPartyKind;
            switch (type) {
              case this.$enum.SUBJECT_PROP_PERSON:
                this.loanCustomer = data.body.loanPersonCustomerMongoDTO;
                break;
              case this.$enum.SUBJECT_PROP_ORGANIZE:
                this.loanCustomer = data.body.loanOrgCustomerMongoDTO;
                break;
            }
            // 证明材料
            const materials = data.body.loanMaterials && data.body.loanMaterials.loanMaterials;
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
                    list = list.concat(materials[this.$enum.PROOF_MATERIAL_O_LICENSE]);
                  }
                  if (materials[this.$enum.PROOF_MATERIAL_O_OTHER]) {
                    list = list.concat(materials[this.$enum.PROOF_MATERIAL_O_OTHER]);
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
            // 收费信息
            this.$set(this.fee, 'allList', data.body.feeDTOList || []);
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
      }
    }
  };
</script>
