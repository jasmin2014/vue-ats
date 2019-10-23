<template>
  <div class="account-create">
    <card :mode="mode"
          style="width: 60%;"
          @save="handleSave"></card>
  </div>
</template>

<script>
  import Card from '../../../modules/account-center/Card'
  import {createBankCard} from '../../api/finance';

  export default {
    components: {
      Card
    },
    data() {
      return {
        useType: this.$route.params.use,
        mode: 'CREATE'
      }
    },

    methods: {
      handleSave(value) {
        value.useType = this.useType;
        createBankCard(value).then(({ data }) => {
          if (data.code === 201) {
            this.$message.success('创建成功');
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>
