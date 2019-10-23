<template>
  <div class="public-setting">
    <el-form class="form"
             ref="form"
             :model="form"
             :rules="rules"
             label-position="left">
      <el-form-item label="主体性质">
        <ats-checkbox v-model="loanPartyKind"
                      :kind="$enum.SUBJECT_PROP"
                      :group="$enum.SUBJECT_PROP"></ats-checkbox>
      </el-form-item>
      <el-form-item label="资产风险等级">
        <ats-checkbox v-model="assetLevelEnums"
                      :kind="$enum.RISK_LEVEL"
                      :group="$enum.RISK_LEVEL_GROUP"></ats-checkbox>
      </el-form-item>
      <el-form-item label="资产类型">
        <ats-checkbox v-model="assetKindEnums"
                      :kind="$enum.ASSET_TYPE"
                      :group="$enum.ASSET_TYPE"></ats-checkbox>
      </el-form-item>
      <el-form-item label="业务类型" class="project-type">
        <ats-checkbox v-model="loanKindEnums"
                      class="checkbox-project-type"
                      :kind="$enum.PROJECT_TYPE"
                      :group="$enum.PROJECT_TYPE"></ats-checkbox>

        <el-popover class="btn-project-type" placement="left-start" trigger="click">
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
      </el-form-item>
      <el-form-item label="借款金额（元）" prop="loanNumMin" class="number">
        <ats-input v-model="form.loanNumMin"
                   type="number"
                   style="width: 160px;"></ats-input>
        <span class="divider"> - </span>
        <ats-input v-model="form.loanNumMax"
                   type="number"
                   style="width: 160px;"></ats-input>
      </el-form-item>
      <el-form-item label="借款期限（天）" prop="loanTermMin" class="number">
        <ats-input v-model="form.loanTermMin"
                   type="number"
                   style="width: 160px;"></ats-input>
        <span class="divider"> - </span>
        <ats-input v-model="form.loanTermMax"
                   type="number"
                   style="width: 160px;"></ats-input>
      </el-form-item>
      <el-form-item label="还款方式">
        <ats-checkbox v-model="repayWayEnums"
                      :kind="$enum.REPAY_WAY"
                      :group="$enum.REPAY_WAY"></ats-checkbox>
      </el-form-item>
      <el-form-item label="年化利率范围（%）" prop="yearRatesMin" class="number">
        <ats-input v-model="yearRatesMin"
                   type="number"
                   style="width: 160px;"></ats-input>
        <span class="divider"> - </span>
        <ats-input v-model="yearRatesMax"
                   type="number"
                   style="width: 160px;"></ats-input>
      </el-form-item>
      <el-form-item label="不接受地区" class="regions">
        <el-button icon="fa fa-edit"
                   class="is-circle btn-edit-regions"
                   type="primary"
                   plain
                   @click="handleEditRegions"></el-button>
        <ul class="region-list">
          <li v-for="region in selectedRegionList" class="region-item">{{ region.name }}</li>
        </ul>
      </el-form-item>

      <el-row type="flex" justify="center">
        <el-button type="primary" @click="handleSave">保存设置</el-button>
      </el-row>
    </el-form>

    <el-dialog :visible.sync="dialog.visible"
               class="dialog"
               width="700px"
               title="不接受地区选择"
               @close="handleDialogClose">
      <ul>
        <li v-for="province in dialog.provinceList"
            :class="{ active: dialog.currentProvince.region === province.region, selected: isProvinceSelected(province, dialog.selected) }"
            @click="handleProvinceChange(province)">{{ province.name }}</li>
      </ul>
      <hr>
      <el-checkbox-group v-model="dialog.selected">
        <el-checkbox v-for="city in dialog.cityList"
                     :key="city.region"
                     :label="city.region">{{ city.name }}</el-checkbox>
      </el-checkbox-group>

      <el-row slot="footer" type="flex" justify="center">
        <el-button type="primary" @click="handleSaveRegions">确定</el-button>
        <el-button @click="handleCancelRegions">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getLoanConfig,
    saveLoanConfig
  } from '../../api/assetMgt';
  import {
    getRegionsByCode,
    getRegionEnum
  } from '../../../api/enum'

  const PROVINCE_CITY_MAP = {};

  export default {
    data() {
      const numberValidator = (val, precise, preciseErrMsg) => {
        preciseErrMsg = preciseErrMsg || `保留${precise}位小数`;
        if (typeof val === 'number' && !isNaN(val)) {
          if (val < 0 || val > 9999999999999998) {
            return '范围0-9999999999999998'
          } else if (!this.$valid.floatValidator(val, precise)) {
            return preciseErrMsg;
          }
        }
      };

      return {
        selectedRegionList: [],
        form: {
          id: null,
          loanPartyKind: null,
          assetLevelEnums: null,
          assetKindEnums: null,
          loanKindEnums: null,
          loanNumMin: null,
          loanNumMax: null,
          loanTermMin: null,
          loanTermMax: null,
          repayWayEnums: null,
          yearRatesMin: null,
          yearRatesMax: null,
          regions: null
        },
        rules: {
          loanNumMin: [
            {
              type: 'number',
              trigger: 'blur',
              validator: (rule, minVal, callback) => {
                const maxVal = this.form.loanNumMax;
                const minErrMsg = numberValidator(minVal, 2);
                const maxErrMsg = numberValidator(maxVal, 2);
                if (minErrMsg) {
                  callback(minErrMsg);
                } else if (maxErrMsg) {
                  callback(maxErrMsg);
                } else if (typeof minVal === 'number' && typeof maxVal === 'number' && minVal > maxVal) {
                  callback('非法区间')
                } else {
                  callback();
                }
              }
            }
          ],
          loanTermMin: [
            {
              type: 'number',
              trigger: 'blur',
              validator: (rule, minVal, callback) => {
                const maxVal = this.form.loanTermMax;
                const minErrMsg = numberValidator(minVal, 0, '请输入整数');
                const maxErrMsg = numberValidator(maxVal, 0, '请输入整数');
                if (minErrMsg) {
                  callback(minErrMsg);
                } else if (maxErrMsg) {
                  callback(maxErrMsg);
                } else if (typeof minVal === 'number' && typeof maxVal === 'number' && minVal > maxVal) {
                  callback('非法区间')
                } else {
                  callback();
                }
              }
            }
          ],
          yearRatesMin: [
            {
              type: 'number',
              trigger: 'blur',
              validator: (rule, minVal, callback) => {
                const maxVal = this.form.yearRatesMax;
                const minErrMsg = numberValidator(minVal, 4, '保留2位小数');
                const maxErrMsg = numberValidator(maxVal, 4, '保留2位小数');
                if (minErrMsg) {
                  callback(minErrMsg);
                } else if (maxErrMsg) {
                  callback(maxErrMsg);
                } else if (typeof minVal === 'number' && typeof maxVal === 'number' && minVal > maxVal) {
                  callback('非法区间')
                } else {
                  callback();
                }
              }
            }
          ]
        },
        dialog: {
          visible: false,
          provinceList: [],
          cityList: [],
          selected: [],
          currentProvince: {}
        }
      }
    },
    computed: {
      loanPartyKind: {
        get() {
          return this.form.loanPartyKind ? this.form.loanPartyKind.split(',') : []
        },
        set(val) {
          this.form.loanPartyKind = val && val.length ? val.join(',') : null;
        }
      },
      assetLevelEnums: {
        get() {
          return this.form.assetLevelEnums ? this.form.assetLevelEnums.split(',') : []
        },
        set(val) {
          this.form.assetLevelEnums = val && val.length ? val.join(',') : null;
        }
      },
      assetKindEnums: {
        get() {
          return this.form.assetKindEnums ? this.form.assetKindEnums.split(',') : []
        },
        set(val) {
          this.form.assetKindEnums = val && val.length ? val.join(',') : null;
        }
      },
      loanKindEnums: {
        get() {
          return this.form.loanKindEnums ? this.form.loanKindEnums.split(',') : []
        },
        set(val) {
          this.form.loanKindEnums = val && val.length ? val.join(',') : null;
        }
      },
      repayWayEnums: {
        get() {
          return this.form.repayWayEnums ? this.form.repayWayEnums.split(',') : []
        },
        set(val) {
          this.form.repayWayEnums = val && val.length ? val.join(',') : null;
        }
      },
      yearRatesMin: {
        get() {
          return typeof this.form.yearRatesMin === 'number' && !isNaN(this.form.yearRatesMin) ? this.$floatMultiply(this.form.yearRatesMin, 100) : null;
        },
        set(val) {
          this.form.yearRatesMin = typeof val === 'number' && !isNaN(val) ? this.$floatDivide(val, 100) : null;
        }
      },
      yearRatesMax: {
        get() {
          return typeof this.form.yearRatesMax === 'number' && !isNaN(this.form.yearRatesMax) ? this.$floatMultiply(this.form.yearRatesMax, 100) : null;
        },
        set(val) {
          this.form.yearRatesMax = typeof val === 'number' && !isNaN(val) ? this.$floatDivide(val, 100) : null;
        }
      }
    },

    created() {
      this.getDetail();
      this.getRegions();
    },

    methods: {
      handleSave() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.save(this.$deepcopy(this.form))
          }
        })
      },
      handleEditRegions() {
        this.dialog.visible = true;
        this.dialog.selected = this.form.regions ? this.form.regions.split(',') : [];
      },
      handleProvinceChange(province) {
        this.dialog.currentProvince = province;
        this.getRegions(province.region);
      },
      handleSaveRegions() {
        this.form.regions = this.dialog.selected && this.dialog.selected.length ? this.dialog.selected.join(',') : null;
        this.selectedRegionList = [];
        this.getRegionName(this.form.regions);
        this.dialog.visible = false;
      },
      handleCancelRegions() {
        this.dialog.visible = false;
      },
      handleDialogClose() {
        this.dialog.selected = [];
        this.dialog.cityList = [];
        this.dialog.currentProvince = {};
      },

      isProvinceSelected(province, selected) {
        return selected.some(_ => _.startsWith(province.region.slice(0, 2)))
      },
      save(obj) {
        console.log(obj);
        saveLoanConfig(obj).then(({ data }) => {
          if (data.code === 201) {
            this.$message.success('保存成功');
            this.getDetail();
          }
        })
      },
      getDetail() {
        getLoanConfig().then(({ data }) => {
          if (data.code === 200) {
            if (data.body) {
              this.form = data.body;
              if (data.body.regions) {
                this.getRegionName(data.body.regions)
              }
            }
          } else {
            this.$message.error(data.message);
          }
        })
      },
      getRegionName(regions) {
        getRegionsByCode(regions).then(({ data }) => {
          if (data.code === 200) {
            this.selectedRegionList = data.body;
          }
        })
      },
      getRegions(region = '86') {
        if (PROVINCE_CITY_MAP[region]) {
          if (region === '86') {
            this.dialog.provinceList = PROVINCE_CITY_MAP[region];
          } else {
            this.dialog.cityList = PROVINCE_CITY_MAP[region];
          }
          return;
        }
        getRegionEnum(region).then(({ data }) => {
          if (data.code === 200) {
            PROVINCE_CITY_MAP[region] = data.body;
            if (region === '86') {
              this.dialog.provinceList = data.body;
            } else {
              this.dialog.cityList = data.body;
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .public-setting {
    margin: 0 auto;
    width: 80%;

    .form {
      .el-form-item {
        display: flex;
        border: 1px solid #dfe6ec;

        &.number, &.regions {
          .el-form-item__label, .el-form-item__content {
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }

        &.project-type {
          .el-form-item__content {
            position: relative;
          }

          .checkbox-project-type {
            padding-right: 60px;
          }

          .btn-project-type {
            position: absolute;
            right: 20px;
            top: 8px;
          }
        }
      }

      .el-form-item__label {
        padding: 0 20px;
        width: 180px;
        border-right: 1px solid #dfe6ec;
        background: #eef1f6;
      }

      .el-form-item__content {
        padding: 0 20px;
        width: calc(100% - 180px);

        .divider {
          text-align: center;
          display: inline-block;
          width: 30px;
        }
      }

      .btn-edit-regions {
        float: left;
      }

      .region-list {
        margin: 0 0 0 60px;
        padding: 0;
      }

      .region-item {
        display: inline-block;

        &:after {
          content: '、';
        }

        &:last-child:after {
          display: none;
        }
      }
    }

    .dialog {
      hr {
        margin: 20px 0;
        border: none;
        border-bottom: 1px solid #dfe6ec;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          display: inline-block;
          margin-top: 10px;
          margin-right: 15px;
          padding: 4px 12px;
          background: #eef1f6;
          border: 1px solid #eef1f6;
          border-radius: 2px;
          cursor: pointer;

          &.active {
            color: #0068ff;
            border-color: #dfe6ec;
          }

          &.selected {
            border-color: #0068ff;
          }
        }
      }
    }
  }
</style>
