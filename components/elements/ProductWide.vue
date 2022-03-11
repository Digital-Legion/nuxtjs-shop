<template>
  <div class="product-wide">
    <clink :to="`/product/${formattedBanner.slug}`" class="product-wide__link" />
    <div class="product-wide__left" v-show="!loading">
      <span class="product-wide__title" v-html="formattedBanner ? formattedBanner.title : ''" />
      <button @click="onCart" class="product-wide__to-cart" :class="{active: inCart}">
        <ShopCartIcon />
        <span>{{ $t('В корзину!') }}</span>
      </button>
    </div>
    <div class="product-wide__image">
      <img
        v-if="!useCustomLazy"
        :src="showImage ? (showMobileImage && formattedBanner.imageMobile ? formattedBanner.imageMobile : formattedBanner.image) : null"
        :alt="formattedBanner.title"
        v-lazy-load
      >
      <img
        v-else-if="showImage || imageLoaded"
        v-show="imageLoaded"
        :src="showImage || imageLoaded ? (showMobileImage && formattedBanner.imageMobile ? formattedBanner.imageMobile : formattedBanner.image) : null"
        :alt="formattedBanner.title"
        @load="imageLoaded = true"
        v-lazy-load
      >
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "ProductWide",

  components: {
    ShopCartIcon: () => import('~/assets/icons/shopping-cart-main.svg?inline')
  },

  props: {
    banner: {
      type: Object,
      default: () => {}
    },
    showImage: {
      type: Boolean,
      default: false
    },
    showMobileImage: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    useCustomLazy: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      imageLoaded: false,
      inCart: false
    }
  },

  mounted () {
    this.inCart = !!this.cartProducts?.[this.banner?.product?.slug] || false
  },

  computed: {
    ...mapState(['cartProducts']),

    formattedBanner () {
      return {
        title: this.banner?.[`name__${this.$i18n.locale}`] || this.banner?.name,
        image: this.banner?.desktop?.url,
        imageMobile: this.banner?.mobile?.url,
        slug: this.banner?.product?.[`slug__${this.$i18n.locale}`] || this.banner?.product?.slug || ''
      }
    }
  },

  methods: {
    ...mapMutations(['onCartAdd', 'onCartRemove']),

    onCart () {
      if (!this.inCart) {
        const orderInfo = {
          count: 1,
          colorId: this.banner?.product?.colors?.[0]?.color?.id
        }

        if (this.banner?.product?.devices?.length)
          orderInfo.variantId = this.product?.devices?.[0]?.id

        this.onCartAdd({
          product: this.banner?.product,
          orderInfo
        })

        this.inCart = !!this.cartProducts?.[this.banner?.product?.slug] || false
      } else {
        this.onCartRemove(this.banner?.product)
        this.inCart = !!this.cartProducts?.[this.banner?.product?.slug] || false
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/product-wide';
</style>
