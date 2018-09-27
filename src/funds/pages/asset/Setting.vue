
<template>
  <div>
    <el-form :model="setupOptions" ref="setupOptions" :rules="setupOptionsRules">
    <el-row class="setup">
      <el-col :span="4" class="rowtit">
        资产风险等级
      </el-col>
      <el-col :span="20">
          <ats-checkbox v-model="checkedEnums.assLevelsList" :kind="this.$enum.RISK_LEVEL" :group="this.$enum.RISK_LEVEL_GROUP" @change="handleCheckedLevels">
          </ats-checkbox>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit">
        资产类型
      </el-col>
      <el-col :span="20">
        <ats-radio v-model="checkedEnums.assType" :kind="this.$enum.ASSET_TYPE" :group="this.$enum.ASSET_TYPE" @change="handleCheckedAsset">
        </ats-radio>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit">
        项目名称
      </el-col>
      <el-col :span="20">
        <el-checkbox-group v-model="checkedEnums.loanTypeEnumList"
                           @change="handleCheckedLoanType">
          <el-checkbox v-for="item in defaultEnums.loanTypeEnumList" :label="item.value" :key="item.value">{{item.text}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit inputs">
        借款金额（元）
      </el-col>
      <el-col :span="20" class="inputs">
        <el-row>
          <el-col :span="5">
            <el-form-item prop="loanNumMin">
              <ats-input type="number" v-model="setupOptions.loanNumMin" :min="0" :max="9999999999999998"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="center">~</el-col>
          <el-col :span="5">
            <el-form-item prop="loanNumMax">
              <ats-input type="number" v-model="setupOptions.loanNumMax" :min="0" :max="9999999999999998"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit inputs">
        借款期限（天）
      </el-col>
      <el-col :span="20" class="inputs">
        <el-row>
          <el-col :span="5">
            <el-form-item prop="loanTermMin">
              <ats-input type="number" v-model="setupOptions.loanTermMin" :min="0" :max="2147483648"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="center">~</el-col>
          <el-col :span="5">
            <el-form-item prop="loanTermMax">
              <ats-input type="number" v-model="setupOptions.loanTermMax" :min="0" :max="2147483648"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit inputs">
        资产评估价值
      </el-col>
      <el-col :span="20" class="inputs">
        <el-row>
          <el-col :span="5">
            <el-form-item prop="selfAssetMin">
              <ats-input type="number" v-model="setupOptions.selfAssetMin" :min="0" :max="9999999999999998"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="center">~</el-col>
          <el-col :span="5">
            <el-form-item prop="selfAssetMax">
              <ats-input type="number" v-model="setupOptions.selfAssetMax" :min="0" :max="9999999999999998"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit inputs">
        信用评分
      </el-col>
      <el-col :span="20" class="inputs">
        <el-row>
          <el-col :span="5">
            <el-form-item prop="creditScoreMin">
              <ats-input type="number" v-model="setupOptions.creditScoreMin" :min="0" :max="9999999999999998"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="center">~</el-col>
          <el-col :span="5">
            <el-form-item prop="creditScoreMax">
              <ats-input type="number" v-model="setupOptions.creditScoreMax" :min="0" :max="9999999999999998"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit">
        还款方式
      </el-col>
      <el-col :span="20">
        <ats-checkbox v-model="checkedEnums.refundWayList" :kind="this.$enum.REPAY_WAY" :group="this.$enum.REPAY_WAY" @change="handleCheckedRefundWay">
        </ats-checkbox>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit inputs">
        年化利率范围(%)
      </el-col>
      <el-col :span="20" class="inputs">
        <el-row>
          <el-col :span="5">
            <el-form-item prop="yearRatesMin">
              <ats-input type="number" v-model="setupOptions.yearRatesMin"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="center">~</el-col>
          <el-col :span="5">
            <el-form-item prop="yearRatesMax">
              <ats-input type="number" v-model="setupOptions.yearRatesMax"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="setup">
      <el-col :span="4" class="rowtit inputs">
        所在地区
      </el-col>
      <el-col :span="20" class="inputs cities">
        <div>
          <span v-for="city in getCities.checkedcities">{{city.name}}</span>
        </div>
        <el-button type="text" @click="showChooseRegions"><i class="el-icon-edit"></i></el-button>
      </el-col>
    </el-row>
    <el-row class="savesetup">
      <el-button type="primary" @click="handlePostLoanConfig">保存设置</el-button>
    </el-row>
    <div class="choosecities" v-show="getCities.editCities">
      <div class="mask"></div>
      <div class="content rel">
        <h2>地区选择</h2>
        <div class="choose">
          <ul class="clear">
            <li v-for="item in getCities.provinces" @click="handleGetRegionEnum(item)">{{item.name}}</li>
          </ul>
        </div>
        <div class="checkeds">
          <el-checkbox-group v-model="getCities.myCities" class="clear" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in getCities.cities" :label="city" :key="city.region">{{city.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="btns abs">
          <el-button type="primary" @click="handleCheckedCitiesOk">确定</el-button>
          <el-button @click="getCities.editCities=false">取消</el-button>
        </div>
      </div>
    </div>
    </el-form>
  </div>
</template>

<script>
  import {getRegionEnum,getSysEnum} from '../../../api/enum'
  import {getLoanConfig, getCitiesByRegions, postLoanConfig} from '../../api/assetMgt';
  import AtsRadio from "../../../components/input/Radio";
  export default {
    components: {
      AtsRadio
    },
    data() {
      var inputNumber = (rule, value, callback) => {
        if (value === null || value === '' || value === undefined || this.$valid.floatValidator(value, 2) && value >= 0 && value <= 9999999999999998) {
          callback();
        }else if(value < 0){
          callback("输入的数字不能小于0");
        }else if (value  > 9999999999999998 ) {
          callback("输入的数字不能大于9999999999999998");
        }else{
          callback('请输入数字值并最多保留2位小数');
        }
      };
      var inputNumberMax = (rule, value, callback) => {

        if (value === null || value === '' || value === undefined || this.$valid.floatValidator(value, 0) && value >= 0 && value <= 2147483648) {
          callback();
        }else if(value < 0){
          callback("输入的数字不能小于0");
        }else if (value  > 2147483648 ) {
          callback("输入的数字不能大于2147483648");
        }else{
          callback("请输入整数值");
        }

      };
      var inputNumberValue = (rule, value, callback) => {
        if (value === null || value === '' || value === undefined || this.$valid.floatValidator(value, 0) && value >= 0 && value <= 9999999999999998) {
          callback()
        }else if(value < 0){
          callback("输入的数字不能小于0");
        }else if (value  > 9999999999999998 ) {
          callback("输入的数字不能大于9999999999999998");
        } else {
          callback('请输入整数值')
        }
      };
      return {
        setupOptionsRules: {
          loanNumMin: [
            {validator: inputNumber, trigger: 'blur'}
          ],
          loanNumMax: [
            {validator: inputNumber, trigger: 'blur'}
          ],
          loanTermMin: [
            {validator: inputNumberMax, trigger: 'blur'}
          ],
          loanTermMax: [
            {validator: inputNumberMax, trigger: 'blur'}
          ],
          selfAssetMin: [
            {validator: inputNumber, trigger: 'blur'}
          ],
          selfAssetMax: [
            {validator: inputNumber, trigger: 'blur'}
          ],
          creditScoreMin: [
            {validator: inputNumberValue, trigger: 'blur'}
          ],
          creditScoreMax: [
            {validator: inputNumberValue, trigger: 'blur'}
          ],
          yearRatesMax: [
            {validator: inputNumber, trigger: 'blur'}
          ],
          yearRatesMin: [
            {validator: inputNumber, trigger: 'blur'}
          ]
        },
        defaultEnums:{
          assLevelsList:[],
          assTypeList:[],
          loanTypeEnumList: [],
          refundWayList: []
        },
        checkedEnums:{
          assLevelsList:[],
          assTypeList:[],
          loanTypeEnumList: [],
          refundWayList: [],
          assType:'CREDIT'
        },
        setupOptions: {},
        currentOptions:[],
        getCities: {
          editCities: false,
          provinces: [],
          myCities: [],
          cities: [],
          myCheckedCities:[],
          checkedcities: [],
          checkedeCitiesRegions: ''
        }
      }
    },
    created() {
      this.getLoanConfig();
      this.getOptions(this.$enum.LOAN_TYPE,this.checkedEnums.assType, () => {
        this.defaultEnums.loanTypeEnumList = this.currentOptions;
      })
    },
    methods: {
      showChooseRegions(){
        this.handleGetRegionEnum('86');
        this.getCities.editCities = true;
        if(this.getCities.checkedcities.length > 0){
          this.getCities.myCheckedCities = this.getCities.checkedcities;
        }
      },
      handeGetCitiesByRegions(regions){
        getCitiesByRegions(regions).then(response => {
          const res = response.data;
          if(res.code === 200){
            setTimeout(() => {
              this.getCities.checkedcities = res.body;
              this.filterCityByProvince(res.body);
            },1000);
          }
        }, () => {})
      },
      handleGetRegionEnum(region){
        let _this = this;
        let _region = ''
        if(region === '86'){
          _region = region;
        }else{
          _region = region.region;
        }
        getRegionEnum(_region).then(response => {
          let res = response.data;
          if(res.code === 200){
            if(_region === '86'){
              this.getCities.provinces = res.body;
            } else{
              this.getCities.cities = res.body;
              this.filterCityByProvince(this.getCities.cities);

              let citiyRegions = '';
              let _regionsArr = this.getCities.checkedeCitiesRegions.split(',');

              res.body.forEach(item => {
                citiyRegions += item.region + ',';
              });
              citiyRegions = citiyRegions.substring(0, citiyRegions.length - 1);
              let _citiyRegions = citiyRegions.split(",");

              for(let j = 0; j < _citiyRegions.length; j++){
                for( let i = 0; i < _regionsArr.length; i ++){
                  if(_regionsArr[i] === _citiyRegions[j]){
                    _this.getCities.myCities.push(res.body[j]);
                  }
                }
              }

            }
          }
        }, () => {})
      },
      filterEnums(enumsString,enumList){
        enumsString.split(',').forEach( (item) => {
          enumList.push(item);
        });
      },
      getLoanConfig(){
        getLoanConfig().then(response => {
          let res = response.data;
          if(res.code === 200 && res.body){
            if(res.body.regions){

              this.getCities.checkedeCitiesRegions = res.body.regions;
//              this.getCities.defaultCitiesRegions = res.body.regions;

              this.handeGetCitiesByRegions(res.body.regions);
            }
            this.setupOptions = res.body;

            if (res.body.yearRatesMin !== 0) {
              this.setupOptions.yearRatesMin = (res.body.yearRatesMin) ? parseFloat((this.$floatMultiply(res.body.yearRatesMin, 100)).toFixed(2)) : '';
            } else {
              this.setupOptions.yearRatesMin = res.body.yearRatesMin.toString();
            }

            if (res.body.yearRatesMax !== 0) {
              this.setupOptions.yearRatesMax = (res.body.yearRatesMax) ? parseFloat((this.$floatMultiply(res.body.yearRatesMax, 100)).toFixed(2)) : '';
            } else {
              this.setupOptions.yearRatesMax = res.body.yearRatesMax.toString();
            }

            if (res.body.assetLevelEnums) {
              this.filterEnums(res.body.assetLevelEnums, this.checkedEnums.assLevelsList);
            }
            if (res.body.assetKindEnums) {
              this.filterEnums(res.body.assetKindEnums, this.checkedEnums.assTypeList);
            }
            if (res.body.loanKindEnums) {
              this.filterEnums(res.body.loanKindEnums, this.checkedEnums.loanTypeEnumList);
            }
            if (res.body.repayWayEnums) {
              this.filterEnums(res.body.repayWayEnums, this.checkedEnums.refundWayList);
            }
          }
        }, response => {})
      },
      handleCheckedAsset(val){
        this.checkedEnums.assType = val;
        this.getOptions(this.$enum.LOAN_TYPE, val,() => {
          this.defaultEnums.loanTypeEnumList = this.currentOptions;
          this.setupOptions.assetKindEnums = '';
        });
      },
      getOptions(kind, group, callback) {
        const enums = this.$store.state.enums;
        if (enums && enums[`${kind}.${group}`]) {
          this.currentOptions = enums[`${kind}.${group}`];
        }
        getSysEnum(kind, group).then((response) => {
          const res = response.data;
          if (res.code === 200) {
            this.currentOptions = res.body.map(_ => ({text: _.displayName, value: _.enumKey}));
            callback&&callback()
          }
        }, () => {})
      },
      checkedItems(value){
        let _items = '';
        value.forEach(item => {
          _items += item + ',';
        });
        _items = _items.substring(0, _items.length - 1);
        return _items;
      },
      handleCheckedLevels(value){
        this.setupOptions.assetLevelEnums = this.checkedItems(value);
      },
      handleCheckedLoanType(value){
        this.setupOptions.loanKindEnums = this.checkedItems(value);
      },
      handleCheckedRefundWay(value){
        this.setupOptions.repayWayEnums = this.checkedItems(value);
      },
      filterCityByProvince(cities){
        cities.forEach(item => {
          switch (item.region) {
            case '110100' :
              item.name = '北京市';
              break;
            case '110200' :
              item.name = '北京(县)';
              break;
            case '120100' :
              item.name = '天津市';
              break;
            case '120200' :
              item.name = '天津(县)';
              break;
            case '310100' :
              item.name = '上海市';
              break;
            case '310200' :
              item.name = '上海(县)';
              break;
            case '500100' :
              item.name = '重庆市';
              break;
            case '500200' :
              item.name = '重庆(县)';
              break;
            case '500300' :
              item.name = '重庆(区)';
              break;
            default :
              break;
          }
        })
      },
      filterRepeatCities(myArray) {
        let _rgn = '', newArr = [];
        myArray.forEach(item => {
          _rgn += item.region + ',';
        });
        _rgn = _rgn.substring(0, _rgn.length - 1);
        newArr = Array.from(new Set(_rgn.split(',')));

        let myRegions = '';
        newArr.forEach(item => {
          myRegions += item + ',';
        })
        myRegions = myRegions.substring(0, myRegions.length -1);
        return myRegions;
      },
      handleCheckedCitiesChange(value) {
        let myRegions = this.filterRepeatCities(value);

        if(myRegions === ''){
          this.getCities.myCheckedCities = [];
          return;
        }
        getCitiesByRegions(myRegions).then(response => {
          const res = response.data;
          if (res.code === 200){
            this.getCities.myCheckedCities = res.body;
            this.filterCityByProvince(res.body);
          }
        }, (response) => {});
      },
      handleCheckedCitiesOk(){
        if(this.getCities.myCheckedCities.length === 0) {
          this.getCities.checkedcities = [];
          this.getCities.editCities = false;
          this.getCities.checkedeCitiesRegions = '';
          this.setupOptions.regions = '';
          return;
        }
        this.getCities.editCities = false;
        this.getCities.checkedeCitiesRegions = '';
        this.getCities.myCheckedCities.forEach(item => {
          this.getCities.checkedeCitiesRegions += item.region + ','
        });
        this.getCities.checkedeCitiesRegions = this.getCities.checkedeCitiesRegions.substring(0, this.getCities.checkedeCitiesRegions.length - 1);
        this.setupOptions.regions = this.getCities.checkedeCitiesRegions;

        this.handeGetCitiesByRegions(this.getCities.checkedeCitiesRegions);
      },
      handlePostLoanConfig(){
        let _yearRatesMin = this.setupOptions.yearRatesMin;
        let _yearRatesMax = this.setupOptions.yearRatesMax;

        let _regions = '';
        if (this.getCities.checkedcities.length > 0) {
          this.getCities.checkedcities.forEach((item) => {
            _regions += item.region + ',';
          });
          this.setupOptions.regions = _regions.substring(0, _regions.length - 1);
        } else {
          this.setupOptions.regions = '';
        }

        const setupOptions = this.$objFilter(this.$deepcopy(this.setupOptions), _ => _ !== '');

        if(_yearRatesMin === 0) {
          setupOptions.yearRatesMin = 0;
        }else if(_yearRatesMin === '') {
          setupOptions.yearRatesMin = null;
        }else{
          setupOptions.yearRatesMin = this.$floatDivide(_yearRatesMin, 100);
        }

        if(_yearRatesMax === 0) {
          setupOptions.yearRatesMax = 0;
        }else if(_yearRatesMax === '') {
          setupOptions.yearRatesMax = null;
        }else{
          setupOptions.yearRatesMax = this.$floatDivide(_yearRatesMax, 100);
        }

        this.$refs['setupOptions'].validate((valid) => {
          if (valid) {
            postLoanConfig(setupOptions).then(response => {
              if(response.data.code === 201){
                setTimeout(() => {
                  this.$message({
                    message: "资产准入数据设置成功",
                    type: 'success'
                  });
                  this.getLoanConfig();
                  this.$refs['setupOptions'].resetFields();
                },1000)
              }
            },(response) => {});
          } else {
            return false;
          }
        });


      }
    }
  }

</script>
<style>
  .clear {
    zoom:1;
  }
  .clear:after,.clear:before {
    clear: both;
    content: '';
    height:0;
    line-height:0;
    display: table;
  }
.setup {
  display: flex;
  width: 80%;
  margin: 20px auto;
  border-left:1px solid #dfe6ec;
  border-top:1px solid #dfe6ec;
}
.setup > .el-col {
  line-height:40px;
  border-right:1px solid #dfe6ec;
  border-bottom:1px solid #dfe6ec;
  padding-left:10px;
}
.setup > .el-col.inputs {
  padding: 10px 0 10px 10px;
}
.setup > .el-col .center {
  text-align: center;
}
.cities {
  position: relative;
}
.cities >div span {
  margin-right:10px;
}
.cities .el-button--text {
  position: absolute;
  right:20px;
  top: 50%;
  margin-top: -18px;
  font-size: 100%;
}
.savesetup {
  text-align: center;
  padding-bottom: 50px;
}

.choosecities,.choosecities .mask {
  width: 100%;
  height:100%;
  left:0;
  top:0;

}
.choosecities {
  position: fixed;
  z-index: 99;
}
.choosecities .mask {
  position: absolute;
  z-index: 100;
  background: rgba(0,0,0,0.3);
}
.choosecities  .content {
  width: 600px;
  padding-bottom: 70px;
  position: absolute;
  left:50%;
  top:50%;
  z-index: 9999;
  margin: -200px 0 0 -300px;
  background: #fff;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px ;
  border-radius: 8px;
}
.choosecities  .content h2 {
  height: 40px;
  line-height:40px;
  font-size:120%;
  font-weight:normal;
  padding-left:20px;
  margin:0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #e5e5e5;
}
.el-checkbox-group,.el-radio-group {
  padding: 0 20px;
  line-height: 40px;
}
.el-checkbox-group .el-checkbox, .el-radio-group .el-radio{
  float: left;
  margin:0 20px 0 0;
}
  .choose {
    border-bottom:1px solid #ddd;
    padding: 0 0 10px 0;
  }
  .choose >ul li {
    float: left;
    list-style: none;
    margin-right: 15px;
    line-height: 40px;
    color: #5a5e66;
    font-size: 14px;
  }
  .btns {
    width: 80%;
    position: absolute;
    bottom:20px;
    left:10%;
    text-align: center;
  }
  .btns .el-button {
    padding: 10px 30px;
  }
</style>
