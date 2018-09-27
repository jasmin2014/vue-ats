<template>
  <org ref="MyOrg" :mode="mode"
       v-model="detail"
       :business="this.$enum.BUSINESS_CENTER"
       :error="error"
       @save="handleSave"
       @create-chain="handleCreateChain"></org>
</template>

<script>
  import Org from '../../../modules/org/Org.vue'
  import {editOrg, getOrg, getOrgExtRel, getMaterialList} from '../../api/org'
  import {getOrgChainDetail, createOrgChain, editOrgChain, createChainAccount} from '../../api/chain'

  export default {
    data() {
      return {
        mode: 'EDIT',
        detail: {},
        error: {},
        id: this.$route.params.id
      }
    },
    created() {
      this.getData(this.id);
    },
    methods: {
      handleSave(data) {
        this.editOrg(data);
      },
      handleCreateChain({orgName}) {
        this.createChainAccount(orgName);
      },
      editOrg(val) {
        editOrg(val).then(({ data }) => {
          if (data.code === 200) {
            if (this.detail.chain && this.detail.chain.member === 1) {
              this.updateChainInfo(this.id, val.chain).then(({ status, data: _data }) => {
                if (status === 200 && _data.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '编辑成功!'
                  });
                  this.$router.go(-1);
                } else {
                  this.$message.error('区块链信息保存失败');
                }
              });
            } else {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              });
              this.$router.go(-1);
            }
          } else {
            this.$message.error('保存失败');
          }
        }).catch(({ status, data }) => {
          if (status === 400 && data.type === 'object') {
            this.error = data.body
          }
        })
      },
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
      getMaterials(partyId, kinds) {
        getMaterialList(partyId, kinds).then(({ data }) => {
          if (data.code === 200) {
            this.$set(this.detail, 'files', data.body)
          }
        })
      },
      // 详情
      getChainInfo(partyId) {
        getOrgChainDetail(partyId).then(({ data }) => {
          if (data.code === 200) {
            if (data.body) {
              data.body.channel = data.body.channel ? data.body.channel.split(',') : [];
              this.$set(this.detail, 'chain', data.body);
            }
          }
        })
      },
      updateChainInfo(partyId, val) {
        let promise = {};
        val.channel = val.channel.join(',');
        val.finance = this.$getLocalStorage('user').finance;
        if (val.id) {
          promise = editOrgChain(partyId, val.id, val)
        } else {
          promise = createOrgChain(partyId, val)
        }
        return promise;
      },
      // 创建区块链账户
      createChainAccount(partyName) {
        const chain = {
          partyName,
          finance: this.$getLocalStorage('user').finance
        };
        createChainAccount(this.id, chain).then(({data}) => {
          if (data.code === 200) {
            this.getChainInfo(this.id);
          } else {
            this.$message.error(data.message);
          }
        }).catch(() => {});
      }
    },
    components: {
      Org
    }
  }
</script>
