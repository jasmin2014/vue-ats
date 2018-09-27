<!--资产端产品配置-->
<template>
  <div class="enterprise">
    <!--基本信息-->
    <el-card class="basic"
             :class="!showCard ? 'no-card' : ''">
      <el-form ref="baseForm"
               :model="currentValue.base"
               :rules="mode !== 'VIEW' ? rules.base : {}"
               label-width="150px">
        <h4>
          <span>基本信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业名称" prop="enterpriseName" :error="error.enterpriseName">
              <ats-input v-model="currentValue.base.enterpriseName"
                         @blur="handleEnterpriseNameBlur"
                         :mode="(mode === 'EDIT' || currentValue.base.partyNo) ? (isUpload ? mode : 'VIEW') : mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码" prop="uscCode" :error="error.uscCode">
              <ats-input v-model="currentValue.base.uscCode"
                         :mode="(mode === 'EDIT' || currentValue.base.partyNo) ? (isUpload ? mode : 'VIEW') : mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="contactPhone" :error="error.contactPhone">
              <ats-input v-model="currentValue.base.contactPhone" :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="办公地址" prop="businessAddress" :error="error.businessAddress">
              <ats-input v-model="currentValue.base.businessAddress" :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码" prop="postalCode" :error="error.postalCode">
              <ats-input v-model="currentValue.base.postalCode" :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="企业网址" prop="webSite" :error="error.webSite">
              <ats-input v-model="currentValue.base.webSite" :mode="mode" placeholder="以 http(s):// 开头"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!isUpload && (mode === 'CREATE' || mode === 'EDIT')"
                type="flex" justify="center">
          <el-button type="primary"
                     @click="handleSaveBase">保存</el-button>
          <el-button v-if="mode === 'CREATE'"
                     @click="handleCancel">取消</el-button>
          <el-button v-else
                     @click="handleResetBase">重置</el-button>
        </el-row>
      </el-form>
    </el-card>
    <!--工商信息-->
    <el-card class="business"
             v-if="this.currentValue.base.partyNo || isUpload"
             :class="!showCard ? 'no-card' : 'mgt20'">
      <el-form ref="businessForm"
               :model="currentValue.business"
               :rules="mode !== 'VIEW' ? rules.business : {}"
               label-width="150px">
        <h4>
          <span>工商信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公司类型" prop="enterpriseType" :error="error.enterpriseType">
              <ats-select v-model="currentValue.business.enterpriseType" :mode="mode"
                          :kind="this.$enum.COMPANY_TYPE" :group="this.$enum.COMPANY_TYPE"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营状态" :error="error.businessCondition">
              <ats-select v-model="currentValue.business.businessCondition" :mode="mode" clearable
                          :kind="this.$enum.COMPANY_STATUS" :group="this.$enum.COMPANY_STATUS"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人员规模" :error="error.staffStat">
              <ats-select v-model="currentValue.business.staffStat" :mode="mode" clearable
                          :kind="this.$enum.COMPANY_SCALE" :group="this.$enum.COMPANY_SCALE"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属行业" prop="industry" :error="error.industry">
              <ats-select v-model="currentValue.business.industry" :mode="mode"
                          :kind="this.$enum.INDUSTRY" :group="this.$enum.INDUSTRY"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册资本" prop="registeredCapital" :error="error.registeredCapital">
              <ats-input v-model="currentValue.business.registeredCapital"
                         type="number" unit="元" :min="0" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实缴资本" prop="contributedCapital" :error="error.contributedCapital">
              <ats-input v-model="currentValue.business.contributedCapital"
                         type="number" unit="元" :min="0" :step="0.01"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="注册地址" prop="registeredAddress" :error="error.registeredAddress">
              <ats-input v-model="currentValue.business.registeredAddress" :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成立日期" prop="registerDate" :error="error.registerDate">
              <ats-date-picker v-model="currentValue.business.registerDate"
                               :picker-options="datePickerOptions"
                               :mode="mode"></ats-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="营业期限" :error="error.businessTerm">
              <ats-date-picker v-model="businessTerm" :mode="mode"
                               type="daterange"></ats-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发证日期" :error="error.issueDate">
              <ats-date-picker v-model="currentValue.business.issueDate"
                               :picker-options="datePickerOptions"
                               :mode="mode"></ats-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="经营区域" prop="businessArea" :error="error.businessArea">
              <el-col :span="12">
                <ats-select v-model="businessProvince" :mode="mode" region="86"></ats-select>
              </el-col>
              <el-col :span="12">
                <ats-select v-model="businessCity" :mode="mode" :region="businessProvince"></ats-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记机关" prop="issuingAuthority" :error="error.issuingAuthority">
              <ats-input v-model="currentValue.business.issuingAuthority" :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="经营范围" :error="error.businessScope">
              <ats-input v-model="currentValue.business.businessScope" :mode="mode" type="textarea"
                         :rows="2"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收益情况(万元)" prop="incomeSituation" :error="error.incomeSituation">
              <ats-select v-model="currentValue.business.incomeSituation" :mode="mode"
                          :kind="this.$enum.COMPANY_INCOME" :group="this.$enum.COMPANY_INCOME"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!isUpload && (mode === 'CREATE' || mode === 'EDIT')"
                type="flex" justify="center">
          <el-button type="primary"
                     @click="handleSaveBusiness">保存</el-button>
          <el-button @click="handleResetBusiness">重置</el-button>
        </el-row>
      </el-form>
    </el-card>
    <!--法人信息-->
    <el-card class="legal-person"
             v-if="this.currentValue.base.partyNo || isUpload"
             :class="!showCard ? 'no-card' : 'mgt20'">
      <el-form ref="legalForm"
               :model="currentValue.legal"
               :rules="mode !== 'VIEW' ? rules.legal : {}"
               label-width="150px">
        <h4>
          <span>法人代表信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业法人代表姓名" prop="realName">
              <ats-input v-model.trim="currentValue.legal.realName" :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <ats-select v-model="currentValue.legal.sex" disabled
                          :kind="this.$enum.GENDER" :group="this.$enum.GENDER"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄">
              <ats-input v-model="currentValue.legal.age" disabled
                         type="number" :min="0"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="婚姻状况">
              <ats-select v-model="currentValue.legal.marriage" :mode="mode" clearable
                          :kind="this.$enum.MARRIAGE_STATUS" :group="this.$enum.MARRIAGE_STATUS"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住房状况">
              <ats-select v-model="currentValue.legal.homeType" :mode="mode" clearable
                          :kind="this.$enum.HOUSE_STATUS" :group="this.$enum.HOUSE_STATUS"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学历">
              <ats-select v-model="currentValue.legal.education" :mode="mode" clearable
                          :kind="this.$enum.EDUCATION" :group="this.$enum.EDUCATION_GROUP"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="年收入(万元)" prop="pmIncome">
              <ats-select v-model="currentValue.legal.pmIncome" :mode="mode"
                          :kind="this.$enum.INCOME_YEAR" :group="this.$enum.INCOME_YEAR"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型" prop="identKind">
              <ats-select v-model="currentValue.legal.identKind" disabled
                          :kind="this.$enum.IDENT_TYPE" :group="this.$enum.IDENT_TYPE"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="ident">
              <ats-input v-model.trim="currentValue.legal.ident" :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="mobile">
              <ats-input v-model.trim="currentValue.legal.mobile"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在省份" prop="province">
              <ats-select v-model="currentValue.legal.province" :mode="mode" :region="'86'"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在城市" prop="city">
              <ats-select v-model="currentValue.legal.city" :mode="mode" :region="currentValue.legal.province"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电话号码" prop="telephone">
              <ats-input v-model.trim="currentValue.legal.telephone"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="家庭住址" prop="homeAddress">
              <ats-input v-model.trim="currentValue.legal.homeAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="常住地址" prop="residentAddress">
              <ats-input v-model.trim="currentValue.legal.residentAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="户籍地址" prop="domicileAddress">
              <ats-input v-model.trim="currentValue.legal.domicileAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!isUpload && (mode === 'CREATE' || mode === 'EDIT')"
                type="flex" justify="center">
          <el-button type="primary"
                     @click="handleSelectLegal">选择法人代表</el-button>
          <el-button type="primary"
                     @click="handleSaveLegal">保存</el-button>
          <el-button @click="handleResetLegal">重置</el-button>
        </el-row>
      </el-form>
    </el-card>
    <!--资产信息-->
    <el-card class="prop"
             v-if="this.currentValue.base.partyNo || isUpload"
             :class="!showCard ? 'no-card' : 'mgt20'">
      <el-form ref="propForm"
               :model="newRow"
               :rules="propRules"
               size="small">
        <h4>
          <span>企业资产信息</span>
        </h4>
        <!--银行卡-->
        <div class="prop-card">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>银行卡信息</h5>
            </el-col>
            <el-col :span="1" v-if="!isUpload">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增银行卡"
                         v-if="mode !== 'VIEW'"
                         @click="handleCreateRow('bank')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.bankList" border>
            <el-table-column align="center" type="index" label="序号"></el-table-column>
            <el-table-column align="center" label="银行卡号">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="bankCard">
                  <el-input v-model.trim="newRow.bankCard"
                            @blur="handleBankName(newRow.bankCard)"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.bankCard }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="所属银行">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="bankName">
                  <el-input v-model.trim="newRow.bankName" disabled></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.bankName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="开户行所在省份">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="province">
                  <ats-select v-model="newRow.province" :mode="mode"
                              :region="'86'"></ats-select>
                </el-form-item>
                <ats-select v-else
                            v-model="scope.row.province"
                            :mode="'VIEW'"
                            region="86"
                            text></ats-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="开户行所在城市">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="city">
                  <ats-select v-model="newRow.city" :mode="mode"
                              :region="newRow.province"></ats-select>
                </el-form-item>
                <ats-select v-else
                            v-model="scope.row.city"
                            :mode="'VIEW'"
                            :region="scope.row.province"
                            text></ats-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="开户行">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="issuingBank">
                  <el-input v-model.trim="newRow.issuingBank"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.issuingBank }}</span>
              </template>
            </el-table-column>
            <el-table-column label="证明信息" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create" :error="attachmentError"
                              prop="attachment">
                  <el-button size="small" type="success"
                             @click="handleUploadFiles('EDIT', scope.row)">上传附件
                  </el-button>
                </el-form-item>
                <el-button v-else
                           size="small"
                           @click="handleUploadFiles('VIEW', scope.row)">查看附件
                </el-button>
              </template>
            </el-table-column>
            <!--<el-table-column align="center" label="认证状态" v-if="!isUpload">-->
              <!--<template slot-scope="scope">-->
                <!--{{ bankAuthStatusFilter(scope.row.authState) }}-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="操作" v-if="mode !== 'VIEW'" :width="isUpload ? 150 : 180">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-tooltip v-if="scope.row.authState !== 2"
                              content="编辑">
                    <el-button size="small" type="info" icon="fa fa-edit"
                               @click="handleEditRow(scope.row, 'bank')"></el-button>
                  </el-tooltip>
                  <!--<el-tooltip v-if="scope.row.authState !== 2 && !isUpload"-->
                              <!--content="认证">-->
                    <!--<el-button size="small" type="success" icon="fa fa-check-square"-->
                               <!--@click="handleBindCard(scope.row)"></el-button>-->
                  <!--</el-tooltip>-->
                  <el-tooltip v-if="scope.row.authState !== 2 && !isUpload"
                              content="删除">
                    <el-button size="small" type="danger" icon="fa fa-trash"
                               @click="handleDeleteRow(scope.row, 'bank', scope.$index)"></el-button>
                  </el-tooltip>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'bank')">确认
                  </el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'bank')">取消
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--房产-->
        <div class="prop-house">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>房产信息</h5>
            </el-col>
            <el-col :span="1" v-if="!isUpload">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增房产信息"
                         v-if="mode !== 'VIEW'"
                         @click="handleCreateRow('house')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.houseList" border>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="所在省份" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="province">
                  <ats-select v-model="newRow.province" :mode="mode"
                              :region="'86'"></ats-select>
                </el-form-item>
                <ats-select v-else
                            v-model="scope.row.province"
                            :mode="'VIEW'"
                            region="86"
                            text></ats-select>
              </template>
            </el-table-column>
            <el-table-column label="所在城市" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="city">
                  <ats-select v-model="newRow.city" :mode="mode"
                              :region="newRow.province"></ats-select>
                </el-form-item>
                <ats-select v-else
                            v-model="scope.row.city"
                            :mode="'VIEW'"
                            :region="scope.row.province"
                            text></ats-select>
              </template>
            </el-table-column>
            <el-table-column label="地址" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="address">
                  <el-input v-model.trim="newRow.address"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="房产附件" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create" :error="attachmentError"
                              prop="attachment">
                  <el-button size="small" type="success"
                             @click="handleUploadFiles('EDIT', scope.row)">上传附件
                  </el-button>
                </el-form-item>
                <el-button v-else
                           size="small"
                           @click="handleUploadFiles('VIEW', scope.row)">查看附件
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button v-if="mode === 'CREATE'"
                             title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'house')"></el-button>
                  <el-button v-if="mode === 'CREATE'"
                             title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'house', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'house')">确认
                  </el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'house')">取消
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--机械设备-->
        <div class="prop-equipment">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>机械设备</h5>
            </el-col>
            <el-col :span="1" v-if="!isUpload">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增机械设备"
                         v-if="mode !== 'VIEW'"
                         @click="handleCreateRow('equipment')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.equipmentList" border>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="设备名称" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="deviceName">
                  <el-input v-model.trim="newRow.deviceName"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.deviceName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="品牌" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="brand">
                  <el-input v-model.trim="newRow.brand"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.brand }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="number">
                  <ats-input v-model="newRow.number" type="number"></ats-input>
                </el-form-item>
                <span v-else>{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="设备购置时间" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="buyDate">
                  <el-date-picker v-model="newRow.buyDate"
                                  :picker-options="datePickerOptions"
                                  value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <span v-else>{{ scope.row.buyDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="机械设备图片" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create" :error="attachmentError"
                              prop="attachment">
                  <el-button size="small" type="success"
                             @click="handleUploadFiles('EDIT', scope.row)">上传附件
                  </el-button>
                </el-form-item>
                <el-button v-else
                           size="small"
                           @click="handleUploadFiles('VIEW', scope.row)">查看附件
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button v-if="mode === 'CREATE'"
                             title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'equipment')"></el-button>
                  <el-button v-if="mode === 'CREATE'"
                             title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'equipment', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'equipment')">确认
                  </el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'equipment')">取消
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--商铺信息-->
        <div class="prop-shop">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>商铺信息</h5>
            </el-col>
            <el-col :span="1" v-if="!isUpload">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增商铺信息"
                         v-if="mode !== 'VIEW'"
                         @click="handleCreateRow('shop')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.shopList" border>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="商铺名称" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="shopName">
                  <el-input v-model.trim="newRow.shopName"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.shopName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所在省份" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="province">
                  <ats-select v-model="newRow.province" :mode="mode"
                              :region="'86'"></ats-select>
                </el-form-item>
                <ats-select v-else
                            v-model="scope.row.province"
                            :mode="'VIEW'"
                            region="86"
                            text></ats-select>
              </template>
            </el-table-column>
            <el-table-column label="所在城市" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="city">
                  <ats-select v-model="newRow.city" :mode="mode"
                              :region="newRow.province"></ats-select>
                </el-form-item>
                <ats-select v-else
                            v-model="scope.row.city"
                            :mode="'VIEW'"
                            :region="scope.row.province"
                            text></ats-select>
              </template>
            </el-table-column>
            <el-table-column label="地址" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="address">
                  <el-input v-model.trim="newRow.address"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="相关证件" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create" :error="attachmentError"
                              prop="attachment">
                  <el-button size="small" type="success"
                             @click="handleUploadFiles('EDIT', scope.row)">上传附件
                  </el-button>
                </el-form-item>
                <el-button v-else
                           size="small"
                           @click="handleUploadFiles('VIEW', scope.row)">查看附件
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button v-if="mode === 'CREATE'"
                             title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'shop')"></el-button>
                  <el-button v-if="mode === 'CREATE'"
                             title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'shop', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'shop')">确认
                  </el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'shop')">取消
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--电商信息-->
        <div class="prop-eshop">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>电商信息</h5>
            </el-col>
            <el-col :span="1" v-if="!isUpload">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增电商信息"
                         v-if="mode !== 'VIEW'"
                         @click="handleCreateRow('eshop')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.eshopList" border>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="所属平台" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="platform">
                  <ats-select v-model="newRow.platform" :mode="mode"
                              :kind="$enum.ESHOP_PLATFORM" :group="$enum.ESHOP_PLATFORM"></ats-select>
                </el-form-item>
                <span v-else>{{ $filter(scope.row.platform, $enum.ESHOP_PLATFORM, $enum.ESHOP_PLATFORM) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商铺名称" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="shopName">
                  <el-input v-model.trim="newRow.shopName"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.shopName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="链接/账号ID" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="ident">
                  <el-input v-model.trim="newRow.ident"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.ident }}</span>
              </template>
            </el-table-column>
            <el-table-column label="相关证件" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create" :error="attachmentError"
                              prop="attachment">
                  <el-button size="small" type="success"
                             @click="handleUploadFiles('EDIT', scope.row)">上传附件
                  </el-button>
                </el-form-item>
                <el-button v-else
                           size="small"
                           @click="handleUploadFiles('VIEW', scope.row)">查看附件
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button v-if="mode === 'CREATE'"
                             title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'eshop')"></el-button>
                  <el-button v-if="mode === 'CREATE'"
                             title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'eshop', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'eshop')">确认
                  </el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'eshop')">取消
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--股份关系信息-->
        <div class="prop-stock">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>股份关系信息</h5>
            </el-col>
            <el-col :span="1" v-if="!isUpload">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增股份关系"
                         v-if="mode !== 'VIEW'"
                         @click="handleCreateRow('stock')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.stockList" border>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="股东类型" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="shareholderType">
                  <ats-select v-model="newRow.shareholderType" :mode="mode"
                              :kind="$enum.SHAREHOLDER_TYPE" :group="$enum.SHAREHOLDER_TYPE"></ats-select>
                </el-form-item>
                <span v-else>{{ $filter(scope.row.shareholderType, $enum.SHAREHOLDER_TYPE, $enum.SHAREHOLDER_TYPE) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="personName">
                  <el-input v-model.trim="newRow.personName"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.personName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="股份占比" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="stockProportion">
                  <ats-input v-model="stockProportion" type="number" unit="%"></ats-input>
                </el-form-item>
                <span v-else>{{ $floatToPercentage(scope.row.stockProportion) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button v-if="mode === 'CREATE'"
                             title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'stock', scope.$index)"></el-button>
                  <el-button v-if="mode === 'CREATE'"
                             title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'stock', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'stock')">确认
                  </el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'stock')">取消
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--负债信息-->
        <div class="prop-debt">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>负债信息</h5>
            </el-col>
            <el-col :span="1">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增负债信息"
                         v-if="mode !== 'VIEW'"
                         @click="handleCreateRow('debt')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.debtList" border>
            <el-table-column label="序号" type="index" align="center"></el-table-column>
            <el-table-column label="出借平台" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="loanPlatform">
                  <el-input v-model.trim="newRow.loanPlatform"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.loanPlatform }}</span>
              </template>
            </el-table-column>
            <el-table-column label="借款用途" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="usageLoan">
                  <ats-select v-model="newRow.usageLoan" :kind="$enum.LOAN_USAGE" :group="$enum.LOAN_USAGE_GROUP"></ats-select>
                </el-form-item>
                <span v-else>{{ $filter(scope.row.usageLoan, $enum.LOAN_USAGE, $enum.LOAN_USAGE_GROUP) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="借款日期范围" align="center" width="220">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="loanDate">
                  <el-date-picker v-model="newRow.loanDate"
                                  type="daterange"
                                  value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <span v-else>{{ scope.row.loanStart }} - {{ scope.row.loanEnd }}</span>
              </template>
            </el-table-column>
            <el-table-column label="借款金额(元)" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="loanAmount">
                  <ats-input v-model="newRow.loanAmount"
                             type="number" :min="0" :step="0.01"></ats-input>
                </el-form-item>
                <span v-else>{{ scope.row.loanAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button v-if="mode === 'CREATE'"
                             title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'debt')"></el-button>
                  <el-button v-if="mode === 'CREATE'"
                             title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'debt', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'debt')">确认
                  </el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'debt')">取消
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div class="photo">
        <h4>
          <span>证件照片</span>
        </h4>
        <el-row type="flex" justify="center">
          <ats-upload v-model="file1"
                      :mode="mode"
                      text="营业执照"
                      :limit="1"
                      required
                      @success="handleUploadLicense"
                      @remove="handleRemoveLicense"></ats-upload>
          <ats-upload v-model="filesOther"
                      :mode="mode"
                      text="其他"
                      @success="handleUploadOther"
                      @remove="handleRemoveOther"></ats-upload>
        </el-row>
      </div>
    </el-card>
    <ats-upload-dialog :visible.sync="showUploadDialog"
                       v-model="newRow.files"
                       :mode="uploadMode"
                       @upload="handleUploadDialogUpload"
                       @remove="handleUploadDialogRemove"
                       @close="handleUploadDialogClose"
                       @cancel="handleUploadDialogCancel"
                       @confirm="handleUploadDialogConfirm"></ats-upload-dialog>
    <!-- 选择客户弹出框 -->
    <el-dialog title="选择客户" width="1000px"
               :visible.sync="showLegalDialog"
               @open="handleLegalDialogOpen"
               @close="handleLegalDialogClose">
      <legal-choose ref="choose"
                    :type="$enum.SUBJECT_PROP_PERSON"
                    :list="legalList"
                    :table="legalTable"
                    :total="legalPageTotal"
                    @search="handleSearchLegal"
                    @confirm="handleConfirmLegal"
                    @cancel="showLegalDialog = false"></legal-choose>
    </el-dialog>
  </div>
</template>

<script>
  import LegalChoose from '../assets/Choose';
  import {getBankNameByCard} from '../../api/enum';
  import {getIndividualCustomerList, getIndividualDetail} from '../../assets/api/customer';
  const BANK_CARD_AUTH_STATUS = {
    0: '未认证',
    2: '已认证',
    3: '认证失败'
  };

  export default {
    props: {
      mode: String,
      value: Object,
      end: String,
      isUpload: Boolean,
      showCard: Boolean,
      error: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        currentValue: {
          base: {
            partyNo: '',
            enterpriseName: '',
            uscCode: '',
            contactPhone: '',
            postalCode: '',
            businessAddress: '',
            webSite: ''
          },
          business: {
            enterpriseType: '',
            businessCondition: '',
            staffStat: '',
            industry: '',
            registeredAddress: '',
            registeredCapital: null,
            contributedCapital: null, // TBD
            registerDate: '',
            issuingAuthority: '',
            issueDate: '',
            businessTerm: '',
            businessArea: '',
            incomeSituation: '',
            businessScope: ''
          },
          legal: {
            kind: '',
            relId: '',
            realName: '',
            sex: '',
            age: 0,
            marriage: '',
            homeType: '',
            education: '',
            pmIncome: '',
            identKind: this.$enum.IDENT_TYPE_IDENTITY,
            ident: '',
            province: '',
            city: '',
            telephone: '',
            mobile: '',
            homeAddress: '',
            residentAddress: '',
            domicileAddress: ''
          },
          bankList: [],
          houseList: [],
          equipmentList: [],
          shopList: [],
          eshopList: [],
          stockList: [],
          debtList: [],
          materialList: []
        },
        rules: {
          // 基本信息
          base: {
            enterpriseName: [
              { required: true, message: '请输入企业名称', trigger: 'blur' },
              { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
            ],
            uscCode: [
              { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
              { pattern: this.$valid.usciCode, message: '18位数字、字母', trigger: 'blur' }
            ],
            contactPhone: [
              { required: true, message: '请输入联系方式', trigger: 'blur' },
              { pattern: this.$valid.telOrMobile, message: '请输入正确的电话或手机号码', trigger: 'blur' }
            ],
            postalCode: [
              { pattern: this.$valid.postCode, message: '请输入正确的邮政编码', trigger: 'blur' }
            ],
            businessAddress: [
              { required: true, message: '请输入办公地址', trigger: 'blur' },
              { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
            ],
            webSite: [
              { pattern: this.$valid.webSite, message: '请输入正确的网址', trigger: 'blur' },
              { min: 0, max: 100, message: '网址过长', trigger: 'blur' }
            ]
          },
          // 工商信息
          business: {
            enterpriseType: [
              { required: true, message: '请选择公司类型', trigger: 'change' }
            ],
            industry: [
              { required: true, message: '请选择所属行业', trigger: 'change' }
            ],
            registeredCapital: [
              { required: true, message: '请输入注册资本', trigger: 'blur', type: 'number' },
              {
                min: 0,
                max: 9999999999999,
                message: '范围0-' + 9999999999999,
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
            contributedCapital: [
              {
                trigger: 'blur',
                validator: (rule, value, callback) => {
                  if (typeof value === 'number' && !isNaN(value)) {
                    if (value < 0 || value > 9999999999999) {
                      callback('范围0-9999999999999')
                    } else if (!this.$valid.floatValidator(value, 2)) {
                      callback('保留2位小数')
                    } else {
                      callback()
                    }
                  } else {
                    callback();
                  }
                }
              }
            ],
            registeredAddress: [
              { message: '请输入注册地址', trigger: 'blur' },
              { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
            ],
            registerDate: [
              { required: true, message: '请选择成立日期', trigger: 'change' }
            ],
            issuingAuthority: [
              { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
            ],
            businessArea: [
              { required: true, message: '请选择经营省份', trigger: 'change' },
              {
                trigger: 'change',
                validator: (rule, value, callback) => {
                  if (!this.businessCity) {
                    callback('请选择经营城市');
                  } else {
                    callback();
                  }
                }
              }
            ],
            incomeSituation: [
              { required: true, message: '请选择收益情况', trigger: 'change' }
            ]
          },
          // 法人代表
          legal: {
            realName: [
              { required: true, message: '请输入企业法人代表姓名', trigger: 'blur' },
              { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
            ],
            pmIncome: [
              { required: true, message: '请选择年收入', trigger: 'change' }
            ],
            identKind: [
              { required: true, message: '请选择证件类型', trigger: 'change' }
            ],
            ident: [
              { required: true, message: '请输入证件号码', trigger: 'blur' },
              { pattern: this.$valid.ident, message: '请输入正确的身份证号', trigger: 'blur' }
            ],
            province: [
              { required: true, message: '请选择客户所在省份', trigger: 'change' }
            ],
            city: [
              { required: true, message: '请选择客户所在城市', trigger: 'change' }
            ],
            mobile: [
              { required: true, message: '请输入手机号码', trigger: 'blur' },
              { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
            ],
            telephone: [
              { pattern: this.$valid.telephone, message: '请输入正确的电话号码', trigger: 'blur' }
            ],
            homeAddress: [
              { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
            ],
            residentAddress: [
              { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
            ],
            domicileAddress: [
              { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
            ]
          },
          // 银行卡
          bank: {
            bankCard: [
              { required: true, message: '请输入银行卡号', trigger: 'blur' },
              { pattern: this.$valid.card, message: '8-28位数字', trigger: 'blur' }
            ],
            bankName: [
              { required: true, message: '请检查银行卡号', trigger: 'change' }
            ],
            province: [
              { required: true, message: '请选择开户行所在省份', trigger: 'change' }
            ],
            city: [
              { required: true, message: '请选择开户行所在城市', trigger: 'change' }
            ],
            issuingBank: [
              { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
            ],
            attachment: [
              { required: true, message: '请上传附件', trigger: 'submit' }
            ]
          },
          house: {
            province: [
              { required: true, message: '请选择房产所在省份', trigger: 'change' }
            ],
            city: [
              { required: true, message: '请选择房产所在城市', trigger: 'change' }
            ],
            address: [
              { required: true, message: '请输入房产地址', trigger: 'blur' },
              { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
            ],
            attachment: [
              { required: true, message: '请上传附件', trigger: 'submit' }
            ]
          },
          equipment: {
            deviceName: [
              { required: true, message: '请输入设备名称', trigger: 'blur' }
            ],
            brand: [
              { required: true, message: '请输入设备品牌', trigger: 'blur' }
            ],
            number: [
              { required: true, message: '请输入设备数量', trigger: 'blur', type: 'number' },
              { min: 0, max: 999999, message: '数量范围0-999999', trigger: 'blur', type: 'number'}
            ],
            buyDate: [
              { required: true, message: '请选择设备购置时间', trigger: 'change' }
            ],
            attachment: [
              { required: true, message: '请上传附件', trigger: 'submit' }
            ]
          },
          shop: {
            shopName: [
              { required: true, message: '请选择商铺名称', trigger: 'change' }
            ],
            province: [
              { required: true, message: '请选择商铺所在省份', trigger: 'change' }
            ],
            city: [
              { required: true, message: '请选择商铺所在城市', trigger: 'change' }
            ],
            address: [
              { required: true, message: '请输入商铺地址', trigger: 'blur' },
              { min: 0, max: 100, message: '商铺地址过长', trigger: 'blur' }
            ],
            attachment: [
              { required: true, message: '请上传附件', trigger: 'submit' }
            ]
          },
          eshop: {
            platform: [
              { required: true, message: '请选择电商所属平台', trigger: 'change' }
            ],
            shopName: [
              { required: true, message: '请选择商铺名称', trigger: 'change' }
            ],
            ident: [
              { required: true, message: '请输入电商链接/账号ID', trigger: 'blur' },
              { min: 0, max: 100, message: '链接/账号ID过长', trigger: 'blur' }
            ],
            attachment: [
              { required: true, message: '请上传附件', trigger: 'submit' }
            ]
          },
          stock: {
            shareholderType: [
              { required: true, message: '请选择股东类型', trigger: 'change' }
            ],
            personName: [
              { required: true, message: '请输入股东名称', trigger: 'blur' },
              { min: 0, max: 50, message: '50字以内', trigger: 'blur'}
            ],
            stockProportion: [
              { required: true, message: '请输入股份占比', trigger: 'blue', type: 'number' },
              { min: 0, max: 1, message: '范围为0-100%', trigger: 'blur', type: 'number' },
              {
                trigger: 'blur',
                type: 'number',
                validator: (rule, value, callback) => {
                  if (!this.$valid.floatValidator(value, 4)) {
                    callback('保留2位小数')
                  } else {
                    let total = this.currentValue.stockList.map(_ => _.stockProportion || 0).reduce((prev, curr) => this.$floatPlus(prev, curr), 0);
                    if (this.newRow.index || this.newRow.index === 0) {
                      total = this.$floatMinus(total, this.currentValue.stockList[this.newRow.index].stockProportion || 0);
                    }
                    total = this.$floatPlus(total, value);
                    if (total < 0 || total > 1) {
                      callback('股份占比和不能超过100%')
                    } else {
                      callback()
                    }
                  }
                }
              }
            ]
          },
          debt: {
            loanPlatform: [
              { required: true, message: '请输入出借平台', trigger: 'blue'}
            ],
            usageLoan: [
              { required: true, message: '请选择借款用途', trigger: 'change'}
            ],
            loanDate: [
              { required: true, message: '请选择借款日期范围', trigger: 'change', type: 'array', length: 2}
            ],
            loanAmount: [
              { required: true, message: '请输入借款金额', trigger: 'blur'}
            ]
          }
        },
        propRules: {},
        newRow: {},
        attachmentError: '',
        isEditing: false,
        showUploadDialog: false,
        uploadMode: '',
        datePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        },

        showLegalDialog: false,
        legalPageTotal: 0,
        legalList: [],
        legalTable: [
          {
            label: '客户编号',
            prop: 'personNo'
          }, {
            label: '客户姓名',
            prop: 'customerName'
          }, {
            label: '证件号码',
            prop: 'customerIdent'
          }, {
            label: '手机号码',
            prop: 'mobile'
          }
        ]
      }
    },
    computed: {
      businessProvince: {
        get() {
          const area = this.currentValue.business.businessArea;
          return area ? (area.split(',')[0] || '') : '';
        },
        set(val) {
          // this.currentValue.business.province = val;
          this.currentValue.business.businessArea = `${val},${this.businessCity}`;
        }
      },
      businessCity: {
        get() {
          const area = this.currentValue.business.businessArea;
          return area ? (area.split(',')[1] || '') : '';
        },
        set(val) {
          // this.currentValue.business.city = val;
          this.currentValue.business.businessArea = `${this.businessProvince},${val}`;
        }
      },
      businessTerm: {
        get() {
          if (this.currentValue.business.businessTerm) {
            return this.currentValue.business.businessTerm.split('~');
          }
          return null;
        },
        set(val) {
          if (val) {
            this.currentValue.business.businessTerm = `${val[0]}~${val[1]}`;
          } else {
            this.currentValue.business.businessTerm = '';
          }
        }
      },
      stockProportion: {
        get() {
          if (typeof this.newRow.stockProportion === 'number') {
            return this.$floatMultiply(this.newRow.stockProportion, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.newRow.stockProportion = null;
          } else {
            this.newRow.stockProportion = this.$floatDivide(val, 100);
          }
        }
      },
      file1: {
        get() {
          return this.currentValue.materialList.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_O_LICENSE).map(_ => ({
            id: _.id,
            name: _.name,
            url: _.fileUri,
            type: _.fileType
          }));
        }
      },
      filesOther: {
        get() {
          return this.currentValue.materialList.filter(_ => _.kind === this.$enum.PROOF_MATERIAL_O_OTHER).map((_, i) => ({
            id: _.id,
            name: _.name,
            url: _.fileUri,
            type: _.fileType
          }));
        }
      }
    },
    watch: {
      'value.base'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'base');
      },
      'value.business'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'business');
      },
      'value.legal'(val) {
        val.identKind = val.identKind || this.$enum.IDENT_TYPE_IDENTITY;
        this.setCurrentValue(this.$deepcopy(val), 'legal')
      },
      'value.bankList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'bankList');
        this.isEditing = false;
      },
      'value.houseList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'houseList');
        this.isEditing = false;
      },
      'value.equipmentList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'equipmentList');
        this.isEditing = false;
      },
      'value.shopList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'shopList');
        this.isEditing = false;
      },
      'value.eshopList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'eshopList');
        this.isEditing = false;
      },
      'value.stockList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'stockList');
        this.isEditing = false;
      },
      'value.debtList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'debtList');
        this.isEditing = false;
      },
      'value.materialList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'materialList');
        this.isEditing = false;
      }
    },
    methods: {
      save() {
        const val = this.$deepcopy(this.currentValue);
        val.bankList.forEach(_ => {
          _.realName = val.base.enterpriseName
        });
        this.$emit('save', {
          base: Object.assign(val.base, val.contact),
          legal: val.legal,
          bankList: val.bankList,
          houseList: val.houseList,
          equipmentList: val.equipmentList,
          shopList: val.shopList,
          eshopList: val.eshopList,
          stockList: val.stockList,
          debtList: val.debtList,
          materialList: val.materialList
        })
      },
      setCurrentValue(val, key) {
        if (this.currentValue.hasOwnProperty(key)) {
          if (typeof val === 'object' && val instanceof Array) {
            this.currentValue[key] = val;
          } else if (typeof val === 'object') {
            for (const k in this.currentValue[key]) {
              if (this.currentValue[key].hasOwnProperty(k)) {
                this.currentValue[key][k] = val[k];
              }
            }
          } else {
            this.currentValue[key] = val;
          }
        }
      },
      setUscCode(uscCode) {
        this.$set(this.currentValue.base, 'uscCode', uscCode);
      },
      handleEnterpriseNameBlur() {
        this.$emit('org-name-blur', this.currentValue.base.enterpriseName);
      },
      handleCancel() {
        this.$router.go(-1);
      },
      handleSaveBase() {
        this.$refs.baseForm.validate((valid) => {
          if (valid) {
            this.$emit('save-base', this.$deepcopy(this.currentValue.base));
          } else {
            return false;
          }
        });
      },
      handleResetBase() {
        this.setCurrentValue(this.value.base, 'base')
      },
      handleSaveBusiness() {
        this.$refs.businessForm.validate((valid) => {
          if (valid) {
            this.$emit('save-business', this.$deepcopy(this.currentValue.business));
          } else {
            return false;
          }
        });
      },
      handleResetBusiness() {
        this.setCurrentValue(this.value.business, 'business')
      },
      handleSaveLegal() {
        this.$refs.legalForm.validate((valid) => {
          if (valid) {
            this.$emit('save-legal', this.$deepcopy(this.currentValue.legal));
          } else {
            return false;
          }
        });
      },
      handleResetLegal() {
        this.setCurrentValue(this.value.legal, 'legal')
      },
      handleSelectLegal() {
        this.showLegalDialog = true;
      },
      handleSearchLegal(search) {
        getIndividualCustomerList(search).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.legalList = res.body.list;
            this.legalPageTotal = res.body.totalRecord;
          }
        }, () => {})
      },
      handleConfirmLegal(customer) {
        this.showLegalDialog = false;
        getIndividualDetail(customer.partyId).then(({data}) => {
          if (data.code === 200 && data.body) {
            const [province, city] = (data.body.region || ',').split(',');
            delete data.body.region;
            data.body.province = province;
            data.body.city = city;
            delete data.body.region;
            this.setCurrentValue(data.body, 'legal');
          }
        }, () => {});
      },
      handleLegalDialogOpen() {
        this.$nextTick(() => {
          this.$refs.choose.handleSearch();
        })
      },
      handleLegalDialogClose() {
        this.$refs.choose.clear();
        this.legalList = [];
        this.legalPageTotal = 0;
      },
      handleBankName(bankCard) {
        if (!this.$valid.card.test(bankCard)) return;
        getBankNameByCard(bankCard).then(({data}) => {
          if (data.code === 200 && data.body) {
            this.$set(this.newRow, 'bankName', data.body.bankName);
            this.$set(this.newRow, 'bankCode', data.body.bankCode);
            this.$set(this.newRow, 'cardType', data.body.cardType);
          } else {
            delete this.newRow.bankName;
            delete this.newRow.bankCode;
            delete this.newRow.cardType;
          }
        }).catch(() => {
          delete this.newRow.bankName;
          delete this.newRow.bankCode;
          delete this.newRow.cardType;
        })
      },
      bankAuthStatusFilter(status) {
        return BANK_CARD_AUTH_STATUS[status] || status
      },

      handleCreateRow(type) {
        if (this.isEditing) {
          this.$alert('请先保存其他表格信息', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return;
        }

        this.isEditing = true;
        this.newRow = {};
        this.$set(this.newRow, 'files', []);
        this.attachmentError = '';
        this.currentValue[type + 'List'].push({
          $create: true
        });
        this.propRules = this.rules[type];
      },
      handleEditRow(row, type, index) {
        if (this.isEditing) {
          this.$alert('请先保存其他表格信息', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return;
        }
        if (type === 'debt') {
          if (row.loanStart && row.loanEnd) {
            row.loanDate = [row.loanStart, row.loanEnd]
          } else {
            row.loanDate = [];
          }
        } else if (type === 'stock') {
          row.index = index;
        }
        this.newRow = this.$deepcopy(row);
        this.$set(this.newRow, 'files', []);
        this.isEditing = true;
        this.$set(row, '$edit', true);
        this.partyRules = this.rules[type];
      },
      handleSaveRow(row, type) {
        this.$refs.propForm.validate((valid) => {
          if (valid) {
            let data = {};
            switch (type) {
              case 'bank':
                data = {
                  propId: this.newRow.propId,
                  propType: this.$enum.CUSTOMER_PROP_CARD,
                  realName: this.currentValue.base.enterpriseName,
                  bankCard: this.newRow.bankCard,
                  bankName: this.newRow.bankName,
                  bankCode: this.newRow.bankCode,
                  cardType: this.newRow.cardType,
                  province: this.newRow.province,
                  city: this.newRow.city,
                  issuingBank: this.newRow.issuingBank,
                  attachment: this.newRow.attachment
                };
                break;
              case 'house':
                data = {
                  propId: this.newRow.propId,
                  propType: this.$enum.CUSTOMER_PROP_HOUSE,
                  province: this.newRow.province,
                  city: this.newRow.city,
                  address: this.newRow.address,
                  attachment: this.newRow.attachment
                };
                break;
              case 'equipment':
                data = {
                  propId: this.newRow.propId,
                  deviceName: this.newRow.deviceName,
                  brand: this.newRow.brand,
                  number: this.newRow.number,
                  buyDate: this.newRow.buyDate,
                  attachment: this.newRow.attachment
                };
                break;
              case 'shop':
                data = {
                  propId: this.newRow.propId,
                  propType: this.$enum.CUSTOMER_PROP_HOUSE,
                  shopName: this.newRow.shopName,
                  province: this.newRow.province,
                  city: this.newRow.city,
                  address: this.newRow.address,
                  attachment: this.newRow.attachment
                };
                break;
              case 'eshop':
                data = {
                  propId: this.newRow.propId,
                  propType: this.$enum.CUSTOMER_PROP_HOUSE,
                  platform: this.newRow.platform,
                  shopName: this.newRow.shopName,
                  ident: this.newRow.ident,
                  attachment: this.newRow.attachment
                };
                break;
              case 'stock':
                data = {
                  propId: this.newRow.propId,
                  shareholderType: this.newRow.shareholderType,
                  personName: this.newRow.personName,
                  stockProportion: this.newRow.stockProportion
                };
                break;
              case 'debt':
                data = {
                  id: this.newRow.id,
                  loanPlatform: this.newRow.loanPlatform,
                  usageLoan: this.newRow.usageLoan,
                  loanStart: this.newRow.loanDate[0],
                  loanEnd: this.newRow.loanDate[1],
                  loanAmount: this.newRow.loanAmount
                };
                break;
              default:
                break;
            }
            if (this.isUpload) {
              row = Object.assign(row, data);
              this.$set(row, '$edit', false);
              this.$set(row, '$create', false);
              delete row.$edit;
              delete row.$create;
              this.isEditing = false;
              this.newRow = {};
              this.$set(this.newRow, 'files', []);
              this.attachmentError = '';
            } else {
              this.$emit('save-prop', {
                type,
                data
              });
            }
          } else {
            return false;
          }
        });
      },
      handleCancelRow(row, type) {
        if (row.$create) {
          this.currentValue[type + 'List'].pop();
        }
        delete row.$edit;
        delete row.$create;
        this.isEditing = false;
        this.newRow = {};
        this.newRow.files = [];
      },
      handleDeleteRow(row, type, index) {
        if (this.isUpload) {
          this.currentValue[type + 'List'].splice(index, 1);
        } else {
          this.$emit('delete-prop', {
            type,
            id: row.propId || row.workId || row.relId || row.id
          });
        }
      },

      handleUploadFiles(mode, row) {
        this.showUploadDialog = true;
        this.$nextTick(() => {
          if (mode === 'EDIT') {
            this.$set(this.newRow, 'files', (this.newRow.attachment ? this.newRow.attachment.split(',').map(_ => ({
              name: '',
              url: _
            })) : []));
          } else {
            this.$set(this.newRow, 'files', (row.attachment ? row.attachment.split(',').map(_ => ({
              name: '',
              url: _
            })) : []));
          }
          this.uploadMode = mode;
        })
      },
      handleUploadDialogUpload(file) {
        this.newRow.files = this.newRow.files.concat({
          url: file.key,
          name: ''
        })
      },
      handleUploadDialogRemove(file, fileList) {
        this.newRow.files = fileList
      },
      handleUploadDialogClose() {
        this.attachmentError = this.newRow.attachment ? undefined : '请上传附件';
        this.$set(this.newRow, 'files', []);
      },
      handleUploadDialogCancel() {
        this.showUploadDialog = false;
      },
      handleUploadDialogConfirm(files) {
        this.newRow.attachment = this.$deepcopy(files).map(_ => _.url).join(',');
        this.showUploadDialog = false;
      },
      handleUploadLicense(file) {
        this.$emit('save-proof', {
          name: this.$filter(this.$enum.PROOF_MATERIAL_O_LICENSE, this.$enum.PROOF_MATERIAL, this.$enum.PROOF_MATERIAL_O),
          kind: this.$enum.PROOF_MATERIAL_O_LICENSE,
          fileType: file.type,
          fileUri: file.key
        })
      },
      handleRemoveLicense(file) {
        this.$emit('delete-proof', file.id)
      },
      handleUploadOther(file) {
        this.$emit('save-proof', {
          name: this.$filter(this.$enum.PROOF_MATERIAL_O_OTHER, this.$enum.PROOF_MATERIAL, this.$enum.PROOF_MATERIAL_O),
          kind: this.$enum.PROOF_MATERIAL_O_OTHER,
          fileType: file.type,
          fileUri: file.key
        })
      },
      handleRemoveOther(file) {
        this.$emit('delete-proof', file.id)
      }
    },
    components: {
      LegalChoose
    }
  };
</script>
