import Vue from 'vue'

export const state = () => ({
  // product modal
  productModalShown: false,
  productModalProduct: null,

  // video modal
  videoModalShown: false,
  videoModalVideos: null,
  videoModalVideoInitIndex: null,

  // quick buy
  quickBuyModalShown: false,
  quickBuyModalProduct: null,
  quickBuyModalColorId: null,
  // preorder
  preorderModalShown: false,
  preorderModalProduct: null,
  preorderModalColorId: null,

  likedProducts: {},
  cartProducts: {},

  fetchedProducts: {},

  likedProductsCount: 0,
  cartProductsCount: 0
})

export const mutations = {
  setProductModalProduct (state, payload) {
    state.productModalProduct = payload
  },

  showProductModal (state) {
    state.productModalShown = true
  },

  hideProductModal (state) {
    state.productModalShown = false
  },

  setVideoModalData (state, { videos, videoIndex }) {
    state.videoModalVideos = videos
    state.videoModalVideoInitIndex = videoIndex
  },

  showVideoModal (state) {
    state.videoModalShown = true
  },

  hideVideoModal (state) {
    state.videoModalShown = false
  },

  showQuickBuyModal (state, {product, colorId}) {
    state.quickBuyModalShown = true
    state.quickBuyModalProduct = product
    state.quickBuyModalColorId = colorId
  },

  hideQuickBuyModal (state) {
    state.quickBuyModalShown = false
    state.quickBuyModalProduct = null
    state.quickBuyModalColorId = null
  },

  showPreorderModal (state, {product, colorId}) {
    state.preorderModalShown = true
    state.preorderModalProduct = product
    state.preorderModalColorId = colorId
  },

  hidePreorderModal (state) {
    state.preorderModalShown = false
    state.preorderModalProduct = null
    state.preorderModalColorId = null
  },

  setLikedProducts (state, payload) {
    state.likedProducts = payload
    state.likedProductsCount = Object.values(state.likedProducts)?.length || 0
  },

  setCartProducts (state, payload) {
    state.cartProducts = payload
    state.cartProductsCount = Object.values(state.cartProducts)?.length || 0
  },

  setFetchedProducts (state, payload) {
    state.fetchedProducts = payload
  },

  onProductLike (state, product) {
    if (!state.likedProducts[product.slug]) {
      state.likedProducts[product.slug] = product
      state.likedProductsCount++
      Vue.prototype.$toasted.success(this.$i18n.t('Товар добавлен в избранное').toString(), { duration: 2000 })
    } else {
      delete state.likedProducts[product.slug]
      state.likedProductsCount--
      Vue.prototype.$toasted.success(this.$i18n.t('Товар удален из избранное').toString(), { duration: 2000 })
    }
    this.$cookies.set('liked-products', Object.values(state.likedProducts).map(v => v.id), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    })
  },

  onCartAdd (state, { product, orderInfo }) {
    if (!state.cartProducts[product.slug]) {
      state.cartProducts[product.slug] = {
        ...product,
        orderInfo
      }
      this.$cookies.set(`cart-products.${product.id}`, orderInfo, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365
      })
      this.$cookies.set('cart-products', Object.values(state.cartProducts).map(v => v.id), {
        path: '/',
        maxAge: 60 * 60 * 24 * 365
      })
      Vue.prototype.$toasted.success(this.$i18n.t('Товар добавлен в корзину').toString(), { duration: 2000 })
      state.cartProductsCount++
    } else {
      Vue.prototype.$toasted.success(this.$i18n.t('Товар уже в корзине').toString(), { duration: 2000 })
    }
  },

  onCartRemove (state, product) {
    this.$cookies.remove(`cart-products.${product.id}`)
    const cartProducts = this.$cookies.get('cart-products'),
      productIndexInCartProducts = cartProducts.findIndex(p => p?.id?.toString() === product?.id?.toString())
    delete state.cartProducts[product.slug]
    Vue.prototype.$toasted.success(this.$i18n.t('Товар удален с корзины').toString())
    state.cartProductsCount--
    if (productIndexInCartProducts !== -1) {
      cartProducts.splice(productIndexInCartProducts, 1)
      this.$cookies.set('cart-products', cartProducts)
    }
  },

  onCartOrderInfoUpdate (state, { product, orderInfo}) {
    // update the vuex state
    state.cartProducts = {
      ...state.cartProducts,
      [product?.slug]: {
        ...state.cartProducts[product?.slug],
        orderInfo
      }
    }

    // update cookies
    this.$cookies.set(`cart-products.${product.id}`, orderInfo, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    })
  },

  emptyCart (state) {
    const products = state.cartProducts
    Object.values(products).forEach(p => {
      this.$cookies.remove(`cart-products.${p.id}`)
    })
    this.$cookies.remove('cart-products')
    state.cartProducts = {}
    state.cartProductsCount = 0
  }
}

export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('categories/fetchCascaderCategories')
    await dispatch('getCartLikedProducts')
    await dispatch('getLikedProducts')
    await dispatch('getCartProducts')
  },

  async getCartLikedProducts ({ commit }) {
    const likedProductIds = this.$cookies.get('liked-products') || [],
      cartProductIds = this.$cookies.get('cart-products') || [],
      productIds = [...new Set([ ...likedProductIds, ...cartProductIds ])].filter(p => p !== undefined && p !== null)

    if (productIds.length) {
      await this.$axios.get(`/product/basket/products?page=1&limit=999&products=${productIds.join(',')}`)
        .then(res => {
          if (res.data?.items) {
            const products = {}
            res.data.items.forEach(p => {
              products[p.id?.toString()] = p
            })
            commit('setFetchedProducts', products)
          }
        })
    }
  },

  async getLikedProducts ({ state, commit }) {
    const likedProductIds = this.$cookies.get('liked-products') || []
    if (likedProductIds.length) {
      const likedProducts = {}
      likedProductIds.forEach(id => {
        if (id) {
          likedProducts[state.fetchedProducts[id]?.slug] = state.fetchedProducts[id]
        }
      })
      commit('setLikedProducts', likedProducts)
    }
  },

  async getCartProducts ({ state, commit }) {
    const cartProductIds = this.$cookies.get('cart-products') || []
    if (cartProductIds.length) {
      const cartProducts = {}
      cartProductIds.forEach(id => {
        if (id) {
          const orderInfo = this.$cookies.get(`cart-products.${id}`)
          if (orderInfo) {
            cartProducts[state.fetchedProducts[id]?.slug] = {
              ...state.fetchedProducts[id],
              orderInfo
            }
          }
        }
      })
      commit('setCartProducts', cartProducts)
    }
  }
}
