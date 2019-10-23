<!--机构列表-->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="5">
          <el-form-item label="业务端">
            <el-select v-model="search.orgType" clearable>
              <el-option :value="1" label="资金端"></el-option>
              <el-option :value="2" label="资产端"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKey"
                      placeholder="机构名称/统一社会信用代码/法人姓名"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查询"
                     @click="handleSearch"></el-button>
          <el-button v-action="'OrgCreate'"
                     type="primary" icon="fa fa-plus" title="新增机构"
                     @click="handleCreate"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" border>
        <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :key="index" align="center"></el-table-column>
        <el-table-column label="操作" width="250px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-tooltip v-action="'OrgDetail'"
                        content="查看">
              <el-button icon="fa fa-eye" size="small"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgEdit'"
                        content="编辑">
              <el-button icon="fa fa-edit" size="small" type="info"
                         @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgEnableOrDisabled'"
                        v-if="scope.row.useFlag === 0"
                        content="启用">
              <el-button icon="fa fa-check-square" size="small" type="success"
                         @click="handleStatusChange(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgEnableOrDisabled'"
                        v-if="scope.row.useFlag === 1"
                        content="禁用">
              <el-button icon="fa fa-window-close" size="small" type="warning"
                         @click="handleStatusChange(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="totalRecord" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getOrgList, switchOrgStatus} from '../../api/org'

  export default {
    data() {
      return {
        totalRecord: 0,
        search: {
          pageNumber: 1,
          pageSize: 20
        },
        list: [],
        table: [
          {
            label: 'ID',
            prop: 'id'
          },
          {
            label: '机构编号',
            prop: 'partyNo'
          },
          {
            label: '机构名称',
            prop: 'orgName'
          },
          {
            label: '业务端',
            prop: 'orgType',
            formatter: (row, col, val) => (val == 1 ? '资金端' : (val == 2 ? '资产端' : ''))
          },
          {
            label: '统一社会信用代码',
            prop: 'usciCode'
          },
          {
            label: '机构简码',
            prop: 'orgShortName'
          },
          {
            label: '法人代表',
            prop: 'legalPartyName'
          },
          {
            label: '相关联系人',
            prop: 'contactPartyName'
          },
          {
            label: '手机号码',
            prop: 'contactPartyMobile'
          },
          {
            label: '创建时间',
            prop: 'createdTime'
          },
          {
            label: '创建人',
            prop: 'createdBy'
          },
          {
            label: '状态',
            prop: 'useFlag',
            formatter: (row, col, value) => this.$filterBoolean(value, '启用', '禁用')
          }
        ]
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      handleSearch() {
        this.getData(1);
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleCreate() {
        this.$router.push({ name: 'OrgCreate' });
      },
      handleDetail(row) {
        this.$router.push({ name: 'OrgDetail', params: { id: row.id } });
      },
      handleEdit(row) {
        // if (row.status === '1') {
        //   this.$alert('请先禁用该机构', '提示', {
        //     type: 'warning'
        //   });
        //   return;
        // }
        this.$router.push({ name: 'OrgEdit', params: { id: row.id } });
      },
      handleStatusChange(row) {
        this.$confirm(`确定${row.useFlag == 1 ? '禁用' : '启用'}该机构吗?`, '提示', {
          type: 'warning'
        }).then(() => {
          this.changeStatus(row.id, row.useFlag == 1 ? '0' : '1');
        });
      },

      getData(pageNumber) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = pageNumber;
        getOrgList(search).then(response => {
          const res = response.data;
          if (res.code === 200 && res.body) {
            this.list = res.body.list || [];
            this.totalRecord = res.body.totalRecord;
          } else {
            this.list = [];
            this.totalRecord = 0;
          }
        }, () => {
          this.list = [];
          this.totalRecord = 0;
        })
      },
      // 开启关闭
      changeStatus(partyId, val) {
        switchOrgStatus(partyId, val).then(response => {
          const res = response.data;
          if (res.code === 200) {
            setTimeout(() => {
              this.getData(this.search.pageNumber);
            }, 1000);
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        }, () => {
          this.getData(this.search.pageNumber);
        })
      }
    }
  }
</script>
