<!--资产端产品配置-->
<template>
  <div class="report">
    <el-row>
      <el-col class="rowtit_r"><h4>企业信息验证</h4></el-col>
      <el-table ref="personalData" :data="personalData" class='table-center table-custom' border tooltip-effect="dark" style="width: 100%;" ><!--@selection-change="handleSelectionChange"-->
        <el-table-column prop="validateContent" label="验证内容"></el-table-column>
        <el-table-column label="数据报告">
          <template slot-scope="scope">
            <el-button type="text" v-show="scope.row.hasReport">查看报告</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ditchResult" label="渠道提供结果"></el-table-column>
        <el-table-column prop="sysResult" label="系统评估结果"></el-table-column>
        <el-table-column prop="searchWebUrl" label="查询网址"></el-table-column>
        <el-table-column prop="validateResult" label="验证结果"></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col class="rowtit_r"><h4>抵押信息验证</h4></el-col>
      <el-col class="row_cus clear"><p>车牌号：</p><p>沪C04040</p></el-col>
      <el-table ref="pledgeData" :data="pledgeData" class='table-center' border tooltip-effect="dark" style="width: 100%;" ><!--@selection-change="handleSelectionChange"-->
        <el-table-column prop="validateContent" label="验证内容"></el-table-column>
        <el-table-column label="数据报告">
          <template slot-scope="scope">
            <el-button type="text" v-show="scope.row.hasReport">查看报告</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ditchResult" label="渠道提供结果"></el-table-column>
        <el-table-column prop="sysResult" label="系统评估结果"></el-table-column>
        <el-table-column prop="searchWebUrl" label="查询网址"></el-table-column>
        <el-table-column prop="validateResult" label="验证结果"></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col class="rowtit_r"><h4>企业征信报告</h4></el-col>
      <el-col class="row_cus clear" :span="12">
        <p>3个月内, 在其他网络借贷平台申请借贷次数：</p> <p>3</p>
      </el-col>
      <el-col class="row_cus clear" :span="11" :offset="1">
        <p>6个月内的征信报告逾期次数： </p><p>1</p>
      </el-col>
      <el-col class="row_cus clear" :span="12">
       <p>6个月内的征信报告逾期金额：</p><p>1000</p>
      </el-col>
      <el-col :offset="1" class="row_cus" :span="3">
        <el-button type="primary">下载报告</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="rowtit_r"><h4>企业客户代表征信报告</h4></el-col>
      <el-col class="row_cus clear" :span="12">
        <p>3个月内, 在其他网络借贷平台申请借贷次数：</p> <p>3</p>
      </el-col>
      <el-col class="row_cus clear" :span="11" :offset="1">
        <p>6个月内的征信报告逾期次数： </p><p>1</p>
      </el-col>
      <el-col class="row_cus clear" :span="12">
        <p>6个月内的征信报告逾期金额：</p><p>1000</p>
      </el-col>
      <el-col :offset="1" class="row_cus" :span="3">
        <el-button type="primary">下载报告</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="rowtit_r"><h4>资产</h4></el-col>
      <el-table ref="personalData" :data="assetData" class='table-center' border tooltip-effect="dark" style="width: 100%;" ><!--@selection-change="handleSelectionChange"-->
        <el-table-column prop="validateContent" label="验证内容"></el-table-column>
        <el-table-column label="数据报告">
          <template slot-scope="scope">
            <el-button type="text">查看报告</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ditchResult" label="渠道提供结果"></el-table-column>
        <el-table-column prop="sysResult" label="系统评估结果"></el-table-column>
        <el-table-column prop="searchWebUrl" label="查询网址"></el-table-column>
        <el-table-column prop="validateResult" label="验证结果"></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col class="rowtit_r"><h4>负资产</h4></el-col>
      <el-table ref="personalData" :data="loseAssetData" class='table-center' border tooltip-effect="dark" style="width: 100%;" ><!--@selection-change="handleSelectionChange"-->
        <el-table-column prop="validateContent" label="验证内容"></el-table-column>
        <el-table-column label="数据报告">
          <template slot-scope="scope">
            <el-button type="text">查看报告</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ditchResult" label="渠道提供结果"></el-table-column>
        <el-table-column prop="sysResult" label="系统评估结果"></el-table-column>
        <el-table-column prop="searchWebUrl" label="查询网址"></el-table-column>
        <el-table-column prop="validateResult" label="验证结果"></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col class="rowtit_r"><h4>历史记录</h4></el-col>
    </el-row>
    <el-row class="history_items">
      <el-col class="row_cus clear" :span="8">
        <p>累积借款总额(元)： </p><p>0</p>
      </el-col>
      <el-col class="row_cus clear" :span="8">
        <p>累积还款金额(利+本)(元)： </p><p>0</p>
      </el-col>
      <el-col class="row_cus clear" :span="8">
        <p>借款次数： </p><p>0</p>
      </el-col>
      <el-col class="row_cus clear" :span="8">
        <p>待还总额(利+本)(元)： </p><p>0</p>
      </el-col>
      <el-col class="row_cus clear" :span="8">
        <p>待还期数(元)： </p><p>0</p>
      </el-col>
      <el-col class="row_cus clear" :span="8">
        <p>按时还款期数： </p><p>0</p>
      </el-col>
      <el-col class="row_cus clear" :span="8">
        <p>逾期还款期数： </p><p>0</p>
      </el-col>
      <el-col class="row_cus clear" :span="8">
        <p>流标次数： </p><p>0</p>
      </el-col>
    </el-row>
    <el-row>
      <el-table ref="personalData" :data="historyData" class='table-center' border tooltip-effect="dark" style="width: 100%;" ><!--@selection-change="handleSelectionChange"-->
        <el-table-column prop="number" label="序号"></el-table-column>
        <el-table-column prop="applaytime" label="申请时间"></el-table-column>
        <el-table-column prop="borrower" label="出借方"></el-table-column>
        <el-table-column prop="loantime" label="放款时间"></el-table-column>
        <el-table-column prop="loansType" label="资产类型"></el-table-column>
        <el-table-column prop="borrowtype" label="项目名称"></el-table-column>
        <el-table-column prop="mode" label="还款方式"></el-table-column>
        <el-table-column prop="amount" label="借款金额"></el-table-column>
        <el-table-column prop="interest" label="年利率"></el-table-column>
        <el-table-column prop="count" label="放款期数"></el-table-column>
        <el-table-column prop="status" label="当前状态"></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col class="rowtit_r"><h4>信用报告</h4></el-col>
      <el-col class="row_cus clear" :span="6">
        <p>信用评分： </p><p>0</p>
      </el-col>
      <el-col class="row_cus" :span="3">
        <el-button type="primary">下载报告</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
    props: {
      info: Object
    },
    data() {
      return {
        personalData: this.info.personalData || [],
        pledgeData: this.info.pledgeData || [],
        credit: this.info.assetData || {},
        assetData: this.info.assetData || [],
        loseAssetData: this.info.loseAssetData || [],
        historyData: this.info.historyData || []
      }
    },
    created() {

    },
    methods: {}

  };
</script>

<style scoped>
  .clear {
    zoom: 1;
  }
  .clear:before, .clear:after {
    clear: both;
    height:0;
    content: '';
    display: table;
  }
  .rowtit_r {
    margin-top:15px;
  }
  .report .el-row:first-child .rowtit_r{
    margin-top: 0;
  }
  .rowtit_r h4{
    margin: 0 0 5px 0;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    background-color: #cfe0ec;
  }
  .row_cus {
    line-height:40px;
    height:40px;
    margin: 15px 0;
  }
  .row_cus p {
    float: left;
    line-height:40px;
    margin:0;
    padding-left: 20px;
  }
  .row_cus p:first-child {
    font-size: 90%;
  }
  .row_cus p:last-child {
    line-height:30px;
    margin-top: 5px;
    border:1px solid #ddd;
    width: 100px;
  }
  .history_items {
    width: 90%;
    padding-bottom:15px;
  }
  .history_items .el-col-8 p:first-child {
    width: 174px;
    font-size: 90%;
    text-align: right;
  }
  .history_items .row_cus {
    margin: 10px 0 0 0;
  }
</style>

