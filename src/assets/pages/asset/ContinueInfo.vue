<!--续借查询-->
<template>
  <div class="asset-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="8">
          <el-form-item label="协议编号">
            <el-input v-model="search.contract" placeholder="协议编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" title="查找" @click="handleSearch"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="sourceLoans" border>
        <el-table-column label="原标协议编号" prop="contract" align="center"></el-table-column>
        <el-table-column label="借款属性" prop="kind" align="center">
          <template
            slot-scope="scope"
          >{{ $filter(scope.row.kind, $enum.LOAN_PROP, $enum.LOAN_PROP) }}</template>
        </el-table-column>
        <el-table-column
          prop="loanPartyKind"
          label="主体性质"
          align="center"
          :formatter="(row, col, val) => ($filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"
        ></el-table-column>
        <el-table-column label="姓名" prop="loanPartyName" align="center"></el-table-column>
        <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="$enum.LOAN_STATUS_COLOR_MAP[scope.row.status]"
            >{{ $filter(scope.row.status, $enum.LOAN_STATUS, $enum.LOAN_STATUS_GROUP) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="relationLoans" border style="margin-top: 24px;">
        <el-table-column label="原标关联协议编号" prop="contract" align="center"></el-table-column>
        <el-table-column label="借款属性" prop="kind" align="center">
          <template
            slot-scope="scope"
          >{{ $filter(scope.row.kind, $enum.LOAN_PROP, $enum.LOAN_PROP) }}</template>
        </el-table-column>
        <el-table-column
          prop="loanPartyKind"
          label="主体性质"
          align="center"
          :formatter="(row, col, val) => ($filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"
        ></el-table-column>
        <el-table-column label="姓名" prop="loanPartyName" align="center"></el-table-column>
        <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="$enum.LOAN_STATUS_COLOR_MAP[scope.row.status]"
            >{{ $filter(scope.row.status, $enum.LOAN_STATUS, $enum.LOAN_STATUS_GROUP) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { getRelatedAssets } from "../../api/asset";
export default {
  data() {
    return {
      search: {
        contract: ""
      },
      sourceLoans: [],
      relationLoans: [],
      table: []
    };
  },
  methods: {
    handleSearch() {
      this.getData();
    },
    getData() {
      getRelatedAssets(this.search).then(
        response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.sourceLoans = res.body.sourceLoans || [];
            this.relationLoans = res.body.relationLoans || [];
          } else {
            this.sourceLoans = [];
            this.relationLoans = [];
          }
        },
        () => {
          this.sourceLoans = [];
          this.relationLoans = [];
        }
      );
    }
  }
};
</script>
