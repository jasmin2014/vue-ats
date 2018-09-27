<!--auditProcess 审核流程设置-->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="资产渠道" prop="partyOrgId">
            <ats-select v-model="search.partyOrgId"
                        :org="this.$enum.BUSINESS_ASSET"
                        clearable
                        required></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" icon="fa fa-search" @click="handleSearch('ruleSearch')" title="查询"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" border class='table-center'>
        <el-table-column prop="assetChannelName" label="资产渠道" width="120">
        </el-table-column>
        <el-table-column prop="assetKind" label="资产类型" width="120"
                         :formatter="(row, col, val) => this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)">
        </el-table-column>
        <el-table-column label="客户信息校验">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.infoAudit" @change="handleCheckedInfo(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="客户信用审核">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.creditAudit" @change="handleCheckedCredit(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户资产评估">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.assetsAudit" @change="handleCheckedAudit(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="资产风险评级">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.riskAudit" @change="handleCheckedRisk(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="图片处理">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.pictureAudit" @change="handleCheckedPic(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import {getProcessList, setProcess} from '../../api/audit'

  export default {
    data() {
      return {
        list: [],
        search: {
          partyOrgId: ''
        }
      };
    },
    created() {
    },
    methods: {
      handleSearch() {
        if (this.search.partyOrgId) {
          this.getProcessList(this.search.partyOrgId);
        } else {
          this.list = [];
        }
      },
      // 信息校验
      handleCheckedInfo(row) {
        this.setProcess(row.partyOrgId, row.assetKind, row.infoAuditType, row.infoAudit);
      },
      // 信用审核
      handleCheckedCredit(row) {
        this.setProcess(row.partyOrgId, row.assetKind, row.creditAuditType, row.creditAudit);
      },
      // 资产评估
      handleCheckedAudit(row) {
        this.setProcess(row.partyOrgId, row.assetKind, row.assetsAuditType, row.assetsAudit);
      },
      // 资产风险评级
      handleCheckedRisk(row) {
        this.setProcess(row.partyOrgId, row.assetKind, row.riskAuditType, row.riskAudit);
      },
      // 图片处理
      handleCheckedPic(row) {
        this.setProcess(row.partyOrgId, row.assetKind, row.pictureAuditType, row.pictureAudit);
      },
      // 列表
      getProcessList(partyOrgId) {
        getProcessList(partyOrgId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.list = res.body;
          }
        })
      },
      // 取消选中
      setProcess(partyOrgId, assetKind, auditType, auditValue) {
        setProcess(partyOrgId, assetKind, auditType, auditValue).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.getProcessList(this.search.partyOrgId);
          }
        })
      }
    }
  };
</script>


