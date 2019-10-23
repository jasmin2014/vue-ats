<template>
  <div class="asset">
    <report v-if="showReport"
            v-model="application"
            :person="application.loanPartyKind === $enum.SUBJECT_PROP_PERSON ? customer : customer.legal"></report>
    <el-form v-else
             ref="form"
             :model="base"
             :rules="rules"
             class="form-label flex">
      <el-row>
        <el-col :span="5">
          <el-form-item label="主体性质" prop="loanPartyKind">
            <ats-select v-model="base.loanPartyKind"
                        :mode="disableEdit"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"
                        @change="handleCustomerTypeChange"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item :label="nameLabel" prop="name">
            <ats-input v-model.trim="base.name"
                       :mode="disableEdit"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item :label="identLabel" prop="ident">
            <ats-input v-model.trim="base.ident"
                       :mode="disableEdit"></ats-input>
          </el-form-item>
        </el-col>
        <el-col v-if="mode !== 'VIEW'" :span="2" :offset="1">
          <el-button type="primary"
                     @click="handleSave">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-alert v-for="(msg, index) in errorMsg" :key="index"
              class="error-msg"
              :title="msg"
              :closable="false"
              type="error"></el-alert>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户信息" name="customer">
        <person ref="customer"
                v-if="base.loanPartyKind === $enum.SUBJECT_PROP_PERSON"
                v-model="customer"
                :mode="mode"
                :encode="encode"></person>
        <org ref="customer"
             v-else-if="base.loanPartyKind === $enum.SUBJECT_PROP_ORGANIZE"
             v-model="customer"
             :mode="mode"
             :encode="encode"></org>
      </el-tab-pane>
      <el-tab-pane label="申请信息" name="application">
        <application ref="application"
                     v-model="application"
                     :end="base.loanPartyKind"
                     :is-audit="isAudit"
                     :is-upload="isUpload"
                     :mode="mode"></application>
      </el-tab-pane>
      <el-tab-pane v-if="propList.length" label="资产信息" name="props">
        <props ref="props"
               v-model="props"
               :prop-list="propList"
               :mode="mode"
               :is-upload="isUpload"></props>
      </el-tab-pane>
      <el-tab-pane label="证明材料" name="material">
        <materials ref="materials"
                   v-model="materials"
                   :mode="mode"
                   :is-upload="isUpload"></materials>
      </el-tab-pane>
      <el-tab-pane v-if="fee"
                   label="收费信息" name="fee">
        <fee ref="fee"
             v-model="fee"
             :mode="mode"
             :is-upload="isUpload"
             @edit="handleFeeEdit"
             @create="handleFeeCreate"
             @delete="handleFeeDelete"></fee>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Person from '../customer/PersonBase';
  import Org from '../customer/OrgBase';
  import Report from './Report';
  import Application from './Application';
  import Props from '../prop/Props';
  import Materials from './Doc';
  import Fee from './Fee';
  import PROJECT_TYPE_PROP_MAP from '../project-config/project_type_prop_map';
  import {mapState} from 'vuex'

  export default {
    components: {
      Person,
      Org,
      Report,
      Application,
      Props,
      Materials,
      Fee
    },
    props: {
      loanCustomer: Object,
      loanApplication: Object,
      proofMaterials: [Array, Object],
      fee: Object,
      mode: String,
      errorMsg: Array,
      isUpload: Boolean,
      isAudit: Boolean,
      showReport: Boolean,
      encode: Boolean
    },
    data() {
      return {
        activeName: 'customer',
        customer: this.$deepcopy(this.loanCustomer),
        application: this.$deepcopy(this.loanApplication),
        props: {},
        materials: this.$deepcopy(this.proofMaterials || []),
        base: {
          loanPartyKind: this.loanApplication && this.loanApplication.loanPartyKind || '',
          name: this.loanCustomer && this.loanCustomer.name || '',
          ident: this.loanCustomer && this.loanCustomer.ident || ''
        },
        rules: {
          loanPartyKind: [
            { required: true, message: '请选择主体性质', trigger: 'change' }
          ],
          name: [
            {
              required: true, trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback('请输入' + this.nameLabel)
                } else {
                  callback()
                }
              }
            }
          ],
          ident: [
            {
              required: true, trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback('请输入' + this.identLabel);
                  return;
                } else if (this.base.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
                  if (!this.$valid.ident.test(value)) {
                    callback('请输入正确的' + this.identLabel);
                    return;
                  }
                } else if (this.base.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
                  if (!this.$valid.usciCode.test(value)) {
                    callback('请输入正确的' + this.identLabel)
                    return;
                  }
                }
                callback()
              }
            }
          ]
        }
      }
    },
    computed: {
      ...mapState('application', [
        'projectType'
      ]),
      propList() {
        return (PROJECT_TYPE_PROP_MAP[this.projectType] || []).map(_ => _.value);
      },
      disableEdit() {
        return this.mode === 'EDIT' ? 'VIEW' : this.mode;
      },
      nameLabel() {
        if (this.base.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
          return '客户姓名'
        } else if (this.base.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
          return '企业名称'
        }
      },
      identLabel() {
        if (this.base.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
          return '证件号码'
        } else if (this.base.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE) {
          return '统一社会信用代码'
        }
      }
    },
    watch: {
      loanCustomer(val) {
        if (val) {
          val = this.$deepcopy(val);
          this.customer = val;
          this.base.name = val.name;
          this.base.ident = val.ident;
        }
      },
      'loanCustomer.propCarDTO'(val) {
        this.$set(this.props, 'propCarDTO', this.$deepcopy(val || {}));
      },
      'loanCustomer.propHouseDTO'(val) {
        this.$set(this.props, 'propHouseDTO', this.$deepcopy(val || {}));
      },
      'loanCustomer.propDeviceDTO'(val) {
        this.$set(this.props, 'propDeviceDTO', this.$deepcopy(val || {}));
      },
      'loanCustomer.propShopDTO'(val) {
        this.$set(this.props, 'propShopDTO', this.$deepcopy(val || {}));
      },
      'loanCustomer.propElectronicCommerceDTO'(val) {
        this.$set(this.props, 'propElectronicCommerceDTO', this.$deepcopy(val || {}));
      },
      'loanCustomer.propPublicReserveFunds'(val) {
        if (this.base.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
          this.$set(this.props, 'propPublicReserveFunds', this.$deepcopy(val || []));
        } else {
          this.$set(this.props, 'propPublicReserveFunds', null);
        }
      },
      loanApplication(val) {
        if (val) {
          if (this.encode) {
            val.loanPartyName = this.$encoder[val.loanPartyKind === this.$enum.SUBJECT_PROP_ORGANIZE ? 'companyName' : 'personName'](val.loanPartyName);
            val.loanIdent = this.$encoder.ident(val.loanIdent);
            val.loanCard = this.$encoder.card(val.loanCard);
            val.loanMobile = this.$encoder.mobile(val.loanMobile);
          }
          this.application = this.$deepcopy(val);
          this.base.loanPartyKind = val.loanPartyKind;
          this.$store.commit('application/updateProjectType', val.projectType);
        }
      },
      proofMaterials: {
        handler(val) {
          if (val) {
            val = this.$deepcopy(val);
            this.materials = val;
          }
        },
        deep: true
      }
    },
    methods: {
      handleCustomerTypeChange(type) {
        this.$emit('customer-type-change', type);
        if (this.mode === 'CREATE') {
          this.$refs.form.clearValidate();
          this.$refs.application.clearValidate();
        }
      },
      handleSave() {
        let isValid = true;
        this.$refs.form && this.$refs.form.validate(valid => {
          if (!valid) {
            isValid = false;
          }
        });

        this.$refs.customer.save(valid => {
          if (!valid) {
            this.$message.error('请检查客户信息');
            this.activeName = 'customer';
            isValid = false;
          }
        });
        this.$refs.application.save(valid => {
          if (!valid && isValid) {
            this.$message.error('请检查借贷信息');
            this.activeName = 'application';
            isValid = false;
          }
        });
        this.$refs.props && this.$refs.props.save((valid, empty) => {
          if (isValid) {
            if (!valid) {
              this.$message.error('请检查资产信息');
              this.activeName = 'props';
              isValid = false;
            } else if (empty) {
              this.$message.error('请至少填写一项');
              this.activeName = 'props';
              isValid = false;
            }
          }
        });
        this.$refs.materials.save();

        // 收费信息
        let feeList = [];
        if (this.isUpload && this.$refs.fee) {
          this.$refs.fee.save(list => {
            feeList = list;
          })
        }

        if (isValid) {
          const customer = this.$deepcopy(this.customer || {});
          const application = this.$deepcopy(this.application || {});
          const props = this.$deepcopy(this.props || {});
          let materials = this.$deepcopy(this.materials.originals).concat(this.$deepcopy(this.materials.pdfs));
          // 三要素
          application.loanPartyKind = this.base.loanPartyKind;
          customer.name = this.base.name;
          customer.ident = this.base.ident;
          application.loanPartyName = this.base.name;
          application.loanIdent = this.base.ident;

          // 客户资产
          let propMap = [];
          if (PROJECT_TYPE_PROP_MAP[application.projectType]) {
            propMap = PROJECT_TYPE_PROP_MAP[application.projectType].map(_ => _.value)
          }
          propMap.forEach(prop => {
            customer[prop] = props[prop];
          });
          // 图片
          // 资产图片
          propMap.forEach(prop => {
            const files = customer[prop] && customer[prop].materials;
            if (files) {
              materials = materials.concat(files);
              delete customer[prop].materials;
            }
          });
          // 客户图片
          materials = materials.concat(customer.materials || []);

          switch (this.base.loanPartyKind) {
            case this.$enum.SUBJECT_PROP_PERSON:
              this.$emit('save', {
                loanApplication: application,
                loanPersonCustomer: customer,
                proofMaterials: materials,
                feeList
              });
              break;
            case this.$enum.SUBJECT_PROP_ORGANIZE:
              this.$emit('save', {
                loanApplication: application,
                loanOrgCustomer: customer,
                proofMaterials: materials,
                feeList
              });
              break;
            default:
              break;
          }
        }
      },
      handleFeeEdit(val) {
        this.$emit('fee-edit', val)
      },
      handleFeeCreate(val) {
        this.$emit('fee-create', val)
      },
      handleFeeDelete(val, phase) {
        this.$emit('fee-delete', val, phase)
      }
    }
  }
</script>
