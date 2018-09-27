<template>
  <org v-model="detail"
       :mode="mode"></org>
</template>

<script>
  import Org from '../../../modules/org/Org.vue'
  import {getLoginOrg, getOrgExtRel, getMaterialList} from '../../api/org';

  export default {
    data() {
      return {
        mode: 'VIEW',
        detail: {}
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        this.getDetail();
      },
      getDetail() {
        getLoginOrg().then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.detail = res.body;
            const partyId = this.detail.partyId;
            this.getLegal(partyId);
            this.getContact(partyId);
            this.getMaterials(partyId);
          } else {
            this.$message.error(res.message)
          }
        }, () => {
        })
      },
      getContact(partyId) {
        getOrgExtRel(partyId, this.$enum.REL_OP_FIRST_CONTACTOR).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.detail, 'contact', data.body.length ? data.body[0] : {})
          }
        }, () => {
        })
      },
      getLegal(partyId) {
        getOrgExtRel(partyId, this.$enum.REL_OP_LEGAL_PERSON).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.detail, 'legal', data.body.length ? data.body[0] : {})
          }
        }, () => {
        })
      },
      getMaterials(partyId) {
        getMaterialList(partyId).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.detail, 'files', data.body)
          }
        })
      }
    },
    components: {
      Org
    }
  }
</script>
