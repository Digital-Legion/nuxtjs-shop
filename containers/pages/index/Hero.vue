<template>
  <div class="index-hero container">
    <global-slider
      @change-active-index="activeSlide = $event"
      :light="true"
      :slides-length="formattedBanners.length"
      :slides-per-view="1"
      :show-pagination="true"
      slider-key="hero-slider"
      :additional-swiper-options="{
        autoplay: {
          delay: 200
        },
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        }
      }"
    >
      <template v-slot:slides>
        <product-wide
          v-for="(banner, index) in formattedBanners"
          :loading="fetchingBanners"
          :key="index"
          :banner="banner"
          class="swiper-slide"
          :use-custom-lazy="true"
          :show-image="watchResizeInitSizeDetermined && (activeSlide === index || activeSlide + 1 === index)"
          :show-mobile-image="watchResizeValues.mobile"
        />
      </template>
    </global-slider>
  </div>
</template>

<script>
import watchResize from "~/mixins/watchResize";
import {mapActions, mapState} from "vuex";

export default {
  name: "Hero",

  mixins: [watchResize],

  components: {
    GlobalSlider: () => import('~/containers/elements/GlobalSlider'),
    ProductWide: () => import('~/components/elements/ProductWide')
  },

  data() {
    return {
      fetchingBanners: false,

      watchResizeThresholds: {
        mobile: 600
      },
      activeSlide: 0
    }
  },

  async fetch() {
    this.fetchingBanners = true
    await this.fetchBigBanners()
    this.fetchingBanners = false
  },

  computed: {
    ...mapState('indexPage', ['bigBanners']),

    formattedBanners() {
      return this.bigBanners?.items || []
      // return this.bigBanners?.items.map(b => ({
      //   title: b[`name__${this.$i18n.locale}`] || b.name,
      //   image: b.desktop?.url,
      //   imageMobile: b.mobile?.url,
      //   slug: b.product?.[`slug__${this.$i18n.locale}`] || b.product?.slug || ''
      // })) || []
    }
  },

  methods: {
    ...mapActions('indexPage', ['fetchBigBanners'])
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/containers/pages/index/hero";
</style>
