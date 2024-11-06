import { createStore } from 'vuex';
import vuexPersist from 'vuex-persistedstate';

export default createStore({
  state: {
    searchedProductId: null,
    highlightedProductId: null,
  },
  mutations: {
    setSearchedProductId(state, productId) {
      state.searchedProductId = productId;
    },
    setHighlightedProductId(state, productId) {
      state.highlightedProductId = productId;
    },
  },
  actions: {
    saveSearchedProductId({ commit }, productId) {
      commit('setSearchedProductId', productId);
    },
    saveHighlightedProductId({ commit }, productId) {
      commit('setHighlightedProductId', productId);
    },
  },
  getters: {
    getSearchedProductId(state) {
      return state.searchedProductId;
    },
    getHighlightedProductId(state) {
      return state.highlightedProductId;
    },
  },
  plugins: [vuexPersist()],
});
