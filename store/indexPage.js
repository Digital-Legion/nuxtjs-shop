export const state = () => ({
  bigBanners: null,
  smallBanners: null,
  popularProducts: null,
  otherProducts: null,
  popularBrands: null
})

export const mutations = {
  setBigBanners (state, payload) {
    state.bigBanners = payload
  },

  setSmallBanners (state, payload) {
    state.smallBanners = payload
  },

  setPopularProducts (state, payload) {
    state.popularProducts = payload
  },

  setOtherProducts (state, payload) {
    state.otherProducts = payload
  },

  setPopularBrands (state, payload) {
    state.popularBrands = payload
  }
}

export const actions = {
  async fetchBigBanners ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/banner?big_banner=true')
        .then(res => {
          commit('setBigBanners', res.data)
          resolve(true)
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  },

  async fetchSmallBanners ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/banner?big_banner=false')
        .then(res => {
          commit('setSmallBanners', res.data)
          resolve(true)
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  },

  async fetchPopularProducts ({commit}) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/product/main-page/products?page=1&limit=12')
        .then(res => {
          commit('setPopularProducts', res.data)
          resolve(true)
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  },

  async fetchOtherProducts ({commit}) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/product/main-page/products?page=2&limit=12')
        .then(res => {
          commit('setOtherProducts', res.data)
          resolve(true)
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  },

  async fetchPopularBrands ({commit}) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/category/main-page/brands')
        .then(res => {
          commit('setPopularBrands', res.data)
          resolve(true)
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  }
}
