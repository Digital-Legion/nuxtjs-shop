<template>
  <div class="product-grid" :class="{'product-grid--max-three': maxThree}">
    <template v-if="title">
      <h1 class="g-title" v-if="useH1Title"></h1>
      <h2 class="g-title" v-else>{{ title }}</h2>
    </template>
    <div class="product-grid__content">
      <ProductCard
        v-for="item in products"
        :key="item.slug"
        :product="item"
        :loading="loading"
        @on-dislike="$emit('on-dislike', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductGrid",

  components: {
    ProductCard: () => import('~/components/elements/ProductCard')
  },

  props: {
    maxThree: {
      type: Boolean,
      default: false
    },
    products: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: null
    },
    useH1Title: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/product-grid';
</style>
