<!--客户信息列表-->
<template>
  <div class="customer-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="资产渠道" :error="orgError" required>
            <ats-select v-model="orgId"
                        :org="this.$enum.BUSINESS_ASSET"
                        @change="handleOrgChange"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="主体性质">
            <ats-select v-model="search.customerType"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.searchKey"
                      :placeholder="searchKeywordTitle"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table"
                         :label="col.label" :prop="col.prop" :formatter="col.formatter"
                         align="center"
                         :key="col.index + col.prop + col.label"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip v-action="'CustomerDetail'"
                        content="查看">
              <el-button icon="fa fa-eye" size="small"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="totalRecord" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>
  </div>
</template>
<script>
  import {getIndividualCustomerList, getEnterpriseCustomerList} from '../../api/customer'

  export default {
    data() {
      return {
        list: [], // 列表数据
        totalRecord: 0, // 总条数
        orgId: '',
        orgError: '',
        search: {
          customerType: this.$enum.SUBJECT_PROP_PERSON,
          searchKey: '',
          pageNumber: 1,
          pageSize: 20
        },
        personTable: [
          { label: '客户编号', prop: 'id' },
          { label: '客户姓名', prop: 'name', formatter: (row, col, val) => this.$encoder.personName(val) },
          { label: '证件号码', prop: 'ident', formatter: (row, col, val) => this.$encoder.ident(val) },
          { label: '创建时间', prop: 'createdTime' },
          { label: '创建渠道', prop: 'partyOrgName' },
          { label: '创建人', prop: 'creatorName' }
        ],
        companyTable: [
          { label: '客户编号', prop: 'id' },
          { label: '企业名称', prop: 'name', formatter: (row, col, val) => this.$encoder.companyName(val) },
          { label: '统一社会信用代码', prop: 'ident', formatter: (row, col, val) => this.$encoder.ident(val) },
          { label: '创建时间', prop: 'createdTime' },
          { label: '创建渠道', prop: 'partyOrgName' },
          { label: '创建人', prop: 'creatorName' }
        ],
        table: []
      };
    },
    computed: {
      searchKeywordTitle() {
        return this.search.customerType === this.$enum.SUBJECT_PROP_ORGANIZE ? '企业名称/统一社会信用代码/客户编号' : '客户编号/客户姓名/证件号码'
      }
    },
    created() {
      this.switchTable(this.search.customerType);
      // this.getData(1);
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleDetail(row) {
        this.$router.push({
          name: 'CustomerDetail',
          params: { id: row.loanPartyId },
          query: {
            type: this.search.customerType,
            id: row.id,
            org: this.orgId
          }
        });
      },
      handleOrgChange(val) {
        if (val) {
          this.orgError = '';
        }
      },

      getData(index) {
        if (!this.orgId) {
          this.orgError = '请选择资产渠道';
          return;
        }

        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        delete search.customerType;
        this.getCustomerList(search, this.orgId).then(response => {
          const res = response.data;
          this.switchTable(this.search.customerType);
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.totalRecord = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.list = [];
            this.totalRecord = 0;
          }
        }, () => {
          this.list = [];
          this.totalRecord = 0;
        })
      },
      getCustomerList(search, orgId) {
        if (this.search.customerType === this.$enum.SUBJECT_PROP_ORGANIZE) {
          return getEnterpriseCustomerList(search, orgId)
        } else {
          return getIndividualCustomerList(search, orgId)
        }
      },
      switchTable(type) {
        this.customerType = type;
        if (type === this.$enum.SUBJECT_PROP_PERSON) {
          this.table = this.personTable;
        } else if (type === this.$enum.SUBJECT_PROP_ORGANIZE) {
          this.table = this.companyTable;
        }
      }
    }
  };
</script>
