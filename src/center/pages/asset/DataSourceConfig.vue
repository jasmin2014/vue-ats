<!--DataSourceConfig 数据源配置-->
<template>
  <div class="main">
    <el-row>
      <el-table :data="list" class="table-center" border style="margin-top:20px">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="assetOrgName" label="所属资产渠道" width="120"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型" width="120"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称" width="120"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column label="数据源">
          <el-table-column label="客户信息">
            <template slot-scope="scope">
              <div class="text-left">
                <el-checkbox v-for="item in scope.row.sourceDataClient"
                             :key="item.auditDataKind"
                             v-model="item.flag"
                             @change="handleChecked(scope.row,item)">{{ item.auditDataName }}
                </el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="资产信息">
            <template slot-scope="scope">
              <div class="text-left">
                <el-checkbox v-for="item in scope.row.sourceDataAsset"
                             :key="item.auditDataKind"
                             v-model="item.flag"
                             @change="handleChecked(scope.row,item)">{{ item.auditDataName }}
                </el-checkbox>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import { getDataSourceList, changeSource } from '../../api/asset';

  export default {
    data() {
      return {
        id: this.$route.params.id,
        list: []
      };
    },
    created() {
      this.getList();
    },
    methods: {
      handleChecked(row, item){
        const data = {
          categoryId:row.categoryId,
          loanKind:row.loanKind,
          auditDataKind: item.auditDataKind,
          flag: item.flag
        };
        changeSource(data).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            setTimeout(() => {
              this.getList();
            }, 1000);
          }
        })
      },
      getList() {
        getDataSourceList(this.id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.list = res.body;
          }
        })
      }
    }
  };
</script>
<style lang="scss">
  .text-left {
    text-align: left;
  }

</style>
