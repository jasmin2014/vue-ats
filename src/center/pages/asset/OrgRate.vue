<!--ogrRate 机构费率-->
<template>
  <div>
    <el-form class="form-label flex fixed-width"
             :model="search"
             ref="search"
             :rules="searchRules">
      <el-row>
        <el-col :span="5">
          <el-form-item label="项目名称" prop="loanKind">
            <ats-select v-model="search.loanKind" :options="myLoanKindList"
                        placeholder="请选择"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="借贷属性" prop="loanAttribute">
            <ats-select v-model="search.loanAttribute"
                        :kind="this.$enum.LOAN_PROP"
                        :group="this.$enum.LOAN_PROP"
                        placeholder="请选择"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查询"
                     @click="handleSearch"></el-button>
          <el-button type="primary" icon="fa fa-plus" title="添加"
                     @click="handleCreate"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" class="table-center" border>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column property="repayWay" label="还款方式"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY))"></el-table-column>
        <el-table-column property="assetProfitRateFirst" label="资产渠道期初返点"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column property="assetProfitRateMiddle" label="资产渠道期中返点"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column property="assetProfitRateLast" label="资产渠道期末返点"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column property="atsProfitRateFirst" label="ATS期初返点"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column property="atsProfitRateMiddle" label="ATS期中返点"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column property="atsProfitRateLast" label="ATS期末返点"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column property="fundProfitRateFirst" label="资金期初收取费率"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column property="fundProfitRateMiddle" label="资金端期中收取费率"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column property="fundProfitRateLast" label="资金端期末收取费率"
                         :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <!--<el-table-column property="fundProfitRateReserve" label="资金端风险金"></el-table-column>-->
        <el-table-column label="相关操作" fixed="right" width="130">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button size="mini" type="info" icon="fa fa-edit"
                         @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除">
              <el-button size="mini" icon="el-icon-delete" type="danger"
                         @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <!--<el-row type="flex" justify="center" class="mgt20">-->
    <!--<el-pagination @current-change="getData"-->
    <!--:page-size="search.pageSize"-->
    <!--layout="prev, next"-->
    <!--:total="totalRecord"></el-pagination>-->
    <!--</el-row>-->

    <!--修改费率信息-->
    <el-dialog :title="orgRateTitle" :visible.sync="isRate" width="1100px" @close="handleClose">
      <el-form ref="form"
               :model="assForm"
               :rules="rules"
               label-width="150px"
               class="demo-ruleForm top20">
        <el-row>
          <el-col :span="8">
            <el-form-item label="资产渠道">
              <ats-select v-model="assForm.assetOrg"
                          :org="this.$enum.BUSINESS_ASSET"
                          disabled></ats-select>
              <!--<ats-input v-model="assForm.assetOrg" disabled></ats-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产类型">
              <ats-select v-model="assForm.assetKind" disabled
                          :kind="this.$enum.ASSET_TYPE" :group="this.$enum.ASSET_TYPE"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <ats-select v-model="assForm.loanKind" disabled
                          :kind="this.$enum.LOAN_TYPE" :group="assetKind"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借贷属性">
              <ats-select v-model="assForm.loanAttribute" disabled
                          :kind="this.$enum.LOAN_PROP" :group="this.$enum.LOAN_PROP"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="还款方式">
              <ats-select v-model="assForm.repayWay"
                          :kind="this.$enum.REPAY_WAY" :group="this.$enum.REPAY_WAY"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="ATS期初返点" prop="atsProfitRateFirst">
              <ats-input v-model="assForm.atsProfitRateFirst" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产渠道期初返点" prop="assetProfitRateFirst">
              <ats-input v-model="assForm.assetProfitRateFirst" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资金端期初收取费率" prop="fundProfitRateFirst">
              <ats-input v-model="assForm.fundProfitRateFirst" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="ATS期中返点" prop="atsProfitRateMiddle">
              <ats-input v-model="assForm.atsProfitRateMiddle" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产渠道期中返点" prop="assetProfitRateMiddle">
              <ats-input v-model="assForm.assetProfitRateMiddle" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资金端期中收取费率" prop="fundProfitRateMiddle">
              <ats-input v-model="assForm.fundProfitRateMiddle" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="ATS期末返点" prop="atsProfitRateLast">
              <ats-input v-model="assForm.atsProfitRateLast" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产渠道期末返点" prop="assetProfitRateLast">
              <ats-input v-model="assForm.assetProfitRateLast" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资金端期末收取费率" prop="fundProfitRateLast">
              <ats-input v-model="assForm.fundProfitRateLast" auto-complete="off"
                         type="number" unit="%"
                         :min="0" :max="100" :step="0.01">
              </ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleSave">确 定</el-button>
        <el-button @click="isRate = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from '../../api/asset';
  /*import {
    getOrgRateList,
    orgRateDetail,
    editOrgRate,
    deleteOrgRate,
    categoryDecs,
    createOrgRate
  } from '../../api/asset'*/

  export default {
    data() {
      const validator = (rule, value, callback) => {
        if (rule.field.endsWith('First')) {
          if (this.assForm.assetProfitRateFirst + this.assForm.atsProfitRateFirst + this.assForm.fundProfitRateFirst !== 100) {
            callback('期初费率之和必须满足100%!')
          } else {
            callback()
          }
        } else if (rule.field.endsWith('Middle')) {
          if (this.assForm.assetProfitRateMiddle + this.assForm.atsProfitRateMiddle + this.assForm.fundProfitRateMiddle !== 100) {
            callback('期中费率之和必须满足100%!')
          } else {
            callback()
          }
        } else if (rule.field.endsWith('Last')) {
          if (this.assForm.assetProfitRateLast + this.assForm.atsProfitRateLast + this.assForm.fundProfitRateLast !== 100) {
            callback('期末费率之和必须满足100%!')
          } else {
            callback()
          }
        }
      };
      const numberRule = [
        {min: 0, max: 100, message: '0-100之间的数字', trigger: 'blur', type: 'number'},
        {
          validator: (rule, value, callback) => {
            if (this.$valid.floatValidator(value, 2)) {
              callback()
            } else {
              callback('保留2位小数')
            }
          },
          trigger: 'blur'
        },
        {validator, trigger: 'submit'}
      ];
      return {
        myLoanKindList: [],
        orgRateTitle: '',
        list: [],
        totalRecord: 0,
        isRate: false,
        id: this.$route.params.id,
        assetKind: this.$route.query.assetKind,
        search: {
          categoryId: this.$route.params.id
        },
        assForm: {
          assetOrg: '',
          assetKind: '',
          loanKind: '',
          loanAttribute: '',
          repayWay: '',
          assetProfitRateFirst: 0,
          assetProfitRateMiddle: 0,
          assetProfitRateLast: 0,
          atsProfitRateFirst: 0,
          atsProfitRateMiddle: 0,
          atsProfitRateLast: 0,
          fundProfitRateFirst: 0,
          fundProfitRateMiddle: 0,
          fundProfitRateLast: 0,
          categoryId: this.$route.params.id
        },
        tmpId: '',
        rules: {
          assetProfitRateFirst: numberRule,
          assetProfitRateMiddle: numberRule,
          assetProfitRateLast: numberRule,
          atsProfitRateFirst: numberRule,
          atsProfitRateMiddle: numberRule,
          atsProfitRateLast: numberRule,
          fundProfitRateFirst: numberRule,
          fundProfitRateMiddle: numberRule,
          fundProfitRateLast: numberRule,
          fundProfitRateReserve: [
            {
              min: 0,
              max: 99999999,
              message: '范围0-99999999',
              trigger: 'blur',
              type: 'number'
            },
            {
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 2)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              },
              trigger: 'blur'
            }
          ]
        },
        searchRules: {
          loanKind: [{required: true, message: '请选择借贷类型', trigger: 'change'}],
          loanAttribute: [{required: true, message: '请选择借贷属性', trigger: 'change'}]
        }
      }
    },
    created() {
      this.getCategoryLoans();
    },
    methods: {
      getCategoryLoans(){
        const params = {
          categoryId: this.$route.params.id
        }
        api.getCategoryLoans(params).then(response => {
          let _data = response.data;
          if(_data.code === 200) {
            this.myLoanKindList = [];
            if(_data.body && _data.body.length){
              _data.body.forEach(item => {
                this.myLoanKindList.push({value:item.loanKind, text: item.loanKindName})
              })
            }
          }
        })
      },
      handleSearch() {
        this.$refs['search'].validate((valid) => {
          if (valid) {
            this.getData();
          } else {
            return false;
          }
        });
      },
      handleCreate() {
        this.isRate = true;
        this.orgRateTitle = '新增费率信息';
        this.categoryDecs(this.id);
      },
      handleEdit(row) {
        this.isRate = true;
        this.orgRateTitle = '修改费率信息';
        this.tmpId = row.id;
        this.orgRateDetail(row.id);
      },
      handleDelete(row) {
        this.$confirm('确定删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.deleteOrgRate(row.id);
        });
      },
      handleClose() {
        this.assForm.repayWay = '';
        this.$refs.form.resetFields();
      },
      handleSave() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            var data = this.$deepcopy(this.assForm);
            data.assetProfitRateFirst = this.assForm.assetProfitRateFirst / 100;
            data.assetProfitRateMiddle = this.assForm.assetProfitRateMiddle / 100;
            data.assetProfitRateLast = this.assForm.assetProfitRateLast / 100;
            data.atsProfitRateFirst = this.assForm.atsProfitRateFirst / 100;
            data.atsProfitRateMiddle = this.assForm.atsProfitRateMiddle / 100;
            data.atsProfitRateLast = this.assForm.atsProfitRateLast / 100;
            data.fundProfitRateFirst = this.assForm.fundProfitRateFirst / 100;
            data.fundProfitRateMiddle = this.assForm.fundProfitRateMiddle / 100;
            data.fundProfitRateLast = this.assForm.fundProfitRateLast / 100;
            if (this.orgRateTitle === '新增费率信息') {
              this.createOrgRate(data);
            } else if (this.orgRateTitle === '修改费率信息') {
              this.editOrgRate(this.tmpId, data);
            }
          } else {
            return false;
          }
        })
      },
      // 列表
      getData() {
        const search = this.$deepcopy(this.search);
        api.getOrgRateList(search).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.list = res.body;
          }
        })
      },
      // 查看
      orgRateDetail(id) {
        api.orgRateDetail(id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.assForm.assetOrg = res.body.assetOrg;
            this.assForm.assetKind = res.body.assetKind;
            this.assForm.loanKind = res.body.loanKind;
            this.assForm.loanAttribute = res.body.loanAttribute;
            this.assForm.repayWay = res.body.repayWay;
            this.assForm.assetProfitRateFirst = this.$floatToPercentage(res.body.assetProfitRateFirst, 100);
            this.assForm.assetProfitRateMiddle = this.$floatMultiply(res.body.assetProfitRateMiddle, 100);
            this.assForm.assetProfitRateLast = this.$floatMultiply(res.body.assetProfitRateLast, 100);
            this.assForm.atsProfitRateFirst = this.$floatMultiply(res.body.atsProfitRateFirst, 100);
            this.assForm.atsProfitRateMiddle = this.$floatMultiply(res.body.atsProfitRateMiddle, 100);
            this.assForm.atsProfitRateLast = this.$floatMultiply(res.body.atsProfitRateLast, 100);
            this.assForm.fundProfitRateFirst = this.$floatMultiply(res.body.fundProfitRateFirst, 100);
            this.assForm.fundProfitRateMiddle = this.$floatMultiply(res.body.fundProfitRateMiddle, 100);
            this.assForm.fundProfitRateLast = this.$floatMultiply(res.body.fundProfitRateLast, 100);
            this.assForm.id = id;
          }
        })
      },
      // 编辑
      editOrgRate(id, data) {
        api.editOrgRate(id, data).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.isRate = false;
            this.getData();
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
          }
        })
      },
      //删除
      deleteOrgRate(id) {
        api.deleteOrgRate(id).then(({data}) => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getData();
          }
        })
      },
      //资产分类详情
      categoryDecs(id) {
        api.categoryDecs(id).then(({data}) => {
          if (data.code === 200) {
            this.assForm.assetOrg = data.body.assetOrg;
            this.assForm.assetKind = data.body.assetKind;
            this.assForm.loanKind = this.search.loanKind;
            this.assForm.loanAttribute = this.search.loanAttribute;
          }
        })
      },
      //新增
      createOrgRate(data) {
        api.createOrgRate(data).then(({data}) => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.getData(1);
            this.isRate = false;
          }
        })
      },
    }
  }
</script>
