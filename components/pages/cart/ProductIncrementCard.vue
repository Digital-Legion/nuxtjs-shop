<template>
  <div class="product-increment-card" :class="{'product-increment-card--unavailable': !isAvailable}">
    <button class="product-increment-card__remove" @click="$emit('remove')" />

<!--    <clink :to="`/product/${productSlug}`" class="product-increment-card__link" />-->

    <div class="product-increment-card__content">
      <div class="product-increment-card__part">
        <clink :to="`/product/${productSlug}`" class="product-increment-card__image">
          <img :src="formattedProduct.image" :alt="formattedProduct.imageAlt">
        </clink>
        <div class="product-increment-card__text">
          <div class="product-increment-card__price-wrapper">
            <div class="product-increment-card__price">
              {{ (formattedProduct.price * (100 - formattedProduct.discount) / 100).toFixed(0) }} AZN
            </div>
            <div class="product-increment-card__price-strike-through" v-if="formattedProduct.discount">
              {{ formattedProduct.price }} AZN
            </div>
          </div>
          <clink :to="`/product/${productSlug}`" class="product-increment-card__title">{{ formattedProduct.title }}</clink>
          <div class="product-increment-card__info">
            <div class="product-increment-card__info-item">
              {{ $t('Цвет') }}: {{ formattedProduct.color }}
            </div>
            <div class="product-increment-card__info-item" v-if="formattedProduct.variant">
              {{ $t('Вариант') }}: {{ formattedProduct.variant.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="product-increment-card__part">
        <incrementer
          v-model="itemCount"
          :min-value="formattedProduct.stock ? 1 : 0"
          :max-value="formattedProduct.stock"
          @input="$emit('change-count', itemCount)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductIncrementCard",

  components: {
    Incrementer: () => import('~/components/elements/Incrementer')
  },

  props: {
    product: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      itemCount: this.product?.stock ? this.product?.orderInfo?.count || 0 : 0
    }
  },

  computed: {
    productSlug () {
      return this.product?.[`slug__${this.$i18n.locale}`] || this.product?.slug || ''
    },

    isAvailable () {
      return this.product?.stock > 0 && this.itemCount !== 0 && (this.formattedProduct.variants ? this.formattedProduct.variants.findIndex(v => v.id === this.formattedProduct.orderInfo.variantId) !== -1 : true)
    },

    formattedProduct () {
      const color = this.product?.colors?.find(c => c.color?.id === this.product?.orderInfo?.colorId)

      return {
        variants: this.product?.devices?.length ? this.product.devices : null,
        variant: this.product?.devices?.find(d => d.id === this.product?.orderInfo?.variantId) || null,
        title: this.product?.[`name__${this.$i18n.locale}`] || this.product?.name || '',
        price: this.product?.price ? parseInt(this.product.price) : 0,
        discount: this.product?.discount || 0,
        stock: this.product?.stock || 0,
        orderInfo: this.product?.orderInfo || {},
        color: color?.color?.[`name__${this.$i18n.locale}`] || color?.color?.name || '',
        image: color?.images?.[0]?.url,
        imageAlt: color?.images?.[0]?.alt
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/cart/product-increment-card';
</style>
