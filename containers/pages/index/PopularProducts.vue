<template>
  <div class="index-popular-products container">
    <ProductGrid
      :products="formattedProducts"
      :title="$t('Популярные товары')"
      :loading="fetchingProducts"
    />
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "PopularProducts",

  components: {
    ProductGrid: () => import('~/containers/elements/ProductGrid')
  },

  data () {
    return {
      fetchingProducts: false
    }
  },

  async fetch () {
    this.fetchingProducts = true
    await this.fetchPopularProducts()
    this.fetchingProducts = false
  },

  computed: {
    ...mapState('indexPage', ['popularProducts']),

    formattedProducts () {
      return this.popularProducts?.items || []
    }
  },

  methods: {
    ...mapActions('indexPage', ['fetchPopularProducts'])
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/pages/index/popular-products';
</style>
