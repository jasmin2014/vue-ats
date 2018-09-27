<!-- 添加还款明细 -->
<template>
  <div>
    <el-row>
      <el-col class="downloadbtns clear">
        <a class="el-button el-button--warning" href="/static/doc/还款明细模板.xlsx">下载模板</a>
        <el-upload class="upload-demo"
                   ref="upload"
                   :file-list="fileList"
                   action="https://jsonplaceholder.typicode.com/posts/"
                   :before-upload="beforeUpload">
          <el-button type="success">点击上传</el-button>
        </el-upload>
        <el-button type="primary" @click="handleBatchRepay">确认提交</el-button>
      </el-col>

      <el-table :data="refundData" class='table-center' border>
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="loanApplicationNo" label="借贷编号"></el-table-column>
        <el-table-column prop="contract" label="协议编号"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质" :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="loanPartyName" label="客户姓名/企业名称"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型" :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称" :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="repayWay" label="还款方式" :formatter="(row, col, val) => (this.$filter(val, this.$enum.REPAY_WAY, this.$enum.REPAY_WAY))"></el-table-column>
        <el-table-column prop="repayYearRate" label="年利率" :formatter="(row, col, val) => (this.$floatToPercentage(val))"></el-table-column>
        <el-table-column prop="currentTerms" label="期数"></el-table-column>
        <el-table-column prop="repayTimeType" label="期数单位"
                         :formatter="(row, col, val) => `${row.repayTime}${this.$filter(val, this.$enum.TERM_UNIT, this.$enum.TERM_UNIT)}`"></el-table-column>
        <el-table-column prop="planedRepayDate" label="应还日期"></el-table-column>
        <el-table-column prop="actRepayDate" label="实还日期"></el-table-column>
        <el-table-column prop="repayStatus" label="还款状态" :formatter="(row, col, val) => (this.$filter(val, this.$enum.BILL_STATUS,this.$enum.BILL_STATUS))"></el-table-column>
        <el-table-column prop="planedCapAmount" label="应还本金（元）"></el-table-column>
        <el-table-column prop="planedIntAmount" label="应还利息（元）"></el-table-column>
        <el-table-column prop="penaltyCapAmount" label="逾期本金(元)"></el-table-column>
        <el-table-column prop="penaltyDays" label="逾期天数"></el-table-column>
        <el-table-column prop="planedPenaltyFee" label="应还罚息（元）"></el-table-column>
        <el-table-column prop="actCapAmount" label="实还本金（元）"></el-table-column>
        <el-table-column prop="actIntAmount" label="实还利息（元）"></el-table-column>
        <el-table-column prop="actPenaltyFee" label="实还罚息（元）"></el-table-column>
        <el-table-column prop="repayAmount" label="还款金额（元）"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button size="small" type="info" icon="fa fa-edit" title="编辑" @click="editItem(scope)"></el-button>
            <el-button size="small" type="danger" icon="fa fa-trash" title="删除" @click="DeleteItem(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="editMessBox" v-show="showEdit">
      <div class="mask"></div>
      <div class="editContent">
        <h3>编辑信息</h3>
        <el-form :inline="true" :model="editForm" :label-position="labelPosition" label-width="150px" class="form-label flex">
          <el-row>
            <el-col>
              <el-form-item label="借贷编号：">
                <ats-input v-model="editForm.loanApplicationNo" :mode="'VIEW'"></ats-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="当前期数：">
                <template>
                  <el-input-number v-model="editForm.term" :min="1" :max="repayTerms" label="描述文字"></el-input-number>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
           <el-col class="clearEarly">
             <el-form-item label="是否提前结清：">
               <el-radio v-model="editForm.defaults" :label="true">是</el-radio>
               <el-radio v-model="editForm.defaults" :label="false">否</el-radio>
             </el-form-item>
           </el-col>
         </el-row>
          <el-row>
            <el-col>
              <el-form-item label="实际还款日期：">
                <el-date-picker
                  v-model="editForm.repayDate"
                  type="date"
                  :picker-options="loanTermOptions"
                  placeholder="选择日期"  :value-format="'yyyy-MM-dd'">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="还款金额：">
                <el-input v-model="editForm.repayAmount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="refundsbtns">
            <el-button type="primary" @click="handleSaveEdit">保存</el-button>
            <el-button @click="showEdit=false">取消</el-button>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {postBatchRepay, postUploadExcel, postUploadExcelData} from '../../api/finance';
