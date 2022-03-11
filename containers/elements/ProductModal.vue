<template>
  <transition name="fade" mode="out-in">
    <modal class="product-modal" v-if="productModalShown" @close="onClose">
      <Product :product="productModalProduct">
        <template v-slot:bottom-content>
          <a
            :href="`/product/${productSlug}`"
            class="product-modal__more"
            @click.prevent="onLearnMore"
          >
            <span v-t="'Подробнее о товаре'" />
            <DropdownIcon />
          </a>
        </template>
      </Product>
    </modal>
  </transition>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "ProductModal",

  components: {
    Modal: () => import('./Modal'),
    Product: () => import('~/containers/elements/Product'),
    DropdownIcon: () => import('~/assets/icons/lang-dropdown.svg?inline')
  },

  computed: {
    ...mapState(['productModalProduct', 'productModalShown']),

    productSlug () {
      return this.productModalProduct?.[`slug__${this.$i18n.locale}`] || this.productModalProduct?.slug || ''
    }
  },

  methods: {
    ...mapMutations(['setProductModalProduct', 'hideProductModal']),

    onClose () {
      this.hideProductModal()
      setTimeout(() => {
        this.setProductModalProduct(null)
      }, 310)
    },

    onLearnMore () {
      this.$router.push(`/product/${this.productSlug}`)?.catch(() => {})
      this.onClose()
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/product-modal';
</style>
