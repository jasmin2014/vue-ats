<template>
  <plan v-model="detail"
        :mode="mode"
        @save="handleSave"
        @cancel="handleCancel"></plan>
</template>

<script>
  import Plan from '../../../modules/plan/Plan.vue'
  import {getPreRepayDetail, postRepayPlan} from '../../api/operation'

  export default {
    data() {
      return {
        mode: 'CREATE',
        detail: {}
      }
    },
    created() {
      this.getData(this.$route.params.id)
    },
    methods: {
      save(val) {
        val.loanApplication = this.$route.params.id;
        postRepayPlan(val).then(({status, data}) => {
          if (status === 201) {
            setTimeout(() => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$router.go(-1)
            }, 1000)
          }
        }).catch(() => {})
      },
      handleSave(val) {
        let message = [];
        if (val.penaltyRate === 0) {
          message.push('逾期罚息日利率为0');
        }
        if (val.defaultsRate === 0) {
          message.push('违约费率为0');
        }
        if (message.length) {
          message = message.join('，');
          this.$confirm(`${message}，确认保存? `, '提示', {
            type: 'warning'
          }).then(() => {
            this.save(val);
          }).catch(() => {
            document.querySelector('.layout').scrollTop = 0;
          })
        } else {
          this.save(val);
        }
      },
      handleCancel() {
        this.$router.go(-1)
      },
      getData(id) {
        getPreRepayDetail(id).then(({data}) => {
          if (data.code === 200) {
            this.detail = data.body;
          }
        }, ({status}) => {
          if (status === 409) {
            this.$router.go(-1)
          }
        })
      }
    },
    components: {
      Plan
    }
  }

</script>
