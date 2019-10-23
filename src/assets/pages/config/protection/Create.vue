<template>
  <div class="protection-config-create">
    <protection-config v-model="detail"
                       :mode="mode"
                       @save="handleSave"></protection-config>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import { createProtectionConfig } from '../../../api/asset';
  import { getCollectionCardList } from '../../../api/finance';
  import ProtectionConfig from '../../../../modules/protection-config/ProtectionConfig'

  export default {
    components: {
      ProtectionConfig
    },
    data() {
      return {
        mode: 'CREATE',
        detail: {}
      }
    },
    computed: {
      ...mapState({
        user: state => state.user,
        intentionFund: state => state.application.intentionFund
      })
    },
    watch: {
      user(val, oldVal) {
        if (val) {
          this.$set(this.detail, 'protectionOrgId', val.orgId);
          this.$set(this.detail, 'protectionOrgName', val.orgName);
        }
      },
      intentionFund(val, oldVal) {
        if (val && val !== oldVal) {
          getCollectionCardList(val, this.$enum.BANK_USE_TYPE_COMPENSATION).then(({ data }) => {
            if (data.code === 200 && data.body) {
              const list = data.body.map(_ => ({
                text: `${_.bankCard}（${_.name}）`,
                value: _.bankUserId,
                extraData: _.bankCard
              }));
              this.$store.commit('application/updateCollectionCardList', list)
            }
          })
        }
      }
    },

    mounted() {
      if (this.user && this.user.orgId) {
        this.$set(this.detail, 'protectionOrgId', this.user.orgId);
        this.$set(this.detail, 'protectionOrgName', this.user.orgName);
      }
    },

    methods: {
      handleSave(val) {
        createProtectionConfig(val).then(({ data }) => {
          if (data.code === 201) {
            this.$message.success('创建成功');
            this.$router.go(-1)
          } else {
            this.$message.error(data.message)
          }
        })
      }
    }
  }
</script>
