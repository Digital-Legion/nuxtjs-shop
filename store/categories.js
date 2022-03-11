export const state = () => ({
  cascaderCategories: null
})

export const mutations = {
  setCascaderCategories (state, payload) {
    state.cascaderCategories = payload
  }
}

export const actions = {
  async fetchCascaderCategories ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/category/cascader')
        .then(res => {
          commit('setCascaderCategories', res.data)
          resolve(true)
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  }
}
