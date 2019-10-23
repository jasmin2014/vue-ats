<!-- 机构关系管理 -->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="资产机构">
            <ats-select v-model="search.assetOrg"
                        :org="this.$enum.BUSINESS_ASSET"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="资金机构">
            <ats-select v-model="search.fundOrg"
                        :org="this.$enum.BUSINESS_FUND"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" icon="fa fa-search" title="查询"
                     @click="handleSearch"></el-button>
          <el-button v-action="'OrgRelCreate'"
                     type="primary" icon="fa fa-plus" title="新增"
                     @click="handleCreate"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" border class="table-center">
        <el-table-column v-for="col in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"
                         :key="col.prop" align="center"></el-table-column>
        <el-table-column label="操作" width="130px" align="center">
          <template slot-scope="scope">
            <el-tooltip v-action="'OrgRelDetail'"
                        content="查看协议">
              <el-button icon="fa fa-file-text-o" size="small"
                         @click="handleProtocol(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgRelEnableOrDisabled'"
                        v-if="scope.row.relStatus === 0"
                        content="启用">
              <el-button icon="fa fa-check-square" size="small" type="success"
                         @click="handleStatusChange(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgRelEnableOrDisabled'"
                        v-if="scope.row.relStatus === 1"
                        content="禁用">
              <el-button icon="fa fa-window-close" title="关闭" size="small" type="warning"
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

    <!-- 新增弹出框 -->
    <el-dialog title="新增机构关系"
               width="750px"
               :visible.sync="isDialogCreateVisible"
               @open="handleDialogOpen"
               @close="handleDialogClose">
      <org-rel ref="rel"
               v-model="detail" :mode="mode"
               @save="handleDialogSave"
               @cancel="handleDialogCancel"></org-rel>
    </el-dialog>

    <!-- 查看协议弹框 -->
    <el-dialog title="相关协议"
               width="1000px"
               :visible.sync="isDialogProtocol"
               @open="handleContractDialogOpen">
      <contract-list :protocolList="protocolList"></contract-list>
    </el-dialog>
  </div>
</template>

<script>
  import OrgRel from '../../../modules/org/OrgRel.vue'
  import ContractList from './ContractList.vue'
  import {
    getOrgRelList,
    switchOrgRelStatus,
    createOrgRel,
    getOrgRelContract
  } from '../../api/org'

  export default {
    components: {
      OrgRel,
      ContractList
    },
    data() {
      return {
        totalRecord: 0,
        search: {
          pageNumber: 1,
          pageSize: 20
        },
        list: [],
        orgType: '',
        table: [
          { label: '关系编号', prop: 'id' },
          { label: '资产机构', prop: 'assetOrgName' },
          { label: '资产机构ID', prop: 'assetOrgId' },
          { label: '资金机构', prop: 'fundOrgName' },
          { label: '资金机构ID', prop: 'fundOrgId' },
          { label: '协议到期日', prop: 'endDate' },
          { label: '创建时间', prop: 'createdTime' },
          { label: '创建人', prop: 'createdBy' },
          { label: '关系状态', prop: 'relStatus', formatter: (row, col, val) => this.$filterBoolean(val, '启用', '禁用') }
        ],
        isDialogCreateVisible: false, // 新增弹出框
        isDialogProtocol: false, // 查看协议弹出框
        detail: {},
        mode: '',
        protocolList: [] // 协议
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
        this.mode = 'CREATE';
        this.isDialogCreateVisible = true;
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },
      handleDialogSave(value) {
        this.newOrgRel(value);
      },
      handleDialogCancel() {
        this.isDialogCreateVisible = false;
      },
      handleDialogClose() {
        this.detail = {};
        this.mode = 'VIEW';
        this.$refs.rel.clearValidate();
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.$refs.rel && this.$refs.rel.clearValidate();
        })
      },
      handleContractDialogOpen() {
        this.protocolList = [];
      },
      handleStatusChange(row) {
        this.$confirm(`确定${row.relStatus === 1 ? '禁用' : '启用'}该机构关系吗?`, '提示', {
          type: 'warning'
        }).then(() => {
          this.switchStatus(row.id, row.relStatus === 1 ? 0 : 1);
        });
      },
      // 协议
      handleProtocol(row) {
        this.getContract(row.id);
        this.isDialogProtocol = true;
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getOrgRelList(search).then(response => {
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
      // 开启关闭
      switchStatus(id, status) {
        switchOrgRelStatus(id, status).then(response => {
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
      // 新增保存
      newOrgRel(value) {
        createOrgRel(value).then(({ data }) => {
          if (data.code === 201) {
            this.isDialogCreateVisible = false;
            setTimeout(() => {
              this.getData(this.search.pageNumber);
            }, 1000);
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          }
        }, (error) => {
          const errMsg = error.data;
          this.$message({
            type: 'error',
            message: errMsg.message
          });
        })
      },
      // 相关协议 protocol
      getContract(id) {
        getOrgRelContract(id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.protocolList = res.body;
          }
        }, () => {
          this.isDialogProtocol = false;
          this.getData(this.search.pageNumber);
        })
      }
    }
  }
</script>
