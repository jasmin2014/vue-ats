<!--assetSet 资产分类设置-->
<template>
  <div class="asset-set">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetOrg"
                        :org="this.$enum.BUSINESS_ASSET"
                        placeholder="全部"
                        learable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind"
                        :kind="this.$enum.ASSET_TYPE"
                        :group="this.$enum.ASSET_TYPE"
                        placeholder="全部"
                        learable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查询"
                     @click="handleSearch"></el-button>
          <el-button v-action="'AssetCategoryCreate'"
                     type="primary" icon="fa fa fa-plus" le="新增"
                     @click="newAssetCategory" tit></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" class='table-center' border>
        <el-table-column prop="categoryId" label="类别编号"></el-table-column>
        <el-table-column prop="categoryName" label="类名"></el-table-column>
        <el-table-column prop="assetOrgName" label="资产渠道"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => ($filter(val, $enum.ASSET_TYPE, $enum.ASSET_TYPE))"></el-table-column>
        <el-table-column label="项目名称">
          <template slot-scope="scope">
            <p v-for="item in (scope.row.loan.split(','))"
               :key="item.id">{{$filter(item, $enum.LOAN_TYPE, scope.row.assetKind)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建日期"></el-table-column>
        <el-table-column prop="creatorName" label="创建人"></el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-tooltip v-action="'AssetCategoryOrgRate'"
                        content="设置机构费率">
              <el-button size="small" icon="fa fa-gear"
                         @click="goToSet(scope.row)">&nbsp;费率
              </el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetCategoryRisk'"
                        content="风控配置">
              <el-button size="small"
                         @click="handleRisk(scope.row)">风控配置
              </el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetCategorySource'"
                        content="数据源配置">
              <el-button size="small"
                         @click="handleDataSource(scope.row)">数据源配置
              </el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetCategoryEdit'"
                        content="编辑资产分类">
              <el-button size="mini" type="info" icon="fa fa-edit"
                         @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'AssetCategoryDelete'"
                        content="删除资产分类">
              <el-button size="mini" type="danger" icon="el-icon-delete"
                         @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @current-change="getData"
                     :page-size="search.pageSize"
                     layout="prev, next"
                     :total="totalRecord"></el-pagination>
    </el-row>

    <!--资产分类弹框-->
    <el-dialog :title="assetPoolTitle" :visible.sync="isAssetCategory" @close="handleDialogClose">
      <el-form :model="assetCategory" ref="assetCategory" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="资产类名" prop="categoryName">
              <ats-input v-model="assetCategory.categoryName" auto-complete="off"
                         placeholder="必填"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="资产渠道" prop="assetOrg">
              <ats-select v-model="assetCategory.assetOrg"
                          :org="this.$enum.BUSINESS_ASSET"
                          :mode="mode"
              ></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="资产类型" prop="assetKind">
              <ats-select v-model="assetCategory.assetKind" placeholder="全部" :clearable="true"
                          :kind="this.$enum.ASSET_TYPE"
                          :group="this.$enum.ASSET_TYPE"
                          :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"
                          :mode="mode"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="项目名称" prop="loanKindType">
              <ats-checkbox v-if="mode ==='CREATE'"
                            v-model="assetCategory.loanKindType"
                            :kind="this.$enum.LOAN_TYPE"
                            :group="assetCategory.assetKind"
                            :mode="'CREATE'">
              </ats-checkbox>

              <el-checkbox v-else v-for="item in loans" v-model="item.checked"
                           :key="item.loanKind"
                           :label="item.loanKindName"
                           @change="handleChecked(item)"
                           :mode="'EDIT'">
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" v-if="mode == 'CREATE'">
        <el-button type="primary" @click="handleSave">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getCategoryList,
    delCategoryRow,
    newCategory,
    editCategory,
    categoryDecs
  } from '../../api/asset'

  export default {
    data() {
      return {
        mode: '',
        list: [],
        loanKind: '',
        loans: [],
        loanTypeList: [], // 项目名称（原借贷类型）数据
        totalRecord: 0,
        search: {
          pageNumber: 1, // 当前页码
          pageSize: 20, // 当前页条数
          assetOrg: '',
          assetKind: ''
        },
        assetCategory: {
          categoryName: '',
          assetOrg: '',
          assetKind: '',
          loanKindType: [] // 项目名称（原借贷类型）
        },
        assetPoolTitle: '',
        isAssetCategory: false,
        tmpId: '',
        rules: {
          categoryName: [{required: true, message: '请输入资产类名!', trigger: 'blur'}],
          assetOrg: [{required: true, message: '请选择资产渠道!', trigger: 'change'}],
          assetKind: [{required: true, message: '请选择资产类型!', trigger: 'change'}],
          loanKindType: [{type: 'array', required: true, message: '请选择项目名称!', trigger: 'change'}]
        }
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleDelete(row) {
        this.$confirm('确定删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.delCategoryRow(row.categoryId);
        });
      },
      newAssetCategory() {
        this.mode = 'CREATE';
        this.assetPoolTitle = '创建资产类别';
        this.isAssetCategory = true;
      },
      // 保存
      handleSave() {
        this.$refs['assetCategory'].validate((valid) => {
          if (valid) {
            const categoryName = this.assetCategory.categoryName; // 资产类名
            const assetOrg = this.assetCategory.assetOrg; // 资产渠道
            const assetKind = this.assetCategory.assetKind; // 资产类型
            const loanKindType = this.assetCategory.loanKindType;
            this.newCategory(categoryName, assetOrg, assetKind, loanKindType);
          } else {
            return false;
          }
        });
      },
      handleChecked(val) {
        this.editCategory(this.tmpId,val.loanKind,val.checked);
      },
      // 编辑
      handleEdit(row) {
        this.mode = 'VIEW';
        this.categoryDecs(row.categoryId);
        this.tmpId = row.categoryId;
      },
      handleDialogClose() {
        this.$refs['assetCategory'].resetFields();
        this.assetCategory = {
          loanKindType: []
        };
      },
      handleCancel() {
        this.isAssetCategory = false;
      },
      // 费率设置
      goToSet(row) {
        this.$router.push({
          name: 'AssetCategoryOrgRate',
          params: {id: row.categoryId},
          query: {assetKind: row.assetKind}
        });
      },
      // 风控配置
      handleRisk(row) {
        this.$router.push({
          name: 'AssetCategoryRisk',
          params: {id: row.categoryId}
        });
      },
      // 数据源配置
      handleDataSource(row) {
        this.$router.push({
          name: 'AssetCategorySource',
          params: {id: row.categoryId}
        });
      },
      // 列表
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getCategoryList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.totalRecord = res.body.totalRecord;
            this.search.pageNumber = index;
          } else {
            this.list = [];
            this.totalRecord = 0;
          }
        }, () => {
          this.list = [];
          this.totalRecord = 0;
        })
      },
      // 删除
      delCategoryRow(categoryId) {
        delCategoryRow(categoryId).then(response => {
          if (response.status === 204) {
            this.getData(this.search.pageNumber);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }, () => {
          this.getData(this.search.pageNumber);
        })
      },
      // 新增
      newCategory(categoryName, assetOrg, assetKind, loanKind) {
        newCategory(categoryName, assetOrg, assetKind, loanKind).then(response => {
          if (response.status === 201) {
            this.assetCategory = {
              loanKindType: []
            };
            this.isAssetCategory = false;
            this.getData(this.search.pageNumber);
            this.$message({
              type: 'success',
              message: '新增成功!'
            });
          }
        }, () => {
        })
      },
      // 查看
      categoryDecs(categoryId) {
        categoryDecs(categoryId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.assetPoolTitle = '修改资产类别';
            this.isAssetCategory = true;
            const decs = res.body;
            this.assetCategory.categoryName = decs.categoryName;
            this.assetCategory.assetOrg = decs.assetOrg;
            this.assetCategory.assetKind = decs.assetKind;
            this.assetCategory.loanKindType = decs.loanKinds.map(_ => _.loanKind);
            this.loans = res.body.loanKinds;
          }
        }, () => {
          this.getData(this.search.pageNumber);
        })
      },
      // 编辑
      editCategory(categoryId, loanKind, checked) {
        editCategory(categoryId, loanKind, checked).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.getData(this.search.pageNumber);
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .asset-set {
    .el-table {
      .cell {
        p {
          margin-top: 5px;
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
