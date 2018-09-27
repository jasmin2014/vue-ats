<!--appraisalDetails 资产评估详情-->
<template>
  <el-row>
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

    <div class="report">
      <el-form label-width="150px">
        <el-row>
          <h4><span>资产</span></h4>
          <el-row class="report-inr">
            <el-table :data="assetList" class='table-center' border>
              <el-table-column prop="auditDataKind" label="验证内容"
                               :formatter="(row, col, val) => $filter(val, $enum.AUDIT_TYPE, row.auditKind)"></el-table-column>
              <el-table-column prop="dataReport" label="数据报告">
                <template slot-scope="scope">
                  <!--<el-button @click="goReport(scope.row)">查看报告-->
                  <a v-if="scope.row.dataReport" class="urllink" href="scope.row.dataReport" target="_blank">查看报告</a>
                  <!--</el-button>-->
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
                  <a :href="'http://'+ scope.row.searchWebsite" target="_blank">{{scope.row.searchWebsite}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="artificalValue" label="人工估值(元)"
                               :formatter="(row, col, val) => (val)"></el-table-column>
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <!--<el-button type="primary" size="small"-->
                  <!--@click="goAudit(scope.$index, scope.row)">修改估值结果-->
                  <!--</el-button>-->
                  <el-button type="primary" size="small"
                             @click="handleValuation(scope.row, scope.$index)">估值
                  </el-button>
                  <!--<ats-input v-model="scope.row.value"></ats-input>-->
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </el-form>
    </div>

    <div style="margin-top: 20px">
      <el-button type="primary" @click="passAudit" :disabled="!flag">审核通过</el-button>
      <el-button type="primary" @click="refuseAudit" :disabled="!flag">审核不通过</el-button>
    </div>

    <!--修改估值结果-->
    <el-dialog title="资产评估" :visible.sync="isValuation" size="tiny" @close="handleDialogClose" width="800px">
      <el-form :model="valuat" label-width="150px" :rules="rules" ref="valuatForm">
        <el-form-item label="系统评估结果">
          <el-col :span="20">
            <ats-input v-model="valuat.value"
                       unit="元"
                       disabled></ats-input>
          </el-col>
        </el-form-item>
        <el-form-item label="人工评估结果" prop="result">
          <el-col :span="20">
            <ats-input v-model="valuat.result"
                       type="number"
                       unit="元"
                       :step="0.01"
                       :min="0"></ats-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="avaluationSave">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--审核不通过-->
    <el-dialog title="拒审原因" :visible.sync="nonAudit" size="tiny" @close="handleAuditClose">
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
  </el-row>
</template>
<script>
  import { auditList, auditDetail, assetStatus } from '../../api/audit'

  export default {
    data() {
      return {
        nonAudit: false,
        isValuation: false,
        list: [],
        assetList: [],
        negativeAsetList: '',
        flag: false,
        // 审核不通过弹框
        refuseInfo: {
          sysResult: '',
          description: ''
        },
        valuat: {
          index: -1,
          value: '',
          result: ''
        },
        rules: {
          result: [
            { required: true, message: '请输入人工评估结果', trigger: 'blur', type: 'number' },
            {
              min: 0,
              max: 9999999999,
              message: '范围0~9999999999',
              trigger: 'blur',
              type: 'number'
            },
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (this.$valid.floatValidator(value, 2)) {
                  callback()
                } else {
                  callback('保留2位小数')
                }
              }
            }
          ],
          description: [
            { required: true, message: '请输入拒审原因', trigger: 'blur' },
            { pattern: /^\s*\S+?(\s?)\S*?\s*$/, message: '不能多个空格', trigger: 'blur' }
          ]
        },
        id: this.$route.params.id,
        valuationId: '',            //保存估值id
        auditKind: 'POSITIVE_ASSET', //识别资产评估
        auditStep: '',
        reportFilter: {
          chsi: {
            kind: this.$enum.EDUCATION,
            group: this.$enum.EDUCATION_GROUP
          }
        }
      };
    },
    created() {
      this.auditList(this.id, this.auditKind);
      this.auditDetail(this.id);
    },
    methods: {
      //审核通过
      passAudit() {
        var option = 'RISK_AUDIT';  //识别评估通过
        this.save(this.auditStep, option, '');
      },
      refuseAudit() {
        this.nonAudit = true; //不通过弹框
      },
      //审核不通过保存
      handleSave() {
        var option = 'REJECTED'; //识别不通过按钮
        var reason = this.refuseInfo.description;
        this.$refs.refuseform.validate((val) => {
          if (val) {
            this.save(this.auditStep, option, reason);
          } else {
            return false;
          }
        })
      },
      save(auditStep, option, reason) {
        //人工估值不为空才能操作通过/不通过
        if (option == 'RISK_AUDIT') {
          for (var i = 0; i < this.assetList.length; i++) {
            if (!this.assetList[i].artificalValue && this.assetList[i].artificalValue !== 0) {
              this.$message.error('请先去估值!');
              return;
            }
          }
        }
        this.assetStatus(this.id, auditStep, option, reason, {
          'POSITIVE_ASSET': this.assetList.map(_ => ({
            id: _.id,
            artificalValue: _.artificalValue
          }))
        });
      },
      handleAuditClose() {
        this.$refs['refuseform'].resetFields();
        this.refuseInfo.description = '';
      },
      handleDialogClose() {
        this.valuat.result = '';
        this.$refs['valuatForm'].resetFields();
      },
      handleCancel() {
        this.isValuation = false;
      },
      //估值
      handleValuation(row, index) {
        this.valuat.index = index;
        this.valuat.result = row.artificalValue; //人工估值
        this.isValuation = true;
        this.valuat.value = row.sysResult;    //系统估值
        this.valuationId = row.id;
      },
      //估值保存
      avaluationSave() {
        this.$refs['valuatForm'].validate((valid) => {
          if (valid) {
            this.isValuation = false;
            this.$set(this.assetList[this.valuat.index], 'artificalValue', this.valuat.result)
          } else {
            return;
          }
        })
      },
      //审核详情
      auditDetail(id) {
        auditDetail(id).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.list.push(res.body);
            this.auditStep = res.body.auditStep;
          }
        })
      },
      //审核详情列表
      auditList(loanApplicationNo, auditKind) {
        auditList(loanApplicationNo, auditKind).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.flag = true;
            this.assetList = res.body ? res.body : [];
          }
        })
      },
      //通过不通过状态
      assetStatus(loanId, currentAuditStep, option, reason, data) {
        assetStatus(loanId, currentAuditStep, option, reason, data).then(response => {
          const res = response.data;
          if (res.code === 200) {
            if (option == 'RISK_AUDIT') {
              this.$message({
                type: 'success',
                message: '审核通过!'
              });
              setTimeout(() => {
                this.$router.push({ name: 'AuditEvalList' });
              }, 1000)
            } else if (option == 'REJECTED'){
              this.nonAudit = false;
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              setTimeout(() => {
                this.$router.push({ name: 'AuditEvalList' });
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

  .credit-title {
    line-height: 38px;
    width: 100%;
    background: lightskyblue;
    color: white;
    font-weight: 900;
    margin-top: 20px;
  }
</style>
