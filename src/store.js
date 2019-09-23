import Vue from 'vue';
import Vuex from 'vuex';
import request from '@/utils/request';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    storeList: null,
    currentStoreId: null,
  },
  mutations: {
    setStoreList(state, payload) {
      state.storeList = payload;
      if (state.storeList.length > 0) {
        state.currentStoreId = state.storeList[0].website_id;
      }
    },
    setCurrentStoreId(state, payload) {
      state.currentStoreId = payload;
    },
  },
  actions: {
    fetchStoreList({ commit }) {
      if (!window.datacueURLs) {
        return;
      }
      request({
        url: window.datacueURLs.getWebsiteList,
        method: 'post',
      }).then((res) => {
        commit('setStoreList', res.data);
      });
    },
    setCurrentStoreId({ commit }, currentStoreId) {
      commit('setCurrentStoreId', currentStoreId);
    },
  },
  getters: {
    pageReady(state) {
      return state.storeList !== null;
    },
  },
});
