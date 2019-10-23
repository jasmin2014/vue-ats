export default {
  namespaced: true,

  state: {
    list: [],
    deleted: [],
    added: []
  },

  mutations: {
    delete(state, material) {
      const index = state.added.findIndex(_ => _.id === material.id || _.uid === material.id);
      console.log('DELETE');
      console.log(material);
      if (index !== -1) {
        state.added.splice(index, 1);
      } else {
        state.deleted.push(material)
      }
    },
    add(state, material) {
      console.log('ADD');
      console.log(material);
      state.added.push(material)
    },
    reset(state) {
      state.added.splice(0);
      state.deleted.splice(0);
    }
  },

  actions: {
    batch({ commit }, { added, deleted }) {
      added.forEach(material => {
        commit('add', material)
      });
      deleted.forEach(material => {
        commit('delete', material)
      })
    }
  }
}
