<!--客户信息数据报告-->
<template>
  <div class="datareport">
    <report-personal v-model="value" :customer-name="customerName"></report-personal>
  </div>
</template>

<script>
  import reportPersonal from './Personal.vue';

  export default {
    components: {
      reportPersonal
    },
    props: {
      customerName: String,
      value: Object
    }
  };
</script>


