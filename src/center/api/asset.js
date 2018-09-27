// 资产信息
import http from '../../lib/http'

/*
 * 资产信息列表
 * */
// 列表
export const getAssetInfoList = (params) => {
  return http.center.get('/v1/assets-audit/loan-list/page', { params })
};
// 资产信息列表下载
export const downloadAssetInfoList = (params) => {
  return http.center.get('/v1/assets-audit/loan-list/_download', {
    params,
    headers: {
      'X-Action-Code': window.__buttons['AssetDownload']
    }
  })
};
// 备注
export const getRemarkList = (loanId) => {
  return http.center.get(`/v1/assets-audit/loan-list/audit-record/${loanId}`);
};

// 借贷申请详情-基本信息接口
export const getLoanApplication = (loanId) => {
  return http.center.get(`/v1/assets-audit/loan-list/${loanId}`);
};

// 借贷申请详情-证明材料接口
export const getProofMaterialList = (loanId) => {
  return http.center.get(`/v1/assets-audit/loan-list/proof-material/${loanId}`);
};

// 借贷申请详情-收费记录接口
export const getFeeList = (loanApplication, phase) => {
  return http.center.get('/v1/fee', {
    params: {
      loanApplication,
      phase
    }
  });
};

/*
 * 资产分类设置
 * */
// 分类列表
export const getCategoryList = (params) => {
  return http.center.get('/v1/app/asset-category', {
    params
  })
};
// 删除
export const delCategoryRow = (categoryId) => {
  return http.center.delete(`/v1/app/asset-category/${categoryId}`, {
    headers: {
      'X-Action-Code': window.__buttons['AssetCategoryDelete']
    }
  })
};
// 新增
export const newCategory = (categoryName, assetOrg, assetKind, loanKind) => {
  return http.center.post('/v1/app/asset-category', {
    categoryName, // 资产类名
    assetOrg, // 资产渠道编号
    assetKind, // 资产类型编号
    loanKind
  }, {
    headers: {
      'X-Action-Code': window.__buttons['AssetCategoryCreate']
    }
  })
};
// 查看
export const categoryDecs = (categoryId) => {
  return http.center.get(`/v1/app/asset-category/${categoryId}`, {
    headers: {
      'X-Action-Code': window.__buttons['AssetCategoryEdit']
    }
  })
};
// 编辑
export const editCategory = ( categoryId, loanKind,checked) => {
  return http.center.put(`/v1/app/asset-category/${categoryId}`, {
    loanKind,
    checked
  }, {
    headers: {
      'X-Action-Code': window.__buttons['AssetCategoryEdit']
    }
  })
};

/*
 * 机构费率设置
 * */
// 列表
export const getOrgRateList = (params) => {
  return http.center.get('/v1/asset/category/rate', {
    params
  })
};
// 查看
export const orgRateDetail = (id) => {
  return http.center.get(`/v1/asset/category/rate/${id}`)
};
// 编辑
export const editOrgRate = (id,data) => {
  return http.center.put(`/v1/asset/category/rate/${id}`, data)
};
//删除
export const deleteOrgRate = (id) => {
  return http.center.delete(`/v1/asset/category/rate/${id}`)
};
//新增
export const createOrgRate = (data) => {
  return http.center.post(`/v1/asset/category/rate/`,data)
};

/* ============ 风控配置 ============ */
// 列表
export const getConfigList = (categoryId) => {
  return http.center.get('/v1/category/risk/configure', {
    params: {
      categoryId
    }
  })
};
//修改
export const editConfig = (riskId) => {
    return http.center.get(`/v1/category/risk/configure/${riskId}`)
}

// 风控配置下拉
export const getConfigures = () => {
  return http.center.get('/v1/category/risk/configure/strategy')
};
// 添加
export const createStrategy = (params) => {
  return http.center.post('/v1/category/risk/configure', params)
};
// 修改
export const editStrategy = (id,params) => {
  return http.center.put(`/v1/category/risk/configure/${id}`, params)
};

/*
 * 数据源配置
 * */
// 列表
export const getDataSourceList = (categoryId) => {
  return http.center.get('/v1/app/asset-data/source', {
    params: {
      categoryId
    }
  })
};
// 取消or选中
export const changeSource = (params) => {
  return http.center.put(`/v1/app/asset-data/source`, params)
};

export const getCategoryLoans = (params) => {
    return http.center.get(`v1/asset/category/loan`, {params})
}
