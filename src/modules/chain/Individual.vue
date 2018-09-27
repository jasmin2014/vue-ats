<template>
  <div class="individual">
    <!--基本信息-->
    <el-form ref="baseForm"
             v-if="currentValue.partyPersonBaseDTO"
             :model="currentValue.partyPersonBaseDTO"
             :rules="mode !== 'VIEW' ? rules.base : {}"
             label-width="150px">
      <h4>
        <span>基本信息</span>
      </h4>
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户姓名" prop="realName" :error="error.realName">
            <ats-input v-model.trim="currentValue.partyPersonBaseDTO.realName" :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <ats-select v-model="currentValue.partyPersonBaseDTO.sex" disabled
                        :kind="this.$enum.GENDER" :group="this.$enum.GENDER"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年龄" prop="age">
            <ats-input v-model="currentValue.partyPersonBaseDTO.age" disabled
                       type="number" :min="0"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="婚姻状况">
            <ats-select v-model="currentValue.partyPersonBaseDTO.marriage" :mode="mode" clearable
                        :kind="this.$enum.MARRIAGE_STATUS" :group="this.$enum.MARRIAGE_STATUS"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="住房状况">
            <ats-select v-model="currentValue.partyPersonBaseDTO.homeType" :mode="mode" clearable
                        :kind="this.$enum.HOUSE_STATUS" :group="this.$enum.HOUSE_STATUS"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学历">
            <ats-select v-model="currentValue.partyPersonBaseDTO.education" :mode="mode" clearable
                        :kind="this.$enum.EDUCATION" :group="this.$enum.EDUCATION_GROUP"></ats-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="年收入(万元)" prop="pmIncome" :error="error.pmIncome">
            <ats-select v-model="currentValue.partyPersonBaseDTO.pmIncome" :mode="mode"
                        :kind="this.$enum.INCOME_YEAR" :group="this.$enum.INCOME_YEAR"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件类型" prop="identKind" :error="error.identKind">
            <ats-select v-model="currentValue.partyPersonBaseDTO.identKind" disabled
                        :kind="this.$enum.IDENT_TYPE" :group="this.$enum.IDENT_TYPE"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号码" prop="ident" :error="error.ident">
            <ats-input v-model.trim="currentValue.partyPersonBaseDTO.ident" :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="工作性质" prop="workNature">
            <ats-select v-model="currentValue.partyPersonBaseDTO.workNature" :mode="mode"
                        :kind="this.$enum.WORK_NATURE" :group="this.$enum.WORK_NATURE"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所在省份" prop="province" :error="error.region">
            <ats-select v-model="province" :mode="mode === 'EDIT' ? 'VIEW' : mode" :region="'86'"></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所在城市" prop="city" :error="error.region">
            <ats-select v-model="city" :mode="mode === 'EDIT' ? 'VIEW' : mode" :region="province"></ats-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--联系方式-->
    <el-form ref="contactForm"
             v-if="currentValue.partyPersonBaseDTO"
             :model="currentValue.partyPersonBaseDTO"
             :rules="mode !== 'VIEW' ? rules.contact : {}"
             label-width="150px">
      <h4>
        <span>联系方式</span>
      </h4>
      <el-row>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="mobile" :error="error.mobile">
            <ats-input v-model.trim="currentValue.partyPersonBaseDTO.mobile"
                       :mode="mode === 'EDIT' ? 'VIEW' : mode"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话号码" prop="telephone" :error="error.telephone">
            <ats-input v-model.trim="currentValue.partyPersonBaseDTO.telephone"
                       :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="家庭住址" prop="homeAddress" :error="error.homeAddress">
            <ats-input v-model.trim="currentValue.partyPersonBaseDTO.homeAddress"
                       :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="常住地址" prop="residentAddress" :error="error.residentAddress">
            <ats-input v-model.trim="currentValue.partyPersonBaseDTO.residentAddress"
                       :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="户籍地址" prop="domicileAddress" :error="error.domicileAddress">
            <ats-input v-model.trim="currentValue.partyPersonBaseDTO.domicileAddress"
                       :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--资产信息-->
    <el-form ref="propForm"
             :model="newRow"
             size="small"
             :rules="propRules">
      <!--资产-->
      <div class="assets">
        <h4>
          <span>资产信息</span>
        </h4>
        <!--银行卡-->
        <div class="prop-bank">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>银行卡信息</h5>
            </el-col>
            <el-col :span="1" v-if="mode !== 'VIEW'">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增银行卡"
                         v-if="!currentValue.propBankDTOList || !currentValue.propBankDTOList.length"
                         @click="handleCreateRow('propBankDTO')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.propBankDTOList" border>
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
            <el-table-column align="center" label="开户行">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="issuingBank">
                  <el-input v-model.trim="newRow.issuingBank"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.issuingBank }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="银行手机号码">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="reservedMobile">
                  <el-input v-model.trim="newRow.reservedMobile"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.reservedMobile }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" v-if="mode !== 'VIEW'" :width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-tooltip v-if="scope.row.authState !== 2"
                              content="编辑">
                    <el-button size="small" type="info" icon="fa fa-edit"
                               @click="handleEditRow(scope.row, 'propBankDTO')"></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除">
                    <el-button size="small" type="danger" icon="fa fa-trash"
                               @click="handleDeleteRow(scope.row, 'propBankDTO', scope.$index)"></el-button>
                  </el-tooltip>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'propBankDTO')">确认</el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'propBankDTO')">取消</el-button>
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
            <el-col :span="1" v-if="mode !== 'VIEW'">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增房产"
                         @click="handleCreateRow('propHouseDTO')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.propHouseDTOList" border>
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
                  <el-button title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'propHouseDTO')"></el-button>
                  <el-button title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'propHouseDTO', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'propHouseDTO')">确认</el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'propHouseDTO')">取消</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--商铺信息-->
        <!--<div class="prop-shop">-->
          <!--<el-row type="flex" justify="space-between" align="middle">-->
            <!--<el-col :span="4">-->
              <!--<h5>商铺信息</h5>-->
            <!--</el-col>-->
            <!--<el-col :span="1" v-if="mode !== 'VIEW'">-->
              <!--<el-button size="small" type="primary" icon="fa fa-plus" title="新增商铺信息"-->
                         <!--@click="handleCreateRow('shop')"></el-button>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-table :data="currentValue.shopList" border>-->
            <!--<el-table-column label="序号" align="center" type="index"></el-table-column>-->
            <!--<el-table-column label="商铺名称" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="shopName">-->
                  <!--<el-input v-model.trim="newRow.shopName"></el-input>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ scope.row.shopName }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="所在省份" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="province">-->
                  <!--<ats-select v-model="newRow.province" :mode="mode"-->
                              <!--:region="'86'"></ats-select>-->
                <!--</el-form-item>-->
                <!--<ats-select v-else-->
                            <!--v-model="scope.row.province"-->
                            <!--:mode="'VIEW'"-->
                            <!--region="86"-->
                            <!--text></ats-select>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="所在城市" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="city">-->
                  <!--<ats-select v-model="newRow.city" :mode="mode"-->
                              <!--:region="newRow.province"></ats-select>-->
                <!--</el-form-item>-->
                <!--<ats-select v-else-->
                            <!--v-model="scope.row.city"-->
                            <!--:mode="'VIEW'"-->
                            <!--:region="scope.row.province"-->
                            <!--text></ats-select>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="地址" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="address">-->
                  <!--<el-input v-model.trim="newRow.address"></el-input>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ scope.row.address }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="相关证件" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create" :error="attachmentError"-->
                              <!--prop="attachment">-->
                  <!--<el-button size="small" type="success"-->
                             <!--@click="handleUploadFiles('EDIT', scope.row)">上传附件-->
                  <!--</el-button>-->
                <!--</el-form-item>-->
                <!--<el-button v-else-->
                           <!--size="small"-->
                           <!--@click="handleUploadFiles('VIEW', scope.row)">查看附件-->
                <!--</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">-->
              <!--<template slot-scope="scope">-->
                <!--<div v-if="!scope.row.$edit && !scope.row.$create">-->
                  <!--<el-button v-if="mode === 'CREATE'"-->
                             <!--title="编辑" size="small" type="info" icon="fa fa-edit"-->
                             <!--@click="handleEditRow(scope.row, 'shop')"></el-button>-->
                  <!--<el-button v-if="mode === 'CREATE'"-->
                             <!--title="删除" size="small" type="danger" icon="fa fa-trash"-->
                             <!--@click="handleDeleteRow(scope.row, 'shop', scope.$index)"></el-button>-->
                <!--</div>-->
                <!--<div v-else>-->
                  <!--<el-button title="确认保存" size="small" type="primary"-->
                             <!--@click="handleSaveRow(scope.row, 'shop')">确认-->
                  <!--</el-button>-->
                  <!--<el-button title="取消" size="small"-->
                             <!--@click="handleCancelRow(scope.row, 'shop')">取消-->
                  <!--</el-button>-->
                <!--</div>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
        <!--电商信息-->
        <!--<div class="prop-eshop">-->
          <!--<el-row type="flex" justify="space-between" align="middle">-->
            <!--<el-col :span="4">-->
              <!--<h5>电商信息</h5>-->
            <!--</el-col>-->
            <!--<el-col :span="1" v-if="mode !== 'VIEW'">-->
              <!--<el-button size="small" type="primary" icon="fa fa-plus" title="新增电商信息"-->
                         <!--@click="handleCreateRow('eshop')"></el-button>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-table :data="currentValue.eshopList" border>-->
            <!--<el-table-column label="序号" align="center" type="index"></el-table-column>-->
            <!--<el-table-column label="所属平台" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="platform">-->
                  <!--<ats-select v-model="newRow.platform" :mode="mode"-->
                              <!--:kind="$enum.ESHOP_PLATFORM" :group="$enum.ESHOP_PLATFORM"></ats-select>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ $filter(scope.row.platform, $enum.ESHOP_PLATFORM, $enum.ESHOP_PLATFORM) }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="商铺名称" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="shopName">-->
                  <!--<el-input v-model.trim="newRow.shopName"></el-input>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ scope.row.shopName }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="链接/账号ID" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="ident">-->
                  <!--<el-input v-model.trim="newRow.ident"></el-input>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ scope.row.ident }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="相关证件" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create" :error="attachmentError"-->
                              <!--prop="attachment">-->
                  <!--<el-button size="small" type="success"-->
                             <!--@click="handleUploadFiles('EDIT', scope.row)">上传附件-->
                  <!--</el-button>-->
                <!--</el-form-item>-->
                <!--<el-button v-else-->
                           <!--size="small"-->
                           <!--@click="handleUploadFiles('VIEW', scope.row)">查看附件-->
                <!--</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">-->
              <!--<template slot-scope="scope">-->
                <!--<div v-if="!scope.row.$edit && !scope.row.$create">-->
                  <!--<el-button v-if="mode === 'CREATE'"-->
                             <!--title="编辑" size="small" type="info" icon="fa fa-edit"-->
                             <!--@click="handleEditRow(scope.row, 'eshop')"></el-button>-->
                  <!--<el-button v-if="mode === 'CREATE'"-->
                             <!--title="删除" size="small" type="danger" icon="fa fa-trash"-->
                             <!--@click="handleDeleteRow(scope.row, 'eshop', scope.$index)"></el-button>-->
                <!--</div>-->
                <!--<div v-else>-->
                  <!--<el-button title="确认保存" size="small" type="primary"-->
                             <!--@click="handleSaveRow(scope.row, 'eshop')">确认-->
                  <!--</el-button>-->
                  <!--<el-button title="取消" size="small"-->
                             <!--@click="handleCancelRow(scope.row, 'eshop')">取消-->
                  <!--</el-button>-->
                <!--</div>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
        <!--车-->
        <div class="prop-car">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>车辆信息</h5>
            </el-col>
            <el-col :span="1" v-if="mode !== 'VIEW'">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增车辆"
                         @click="handleCreateRow('propCarDTO')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.propCarDTOList" border>
            <el-table-column label="序号" type="index" align="center"></el-table-column>
            <el-table-column label="品牌" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="brand">
                  <el-input v-model.trim="newRow.brand"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.brand }}</span>
              </template>
            </el-table-column>
            <el-table-column label="型号" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="modelNumber">
                  <el-input v-model.trim="newRow.modelNumber"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.modelNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="购置年月" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="buyCarDate">
                  <el-date-picker v-model="newRow.buyCarDate"
                                  :picker-options="datePickerOptions"
                                  value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <span v-else>{{ scope.row.buyCarDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="使用性质" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="nature">
                  <ats-select v-model="newRow.nature"
                              :kind="$enum.CAR_NATURE" :group="$enum.CAR_NATURE" :mode="mode"></ats-select>
                </el-form-item>
                <span v-else>{{ $filter(scope.row.nature, $enum.CAR_NATURE, $enum.CAR_NATURE) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="车牌照" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="licencePlate">
                  <el-input v-model.trim="newRow.licencePlate"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.licencePlate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="车辆信息图片" align="center">
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
                  <el-button title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'propCarDTO')"></el-button>
                  <el-button title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'propCarDTO', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'propCarDTO')">确认</el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'propCarDTO')">取消</el-button>
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
            <el-col :span="1" v-if="mode !== 'VIEW'">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增负债信息"
                         @click="handleCreateRow('personDebtInformationDTO')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.personDebtInformationDTOList" border>
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
                  <el-button title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'personDebtInformationDTO')"></el-button>
                  <el-button title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'personDebtInformationDTO', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'personDebtInformationDTO')">确认</el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'personDebtInformationDTO')">取消</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--公积金-->
      <div class="public">
        <h4>
          <span>公共资源信息</span>
        </h4>
        <!--公积金-->
        <div class="prop-public">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>公积金信息</h5>
            </el-col>
            <el-col :span="1" v-if="mode !== 'VIEW'">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增公积金缴存信息"
                         @click="handleCreateRow('propPublicReserveFundsDTO')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.propPublicReserveFundsDTOList" border>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="公积金客户号" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="account">
                  <el-input v-model.trim="newRow.account"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.account }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column label="账户状态" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="status">-->
                  <!--<ats-select v-model="newRow.status"-->
                              <!--:kind="$enum.PUBLIC_ACC_STATUS" :group="$enum.PUBLIC_ACC_STATUS"></ats-select>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ $filter(scope.row.status, $enum.PUBLIC_ACC_STATUS, $enum.PUBLIC_ACC_STATUS) }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="缴纳单位" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="payOrgParty">
                  <el-input v-model.trim="newRow.payOrgParty"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.payOrgParty }}</span>
              </template>
            </el-table-column>
            <el-table-column label="缴纳城市" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="paymentCity">
                  <el-input v-model.trim="newRow.paymentCity"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.paymentCity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="账户余额（元）" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="balance">
                  <ats-input v-model="newRow.balance"
                             type="number" :min="0" :step="0.01"></ats-input>
                </el-form-item>
                <span v-else>{{ scope.row.balance }}</span>
              </template>
            </el-table-column>
            <el-table-column label="当前每月缴纳金额（元）" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="monthPaymentAmount">
                  <ats-input v-model="newRow.monthPaymentAmount"
                             type="number" :min="0" :step="0.01"></ats-input>
                </el-form-item>
                <span v-else>{{ scope.row.monthPaymentAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button v-if="mode === 'CREATE'"
                             title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'propPublicReserveFundsDTO')"></el-button>
                  <el-button v-if="mode === 'CREATE'"
                             title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'propPublicReserveFundsDTO', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'propPublicReserveFundsDTO')">确认
                  </el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'propPublicReserveFundsDTO')">取消
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--社保-->
        <!--<div class="prop-insurance">-->
          <!--<el-row type="flex" justify="space-between" align="middle">-->
            <!--<el-col :span="4">-->
              <!--<h5>社保信息</h5>-->
            <!--</el-col>-->
            <!--<el-col :span="1" v-if="mode !== 'VIEW'">-->
              <!--<el-button size="small" type="primary" icon="fa fa-plus" title="新增社保缴存信息"-->
                         <!--@click="handleCreateRow('insurance')"></el-button>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-table :data="currentValue.insuranceList" border>-->
            <!--<el-table-column label="序号" align="center" type="index"></el-table-column>-->
            <!--<el-table-column label="社保账号" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="account">-->
                  <!--<el-input v-model.trim="newRow.account"></el-input>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ scope.row.account }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="账户状态" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="status">-->
                  <!--<ats-select v-model="newRow.status"-->
                              <!--:kind="$enum.PUBLIC_ACC_STATUS" :group="$enum.PUBLIC_ACC_STATUS"></ats-select>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ $filter(scope.row.status, $enum.PUBLIC_ACC_STATUS, $enum.PUBLIC_ACC_STATUS) }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="缴纳单位" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="payOrgParty">-->
                  <!--<el-input v-model.trim="newRow.payOrgParty"></el-input>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ scope.row.payOrgParty }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="缴纳城市" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="paymentCity">-->
                  <!--<el-input v-model.trim="newRow.paymentCity"></el-input>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ scope.row.paymentCity }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="当前每月缴纳金额（元）" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-form-item v-if="scope.row.$edit || scope.row.$create"-->
                              <!--prop="monthPaymentAmount">-->
                  <!--<ats-input v-model="newRow.monthPaymentAmount"-->
                             <!--type="number" :min="0" :step="0.01"></ats-input>-->
                <!--</el-form-item>-->
                <!--<span v-else>{{ scope.row.monthPaymentAmount }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">-->
              <!--<template slot-scope="scope">-->
                <!--<div v-if="!scope.row.$edit && !scope.row.$create">-->
                  <!--<el-button v-if="mode === 'CREATE'"-->
                             <!--title="编辑" size="small" type="info" icon="fa fa-edit"-->
                             <!--@click="handleEditRow(scope.row, 'insurance')"></el-button>-->
                  <!--<el-button v-if="mode === 'CREATE'"-->
                             <!--title="删除" size="small" type="danger" icon="fa fa-trash"-->
                             <!--@click="handleDeleteRow(scope.row, 'insurance', scope.$index)"></el-button>-->
                <!--</div>-->
                <!--<div v-else>-->
                  <!--<el-button title="确认保存" size="small" type="primary"-->
                             <!--@click="handleSaveRow(scope.row, 'insurance')">确认-->
                  <!--</el-button>-->
                  <!--<el-button title="取消" size="small"-->
                             <!--@click="handleCancelRow(scope.row, 'insurance')">取消-->
                  <!--</el-button>-->
                <!--</div>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
        <!--</div>-->
      </div>
      <!--单位信息-->
      <div class="org">
        <h4>
          <span>单位信息</span>
        </h4>
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="4">
            <h5>单位信息</h5>
          </el-col>
          <el-col :span="1" v-if="mode !== 'VIEW'">
            <el-button size="small" type="primary" icon="fa fa-plus" title="新增单位"
                       @click="handleCreateRow('partyPersonWorkHisDTO')"></el-button>
          </el-col>
        </el-row>
        <el-table :data="currentValue.partyPersonWorkHisDTOList" border>
          <el-table-column label="序号" align="center" type="index"></el-table-column>
          <el-table-column label="年份" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit || scope.row.$create"
                            prop="jobStart">
                <el-date-picker v-model="jobTime"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                :picker-options="datePickerOptions"></el-date-picker>
              </el-form-item>
              <span v-else>{{ scope.row.jobStart }} ~ {{ scope.row.jobEnd }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位名称" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit || scope.row.$create"
                            prop="workOrgName">
                <el-input v-model.trim="newRow.workOrgName"></el-input>
              </el-form-item>
              <span v-else>{{ scope.row.workOrgName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属行业" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit || scope.row.$create"
                            prop="workType">
                <ats-select v-model.trim="newRow.workType"
                            :kind="$enum.INDUSTRY" :group="$enum.INDUSTRY"></ats-select>
              </el-form-item>
              <span v-else>{{ $filter(scope.row.workType, $enum.INDUSTRY, $enum.INDUSTRY) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位性质" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit || scope.row.$create"
                            prop="workOrgNature">
                <ats-select v-model.trim="newRow.workOrgNature"
                            :kind="$enum.COMPANY_PROP" :group="$enum.COMPANY_PROP_GROUP"></ats-select>
              </el-form-item>
              <span v-else>{{ $filter(scope.row.workOrgNature, $enum.COMPANY_PROP, $enum.COMPANY_PROP_GROUP) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位电话" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit || scope.row.$create"
                            prop="workOrgPhone">
                <el-input v-model="newRow.workOrgPhone"></el-input>
              </el-form-item>
              <span v-else>{{ scope.row.workOrgPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位地址" align="center">
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.$edit || scope.row.$create"
                            prop="workOrgAddress">
                <el-input v-model="newRow.workOrgAddress"></el-input>
              </el-form-item>
              <span v-else>{{ scope.row.workOrgAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
            <template slot-scope="scope">
              <div v-if="!scope.row.$edit && !scope.row.$create">
                <el-button title="编辑" size="small" type="info" icon="fa fa-edit"
                           @click="handleEditRow(scope.row, 'partyPersonWorkHisDTO')"></el-button>
                <el-button title="删除" size="small" type="danger" icon="fa fa-trash"
                           @click="handleDeleteRow(scope.row, 'partyPersonWorkHisDTO', scope.$index)"></el-button>
              </div>
              <div v-else>
                <el-button title="确认保存" size="small" type="primary"
                           @click="handleSaveRow(scope.row, 'partyPersonWorkHisDTO')">确认</el-button>
                <el-button title="取消" size="small"
                           @click="handleCancelRow(scope.row, 'partyPersonWorkHisDTO')">取消</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--联系人信息-->
      <div class="relationship">
        <h4>
          <span>联系人信息</span>
        </h4>
        <!--亲属联系人-->
        <div class="prop-family">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>亲属联系人</h5>
            </el-col>
            <el-col :span="1" v-if="mode !== 'VIEW'">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增亲属联系人"
                         @click="handleCreateRow('family')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.familyList" border>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="realName">
                  <el-input v-model.trim="newRow.realName"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.realName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="关系" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="kind">
                  <ats-select v-model="newRow.kind"
                              :kind="$enum.REL_RELATIVE" :group="$enum.REL_RELATIVE"></ats-select>
                </el-form-item>
                <span v-else>{{ $filter(scope.row.kind, $enum.REL_RELATIVE, $enum.REL_RELATIVE) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号码" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="mobile">
                  <el-input v-model.trim="newRow.mobile"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.mobile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'family')"></el-button>
                  <el-button title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'family', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'family')">确认</el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'family')">取消</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--朋友联系人-->
        <div class="prop-friend">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="4">
              <h5>其他联系人</h5>
            </el-col>
            <el-col :span="1" v-if="mode !== 'VIEW'">
              <el-button size="small" type="primary" icon="fa fa-plus" title="新增其他联系人"
                         @click="handleCreateRow('friend')"></el-button>
            </el-col>
          </el-row>
          <el-table :data="currentValue.friendList" border>
            <el-table-column label="序号" align="center" type="index"></el-table-column>
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="realName">
                  <el-input v-model.trim="newRow.realName"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.realName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="关系" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="kind">
                  <ats-select v-model="newRow.kind"
                              :kind="$enum.REL_FRIEND" :group="$enum.REL_FRIEND"></ats-select>
                </el-form-item>
                <span v-else>{{ $filter(scope.row.kind, $enum.REL_FRIEND, $enum.REL_FRIEND) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号码" align="center">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.$edit || scope.row.$create"
                              prop="mobile">
                  <el-input v-model.trim="newRow.mobile"></el-input>
                </el-form-item>
                <span v-else>{{ scope.row.mobile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="mode !== 'VIEW'" width="150">
              <template slot-scope="scope">
                <div v-if="!scope.row.$edit && !scope.row.$create">
                  <el-button title="编辑" size="small" type="info" icon="fa fa-edit"
                             @click="handleEditRow(scope.row, 'friend')"></el-button>
                  <el-button title="删除" size="small" type="danger" icon="fa fa-trash"
                             @click="handleDeleteRow(scope.row, 'friend', scope.$index)"></el-button>
                </div>
                <div v-else>
                  <el-button title="确认保存" size="small" type="primary"
                             @click="handleSaveRow(scope.row, 'friend')">确认</el-button>
                  <el-button title="取消" size="small"
                             @click="handleCancelRow(scope.row, 'friend')">取消</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-form>
    <!--证件照片-->
    <div class="photo">
      <h4>
        <span>证件照片</span>
      </h4>
      <el-row type="flex" justify="center">
        <ats-upload v-model="filesIdCard"
                    :mode="mode"
                    text="证件照片"
                    :limit="2"
                    required
                    @success="handleUploadIdCard"
                    @remove="handleRemoveIdCard"></ats-upload>
      </el-row>
    </div>
    <ats-upload-dialog :visible.sync="showUploadDialog"
                       v-model="newRow.files"
                       :mode="uploadMode"
                       @upload="handleUploadDialogUpload"
                       @remove="handleUploadDialogRemove"
                       @close="handleUploadDialogClose"
                       @cancel="handleUploadDialogCancel"
                       @confirm="handleUploadDialogConfirm"></ats-upload-dialog>
  </div>
</template>

<script>
  import {getBankNameByCard} from '../../api/enum';
  const BANK_CARD_AUTH_STATUS = {
    0: '未认证',
    2: '已认证',
    3: '认证失败'
  };

  export default {
    props: {
      mode: String,
      value: Object,
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
          partyPersonBaseDTO: {
            realName: '',
            sex: '',
            age: null,
            marriage: '',
            homeType: '',
            education: '',
            pmIncome: '',
            identKind: this.$enum.IDENT_TYPE_IDENTITY,
            ident: '',
            workNature: '',
            region: '', // p,c
            // contact
            telephone: '',
            mobile: '',
            homeAddress: '',
            residentAddress: '',
            domicileAddress: ''
          },
          propBankDTOList: [],
          propHouseDTOList: [],
          shopList: [],
          eshopList: [],
          propCarDTOList: [],
          personDebtInformationDTOList: [],
          propPublicReserveFundsDTOList: [],
          insuranceList: [],
          partyPersonWorkHisDTOList: [],
          familyList: [],
          friendList: [],
          materialList: []
        },
        newRow: {
          files: []
        },
        isEditing: false,
        showUploadDialog: false,
        uploadMode: '',
        rules: {
          base: {
            // 基本信息
            realName: [
              { required: true, message: '请输入客户姓名', trigger: 'blur' },
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
            workNature: [
              { required: true, message: '请选择工作性质', trigger: 'change' }
            ],
            province: [
              { required: true, message: '请选择客户所在省份', trigger: 'change' }
            ],
            city: [
              { required: true, message: '请选择客户所在城市', trigger: 'change' }
            ]
          },
          baseEdit: {
            // 基本信息
            pmIncome: [
              { required: true, message: '请选择年收入', trigger: 'change' }
            ]
          },
          contact: {
            // 联系方式
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
          propBankDTO: {
            bankCard: [
              { required: true, message: '请输入银行卡号', trigger: 'blur' },
              { pattern: this.$valid.card, message: '8-28位数字', trigger: 'blur' }
            ],
            bankName: [
              { required: true, message: '请检查银行卡号', trigger: 'change' }
            ],
            issuingBank: [
              // { required: true, message: '请输入开户行', trigger: 'blur' },
              { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
            ],
            reservedMobile: [
              { required: true, message: '请输入银行预留手机号码', trigger: 'blur' },
              { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
            ]
          },
          propHouseDTO: {
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
          shop: {
            shopName: [
              { required: true, message: '请输入商铺名称', trigger: 'blur' }
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
              { required: true, message: '请输入商铺名称', trigger: 'blur' }
            ],
            ident: [
              { required: true, message: '请输入电商链接/账号ID', trigger: 'blur' },
              { min: 0, max: 100, message: '链接/账号ID过长', trigger: 'blur' }
            ],
            attachment: [
              { required: true, message: '请上传附件', trigger: 'submit' }
            ]
          },
          propCarDTO: {
            brand: [
              { required: true, message: '请输入车辆品牌', trigger: 'blur' }
            ],
            modelNumber: [
              { required: true, message: '请输入车辆型号', trigger: 'blur' }
            ],
            buyCarDate: [
              { required: true, message: '请选择新车购置年月', trigger: 'change' }
            ],
            nature: [
              { required: true, message: '请选择车辆使用性质', trigger: 'change' }
            ],
            licencePlate: [
              { required: true, message: '请输入车牌照', trigger: 'blur' }
            ],
            attachment: [
              { required: true, message: '请上传附件', trigger: 'submit' }
            ]
          },
          personDebtInformationDTO: {
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
          },
          propPublicReserveFundsDTO: {
            account: [
              { required: true, message: '请输入公积金客户号', trigger: 'blur' },
              { pattern: this.$valid.pfAccount, message: '9-20位数字', trigger: 'blur' }
            ],
            status: [
              { required: true, message: '请选择公积金账户状态', trigger: 'change' }
            ],
            payOrgParty: [
              { required: true, message: '请输入公积金缴纳单位', trigger: 'blur' }
            ],
            paymentCity: [
              { required: true, message: '请输入公积金缴纳城市', trigger: 'blur' }
            ],
            balance: [
              { required: true, message: '请输入账户余额', trigger: 'blur', type: 'number' },
              { min: 0, max: Number.MAX_SAFE_INTEGER, message: '请输入正确的账户余额', trigger: 'blur', type: 'number' },
              {
                trigger: 'blur',
                type: 'number',
                validator: (rule, value, callback) => {
                  if (this.$valid.floatValidator(value, 2)) {
                    callback()
                  } else {
                    callback('保留2位小数')
                  }
                }
              }
            ],
            monthPaymentAmount: [
              { required: true, message: '请输入每月缴纳金额', trigger: 'blur', type: 'number' },
              { min: 0, max: Number.MAX_SAFE_INTEGER, message: '请输入正确的每月缴纳金额', trigger: 'blur', type: 'number' },
              {
                trigger: 'blur',
                type: 'number',
                validator: (rule, value, callback) => {
                  if (this.$valid.floatValidator(value, 2)) {
                    callback()
                  } else {
                    callback('保留2位小数')
                  }
                }
              }
            ]
          },
          insurance: {
            account: [
              { required: true, message: '请输入公积金客户号', trigger: 'blur' },
              { pattern: this.$valid.pfAccount, message: '9-20位数字', trigger: 'blur' }
            ],
            status: [
              { required: true, message: '请选择公积金账户状态', trigger: 'change' }
            ],
            payOrgParty: [
              { required: true, message: '请输入公积金缴纳单位', trigger: 'blur' }
            ],
            paymentCity: [
              { required: true, message: '请输入公积金缴纳城市', trigger: 'blur' }
            ],
            monthPaymentAmount: [
              { required: true, message: '请输入每月缴纳金额', trigger: 'blur', type: 'number' },
              { min: 0, max: Number.MAX_SAFE_INTEGER, message: '请输入正确的每月缴纳金额', trigger: 'blur', type: 'number' },
              {
                trigger: 'blur',
                type: 'number',
                validator: (rule, value, callback) => {
                  if (this.$valid.floatValidator(value, 2)) {
                    callback()
                  } else {
                    callback('保留2位小数')
                  }
                }
              }
            ]
          },
          partyPersonWorkHisDTO: {
            // 单位信息
            jobStart: [
              { required: true, message: '请选择工作年份', trigger: 'change' }
            ],
            workOrgName: [
              { required: true, message: '请输入单位名称', trigger: 'blur' },
              { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
            ],
            workType: [
              { required: true, message: '请选择所属行业', trigger: 'change' }
            ],
            workOrgNature: [
              { required: true, message: '请选择单位性质', trigger: 'change' }
            ],
            workOrgPhone: [
              { pattern: this.$valid.telephone, message: '请输入正确的电话号码', trigger: 'blur' }
            ],
            workOrgAddress: [
              { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
            ]
          },
          family: {
            realName: [
              { required: true, message: '请输入联系人姓名', trigger: 'blur' },
              { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
            ],
            kind: [
              { required: true, message: '请选择联系人关系', trigger: 'change' }
            ],
            mobile: [
              { required: true, message: '请输入联系人手机号码', trigger: 'blur' },
              { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
            ]
          },
          friend: {
            realName: [
              { required: true, message: '请输入联系人姓名', trigger: 'blur' },
              { min: 0, max: 10, message: '10字以内', trigger: 'blur' }
            ],
            kind: [
              { required: true, message: '请选择联系人关系', trigger: 'change' }
            ],
            mobile: [
              { required: true, message: '请输入联系人手机号码', trigger: 'blur' },
              { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
            ]
          }
        },
        propRules: {},
        attachmentError: '',
        datePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    watch: {
      'value.partyPersonBaseDTO'(val) {
        val.identKind = val.identKind || this.$enum.IDENT_TYPE_IDENTITY;
        this.setCurrentValue(this.$deepcopy(val), 'partyPersonBaseDTO');
      },
      'value.propBankDTOList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'propBankDTOList');
        this.isEditing = false;
      },
      'value.propHouseDTOList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'propHouseDTOList');
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
      'value.propCarDTOList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'propCarDTOList');
        this.isEditing = false;
      },
      'value.personDebtInformationDTOList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'personDebtInformationDTOList');
        this.isEditing = false;
      },
      'value.propPublicReserveFundsDTOList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'propPublicReserveFundsDTOList');
        this.isEditing = false;
      },
      'value.insuranceList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'insuranceList');
        this.isEditing = false;
      },
      'value.partyPersonWorkHisDTOList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'partyPersonWorkHisDTOList');
        this.isEditing = false;
      },
      'value.familyList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'familyList');
        this.isEditing = false;
      },
      'value.friendList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'friendList');
        this.isEditing = false;
      },
      'value.materialList'(val) {
        this.setCurrentValue(this.$deepcopy(val), 'materialList')
      }
    },
    computed: {
      province: {
        get() {
          const region = this.currentValue.partyPersonBaseDTO.region;
          return region ? (region.split(',')[0] || '') : '';
        },
        set(val) {
          this.currentValue.partyPersonBaseDTO.province = val;
          this.currentValue.partyPersonBaseDTO.region = `${val},${this.city}`;
        }
      },
      city: {
        get() {
          const region = this.currentValue.partyPersonBaseDTO.region;
          return region ? (region.split(',')[1] || '') : '';
        },
        set(val) {
          this.currentValue.partyPersonBaseDTO.city = val;
          this.currentValue.partyPersonBaseDTO.region = `${this.province},${val}`;
        }
      },
      jobTime: {
        get() {
          if (this.newRow.jobStart && this.newRow.jobEnd) {
            const dateRange = [];
            dateRange[0] = this.newRow.jobStart;
            dateRange[1] = this.newRow.jobEnd;
            return dateRange
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.$set(this.newRow, 'jobStart', val[0]);
            this.$set(this.newRow, 'jobEnd', val[1]);
            // this.newRow.jobStart = val[0];
            // this.newRow.jobEnd = val[1]
          } else {
            this.$set(this.newRow, 'jobStart', '');
            this.$set(this.newRow, 'jobEnd', '');
            // this.newRow.jobStart = '';
            // this.newRow.jobEnd = ''
          }
        }
      },
      filesIdCard: {
        get() {
          // .filter(_ => _.kind === this.$enum.PROOF_MATERIAL_P_ID_CARD)
          return this.currentValue.materialList.map((_, i) => ({
            id: _.id || i,
            name: _.name,
            url: _.fileUri,
            type: _.fileType
          }))
        }
      }
    },
    methods: {
      get3Elements() {
        return {
          name: this.currentValue.partyPersonBaseDTO.realName,
          ident: this.currentValue.partyPersonBaseDTO.ident,
          mobile: this.currentValue.partyPersonBaseDTO.mobile
        }
      },
      save(done) {
        if (this.isEditing) {
          this.$alert('请先保存表格信息', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          this.$emit('error');
          return;
        }
        const val = this.$deepcopy(this.currentValue);
        this.$refs.baseForm.validate((valid) => {
          if (valid) {
            this.$refs.contactForm.validate((v) => {
              if (v && this.validate(val)) {
                this.emitSave(val, done)
              } else if (!v) {
                this.$emit('error');
                this.$message.error('请检查保存信息');
                return false;
              } else {
                this.$emit('error');
                return false;
              }
            })
          } else {
            this.$emit('error');
            return false;
          }
        })
      },
      emitSave(val, done) {
        delete val.partyPersonBaseDTO.province;
        delete val.partyPersonBaseDTO.city;
        const customer = {
          partyPersonBaseDTO: this.$objClean(val.partyPersonBaseDTO),
          propBankDTOList: val.propBankDTOList,
          propHouseDTOList: val.propHouseDTOList,
          shopList: val.shopList,
          eshopList: val.eshopList,
          propCarDTOList: val.propCarDTOList,
          personDebtInformationDTOList: val.personDebtInformationDTOList,
          propPublicReserveFundsDTOList: val.propPublicReserveFundsDTOList,
          insuranceList: val.insuranceList,
          partyPersonWorkHisDTOList: val.partyPersonWorkHisDTOList,
          familyList: val.familyList,
          friendList: val.friendList,
          materialList: val.materialList
        };
        if (typeof done === 'function') {
          done(customer);
        } else {
          this.$emit('save', customer);
        }
      },
      validate(val) {
        if (!val.propBankDTOList.length) {
          this.$message.error('至少添加一张银行卡');
          return false;
        }
        if (!val.materialList || val.materialList.length < 2) {
          this.$message.error('请上传身份证正反面');
          return false;
        }
        return true;
      },
      setCurrentValue(val, key) {
        if (this.currentValue.hasOwnProperty(key)) {
          if (typeof val === 'object' && val instanceof Array) {
            this.currentValue[key] = val;
          } else if (typeof val === 'object') {
            for (const k in val) {
              if (this.currentValue[key].hasOwnProperty(k)) {
                this.currentValue[key][k] = val[k];
              }
            }
          } else {
            this.currentValue[key] = val;
          }
        }
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
      handleCancel() {
        this.$router.go(-1);
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
      handleBindCard(row) {
        this.$emit('bind-card', row.propId)
      },
      handleEditRow(row, type) {
        if (this.isEditing) {
          this.$alert('请先保存其他表格信息', '提示消息', {
            confirmButtonText: '确定',
            type: 'warning'
          });
          return;
        }
        if (type === 'personDebtInformationDTO') {
          if (row.loanStart && row.loanEnd) {
            row.loanDate = [row.loanStart, row.loanEnd]
          } else {
            row.loanDate = [];
          }
        }
        this.newRow = this.$deepcopy(row);
        this.$set(this.newRow, 'files', []);
        this.isEditing = true;
        this.$set(row, '$edit', true);
        this.propRules = this.rules[type];
      },
      handleSaveRow(row, type) {
        this.$refs.propForm.validate((valid) => {
          if (valid) {
            let data = {};
            switch (type) {
              case 'propBankDTO':
                data = {
                  // propId: this.newRow.propId,
                  // propType: this.$enum.CUSTOMER_PROP_CARD,
                  // realName: this.currentValue.base.realName,
                  bankCard: this.newRow.bankCard,
                  bankName: this.newRow.bankName,
                  // bankCode: this.newRow.bankCode,
                  // cardType: this.newRow.cardType,
                  issuingBank: this.newRow.issuingBank,
                  reservedMobile: this.newRow.reservedMobile
                };
                break;
              case 'propHouseDTO':
                data = {
                  // propId: this.newRow.propId,
                  // propType: this.$enum.CUSTOMER_PROP_HOUSE,
                  province: this.newRow.province,
                  city: this.newRow.city,
                  address: this.newRow.address,
                  attachment: this.newRow.attachment
                };
                break;
              case 'shop':
                data = {
                  // propId: this.newRow.propId,
                  // propType: this.$enum.CUSTOMER_PROP_HOUSE,
                  shopName: this.newRow.shopName,
                  province: this.newRow.province,
                  city: this.newRow.city,
                  address: this.newRow.address,
                  attachment: this.newRow.attachment
                };
                break;
              case 'eshop':
                data = {
                  // propId: this.newRow.propId,
                  // propType: this.$enum.CUSTOMER_PROP_HOUSE,
                  platform: this.newRow.platform,
                  shopName: this.newRow.shopName,
                  ident: this.newRow.ident,
                  attachment: this.newRow.attachment
                };
                break;
              case 'propCarDTO':
                data = {
                  // propId: this.newRow.propId,
                  // propType: this.$enum.CUSTOMER_PROP_CAR,
                  brand: this.newRow.brand,
                  buyCarDate: this.newRow.buyCarDate,
                  nature: this.newRow.nature,
                  modelNumber: this.newRow.modelNumber,
                  licencePlate: this.newRow.licencePlate,
                  attachment: this.newRow.attachment
                };
                break;
              case 'personDebtInformationDTO':
                data = {
                  // id: this.newRow.id,
                  loanPlatform: this.newRow.loanPlatform,
                  usageLoan: this.newRow.usageLoan,
                  loanStart: this.newRow.loanDate[0],
                  loanEnd: this.newRow.loanDate[1],
                  loanAmount: this.newRow.loanAmount
                };
                break;
              case 'propPublicReserveFundsDTO':
                data = {
                  // propId: this.newRow.propId,
                  // propType: this.$enum.CUSTOMER_PROP_FUND,
                  account: this.newRow.account,
                  kind: 'HOUSING_FUND',
                  // status: this.newRow.status,
                  payOrgParty: this.newRow.payOrgParty,
                  paymentCity: this.newRow.paymentCity,
                  balance: this.newRow.balance,
                  monthPaymentAmount: this.newRow.monthPaymentAmount
                };
                break;
              case 'insurance':
                data = {
                  // propId: this.newRow.propId,
                  // propType: this.$enum.CUSTOMER_PROP_FUND,
                  account: this.newRow.account,
                  // kind: 'HOUSING_FUND',
                  // status: this.newRow.status,
                  payOrgParty: this.newRow.payOrgParty,
                  paymentCity: this.newRow.paymentCity,
                  monthPaymentAmount: this.newRow.monthPaymentAmount
                };
                break;
              case 'partyPersonWorkHisDTO':
                data = {
                  // workId: this.newRow.workId,
                  jobStart: this.newRow.jobStart,
                  jobEnd: this.newRow.jobEnd,
                  workOrgName: this.newRow.workOrgName,
                  workType: this.newRow.workType,
                  workOrgNature: this.newRow.workOrgNature,
                  workOrgPhone: this.newRow.workOrgPhone,
                  workOrgAddress: this.newRow.workOrgAddress
                };
                break;
              case 'family':
              case 'friend':
                data = {
                  // relId: this.newRow.relId,
                  realName: this.newRow.realName,
                  kind: this.newRow.kind,
                  mobile: this.newRow.mobile
                };
                break;
              default:
                break;
            }
            row = this.$objClean(Object.assign(row, data));
            this.$set(row, '$edit', false);
            this.$set(row, '$create', false);
            delete row.$edit;
            delete row.$create;
            this.isEditing = false;
            this.newRow = {};
            this.$set(this.newRow, 'files', []);
            this.attachmentError = '';
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
        this.$set(this.newRow, 'files', []);
        this.attachmentError = '';
      },
      handleDeleteRow(row, type, index) {
        this.currentValue[type + 'List'].splice(index, 1)
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
      handleUploadIdCard(file) {
        this.currentValue.materialList.push({
          name: this.$filter(this.$enum.PROOF_MATERIAL_P_ID_CARD, this.$enum.PROOF_MATERIAL, this.$enum.PROOF_MATERIAL_P),
          kind: this.$enum.PROOF_MATERIAL_P_ID_CARD,
          fileType: file.type,
          fileUri: file.key
        });
      },
      handleRemoveIdCard(file) {
        this.$emit('delete-proof', file.id)
      },
      bankAuthStatusFilter(status) {
        return BANK_CARD_AUTH_STATUS[status] || status
      }
    }
  };
</script>
