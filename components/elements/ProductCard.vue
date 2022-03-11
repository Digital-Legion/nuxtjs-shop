<template>
  <div
    class="product-card"
    :class="{'product-card--loading': loading || !imageLoaded}"
    @mouseenter="actionsVisible = true"
    @mouseleave="actionsVisible = false"
  >
    <clink class="product-card__link" :to="`/product/${formattedProduct.slug}`" />
    <div class="product-card__inner">
      <div class="product-card__top">
        <div class="product-card__top-labels">
          <span v-if="formattedProduct.hit" class="product-card__item product-card__item--green" v-t="'Хит продаж'" />
          <span v-if="formattedProduct.discount" class="product-card__item product-card__item--orange" :class="[`g-badge--${discountColor}`]">{{formattedProduct.discount}}%</span>
        </div>
        <button
          class="product-card__like"
          :class="{active: isLiked}"
          @click="onLike"
        >
          <LikeIcon />
        </button>
      </div>
      <div class="product-card__image">
        <img :data-src="formattedProduct.defaultImage" :alt="formattedProduct.defaultImageAlt" v-lazy-load @load="imageLoaded = true">

        <transition name="fade" mode="out-in">
          <div class="product-card__actions" v-if="actionsVisible">
            <button class="light" @click.stop="onQuickView">
              <span v-t="'Быстрый просмотр'" />
            </button>
            <button class="green" @click.stop="onQuickBuy" v-if="product.stock > 0">
              <span v-t="'Быстрая покупка'" />
            </button>
            <button class="green" @click.stop="onPreorder" v-else>
              <span v-t="'Предзаказ'" />
            </button>
          </div>
        </transition>
      </div>
      <div class="product-card__price">
        <div class="product-card__wrapper">
          <AZNIcon />
          <span class="product-card__price-value">{{ (formattedProduct.price * (100 - formattedProduct.discount) / 100).toFixed(0) }}</span>
          <span v-if="formattedProduct.discount" class="product-card__discount">{{ formattedProduct.price }}</span>
        </div>
        <button @click="onCart">
          <MainShopCartIcon class="product-card__cart" :class="{'product-card__cart--disabled': !isAvailable, active: inCart}" />
        </button>
      </div>
      <div class="product-card__text">
        <span>{{ formattedProduct.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "ProductCard",

  components:{
    MainShopCartIcon: () => import('~/assets/icons/shopping-cart-main.svg?inline'),
    LikeIcon: () => import('~/assets/icons/heart-main.svg?inline'),
    AZNIcon: () => import('~/assets/icons/azn.svg?inline')
  },

  props: ['product', 'loading'],

  data () {
    return {
      actionsVisible: false,
      imageLoaded: false,
      isLiked: false,
      inCart: false
    }
  },

  mounted () {
    this.isLiked = !!this.likedProducts?.[this.product?.slug] || false
    this.inCart = !!this.cartProducts?.[this.product?.slug] || false
  },

  computed: {
    ...mapState(['likedProducts', 'cartProducts']),

    isAvailable() {
      return this.product?.stock > 0;
    },

    formattedProduct () {
      return {
        hit: this.product?.hit,
        title: this.product?.[`name__${this.$i18n.locale}`] || this.product?.name || '',
        slug: this.product?.[`slug__${this.$i18n.locale}`] || this.product?.slug || '',
        defaultImage: this.product?.colors?.[0]?.images?.[0]?.url,
        defaultImageAlt: this.product?.colors?.[0]?.images?.[0]?.alt,
        price: this.product?.price ? parseInt(this.product?.price) : 0,
        discount: this.product?.discount
      }
    },

    discountColor () {
      if (this.product?.discount <= 10) return 'yellow'
      else if (this.product?.discount <= 20) return 'orange'
      else if (this.product?.discount <= 30) return 'red-orange'
      else return 'red'
    },
  },

  methods: {
    ...mapMutations(['setProductModalProduct', 'showProductModal', 'showPreorderModal', 'showQuickBuyModal', 'onProductLike', 'onCartAdd', 'onCartRemove']),

    onQuickBuy () {
      this.showQuickBuyModal({product: this.product, colorId: this.product.colors?.[0]?.color?.id})
    },

    onPreorder () {
      this.showPreorderModal({product: this.product, colorId: this.product.colors?.[0]?.color?.id})
    },

    onQuickView () {
      this.setProductModalProduct(this.product)
      this.showProductModal()
    },

    onLike () {
      this.onProductLike(this.product)
      this.isLiked = !this.isLiked
      if (!this.isLiked)
        this.$emit('on-dislike', this.product)
    },

    onCart () {
      if (!this.inCart && this.isAvailable) {
        const orderInfo = {
          count: 1,
          colorId: this.product?.colors?.[0]?.color?.id
        }

        if (this.product?.devices?.length)
          orderInfo.variantId = this.product?.devices?.[0]?.id

        this.onCartAdd({
          product: this.product,
          orderInfo
        })

        this.inCart = !!this.cartProducts?.[this.product?.slug] || false
      } else {
        this.onCartRemove(this.product)
        this.inCart = !!this.cartProducts?.[this.product?.slug] || false
      }
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/elements/product-card";
</style>
