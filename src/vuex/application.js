export default {
  namespaced: true,
  state: {
    projectType: undefined,
    projectNameList: [],
    intentionFund: undefined,
    collectionCardList: [],
    serviceFeeRate: undefined,
    protectionModel: '',
    protectionPlanList: []
  },
  mutations: {
    updateProjectType(state, projectType) {
      state.projectType = projectType;
    },
    updateProjectNameList(state, list) {
      state.projectNameList = list;
    },
    updateIntentionFund(state, intentionFund) {
      state.intentionFund = intentionFund;
    },
    updateCollectionCardList(state, cardList) {
      state.collectionCardList = cardList;
    },
    updateServiceFeeRate(state, fee) {
      state.serviceFeeRate = fee;
    },
    updateProtectionModel(state, model) {
      state.protectionModel = model;
    },
    updateProtectionPlanList(state, list) {
      state.protectionPlanList = list || [];
    },
    reset(state) {
      state.projectType = undefined;
      state.projectNameList = [];
      state.intentionFund = undefined;
      state.collectionCardList = [];
      state.serviceFeeRate = undefined;
      state.protectionModel = '';
      state.protectionPlanList = [];
    }
  }
}
