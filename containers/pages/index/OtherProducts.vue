<template>
  <div class="index-other-products container">
    <ProductGrid
      :products="formattedProducts"
    />
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "OtherProducts",

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
    await this.fetchOtherProducts()
    this.fetchingProducts = false
  },

  computed: {
    ...mapState('indexPage', ['otherProducts']),

    formattedProducts () {
      return this.otherProducts?.items || []
    }
  },

  methods: {
    ...mapActions('indexPage', ['fetchOtherProducts'])
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/pages/index/other-products';
</style>
