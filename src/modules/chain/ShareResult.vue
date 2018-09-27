<template>
  <div class="share-result">
    <el-form label-width="150px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="可贷额度">
            <ats-input v-model="currentValue.loanLimit" mode="VIEW"
                       type="number" unit="元"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="分享额度">
            <ats-input v-model="currentValue.shareLimit" mode="VIEW"
                       type="number" unit="元"></ats-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="分享利率">
            <el-col :span="11">
              <ats-input v-model="sharedRateLowerLimit" mode="VIEW"
                         type="number" unit="%"></ats-input>
            </el-col>
            <el-col :span="2" style="text-align: center;">
              <span>-</span>
            </el-col>
            <el-col :span="11">
              <ats-input v-model="sharedRateUpLimit" mode="VIEW"
                         type="number" unit="%"></ats-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-if="currentValue.loanShareConfirms"
              :data="currentValue.loanShareConfirms" border>
      <el-table-column v-for="col in table"
                       :key="col.prop"
                       align="center"
                       :label="col.label"
                       :prop="col.prop"
                       :formatter="col.formatter"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      value: Object
    },
    data() {
      return {
        currentValue: this.value || {},
        table: [
          {
            label: '参与机构',
            prop: 'partyName'
          },
          {
            label: '参与额度(元)',
            prop: 'confirmTakeInLimit'
          },
          {
            label: '参与利率(利率)',
            prop: 'confirmTakeInRate'
          },
          {
            label: '参与状态',
            prop: 'confirmStatus',
            formatter: (row, col, val) => this.$filter(val, this.$enum.BLOCK_CHAIN_SHARE_CONFIRM_STATUS, this.$enum.BLOCK_CHAIN_SHARE_CONFIRM_STATUS)
          }
        ]
      }
    },
    computed: {
      sharedRateLowerLimit: {
        get() {
          if (typeof this.currentValue.sharedRateLowerLimit === 'number') {
            return this.$floatMultiply(this.currentValue.sharedRateLowerLimit, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.sharedRateLowerLimit = null;
          } else {
            this.currentValue.sharedRateLowerLimit = this.$floatDivide(val, 100);
          }
        }
      },
      sharedRateUpLimit: {
        get() {
          if (typeof this.currentValue.sharedRateUpLimit === 'number') {
            return this.$floatMultiply(this.currentValue.sharedRateUpLimit, 100);
          }
          return '';
        },
        set(val) {
          if (val === '') {
            this.currentValue.sharedRateUpLimit = null;
          } else {
            this.currentValue.sharedRateUpLimit = this.$floatDivide(val, 100);
          }
        }
      }
    },
    watch: {
      value(val) {
        this.currentValue = this.$deepcopy(val)
      }
    }
  }
</script>
