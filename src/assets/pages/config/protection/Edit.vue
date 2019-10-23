<template>
  <div class="protection-config-edit">
    <protection-config v-model="detail"
                       :mode="mode"
                       @save="handleSave"></protection-config>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {
    getProtectionConfig,
    editProtectionConfig
  } from '../../../api/asset';
  import { getCollectionCardList } from '../../../api/finance';
  import ProtectionConfig from '../../../../modules/protection-config/ProtectionConfig'

  export default {
    components: {
      ProtectionConfig
    },
    data() {
      return {
        id: this.$route.params.id,
        detail: {},
        mode: 'EDIT'
      }
    },
    computed: {
      ...mapState({
        user: state => state.user,
        intentionFund: state => state.application.intentionFund
      })
    },
    watch: {
      intentionFund(val, oldVal) {
        if (val && val !== oldVal) {
          this.getCollectionCardList(val);
        }
      }
    },

    created() {
      this.getData(this.id);
    },

    methods: {
      handleSave(val) {
        editProtectionConfig(this.id, val).then(({ data }) => {
          if (data.code === 200) {
            this.$message.success('修改成功');
            this.$router.go(-1)
          } else {
            this.$message.error(data.message)
          }
        })
      },

      getData(id) {
        getProtectionConfig(id).then(({ data }) => {
          if (data.code === 200) {
            this.getCollectionCardList(data.body.fundOrg).then(() => {
              this.detail = data.body;
            });
          } else {
            this.$message.error(data.message)
          }
        })
      },

      getCollectionCardList(intentionFund) {
        return new Promise((resolve) => {
          getCollectionCardList(intentionFund, this.$enum.BANK_USE_TYPE_COMPENSATION).then(({ data }) => {
            if (data.code === 200 && data.body) {
              const list = data.body.map(_ => ({
                text: `${_.bankCard}（${_.name}）`,
                value: _.bankUserId,
                extraData: _.bankCard
              }));
              this.$store.commit('application/updateCollectionCardList', list);
              resolve();
            }
          })
        })
      }
    }
  }
</script>
