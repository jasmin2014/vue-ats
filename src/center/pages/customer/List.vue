<!--客户信息列表-->
<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="5">
          <el-form-item label="主体性质" prop="customerType">
            <ats-select v-model="search.customerType"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKey"
                      :placeholder="searchKeywordTitle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" icon="fa fa-search" @click="handleSearch()"></el-button>
          </el-form-item>
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
              <el-button icon="fa fa-eye" size="small"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @current-change="getData"
                     :current-page="search.pageNumber"
                     :page-size="search.pageSize"
                     layout="prev, next"
                     :total="totalRecord">
      </el-pagination>
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
        search: {
          customerType: this.$enum.SUBJECT_PROP_PERSON,
          searchKey: '',
          pageNumber: 1,
          pageSize: 20
        },
        personTable: [
          { label: '客户编号', prop: 'personNo' },
          { label: '客户姓名', prop: 'customerName' },
          { label: '证件号码', prop: 'customerIdent' },
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
        return this.search.customerType === this.$enum.SUBJECT_PROP_ORGANIZE ? '企业名称/统一社会信用代码/客户编号/企业法人代表姓名' : '客户编号/客户姓名/证件号码/手机号码'
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
      handleDetail(row) {
        this.$router.push({
          name: 'CustomerDetail',
          params: { id: row.partyId },
          query: { type: this.search.customerType }
        });
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
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
    },
    mounted() {
    }
  };
</script>
