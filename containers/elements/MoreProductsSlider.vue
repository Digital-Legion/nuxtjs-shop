<template>
  <Section class="more-products-slider">
    <global-slider
      slides-per-view="auto"
      :space-between="20"
      :slider-key="sliderKey"
      :title="$t('Похожие товары')"
      :additional-swiper-options="{
        breakpoints: {
          1101: {
            spaceBetween: 30,
            slidesPerView: 4
          },
          851: {
            spaceBetween: 20,
            slidesPerView: 3
          },
          361: {
            spaceBetween: 20,
            slidesPerView: 2
          }
        }
      }"
    >
      <template v-slot:slides>
        <product-card
          class="swiper-slide"
          v-for="(item, index) in products"
          :key="index"
          :product="item"
        />
      </template>
    </global-slider>
  </Section>
</template>

<script>
export default {
  name: "Similar",

  components: {
    ProductCard: () => import('~/components/elements/ProductCard'),
    Section: () => import('./Section'),
    GlobalSlider: () => import('~/containers/elements/GlobalSlider')
  },

  props: {
    sliderKey: {
      type: [Number, String],
      default: 'similar-slider'
    },
    products: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/more-products-slider';
</style>
