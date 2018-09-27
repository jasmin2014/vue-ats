<!-- 机构关系管理 -->
<template>
  <div>
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="5">
          <el-form-item label="服务方式">
            <ats-select v-model="search.serviceType"
                        :kind="this.$enum.SERVICE_TYPE"
                        :group="this.$enum.SERVICE_TYPE"
                        placeholder="全部"
                        @change="handleRelationTypeChange"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" v-if="search.serviceType">
          <el-form-item :label="searchOrgLabel">
            <ats-select v-model="search.partyId"
                        :org="orgType"
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
        <!--<el-table-column v-for="col in table" :prop="col.prop" :label="col.label" :formatter="col.formatter"-->
                         <!--:key="col.prop" align="center"></el-table-column>-->
        <el-table-column prop="relNo" label="关系编号"></el-table-column>
        <el-table-column prop="partyNo" label="机构编号"></el-table-column>
        <el-table-column prop="serviceType" label="服务方式"
                         :formatter="(row, col, val) => ($filter(val, $enum.SERVICE_TYPE, $enum.SERVICE_TYPE))"></el-table-column>
        <el-table-column prop="orgName" label="机构名称"></el-table-column>
        <el-table-column prop="firstName" label="机构联系人姓名"></el-table-column>
        <el-table-column prop="mobile" label="机构联系方式"></el-table-column>
        <el-table-column label="放款模式">
          <template slot-scope="scope">
            <p v-for="item in scope.row.loanModels"
               :key="item.id">{{$filter(item, $enum.LOAN_MODEL, $enum.LOAN_MODEL)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="还款模式">
          <template slot-scope="scope">
            <p v-for="item in scope.row.repayModels"
               :key="item.id">{{$filter(item, $enum.REPAY_MODEL, $enum.REPAY_MODEL)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="enableStatus" label="关系状态"
        :formatter="(row,col,val) => (this.$filterBoolean(val, '启用', '禁用'))"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="270px" align="center">
          <template slot-scope="scope">
            <el-tooltip v-action="'OrgRelDetail'"
                        content="查看协议">
              <el-button icon="fa fa-file-text-o" size="small"
                         @click="handleProtocol(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgRelDetail'"
                        content="查看机构关系">
              <el-button icon="fa fa-eye" size="small"
                         @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgRelEnableOrDisabled'"
                        v-if="scope.row.enableStatus === 0"
                        content="启用">
              <el-button icon="fa fa-check-square" size="small" type="success"
                         @click="handleStatusChange(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgRelEnableOrDisabled'"
                        v-if="scope.row.enableStatus === 1"
                        content="禁用">
              <el-button icon="fa fa-window-close" title="关闭" size="small" type="warning"
                         @click="handleStatusChange(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-action="'OrgRelDelete'"
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
                     :page-size="search.pageSize"
                     layout="prev, next"
                     :total="totalRecord"></el-pagination>
    </el-row>

    <!-- 新增弹出框 -->
    <el-dialog :title="orgRelTitle"
               :visible.sync="isDialogCreateVisible"
               width="750px"
               @open="handleDialogOpen"
               @close="handleDialogClose">
      <org-rel ref="rel"
               v-model="detail" :mode="mode"
               @save="handleDialogSave"
               @cancel="handleDialogCancel"></org-rel>
    </el-dialog>

    <!-- 查看协议弹框 -->
    <el-dialog title="相关协议" :visible.sync="isDialogProtocol" @open="handleContractDialogOpen">
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
    deleteOrgRel,
    createOrgRel,
    editOrgRel,
    orgRelDetail,
    getOrgRelContract
  } from '../../api/org'

  export default {
    components: {
      OrgRel,
      ContractList
    },
    data() {
      return {
        orgRelTitle: '',
        totalRecord: 0,
        search: {
          pageNumber: 1,
          pageSize: 20
        },
        list: [],
        orgType: '',
        table: [
          { label: '关系编号', prop: 'relNo' },
          { label: '机构编号', prop: 'partyNo' },
          {
            label: '服务方式',
            prop: 'serviceType',
            formatter: (row, col, val) => this.$filter(val, this.$enum.SERVICE_TYPE, this.$enum.SERVICE_TYPE)
          },
          { label: '机构名称', prop: 'orgName' },
          { label: '机构联系人姓名', prop: 'firstName' },
          { label: '机构联系方式', prop: 'mobile' },
          { label: '放款模式',
            prop: 'loanModels',
            formatter: (row, col, val) => val ? val.map(_ => this.$filter(_, this.$enum.LOAN_MODEL, this.$enum.LOAN_MODEL)).join('，') : ''
          },
          {
            label: '还款模式',
            prop: 'repayModels',
            formatter: (row, col, val) => val ? val.map(_ => this.$filter(_, this.$enum.REPAY_MODEL, this.$enum.REPAY_MODEL)).join('，') : ''
          },
          { label: '关系状态', prop: 'enableStatus', formatter: (row, col, val) => this.$filterBoolean(val, '启用', '禁用') },
          { label: '创建时间', prop: 'createdTime' }
        ],
        isDialogCreateVisible: false, // 新增弹出框
        isDialogProtocol: false, // 查看协议弹出框
        detail: {},
        mode: '',
        orgRelObj: {},
        protocolList: [] // 协议
      }
    },
    computed: {
      searchOrgLabel() {
        if (!this.search.serviceType) return '';
        return this.search.serviceType === this.$enum.SERVICE_TYPE_ASSET ? '资产渠道' : '资金端';
      }
    },
    created() {
      this.getData(1);
    },
    methods: {
      handleRelationTypeChange(val) {
        this.$set(this.search, 'partyId', '');
        if (val === this.$enum.SERVICE_TYPE_ASSET) {
          this.orgType = this.$enum.BUSINESS_ASSET
        } else if (val === this.$enum.SERVICE_TYPE_FUND) {
          this.orgType = this.$enum.BUSINESS_FUND
        }
      },
      handleSearch() {
        this.getData(1);
      },
      handleCreate() {
        this.orgRelTitle = '新增机构关系';
        this.mode = 'CREATE';
        this.isDialogCreateVisible = true;
      },
      handleDialogSave(value) {
        if (this.mode === 'CREATE') {
          this.newOrgRel(value.partyRelDTO.serviceType, value);
        } else if (this.mode === 'EIDT') {
          this.editOrgRel(value);
        }
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
      handleDetail(row) {
        this.orgRelTitle = '查看机构关系';
        this.mode = 'VIEW';
        this.orgRelDetail(row.relId);
      },
      // 编辑暂时先不做
      handleEdit(row) {
        // if (row.status == '1') {
        //   this.$alert('请先禁用该机构关系', '提示', {
        //     type: 'warning'
        //   });
        //   return;
        // }
        this.mode = 'EIDT';
        this.orgRelTitle = '编辑机构关系';
        this.orgRelDetail(row.relId);
      },
      handleStatusChange(row) {
        this.$confirm(`确定${row.enableStatus === 1 ? '禁用' : '启用'}该机构关系吗?`, '提示', {
          type: 'warning'
        }).then(() => {
          this.switchStatus(row.relId, row.enableStatus === 1 ? '0' : '1');
        });
      },
      handleDelete(row) {
        // if (row.status == '1') {
        //    this.$alert('请先禁用该机构关系', '提示', {
        //     type: 'warning'
        //   });
        //   return;
        // }
        this.$confirm('确定删除吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.deleteRow(row.relId);
        });
      },
      // 协议
      handleProtocol(row) {
        this.getContract(row.relId);
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
      switchStatus(relId, val) {
        switchOrgRelStatus(relId, val).then(response => {
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
      deleteRow(relId) {
        deleteOrgRel(relId).then(response => {
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
      },
      // 新增保存
      newOrgRel(serviceType, value) {
        createOrgRel(serviceType, value).then(response => {
          if (response.status === 201) {
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
      // 详情
      orgRelDetail(relId) {
        orgRelDetail(relId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.isDialogCreateVisible = true;
            this.detail = res.body;
          }
        }, () => {
          this.isDialogCreateVisible = false;
          this.getData(this.search.pageNumber);
        })
      },
      // 编辑
      editOrgRel(relId, fromParty, kind, toParty, uri, serviceType) {
        editOrgRel(relId, fromParty, kind, toParty, uri, serviceType).then(response => {
          if (response.status === 200) {
            this.isDialogCreateVisible = false;
            setTimeout(() => {
              this.getData(this.search.pageNumber);
            }, 1000);
            this.$message({
              type: 'success',
              message: '修改成功!'
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
      getContract(relId) {
        getOrgRelContract(relId).then(response => {
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
