<template>
  <div class="card-correction">
    <el-row>
      <el-button type="primary" size="small" icon="fa fa-plus"
                 @click="handleCreate"> 添加银行卡</el-button>
    </el-row>
    <el-form ref="form"
             :rules="rules"
             :model="newRow"
             class="mgt20" size="small">
      <el-table :data="list" border>
        <el-table-column align="center" type="index" label="序号"></el-table-column>
        <el-table-column align="center" label="银行卡号">
          <template slot-scope="scope">
            <el-form-item v-if="scope.row.$create"
                          prop="bankCard">
              <el-input v-model.trim="newRow.bankCard"
                        @blur="handleBankName(newRow.bankCard)"></el-input>
            </el-form-item>
            <span v-else
                  :class="scope.$index === 0 ? 'error-card' : ''">{{ scope.row.bankCard }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属银行">
          <template slot-scope="scope">
            <el-form-item v-if="scope.row.$create"
                          prop="bankName">
              <el-input v-model.trim="newRow.bankName" disabled></el-input>
            </el-form-item>
            <span v-else
                  :class="scope.$index === 0 ? 'error-card' : ''">{{ scope.row.bankName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开户行">
          <template slot-scope="scope">
            <el-form-item v-if="scope.row.$create"
                          prop="issuingBank">
              <el-input v-model.trim="newRow.issuingBank"></el-input>
            </el-form-item>
            <span v-else
                  :class="scope.$index === 0 ? 'error-card' : ''">{{ scope.row.issuingBank }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行手机号码">
          <template slot-scope="scope">
            <el-form-item v-if="scope.row.$create"
                          prop="reservedMobile">
              <el-input v-model.trim="newRow.reservedMobile"></el-input>
            </el-form-item>
            <span v-else
                  :class="scope.$index === 0 ? 'error-card' : ''">{{ scope.row.reservedMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span :class="scope.$index === 0 ? 'error-card' : ''">
              {{ bankAuthStatusFilter(scope.row.authState) }}
            </span>
            <span v-if="scope.$index === 0"
                  :class="scope.$index === 0 ? 'error-card' : ''">
              （异常）
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <span v-if="scope.$index === 0">
            </span>
            <div v-else-if="!scope.row.$create">
              <el-button title="使用" size="small" type="success"
                         v-if="scope.row.authState === 2"
                         @click="handleUse(scope.row)">使用</el-button>
              <el-button title="认证" size="small" type="success"
                         v-if="scope.row.authState !== 2"
                         @click="handleAuth(scope.row)">认证</el-button>
            </div>
            <div v-else>
              <el-button title="确认保存" size="small" type="primary"
                         @click="handleSave()">确认</el-button>
              <el-button title="取消" size="small"
                         @click="handleCancel()">取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
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
      value: Array
    },
    data() {
      return {
        list: this.$deepcopy(this.value),
        partyId: this.value && this.value.length > 0 ? this.value[0].partyId : null,
        realName: this.value && this.value.length > 0 ? this.value[0].realName : null,
        newRow: {},
        rules: {
          bankCard: [
            { required: true, message: '请输入银行卡号', trigger: 'blur' },
            { pattern: this.$valid.card, message: '8-28位数字', trigger: 'blur' }
          ],
          bankName: [
            { required: true, message: '请检查银行卡号', trigger: 'change' }
          ],
          issuingBank: [
            { min: 0, max: 50, message: '50字以内', trigger: 'blur' }
          ],
          reservedMobile: [
            { required: true, message: '请输入银行预留手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      value(val) {
        this.list = this.$deepcopy(this.value);
        this.partyId = this.value && this.value.length > 0 ? this.value[0].partyId : null;
        this.realName = this.value && this.value.length > 0 ? this.value[0].realName : null;
      }
    },
    methods: {
      handleCreate() {
        this.list.push({
          $create: true
        })
      },
      handleUse(row) {
        this.$confirm('使用后银行卡将不可再次修改，确定使用该银行卡?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$emit('change-card', row)
        }).catch(() => {})
      },
      handleAuth(row) {
        this.$emit('auth-card', row)
      },
      handleSave() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('create-card', {
              partyId: this.partyId,
              realName: this.realName,
              propType: this.$enum.CUSTOMER_PROP_CARD,
              bankCard: this.newRow.bankCard,
              bankName: this.newRow.bankName,
              bankCode: this.newRow.bankCode,
              cardType: this.newRow.cardType,
              issuingBank: this.newRow.issuingBank,
              reservedMobile: this.newRow.reservedMobile
            })
          } else {
            return false;
          }
        })
      },
      handleCancel() {
        this.list.pop();
      },
      bankAuthStatusFilter(status) {
        return BANK_CARD_AUTH_STATUS[status] || status
      },
      handleBankName(bankCard) {
        delete this.newRow.bankName;
        delete this.newRow.bankCode;
        delete this.newRow.cardType;
        if (!this.$valid.card.test(bankCard)) return;
        getBankNameByCard(bankCard).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.newRow, 'bankName', data.body.bankName);
            this.$set(this.newRow, 'bankCode', data.body.bankCode);
            this.$set(this.newRow, 'cardType', data.body.cardType);
          }
        }).catch(() => {
          delete this.newRow.bankName;
          delete this.newRow.bankCode;
          delete this.newRow.cardType;
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .card-correction {
    .error-card {
      color: #f56c6c;
    }
  }
</style>
