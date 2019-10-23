<template>
  <div class="account-list">
    <el-tabs v-model="tabName" type="border-card">
      <template v-for="item in list">
        <el-tab-pane :key="item.useType" :name="item.useType" :label="`${$filter(item.useType, $enum.BANK_USE_TYPE, $enum.BANK_USE_TYPE)}银行卡`">
          <el-button v-action="'FinanceAccountCreate'"
                    type="primary" icon="fa fa-plus" size="small"
                    @click="handleAdd(item.useType)"> 增加银行卡</el-button>
          <div class="bank-list">
            <el-card v-for="card in item.bankList" :key="card.id"
                    class="mgt20">
              <!--个人银行卡-->
              <table v-if="card.bankType === $enum.BANK_TYPE_PERSONAL_CARD"
                    class="el-table el-table--border" cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                  <td>银行卡号</td>
                  <td colspan="3">
                    <span class="bank-card">{{ card.bankCard }}</span> （{{ $filter(card.bankType, $enum.BANK_TYPE, $enum.BANK_TYPE) }}）
                  </td>
                  <td>
                    <el-button v-action="'FinanceAccountEdit'"
                              type="info" size="mini" icon="fa fa-edit"
                              :disabled="!canEdit(card)"
                              @click="handleEdit(card)"></el-button>
                  </td>
                </tr>
                <tr>
                  <th>姓名</th>
                  <th>身份证号</th>
                  <th>所属银行</th>
                  <th>开户行</th>
                  <th>预留手机号</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{ card.name }}</td>
                  <td>{{ card.ident }}</td>
                  <td>{{ card.ownerBank }}</td>
                  <td>{{ card.openBank }}</td>
                  <td>{{ card.mobilePhone }}</td>
                </tr>
                </tbody>
              </table>
              <!--对公银行卡-->
              <table v-else-if="card.bankType === $enum.BANK_TYPE_PUBLIC_CARD"
                    class="el-table el-table--border" cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                  <td>银行卡号</td>
                  <td colspan="6">
                    <span class="bank-card">{{ card.bankCard }}</span> （{{ $filter(card.bankType, $enum.BANK_TYPE, $enum.BANK_TYPE) }}）
                  </td>
                  <td>
                    <el-button v-action="'FinanceAccountEdit'"
                              type="info" size="mini" icon="fa fa-edit"
                              :disabled="!canEdit(card)"
                              @click="handleEdit(card)"></el-button>
                  </td>
                </tr>
                <tr>
                  <th>企业名称</th>
                  <th>社会统一信用代码</th>
                  <th>所属银行</th>
                  <th>开户行</th>
                  <th>所在省份</th>
                  <th>所在城市</th>
                  <th>联系人</th>
                  <th>手机号</th>
                </tr>
                <tr>
                  <td>{{ card.name }}</td>
                  <td>{{ card.ident }}</td>
                  <td>{{ card.ownerBank }}</td>
                  <td>{{ card.openBank }}</td>
                  <td>
                    <ats-select v-model="card.province"
                                region="86"
                                mode="VIEW"
                                text></ats-select>
                  </td>
                  <td>
                    <ats-select v-model="card.city"
                                :region="card.province"
                                mode="VIEW"
                                text></ats-select>
                  </td>
                  <td>{{ card.linkmanName }}</td>
                  <td>{{ card.mobilePhone }}</td>
                </tr>
                </thead>
              </table>
              <!--资金方-->
              <el-table v-if="card.bankRelationList && card.bankRelationList.length > 0"
                        :data="card.bankRelationList" border
                        class="mgt20">
                <el-table-column v-for="col in relationTable"
                                :key="col.prop"
                                :label="col.label"
                                :prop="col.prop"
                                :formatter="col.formatter"
                                align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.authStatus !== $enum.BANK_CARD_AUTH_STATUS_AUTHERIZED"
                              type="success"
                              size="mini"
                              @click="handleAuthCard(scope.row, item.useType)">认证</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>
      </template>
    </el-tabs>

    <el-dialog :visible.sync="dialog.visible" width="800px">
      <card v-if="dialog.form" :value="dialog.form" :mode="dialog.mode" style="width: 80%;" @save="handleCardSave"></card>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getBankCardList,
    editBankCard,
    deleteBankCard,
    authBankCard
  } from '../../api/finance';
  import Card from '../../../modules/account-center/Card'

  export default {
    components: {
      Card
    },
    data() {
      return {
        tabName: this.$enum.BANK_USE_TYPE_COLLECTION,
        list: [],
        dialog: {
          mode: 'EDIT',
          visible: false,
          form: null
        },
        relationTable: [
          {
            label: '关系资金方',
            prop: 'fundOrgName'
          },
          {
            label: '验证状态',
            prop: 'authStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.BANK_CARD_AUTH_STATUS, this.$enum.BANK_CARD_AUTH_STATUS)
          }
        ]
      }
    },

    created() {
      this.getData();
    },

    methods: {
      canEdit(card) {
        return (card.bankRelationList || []).every(_ => _.authStatus === this.$enum.BANK_CARD_AUTH_STATUS_UNAUTHERIZED)
      },
      handleAdd(useType) {
        this.$router.push({
          name: 'FinanceAccountCreate',
          params: {
            use: useType
          }
        })
      },
      handleEdit(card) {
        card = this.$deepcopy(card);
        card.bankRelationList = undefined;
        this.dialog.form = card;
        this.dialog.visible = true;
      },
      // handleDelete(bankId) {
      //   this.$confirm('您确认不再使用该银行卡了?', '提示').then(() => {
      //     deleteBankCard(bankId).then(({ data }) => {
      //       if (data.code === 204) {
      //         this.$message.success('删除成功');
      //         this.getData();
      //       } else {
      //         this.$message.error(data.message)
      //       }
      //     }).catch(() => {
      //       this.getData();
      //     })
      //   })
      // },
      handleAuthCard({ bankId, fundOrg, fundOrgName }, useType) {
        authBankCard({
          bankId,
          fundOrg,
          fundOrgName,
          useType
        }).then(({ data }) => {
          if (data.code === 201) {
            this.$message.success('认证成功');
            this.getData();
          } else {
            this.$message.error(data.message)
          }
        }).catch(() => {
          this.getData();
        })
      },
      handleCardSave(card) {
        editBankCard(card).then(({ data }) => {
          if (data.code === 200) {
            this.getData();
            this.$message.success('编辑成功');
            this.dialog.visible = false;
          }
        })
      },

      getData() {
        getBankCardList().then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body;
          } else {
            this.$message.error(data.message)
          }
        }).catch(() => {
          this.list = [];
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table {
    th, td {
      text-align: center;
      padding: 12px 10px;

      .bank-card {
        font-size: 1.5em;
        font-weight: bold;
      }
    }
  }
</style>
