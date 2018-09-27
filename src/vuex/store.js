export default {
  state: {
    routes: {},
    buttons: {},
    qiniu: '',
    enums: {},
    regions: {},
    download: {
      list: [],
      index: 0,
      loadDone: false,
      loading: false
    }
  },
  getters: {
    downloadWaitingList: (state) => {
      return state.download.list.filter(_ => _.status === 0)
    },
    downloadProcessingList: (state) => {
      return state.download.list.filter(_ => _.status === 1)
    }
  },
  mutations: {
    saveRoute(state, {routes, buttons}) {
      state.routes = routes.filter(_ => _.meta.show);
      window.__buttons = state.buttons = buttons;
    },
    saveQiniuToken(state, token) {
      state.qiniu = token;
    },
    saveSysEnums(state, enums) {
      state.enums = enums;
    },
    saveRegions(state, region) {
      state.regions[region.code] = region.list;
    },
    updateDownloads(state, obj) {
      if (obj) {
        if (obj.pageNumber > 1) {
          state.download.list = state.download.list.concat(obj.list);
        } else {
          state.download.list = obj.list;
        }
        state.download.index = obj.pageNumber;
        state.download.loadDone = ((obj.pageNumber - 1) * obj.pageSize + obj.list.length === obj.totalRecord);
        if (obj.list.length === 0) {
          state.download.index--;
        }
      }
    },
    updateDownloadLoadStatus(state, loading) {
      state.download.loading = loading
    },
    deleteDownloadFile(state, id) {
      state.download.list = state.download.list.filter(_ => _.id !== id);
    }
  }
}
