<template>
  <div class="project-config">
    <el-form v-if="currentValue"
             ref="form"
             label-width="180px"
             :model="currentValue"
             :rules="computedMode !== 'VIEW' ? rules : computedViewRules">
      <el-row>
        <el-col :span="14" :offset="2">
          <el-form-item label="项目名称" prop="projectName">
            <ats-input v-model.trim="currentValue.projectName"
                       placeholder="请填写真实的渠道产品名称"
                       :mode="computedMode"></ats-input>
          </el-form-item>
          <el-form-item label="资产类型" prop="assetKind">
            <ats-select v-model="currentValue.assetKind"
                        :kind="$enum.ASSET_TYPE"
                        :group="$enum.ASSET_TYPE"
                        :mode="computedMode"></ats-select>
          </el-form-item>
          <el-form-item label="业务类型" prop="projectType">
            <el-col :span="20">
              <ats-select v-model="currentValue.projectType"
                          :kind="$enum.PROJECT_TYPE"
                          :group="$enum.PROJECT_TYPE"
                          :mode="computedMode"></ats-select>
            </el-col>
            <el-col :span="4" align="right">
              <el-popover placement="right-start" trigger="click">
                <el-button slot="reference">说明</el-button>
                <article class="intro">
                  <h4>业务类型说明</h4>
                  <p>1. 车辆信息类: 根据借款人提供的车辆信息, 并进行信息评估后达成借款人的借款诉求.</p>
                  <p>2. 消费类: 根据借款人的消费意愿, 提供短期, 小金额的借款诉求.</p>
                  <p>3. 工薪类: 根据借款人提供的社保, 公积金, 单位信息, 工资情况等信息, 达成的借款人借款诉求.</p>
                  <p>4. 保单类: 根据借款人提供已投保的保单信息, 从而达成的借款诉求.</p>
                  <p>5. 纯信用类: 不需要借款人提供任何信息, 资产方通过第三方或自身风控单纯评估后达成的借款诉求.</p>
                  <p>6. 虚拟网店类: 根据借款人提供的电商平台的商铺信息, 从而达成的借款诉求.</p>
                  <p>7. 实体企业类: 根据借款人提供的实体店铺或公司信息, 从而达成的借款诉求.</p>
                  <p>8. 房产类: 根据借款人提供的房产信息, 达成的借款诉求.</p>
                  <p>9. 学历类: 根据借款人提供的学历信息, 达成的借款诉求.</p>
                  <p>10. 实体设备类: 根据借款人提供的机械或硬件设备信息, 达成的借款诉求.</p>
                  <p>11. 装饰装潢类:根据借款人提供的装潢, 装饰, 装修信息, 达成的借款诉求.</p>
                  <p>12. 虚拟信息类: 根据借款人提供的虚拟账户或虚拟信息, 达成的借款诉求.</p>
                </article>
              </el-popover>
            </el-col>
          </el-form-item>
          <el-form-item label="需提供相应的资产信息">
            <el-col :span="20">
              <ats-input v-model="props"
                         type="text"></ats-input>
            </el-col>
            <el-col :span="4" align="right">
              <el-popover placement="right-start" trigger="click">
                <el-button slot="reference">说明</el-button>
                <article class="intro">
                  <h4>资产信息说明</h4>
                  <p>1. 车辆信息类: 需要提供相应的车辆信息, 包括: 品牌, 型号, 购置年月, 使用性质, 车牌照, 渠道评估价值(元), 车辆信息图片.</p>
                  <p>2. 消费类: (暂无)</p>
                  <p>3. 工薪类: 需要提供相应的公积金信息 或 社保信息 或工资信息.</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;a. 公积金: 公积金客户号, 账号状态, 缴纳单位, 缴纳城市, 账户余额(元), 当前每月缴纳金额(元).</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;b. 社保信息: 社保账号, 账号状态, 缴纳单位, 缴纳城市, 账号余额, 每月缴纳金额.</p>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp;c. 工资信息(暂无)</p>
                  <p>4. 保单类: (暂无)</p>
                  <p>5. 纯信用类: (暂无)</p>
                  <p>6. 虚拟网店类: 需要提供相应的网店信息. 包括: 所属平台, 店面名称, 账号/链接, 附件信息.</p>
                  <p>7. 实体企业类: 需要提供相应的企业(商铺)信息.包括: 企业(商铺)名称, 所在省, 所在市, 地址, 附件.</p>
                  <p>8. 房产类: 需要提供相应的房产信息. 包括: 所在省份, 所在城市, 地址, 房产附件.</p>
                  <p>9. 学历类: (暂无)</p>
                  <p>10. 实体设备类: 需要提供相应的设备信息.</p>
                  <p>11. 装饰装潢类:(暂无)</p>
                  <p>12. 虚拟信息类: (暂无)</p>
                </article>
              </el-popover>
            </el-col>
          </el-form-item>
          <el-form-item label="产品说明文档" prop="projectUri">
            <ats-upload-doc v-model="fileList"
                            :limit="1"
                            :mode="computedMode"
                            @success="validateUploadFile"
                            @remove="validateUploadFile"></ats-upload-doc>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="$store.state.businessType === this.$enum.BUSINESS_CENTER || ($store.state.businessType === $enum.BUSINESS_ASSET && mode === 'VIEW')">
        <el-col :span="14" :offset="2">
          <el-form-item label="风控开关" prop="riskSwitch">
            <ats-radio v-model="currentValue.riskSwitch"
                       type="boolean-num"
                       true-text="开启"
                       false-text="关闭"
                       :mode="mode"></ats-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="$store.state.businessType === this.$enum.BUSINESS_CENTER">
        <el-col :span="14" :offset="2">
          <el-form-item label="风控策略" prop="riskStrategy">
            <ats-input v-if="mode === 'VIEW'"
                       v-model="currentValue.riskStrategyName"
                       type="text"
                       :mode="mode"></ats-input>
            <ats-select v-else
                        v-model="currentValue.riskStrategy"
                        :value-text.sync="currentValue.riskStrategyName"
                        :options="riskOptions"
                        :disabled="currentValue.riskSwitch !== 1"
                        :mode="mode"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="mode !== 'VIEW'">
        <div v-if="$store.state.businessType === $enum.BUSINESS_ASSET">
          <el-col :span="14" :offset="2">
            <el-button type="primary"
                       style="margin-left: 180px;"
                       @click="handleSave">提交审核</el-button>
            <el-button @click="handleCancel">放弃申请</el-button>
          </el-col>
        </div>
        <div v-else-if="$store.state.businessType === $enum.BUSINESS_CENTER">
          <el-col v-if="isAudit"
                  :span="14" :offset="2">
            <el-button type="primary"
                       style="margin-left: 180px;"
                       @click="handlePass">通过</el-button>
            <el-button @click="handleReject">拒绝</el-button>
          </el-col>
          <el-col v-else
                  :span="14" :offset="2">
            <el-button type="primary"
                       style="margin-left: 180px;"
                       @click="handleConfig">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-col>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import PROJECT_TYPE_PROP_MAP from './project_type_prop_map'

  const DEFAULT_VALUE = {
    id: '',
    assetKind: '',
    // auditStatus: '',
    projectName: '',
    projectType: '',
    projectUri: '',
    fileName: '',
    riskSwitch: 1,
    riskStrategy: '',
    riskStrategyName: ''
  };

  export default {
    props: {
      value: Object,
      mode: String,
      isAudit: Boolean,
      riskStrategyList: Array
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value),
        rules: {
          projectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                this.$emit('project-name-change', {
                  value,
                  callback: (existed, message) => {
                    if (existed) {
                      callback(message || '该项目名称已存在')
                    } else {
                      callback()
                    }
                  }
                });
              }
            }
          ],
          assetKind: [
            { required: true, message: '请选择资产类型', trigger: 'change' }
          ],
          projectType: [
            { required: true, message: '请选择业务类型', trigger: 'change' }
          ],
          projectUri: [
            { message: '请上传产品说明文档', trigger: 'change' }
          ]
        },
        riskRules: {
          riskSwitch: [
            { required: true, message: '请选择风控开关', trigger: 'change' }
          ],
          riskStrategy: [
            { required: true, message: '请选择风控策略', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      computedMode: {
        get() {
          return this.$store.state.businessType === this.$enum.BUSINESS_CENTER ? 'VIEW' : this.mode;
        }
      },
      computedViewRules: {
        get() {
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          });
          if (this.$store.state.businessType === this.$enum.BUSINESS_CENTER) {
            if (this.currentValue.riskSwitch === 1) {
              return this.riskRules
            } else {
              return {
                riskSwitch: this.riskRules.riskSwitch
              }
            }
          } else {
            return {};
          }
        }
      },
      fileList: {
        get() {
          if (this.currentValue.projectUri) {
            return [{
              name: this.currentValue.fileName || '产品说明文档',
              url: this.currentValue.projectUri
            }]
          }
          return []
        },
        set(val) {
          this.currentValue.projectUri = val && val.length ? val[0].url : '';
          this.currentValue.fileName = val && val.length ? val[0].name : '';
        }
      },
      props: {
        get() {
          const projectType = this.currentValue.projectType;
          if (projectType && PROJECT_TYPE_PROP_MAP[projectType].length > 0) {
            return PROJECT_TYPE_PROP_MAP[projectType].map(_ => _.name).join('、')
          } else {
            return '暂无'
          }
        }
      },
      riskOptions: {
        get() {
          return this.riskStrategyList ? this.riskStrategyList.map(_ => ({
            value: _.strategyCode,
            text: _.strategyName
          })) : []
        }
      }
    },
    watch: {
      value(val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
          this.setCurrentValue(val)
        }
      }
    },

    methods: {
      setCurrentValue(val) {
        this.currentValue = Object.assign(this.$deepcopy(DEFAULT_VALUE), val);
      },
      handleSave() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const value = this.currentValue;
            this.$emit('save', {
              assetKind: value.assetKind,
              projectName: value.projectName,
              projectType: value.projectType,
              projectUri: value.projectUri,
              fileName: value.fileName
            })
          } else {
            return false
          }
        })
      },
      handleCancel() {
        this.$router.go(-1)
      },
      handlePass() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const value = this.currentValue;
            this.$emit('pass', {
              riskSwitch: value.riskSwitch,
              riskStrategy: value.riskStrategy,
              riskStrategyName: value.riskStrategyName
            })
          }
        })
      },
      handleReject() {
        this.$emit('reject')
      },
      handleConfig() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const value = this.currentValue;
            this.$emit('config', {
              riskSwitch: value.riskSwitch,
              riskStrategy: value.riskStrategy,
              riskStrategyName: value.riskStrategyName
            })
          }
        })
      },

      validateUploadFile() {
        this.$refs.form.validateField('projectUri');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .intro {
    line-height: 1.5;

    p {
      margin: 0;
    }
  }
</style>
