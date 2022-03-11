<template>
  <div class="index-product-slider container">
    <global-slider
      :slides-length="formattedBanners.length"
      :slides-per-view="1"
      :space-between="30"
      slider-key="product-slider"
      :breakpoints="{
        1201: {
          slidesPerView: 2,
          autoHeight: false
        }
      }"
      :additional-swiper-options="{
        mousewheel: {
          forceToAxis: true
        },
        autoHeight: true
      }"
      :show-pagination="true"
      @change-active-index="activeIndex = $event"
      :class="[
        activeIndex % 2 === 0
          ? 'global-slider--even'
          : 'global-slider--odd',
        'global-slider--even-odd',
        activeBannerHex === 'white'
          ? 'global-slider--left-white'
          : 'global-slider--left-black',
        activeNextBannerHex === 'white'
          ? 'global-slider--right-white'
          : 'global-slider--right-black'
      ]"
    >
      <template v-slot:slides>
        <product-wide
          v-for="(banner, index) in formattedBanners"
          :loading="fetchingBanners"
          :key="index"
          :banner="banner"
          :use-custom-lazy="true"
          :show-image="
            watchResizeInitSizeDetermined
            && (
              activeIndex === index
              || activeIndex + 1 === index
              || activeIndex + 2 === index
              || activeIndex + 3 === index
            )
          "
          :show-mobile-image="watchResizeValues.mobile"
          class="swiper-slide"
          :class="{'product-wide--dark product-wide--border': banner.hex === 'white'}"
        />
      </template>
    </global-slider>
  </div>
</template>

<script>
import watchResize from "~/mixins/watchResize";
import {mapActions, mapState} from "vuex";

export default {
  name: "ProductSlider",

  mixins: [watchResize],

  components: {
    GlobalSlider: () => import('~/containers/elements/GlobalSlider'),
    ProductWide: () => import('~/components/elements/ProductWide')
  },

  data () {
    return {
      activeIndex: 0,
      fetchingBanners: false,

      watchResizeThresholds: {
        mobile: 600
      }
    }
  },

  async fetch() {
    this.fetchingBanners = true
    await this.fetchSmallBanners()
    this.fetchingBanners = false
  },

  computed: {
    ...mapState('indexPage', ['smallBanners']),

    activeBannerHex () {
      return this.formattedBanners?.[this.activeIndex]?.hex || ''
    },

    activeNextBannerHex () {
      return this.formattedBanners?.[this.activeIndex + 1]?.hex || ''
    },

    formattedBanners() {
      return this.smallBanners?.items || []
    }
  },

  methods: {
    ...mapActions('indexPage', ['fetchSmallBanners'])
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/pages/index/product-slider';
</style>
