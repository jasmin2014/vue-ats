<!--picture 图片处理-->
<template>
  <div class="main">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="申请日期">
            <ats-date-picker-query v-model="applyDate"></ats-date-picker-query>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="主体性质">
            <ats-select v-model="search.subjectNature"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产类型">
            <ats-select v-model="search.assetKind"
                        :kind="this.$enum.ASSET_TYPE"
                        :group="this.$enum.ASSET_TYPE"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="项目名称">
            <ats-select v-model="search.loanKind"
                        :kind="this.$enum.LOAN_TYPE"
                        :group="search.assetKind"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="资产渠道">
            <ats-select v-model="search.assetChannel"
                        :org="this.$enum.BUSINESS_ASSET"
                        placeholder="全部"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="关键词">
            <el-input v-model="search.otherParams"
                      placeholder="姓名/协议编号/借贷编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="fa fa-search" @click="handleSearch" title="查询"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-table :data="list" class='table-center' border>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="assetChannel" label="资产渠道"
        ></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/法人姓名"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="assuredPartyName" label="担保公司"></el-table-column>
        <el-table-column prop="loanIdent" label="身份证号/统一社会信用代码"></el-table-column>
        <el-table-column prop="assetRiskLevel" label="系统资产风险评级"></el-table-column>
        <el-table-column prop="appliedTime" label="申请日期" width="85"></el-table-column>
        <el-table-column label="操作" width="280px" fixed="right">
          <template slot-scope="scope">
            <el-button v-action="'AuditPicDetail'"
                       size="mini" icon="fa fa-eye" title="查看"
                       @click="picDetail(scope.row)"></el-button>
            <el-button v-action="'AuditPicAudit'"
                       type="primary" size="mini"
                       @click="passAudit(scope.row)">审核通过
            </el-button>
            <el-button v-action="'AuditPicAudit'"
                       type="primary" size="mini"
                       @click="refuseAudit(scope.row)">审核不通过
            </el-button>
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

    <!--审核不通过弹框-->
    <el-dialog title="拒审原因" :visible.sync="nonAudit" size="tiny" @close="handleAuditClose">
      <el-form ref="refuseForm"
               :rules="rules"
               :model="refuseInfo"
               label-width="140px">
        <el-form-item label="请输入拒审原因" prop="description">
          <el-col :span="20">
            <el-input type="textarea" v-model.trim="refuseInfo.description" auto-complete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handleSave">确 定</el-button>
        <el-button @click="nonAudit = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getPicList, picAuditStatus} from '../../api/audit'

  export default {
    data() {
      return {
        nonAudit: false,
        list: [],
        totalRecord: 20,
        search: {
          pageNumber: 1,
          pageSize: 20,
          appliedStartTime: this.$dateStringify(this.$lastNMonth(new Date(), 3)),
          appliedEndTime: this.$dateStringify(new Date()),
          subjectNature: '',
          assetKind: '',
          loanKind: '',
          statusCount: '',
          otherParams: ''
        },
        // 审核不通过弹框
        refuseInfo: {
          description: ''
        },
        id: '',
        auditStep: '',
        rules: {
          description: [
            { required: true, message: '请输入拒审原因', trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      this.getData(1);
    },
    computed: {
      applyDate: {
        get() {
          if (this.search.appliedStartTime || this.search.appliedEndTime) {
            const dateRange = [];
            dateRange[0] = this.search.appliedStartTime;
            dateRange[1] = this.search.appliedEndTime;
            return dateRange;
          } else {
            return '';
          }
        },
        set(range) {
          if (range) {
            this.search.appliedStartTime = range[0];
            this.search.appliedEndTime = range[1];
          } else {
            this.search.appliedStartTime = '';
            this.search.appliedEndTime = '';
          }
        }
      }
    },
    methods: {
      handleSearch() {
        this.getData(1);
      },
      passAudit(row) {
        this.picAuditStatus(row.id, row.auditStep, 'PENDING_STORAGE');
      },
      refuseAudit(row) {
        this.nonAudit = true;
        this.id = row.id;
        this.auditStep = row.auditStep;
      },
      handleAuditClose() {
        this.$refs['refuseForm'].resetFields();
        this.refuseInfo.description = '';
      },
      handleSave() {
        this.$refs['refuseForm'].validate((val) => {
          if (val) {
            this.picAuditStatus(this.id, this.auditStep, 'REJECTED', this.refuseInfo.description)
          } else {
            return false;
          }
        })
      },
      picDetail(row) {
        this.$router.push({
          name: 'AuditPicDetail',
          params: { id: row.id }
        })
      },
      getData(index) {
        const search = this.$deepcopy(this.search);
        search.pageNumber = index;
        getPicList(search).then(response => {
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
      // 审核通过/不通过 picAuditStatus
      picAuditStatus(loanId, currentAuditStep, option, reason = '') {
        picAuditStatus(loanId, option, reason, currentAuditStep).then(response => {
          const res = response.data;
          if (res.code === 200) {
            if (option === 'PENDING_STORAGE') {
              setTimeout(() => {
                this.getData(this.search.pageNumber);
              }, 1000);
              this.$message({
                type: 'success',
                message: '审核通过!'
              });
            } else if (option === 'REJECTED') {
              this.nonAudit = false;
              setTimeout(() => {
                this.getData(this.search.pageNumber);
              }, 1000);
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
            }
          }
        })
      }
    }
  };
</script>
