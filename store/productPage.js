export const actions = {
  async fetchProduct (_, productSlug) {
    return await this.$axios.get(`/product/slug/${productSlug}`)
  },

  async fetchSimilarProducts (_, {page, catId, productId}) {
    return await this.$axios.get(`/product/same/products?page=${page}&limit=10&cat_id=${catId}&product=${productId}`)
  }
}
