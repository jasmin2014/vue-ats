<template>
  <org :mode="mode"
       v-model="detail"
       :business="this.$enum.BUSINESS_CENTER"></org>
</template>

<script>
  import Org from '../../../modules/org/Org.vue'
  import {getOrg, getOrgExtRel, getMaterialList} from '../../api/org'
  import {getOrgChainDetail} from '../../api/chain'

  export default {
    data() {
      return {
        mode: 'VIEW',
        detail: {},
        id: this.$route.params.id
      }
    },
    created() {
      this.getData(this.id);
    },
    methods: {
      getData(partyId) {
        this.getDetail(partyId);
      },
      getDetail(partyId) {
        getOrg(partyId).then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.detail = res.body;
            this.getLegal(partyId);
            this.getContact(partyId);
            this.getMaterials(partyId, [this.$enum.PROOF_MATERIAL_O_LICENSE,
              this.$enum.PROOF_MATERIAL_O_PERMIT,
              this.$enum.PROOF_MATERIAL_O_TAX,
              this.$enum.PROOF_MATERIAL_O_OTHER
            ]);
            this.getChainInfo(partyId);
          }
        }, () => {})
      },
      getContact(partyId) {
        getOrgExtRel(partyId, this.$enum.REL_OP_FIRST_CONTACTOR).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.detail, 'contact', data.body.length ? data.body[0] : {})
          }
        }, () => {})
      },
      getLegal(partyId) {
        getOrgExtRel(partyId, this.$enum.REL_OP_LEGAL_PERSON).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.detail, 'legal', data.body.length ? data.body[0] : {})
          }
        }, () => {})
      },
      getMaterials(partyId, kinds) {
        getMaterialList(partyId, kinds).then(({data}) => {
          if (data.code === 200) {
            this.$set(this.detail, 'files', data.body)
          }
        }, () => {})
      },
      // 查看区块链详情
      getChainInfo(partyId) {
        getOrgChainDetail(partyId).then(({data}) => {
          if (data.code === 200) {
            data.body.channel = data.body.channel ? data.body.channel.split(',') : [];
            this.$set(this.detail, 'chain', data.body);
          }
        }, () => {})
      }
    },
    components: {
      Org
    }
  }
</script>
