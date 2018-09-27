<!--资产端客户列表-->
<template>
  <div class="customer-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="5">
          <el-form-item label="主体性质">
            <ats-select v-model="search.customerType"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="关键词">
            <el-input v-model.trim="search.searchKey" :placeholder="searchKeywordTitle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查找" @click="handleSearch"></el-button>
          <el-button v-action="'CustomerCreate'"
                     type="primary" icon="fa fa-plus" title="新增客户" @click="handleCreate"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" align="center"
                         :key="index"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip v-action="'CustomerDetail'"
                        content="查看">
              <el-button size="small" icon="fa fa-eye"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'CustomerEdit'"
                        content="编辑">
              <el-button size="small" type="info" icon="fa fa-edit"
                         @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="pageTotal" :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getIndividualCustomerList, getEnterpriseCustomerList} from '../../api/customer'

  export default {
    data() {
      return {
        search: {
          customerType: this.$enum.SUBJECT_PROP_PERSON,
          pageSize: 20,
          pageNumber: 1
        },
        customerType: '',
        pageTotal: 0,
        list: [],
        personTable: [
          { label: '客户编号', prop: 'personNo' },
          { label: '客户姓名', prop: 'customerName' },
          { label: '证件号码', prop: 'customerIdent' },
          { label: '手机号码', prop: 'mobile' },
          { label: '创建时间', prop: 'createdTime' },
          { label: '创建渠道', prop: 'source' },
          { label: '创建人', prop: 'creator' }
        ],
        companyTable: [
          { label: '客户编号', prop: 'partyNo' },
          { label: '企业名称', prop: 'enterpriseName' },
          { label: '统一社会信用代码', prop: 'uscCode' },
          { label: '企业法人代表姓名', prop: 'realName' },
          { label: '证件号码', prop: 'ident' },
          { label: '创建时间', prop: 'createdTime' },
          { label: '创建渠道', prop: 'ownerOrgName' },
          { label: '创建人', prop: 'createdName' }
        ],
        table: []
      };
    },
    computed: {
      searchKeywordTitle() {
        return this.search.customerType === this.$enum.SUBJECT_PROP_ORGANIZE ? '客户编号/企业名称/统一社会信用代码/企业法人代表姓名' : '客户编号/客户姓名/证件号码/手机号码'
      }
    },
    created() {
      this.switchTable(this.search.customerType);
      this.getData(1)
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handleCreate() {
        this.$router.push({
          name: 'CustomerCreate',
          query: { type: this.customerType }
        });
      },
      handleDetail(row) {
        this.$router.push({
          name: 'CustomerDetail',
          params: { id: row.partyId },
          query: { type: this.customerType }
        });
      },
      handleEdit(row) {
        this.$router.push({
          name: 'CustomerEdit',
          params: { id: row.partyId },
          query: { type: this.customerType }});
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        delete search.customerType;
        this.getCustomerList(search).then(response => {
          const res = response.data;
          this.switchTable(this.search.customerType);
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.pageTotal = res.body.totalRecord;
            this.search.pageNumber = res.body.pageNumber;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }, () => {
          this.list = [];
          this.pageTotal = 0;
        })
      },
      getCustomerList(search) {
        if (this.search.customerType === this.$enum.SUBJECT_PROP_ORGANIZE) {
          return getEnterpriseCustomerList(search)
        } else {
          return getIndividualCustomerList(search)
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
