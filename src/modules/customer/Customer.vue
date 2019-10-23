<template>
  <div class="customer">
    <el-form class="form-label flex">
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户编号">
            <ats-input v-model="value.id"
                       disabled></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="主体性质">
            <ats-select v-model="type"
                        :mode="mode === 'CREATE' ? mode : 'VIEW'"
                        :kind="this.$enum.SUBJECT_PROP"
                        :group="this.$enum.SUBJECT_PROP"></ats-select>
          </el-form-item>
        </el-col>
        <el-col v-if="dialog"
                :span="3" :offset="1">
          <el-button type="primary" @click="handleLoanStat">借款统计</el-button>
        </el-col>
      </el-row>
      <el-row v-if="type === this.$enum.SUBJECT_PROP_PERSON">
        <el-col :span="6">
          <el-form-item label="客户姓名">
            <ats-input v-model="personName"
                       :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="证件号码">
            <ats-input v-model="ident"
                       :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else-if="type === this.$enum.SUBJECT_PROP_ORGANIZE">
        <el-col :span="6">
          <el-form-item label="企业名称">
            <ats-input v-model="companyName"
                       :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="统一社会信用代码">
            <ats-input v-model="ident"
                       :mode="mode"></ats-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-collapse v-model="currentLoanId"
                 accordion
                 @change="handleLoanIdChange">
      <el-collapse-item v-for="loan in value.loanList" :key="loan.id"
                        :name="loan.id">
        <template slot="title">
          <span>合同号：{{ loan.contract }}</span>
          <span style="float: right; margin-right: 20px;">申请日期： {{ loan.appliedTime }}</span>
        </template>
        <div v-if="currentLoanId === loan.id">
          <person v-if="type === $enum.SUBJECT_PROP_PERSON"
                  v-model="customer"
                  :mode="mode"
                  :encode="encode"></person>
          <org v-else-if="type === $enum.SUBJECT_PROP_ORGANIZE"
               v-model="customer"
               :mode="mode"
               :encode="encode"></org>
          <card v-model="card"
                :type="type"
                :mode="mode"
                :encode="encode"></card>
          <props v-model="props"
                 :prop-list="propList"
                 :mode="mode"></props>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="totalRecord" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="handleCurrentChange" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>

    <el-dialog v-if="dialog"
               :visible.sync="dialog.visible"
               title="借款统计"
               width="700px"
               @close="handleDialogClose">
      <loan-stat v-model="dialog.list" style="width: 90%;"></loan-stat>
    </el-dialog>
  </div>
</template>

<script>
  import Person from './PersonBase'
  import Org from './OrgBase'
  import Props from '../prop/Props'
  import Card from '../prop/Card'
  import LoanStat from './LoanStat'
  const PROP_LIST = [
    'propCarDTO',
    'propHouseDTO',
    'propDeviceDTO',
    'propShopDTO',
    'propElectronicCommerceDTO',
    'propPublicReserveFunds'
  ];

  export default {
    props: {
      value: Object,
      customer: Object,
      props: Object,
      mode: {
        type: String,
        default: 'VIEW'
      },
      type: String,
      dialog: Object,
      pageNumber: Number,
      pageSize: Number,
      totalRecord: Number,
      encode: Boolean
    },
    data() {
      return {
        currentLoanId: ''
      }
    },
    computed: {
      propList() {
        const list = [];
        PROP_LIST.forEach(prop => {
          if (this.customer && this.customer.hasOwnProperty(prop) && this.customer[prop]) {
            list.push(prop)
          }
        });
        return list;
      },
      card() {
        const value = this.value;
        return {
          loanCard: this.encode ? this.$encoder.card(value.bankCard) : value.bankCard,
          cardBank: value.cardBank,
          loanMobile: this.encode ? this.$encoder.mobile(value.bankMobile) : value.bankMobile,
          openBank: value.openBank,
          bankProvince: value.bankProvince,
          bankCity: value.bankCity
        }
      },
      personName: {
        get() {
          return this.encode ? this.$encoder.personName(this.value.name) : this.value.name;
        },
        set(val) {
          this.value.name = val;
        }
      },
      companyName: {
        get() {
          return this.encode ? this.$encoder.companyName(this.value.name) : this.value.name;
        },
        set(val) {
          this.value.name = val;
        }
      },
      ident: {
        get() {
          return this.encode ? this.$encoder.ident(this.value.ident) : this.value.ident;
        },
        set(val) {
          this.value.ident = val;
        }
      }
    },
    methods: {
      handleLoanIdChange(loanId) {
        this.$emit('loan-change', loanId)
      },
      handleLoanStat() {
        this.$emit('stat', {
          assetOrgId: this.value.partyOrgId,
          partyId: this.value.loanPartyId
        });
      },
      handleDialogClose() {
        this.$emit('stat-close');
      },
      handleCurrentChange(index) {
        this.$emit('current-change', index);
      },
      handlePageSizeChange(pageSize) {
        this.$emit('size-change', pageSize)
      }
    },
    components: {
      Person,
      Org,
      Props,
      Card,
      LoanStat
    }
  }

</script>
