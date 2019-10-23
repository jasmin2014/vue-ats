<template>
  <uploaded-new-list v-if="$route.query.type === $enum.LOAN_PROP_NEW"></uploaded-new-list>
  <uploaded-renew-list v-else-if="$route.query.type === $enum.LOAN_PROP_CONTINUE"></uploaded-renew-list>
</template>

<script>
  import UploadedNewList from './UploadedNewList'
  import UploadedRenewList from './UploadedRenewList'

  export default {
    components: {
      UploadedNewList,
      UploadedRenewList
    }
  }
</script>
