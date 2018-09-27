import http from '../lib/http'

export const getQiniuToken = () => {
  return http.common.get('v1/storage/token')
};
export const getPicUrls = (uris) => {
  return http.common.post('v1/storage/urls', uris)
};
export const postQiniu = (val) => {
  return http.common.post('http://upload.qiniu.com/', val, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': undefined
    },
    transformRequest: function (data) {
      const formData = new FormData();
      formData.append('token', data.token);
      formData.append('file', data.file, data.filename);
      return formData
    }
  })
};

export const getFileList = (params) => {
  // return http.common.get('http://localhost:8081/static/mock/file.json', {
  return http.common.get('v1/file-task/page', {
    params
  })
};

export const getFileStatus = (ids) => {
  return http.common.post('v1/file-task/status', ids)
};

export const getFileProgress = (fileId) => {
  return http.common.get('v1/file-task/progress', {
    params: {
      fileId
    }
  })
};

const getFileToken = (fileId) => {
  return http.common.get('v1/file-task/token', {
    params: {
      fileId
    },
    responseType: 'blob'
  })
};

export const downloadFile = (fileId) => {
  return getFileToken(fileId)
};

// 删除下载文件
export const delFile = (id) => {
  return http.common.delete(`/v1/file-task/${id}`)
};
// 根据组织名称查询组织信息
export const getOrgDetailByName = (orgName) => {
  return http.common.get(`/v1/org/enterprise/detail/${orgName}`)
};
