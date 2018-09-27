<template>
  <org v-model="detail"
       :mode="mode"
       @edit-publickey="handleEditPublicKey"
       @reset-publickey="handleResetPublicKey"></org>
</template>

<script>
  import Org from '../../../modules/org/Org.vue'
  import {getLoginOrg, getOrgExtRel, getMaterialList, getOrgChainDetail} from '../../api/org'
  import {getOrgPublicKey, editPublicKey, resetPublicKey} from '../../../api/chain';

  export default {
    data() {
      return {
        detail: {},
        mode: 'VIEW'
      }
    },
    created() {
      this.getData()
    },
    methods: {
      handleEditPublicKey(publicKey) {
        editPublicKey(publicKey).then(({ data }) => {
          if (data.code === 200) {
            this.getPublicKey();
          }
        }).catch(() => {
        })
      },
      handleResetPublicKey() {
        resetPublicKey().then(({ data }) => {
          if (data.code === 200) {
            this.getPublicKey();
          }
        }).catch(() => {
        })
      },
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
            this.getChainInfo();
          } else {
            this.$message.error(res.message)
          }
        }, () => {
        })
      },
      getContact(partyId) {
        getOrgExtRel(partyId, this.$enum.REL_OP_FIRST_CONTACTOR).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'contact', data.body.length ? data.body[0] : {})
          }
        }, () => {
        })
      },
      getLegal(partyId) {
        getOrgExtRel(partyId, this.$enum.REL_OP_LEGAL_PERSON).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'legal', data.body.length ? data.body[0] : {})
          }
        }, () => {
        })
      },
      getMaterials(partyId) {
        getMaterialList(partyId).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'files', data.body)
          }
        }, () => {
        })
      },
      // 区块链详情
      getChainInfo() {
        getOrgChainDetail().then(({ data }) => {
          if (data.code === 200 && data.body) {
            data.body.channel = data.body.channel ? data.body.channel.split(',') : [];
            this.$set(this.detail, 'chain', data.body);
            this.getPublicKey();
          }
        }, () => {
        })
      },
      getPublicKey() {
        getOrgPublicKey().then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'publicKey', data.body.publicKey);
          }
        }, () => {
        })
      }
    },
    components: {
      Org
    }
  }
</script>
