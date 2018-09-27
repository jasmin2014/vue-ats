<!--风控配置-->
<template>
  <div class="main">
    <el-row>
      <el-table ref="table"
                :data="list"
                class='table-center' border style="margin-top:20px;"
                :span-method="objectSpanMethod">
        <!--<el-table-column type="index" width="50" label="序号"></el-table-column>-->
        <el-table-column prop="assetOrgName" label="所属资产渠道"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="riskKind" label="风控类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.RISK_TYPE, this.$enum.RISK_TYPE_GROUP))"></el-table-column>
        <el-table-column prop="riskStrategyName" label="风控策略"></el-table-column>
        <el-table-column prop="riskStrategyVersionName" label="风控版本"></el-table-column>


        <!--<el-table-column label="风控类型">-->
        <!--<template slot-scope="scope">-->
        <!--<div class="table-cell" v-for="item in scope.row.chaList">{{item.riskKind}}</div>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column label="风控策略">-->
        <!--<template slot-scope="scope">-->
        <!--<div class="table-cell" v-for="item in scope.row.chaList">{{item.riskStrategyName}}</div>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column prop="riskStrategyVersionName" label="风控版本">-->
        <!--<template slot-scope="scope">-->
        <!--<div class="table-cell" v-for="item in scope.row.chaList">{{item.riskStrategyVersionName}}</div>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column label="操作">
          <el-table-column label="编辑策略">
            <template slot-scope="scope">
              <el-tooltip content="编辑策略" v-if="scope.row.riskKind">
                <el-button icon="fa fa-edit" size="small" type="info" @click="handleEdit(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="增加策略" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="增加策略">
                <el-button icon="fa fa fa-plus" size="small"
                           @click="handleCreate(scope.row)">
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table-column>

      </el-table>
    </el-row>

    <!--策略-->
    <el-dialog :title="strategyTitle" class="customDialog" :visible.sync="isStrategy" @close="handleDialogClose">
      <el-form :model="tactics" label-width="100px" ref="form" :rules='rules'>
        <el-row>
          <el-col :span="22">
            <el-form-item label="资产渠道" prop="assetChannel">
              <ats-select v-model="tactics.assetOrgName"
                          :org="this.$enum.BUSINESS_ASSET"
                          :disabled="true"
              ></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="资产类型" prop="assetKind">
              <ats-select v-model="tactics.assetKind" :clearable="true"
                          :kind="this.$enum.ASSET_TYPE"
                          :group="this.$enum.ASSET_TYPE"
                          :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"
                          :disabled="true"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="项目名称" prop="loanKind">
              <ats-select v-model="tactics.loanKind" :clearable="true"
                          :kind="this.$enum.LOAN_TYPE"
                          :group="tactics.assetKind"
                          :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, tactics.assetKind))"
                          :disabled="true"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="风控类型" prop="riskKind">
              <ats-select v-model="tactics.riskKind"
                          :kind="this.$enum.RISK_TYPE"
                          :group="this.$enum.RISK_TYPE_GROUP"
                          :formatter="(row, col, val) => (this.$filter(val, this.$enum.RISK_TYPE, this.$enum.RISK_TYPE_GROUP))">
              </ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="风控策略" prop="riskStrategy">
              <ats-select v-model="tactics.riskStrategy"
                          :options="configuresList"
                          placeholder="请选择"
                          @change="changeCurrentName">
              </ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="风控版本" prop="riskStrategyVersion">
              <ats-select v-model="tactics.riskStrategyVersion"
                          placeholder="请选择"
                          :options="versionList"
                          @change="changeVersion"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleSave">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getConfigList, getConfigures, createStrategy, editStrategy} from '../../api/asset';

  export default {
    data() {
      return {
        rules: {
          riskKind: [{required: true, message: '请选择风控类型!', tigger: 'change'}],
          riskStrategy: [{required: true, message: '请选择风控策略!', tigger: 'change'}],
          riskStrategyVersion: [{required: true, message: '请选择风控版本!', tigger: 'change'}]
        },
        list: [],
        categoryRisks: [],
        configuresList: [],
        tactics: {
          assetOrgName: "",
          assetKind: "",
          loanKind: "",
          riskKind: "",
          riskStrategy: "",
          riskStrategyName: "",
          riskStrategyVersion: "",
          riskStrategyVersionName: "",
          categoryId: "",  //分类id
          id: ""  //风控id
        },
        isStrategy: false,
        strategyTitle: "",
        objs: {},
        keyIndex: {},
        riskStrategyName: "",
        riskStrategyVersionName: "",
        versionList: [],
        id: this.$route.params.id,
        tmpId: ''
      };
    },
    computed: {},
    watch: {
      'tactics.riskStrategyVersion'(val, oldval){
        this.tactics.riskStrategyVersion = val;
      }
    },
    created() {
      this.getList();
      this.getConfigures();
    },
    methods: {
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        const assetKind = row.assetKind;
        const loanKind = row.loanKind;
        const key = assetKind + "_" + loanKind;
        const len = this.objs[key];
        if (this.keyIndex[key] === rowIndex) {
          if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 7) {
            return {
              rowspan: len,
              colspan: 1
            }
          }
        } else {
          if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 7) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      changeCurrentName(vid){
        this.tactics.riskStrategyVersion = '';
        this.changeName(vid)
      },
      changeName(vid){
        if (vid) {
          const name = this.configuresList.find((item) => {
            return item.value === vid;
          });
          this.riskStrategyName = name.text;
          this.versionList = name.versionList;
        }
      },
      changeVersion(vid){
        const name = this.versionList.find((item) => {
          return item.value === vid;
        })
        if (name) {
          this.riskStrategyVersionName = name.text;
        }
      },
      handleCreate(row){
        this.strategyTitle = '增加策略';
        this.tactics.assetOrgName = row.assetOrg;
        this.tactics.assetKind = row.assetKind;
        this.tactics.loanKind = row.loanKind;
        this.tactics.categoryId = row.categoryId;
        this.tactics.id = row.id;
        this.isStrategy = true;

      },
      handleEdit(row){
        this.strategyTitle = '编辑策略';
        this.tactics.assetOrgName = row.assetOrg;
        this.tactics.assetKind = row.assetKind;
        this.tactics.loanKind = row.loanKind;
        this.tactics.riskKind = row.riskKind;
        this.tactics.riskStrategyVersion = row.riskStrategyVersion;
        this.tactics.riskStrategy = row.riskStrategy;
        this.tactics.categoryId = row.categoryId;
        this.tactics.id = row.id;
        this.tmpId = row.id;
        this.changeName(row.riskStrategy);
        this.isStrategy = true;
      },
      handleDialogClose(){
        this.tactics = {};
        this.versionList = [];
        this.$refs['form'].resetFields();
      },
      handleSave(){
        this.tactics.riskStrategyName = this.riskStrategyName;
        this.tactics.riskStrategyVersionName = this.riskStrategyVersionName;
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.strategyTitle === '增加策略') {
              this.createStrategy();
            } else if (this.strategyTitle === '编辑策略') {
              this.editStrategy(this.tmpId);
            }
          } else {
            return false;
          }
        })
      },
      handleCancel(){
        this.isStrategy = false;
      },
      getList() {
        getConfigList(this.id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.list = res.body;
            this.objs = {};
            this.keyIndex = {};
            let keyIndex = "";
            for (var i = 0; i < this.list.length; i++) {
              var assetKind = this.list[i].assetKind;
              var loanKind = this.list[i].loanKind;
              var key = assetKind + "_" + loanKind;

              if (keyIndex !== key) {
                this.keyIndex[key] = i;
              }
              if (!this.objs[key]) {
                this.objs[key] = 1;
              } else {
                this.objs[key]++;
              }
              keyIndex = key;
            }
          }
        })
      },
      //下拉
      getConfigures(){
        getConfigures().then(response => {
          const res = response.data;
          if (res.code === 200) {
            if (res.body) {
              this.configuresList = res.body.map(_ => ({
                text: _.projectName,
                value: _.projectId,
                versionList: _.projectVersionList.map(item => ({
                  text: item.version,
                  value: item.versionId
                }))
              }));
            }
          }
        })
      },
      //添加
      createStrategy(){
        const tactics = this.$objFilter(this.$deepcopy(this.tactics), _ => _ !== '');
        createStrategy(tactics).then(response => {
          const res = response.data;
          if (response.status === 200) {
            this.isStrategy = false;
            this.tactics = {};
            setTimeout(() => {
              this.getList();
            }, 1000);
          }
        })
      },
      //编辑
      editStrategy(id){
        const tactics = this.$objFilter(this.$deepcopy(this.tactics), _ => _ !== '');
        editStrategy(id, tactics).then(response => {
          const res = response.data;
          if (response.status === 200) {
            this.isStrategy = false;
            this.tactics = {};
            setTimeout(() => {
              this.getList();
            }, 1000);
          }
        }, () => {
        })
      }
    }
  };
</script>

<style lang="scss">
  .table-cell {
    border-bottom: 1px solid #eee;
    padding: 10px;
  }

  .table-cell:last-child {
    border-bottom: none;
  }
</style>
