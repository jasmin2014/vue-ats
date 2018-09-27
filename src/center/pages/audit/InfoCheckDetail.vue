<!-- 效验详情-->
<template>
  <div class="report">
    <el-row>
      <el-col>
        <el-table :data="list" class='report-inr table-center' border style="margin-top:20px;">
          <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
          <el-table-column prop="contract" label="协议编号"></el-table-column>
          <el-table-column prop="assetChannel" label="资产渠道"></el-table-column>
          <el-table-column prop="loanPartyKind" label="主体性质"
                           :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
          <el-table-column prop="assetKind" label="资产类型"
                           :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
          <el-table-column prop="loanKind" label="项目名称"
                           :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
          <el-table-column prop="appliedTime" label="申请日期"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-form label-width="150px">
      <el-row :model="form" label-position="left">
        <h4><span>{{infoTitle1}}</span></h4>
        <el-row class="report-inr">
          <el-col :span="8">
            <el-form-item :label="infoTitle1Name">
              <ats-input v-model="form.name" :mode="'VIEW'"></ats-input>
            </el-form-item>
          </el-col>
          <el-table :data="infoList" class='table-center table-custom' border tooltip-effect="dark"
                    style="width: 100%;">
            <el-table-column prop="auditDataKind" label="验证内容"
                             :formatter="(row, col, val) => $filter(val, $enum.AUDIT_TYPE, row.auditKind)"></el-table-column>
            <el-table-column prop="dataReport" label="数据报告">
              <template slot-scope="scope">
                <a v-if="scope.row.dataReport"
                   :href="scope.row.dataReport"
                   target="_blank" class="el-button el-button--default">查看报告</a>
              </template>
            </el-table-column>
            <el-table-column prop="channelResult" label="渠道提供结果">
              <template slot-scope="scope">
                {{ reportFilter[scope.row.auditDataKind]
                ? $filter(scope.row.channelResult, reportFilter[scope.row.auditDataKind].kind,
                reportFilter[scope.row.auditDataKind].group)
                : scope.row.channelResult }}
              </template>
            </el-table-column>
            <el-table-column prop="sysResult" label="系统评估结果"></el-table-column>
            <el-table-column prop="searchWebsite" label="查询网址">
              <template slot-scope="scope">
                <a :href="'http://'+ scope.row.searchWebsite"
                   target="_blank">{{scope.row.searchWebsite}}</a>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.operateType" placeholder="请选择">
                  <el-option v-for="item in verifyList" :label="item.label" :value="item.status"
                             :key="item.status"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </el-form>

    <div style="margin-top: 20px">
      <el-button type="primary" @click="passAudit()" :disabled="!flag">审核通过</el-button>
      <el-button type="primary" @click="refuseAudit()" :disabled="!flag">审核不通过</el-button>
    </div>

    <!--审核不通过弹框-->
    <el-dialog title="拒审原因" :visible.sync="nonAudit" size="tiny" @close="handleClose">
      <el-form ref="refuseform"
               :model="refuseInfo"
               :rules="rules"
               label-width="140px">
        <el-form-item label="请输入拒审原因：" prop="description">
          <el-col :span="20">
            <el-input type="textarea" v-model="refuseInfo.description" auto-complete="off"></el-input>
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
  import {auditList, auditDetail, infoAuditStatus} from '../../api/audit'

  export default {
    data() {
      return {
        infoTitle1: '',
        infoTitle1Name: '',
        list: [],
        infoList: [],
        pledgeList: [],
        verifyList: [{status: false, label: '未验证'}, {status: true, label: '已验证'}],
        name: '',
        form: {},
        auditStep: '',  //异常状态
        nonAudit: false,
        flag: false,
        // 审核不通过弹框
        refuseInfo: {
          description: ''
        },
        id: this.$route.params.id,
        auditKind: 'CLIENT_INFO_AUDIT', // 识别客户信息
        reportUrl: '',
        rules: {
          description: [
            {required: true, message: '请输入拒审原因', trigger: 'blur'},
            {pattern: /^\s*\S+?(\s?)\S*?\s*$/, message: '不能多个空格', trigger: 'blur'}
          ]
        },
        reportFilter: {
          chsi: {
            kind: this.$enum.EDUCATION,
            group: this.$enum.EDUCATION_GROUP
          }
        }
      };
    },
    created() {
      this.infoTitle1 = '客户身份信息验证:';
      this.infoTitle1Name = '客户姓名';
      this.auditDetail(this.id);
    },
    methods: {
      passAudit() {
        //CREDIT_AUDIT 通过按钮
        this.infoAuditStatus('CREDIT_AUDIT', '', {
          'CLIENT_INFO_AUDIT': this.infoList.map(_ => ({
            id: _.id,
            operateType: _.operateType
          }))
        });
      },
      refuseAudit() {
        this.nonAudit = true; // 不通过弹框
      },
      handleSave() {
        this.$refs.refuseform.validate((val) => {
          const option = 'REJECTED';   //不通过按钮
          const reason = this.refuseInfo.description;
          if (val) {
            this.infoAuditStatus(option, reason)
          } else {
            return false;
          }
        })
      },
      handleClose() {
        this.$refs.refuseform.resetFields();
        this.refuseInfo.description = '';
      },
      // 表格数据
      auditDetail(id) {
        auditDetail(id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.list.push(res.body);
            this.form.name = res.body.loanPartyName;
            this.auditStep = res.body.auditStep;
            this.auditList(this.id, this.auditKind);
          }
        })
      },
      // 验证的详情
      auditList(loanApplicationNo, auditKind) {
        auditList(loanApplicationNo, auditKind).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.flag = true;
            this.infoList = res.body ? res.body : [];
          }
        })
      },
      // 通过不通过状态
      infoAuditStatus(option, reason, data) {
        infoAuditStatus(this.id, this.auditStep, option, reason, data).then(response => {
          const res = response.data;
          if (res.code === 200) {
            if (option == true) {
              this.$message({
                type: 'success',
                message: '审核通过!'
              });
              setTimeout(() => {
                this.$router.push({name: 'AuditCheckList'});
              }, 1000)
            } else {
              this.nonAudit = false;
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              setTimeout(() => {
                this.$router.push({name: 'AuditCheckList'});
              }, 1000)
            }
          }
        })
      }
    }
  };
</script>
<style>
  .report-inr {
    width: 94%;
    margin: 10px auto;
  }
</style>