export default {
  data() {
    return {
      labelPosition:'right',
      showEdit:false,
      fileList: [],
      uploadeNow:false,
      editForm:{
        loanApplicationNo :'',
        term:1,
        defaults: false,
        repayAmount:'',
        repayDate: ''
      },
      repayTerms: 0,
      refundForm: {
        sDate:'',
        tDate:'',
        refundStatus:''
      },
      refundData:[],
      loanTermOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now()
        }
      }
    }
  },
  methods: {
    handleSaveEdit(){
      const editParams = this.$objFilter(this.$deepcopy(this.editForm), _ => _ !== '');
      postUploadExcelData(editParams).then(response => {
        if (response.data.code === 200) {
          this.refundData.forEach(item => {
            if (item.loanApplicationNo === response.data.body.loanApplicationNo) {
              item.repayAmount = response.data.body.repayAmount;
              item.actRepayDate = response.data.body.actRepayDate
              item.term = response.data.body.term;
              item.defaults = response.data.body.defaults;
              item.penaltyDays = response.data.body.penaltyDays;
              item.penaltyAmount = response.data.body.penaltyAmount;
              item.planedPenaltyFee = response.data.body.planedPenaltyFee;
              item.planedCapAmount = response.data.body.planedCapAmount;
              item.planedIntAmount = response.data.body.planedIntAmount;
              item.actCapAmount = response.data.body.actCapAmount;
              item.actIntAmount = response.data.body.actIntAmount;
              item.actPenaltyFee = response.data.body.actPenaltyFee;
              item.currentTerms = response.data.body.term.toString() + '/' + response.data.body.repayTerms.toString();
            }
          });
          this.$message({
            message: "还款明细保存成功",
            type: 'success'
          });
        }
      });
      this.showEdit = false;
    },
    handleBatchRepay(){
      let _item = {}, _params = [];
      this.refundData.forEach(item => {
        _item = {
          loanApplicationNo :item.loanApplicationNo,
          term: item.term,
          defaults: item.defaults,
          repayAmount: item.repayAmount,
          repayDate: item.actRepayDate
        };
        _params.push(_item);
      });
      postBatchRepay(_params).then(response => {
        if(response.data.code === 200){
          this.$message({
            message: "还款明细添加成功",
            type: 'success'
          });
          setTimeout(() => {
            this.refundData = [];
            this.$router.go(-1);
          },1000)
        }
      }, (response) => {})

    },
    editItem(scope){
      let me = this;
      me.showEdit = true;
      me.editForm = {
        loanApplicationNo: scope.row.loanApplicationNo,
        term: scope.row.term,
        defaults: scope.row.defaults,
        repayAmount: scope.row.repayAmount,
        repayDate: scope.row.actRepayDate
      }
    },
    DeleteItem(index){
      let me = this;
      let newArr = [];
      for(let i = 0; i < me.refundData.length; i++){
        let j = me.refundData[i];
        if(j.id!=index){
          newArr.push(j);
        }
      }

      me.refundData = newArr;
//      console.log(index);
    },
    beforeUpload(file){
      let fd = new FormData();
      fd.append("file",file);

      postUploadExcel(fd).then(response =>{
        if(response.data.code === 200) {
          this.$message({
            message: "数据导入成功",
            type: 'success'
          });
          this.refundData = [];
          response.data.body.forEach( (item) => {
            item.currentTerms = item.term.toString() + '/' + item.repayTerms.toString();
            this.refundData.push(item);
          });
          this.repayTerms = this.refundData[0].repayTerms
        }
      },(response) => {})
    }
  }
}

</script>
<style>
  .downloadbtns {
    margin-bottom: 10px;
  }
.downloadbtns > .el-button, .downloadbtns .upload-demo, .downloadbtns a {
  float: left;
  margin-right: 10px;
}
  .downloadbtns a {
    text-decoration: none;
  }
  .editMessBox,.editMessBox .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left:0;
    top:0;
    z-index: 99;
  }
  .editMessBox .mask {
    background: rgba(0,0,0,.4);
  }
  .editContent {
    width: 500px;
    position: absolute;
    left:50%;
    top:50%;
    z-index:100;
    margin: -260px 0 0 -250px;
    background: #fff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .editContent h3 {
    margin: 0;
    padding: 10px 0;
    background: #0068ff;
    color: #fff;
    font-size: 100%;
    font-weight: normal;
    text-align: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .editContent .el-form {
    padding: 20px 30px;
  }
  .editContent .el-form .el-row .el-col-7 {
    text-align: right;
  }
  .editContent .el-input-number__decrease {
    right: auto;
    left:0;
    border-right:1px solid #ddd;
  }
  .editContent .el-input-number__decrease,.editContent .el-input-number__increase{
    height: 40px;
    margin-left: 1px;
  }
  .editContent  .el-input-number .el-input__inner {
    padding: 0 37px;
    text-align: center;
  }
  .editContent .el-input-number {
    width: 100%;
  }
  .editContent .el-form-item {
    margin-bottom: 15px;
  }
  .refundsbtns {
    text-align: center;
  }
  .refundsbtns .el-button {
    padding: 10px 40px;
  }
  .el-col.clearEarly .el-form-item .el-form-item__content{
    margin: 0;
    padding: 0;
    line-height:40px;
    padding-left: 15px;
    border:1px solid #ddd;
  }
  .upload-demo .el-upload-list {
    display: none;
  }
</style>
