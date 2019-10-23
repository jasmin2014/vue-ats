<template>
  <div style="display: inline-block;">
    <slot>
      <el-button type="info" title="金额统计"
                 @click="handleShowDialog">统计</el-button>
    </slot>
    <el-dialog :visible.sync="visible" title="借款金额统计">
      <div style="padding-left: 20px;">
        <p v-if="getTotal">
          <label>当前条件下借款总金额：</label>
          {{ $floatToThousands(total.toFixed(2)) }} 元
        </p>
        <p>
          <label>当前页借款总金额：</label>
          {{ $floatToThousands(currentTotal.toFixed(2)) }} 元
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array
      },
      search: {
        type: Object,
        default: () => ({})
      },
      getTotal: {
        type: Function
      }
    },
    data () {
      return {
        visible: false,
        total: 0,
        currentTotal: 0
      }
    },
    watch: {
      list(val, oldVal) {
        if (val) {
          this.currentTotal = val.reduce((total, amount) => {
            return total + amount
          }, 0)
        }
      }
    },

    methods: {
      handleShowDialog () {
        if (typeof this.getTotal === 'function') {
          this.getTotal(this.search).then(({ data }) => {
            if (data.code === 200) {
              this.total = data.body || 0;
              this.visible = true
            }
          })
        } else {
          this.visible = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  label {
    display: inline-block;
    text-align: right;
    width: 180px;
  }
</style>
