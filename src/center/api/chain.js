import http from '../../lib/http'

/** --------------- 机构区块链 ------------------- **/
// 查看机构区块链详情
export const getOrgChainDetail = (partyId) => {
  return http.chain.get('v1/block/chain/manager/attrs', {
    params: {
      partyId
    }
  })
};
// 创建区块链账户
export const createChainAccount = (partyId, params) => {
  params.partyId = partyId;
  return http.chain.post('/v1/block/chain/manager/participant', null, {
    params
  })
};
// 机构区块链新增保存
export const createOrgChain = (partyId, params) => {
  params.partyId = partyId;
  return http.chain.post('/v1/block/chain/manager/attrs', null, {
    params
  })
};
// 机构区块链编辑
export const editOrgChain = (partyId, attrId, params) => {
  params.partyId = partyId;
  params.attrId = attrId;
  return http.chain.put('/v1/block/chain/manager/attrs', null, {
    params
  })
};
