<!--机构列表-->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input v-model="search.searchKey"
                      placeholder="机构名称/统一社会信用代码/法人姓名"></el-input>
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
        <el-table-column label="操作" width="270px" align="center">
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
                        v-if="scope.row.enableStatus === 0"
                        content="启用">
              <el-button icon="fa fa-check-square" size="small" type="success"
                         @click="handleStatusChange(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgEnableOrDisabled'"
                        v-if="scope.row.enableStatus === 1"
                        content="禁用">
              <el-button icon="fa fa-window-close" size="small" type="warning"
                         @click="handleStatusChange(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgDelete'"
                        content="删除">
              <el-button icon="el-icon-delete" size="small" type="danger"
                         @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination @current-change="getData"
                     :current-page="search.pageNumber"
                     :page-size="search.pageSize"
                     layout="prev, next"
                     :total="totalRecord"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getOrgList, switchOrgStatus, orgDelete} from '../../api/org'

  export default {
    data() {
      return {
        totalRecord: 0,
        visible2: false,
        search: {
          pageNumber: 1,
          pageSize: 20
        },
        list: [],
        table: [
          {
            label: '机构编号',
            prop: 'partyNo'
          },
          {
            label: '机构名称',
            prop: 'orgName'
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
            prop: 'contactName'
          },
          {
            label: '手机号码',
            prop: 'mobile'
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
            prop: 'enableStatus',
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
      handleCreate() {
        this.$router.push({ name: 'OrgCreate' });
      },
      handleDetail(row) {
        this.$router.push({ name: 'OrgDetail', params: { id: row.partyId } });
      },
      handleEdit(row) {
        // if (row.status === '1') {
        //   this.$alert('请先禁用该机构', '提示', {
        //     type: 'warning'
        //   });
        //   return;
        // }
        this.$router.push({ name: 'OrgEdit', params: { id: row.partyId } });
      },
      handleStatusChange(row) {
        this.$confirm(`确定${row.enableStatus == 1 ? '禁用' : '启用'}该机构吗?`, '提示', {
          type: 'warning'
        }).then(() => {
          this.changeStatus(row.partyId, row.enableStatus == 1 ? '0' : '1');
        });
      },
      handleDelete(row) {
        // if (row.status === '1') {
        //   this.$alert('请先禁用该机构', '提示', {
        //     type: 'warning'
        //   });
        //   return;
        // }
        this.$confirm('确定删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.deleteOrg(row.partyId);
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
      },
      // 删除
      deleteOrg(relId) {
        orgDelete(relId).then(response => {
          if (response.status === 204) {
            setTimeout(() => {
              this.getData(this.search.pageNumber);
            }, 1000);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }, () => {
          this.getData(this.search.pageNumber);
        })
      }
    }
  }
</script>
