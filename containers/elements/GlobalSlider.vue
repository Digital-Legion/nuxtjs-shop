<template>
  <div class="global-slider" :class="{'global-slider--light': light}">
    <div class="global-slider__top" v-if="title">
      <h2>{{ title }}</h2>
      <div class="global-slider__navigation-wrapper">
        <div
          class="swiper-button-next global-slider__navigation global-slider__navigation-next"
          :class="[`${sliderKey}-navigation-next`]"
        >
          <arrow-left-icon />
        </div>
        <div
          class="swiper-button-prev global-slider__navigation global-slider__navigation-prev"
          :class="[`${sliderKey}-navigation-prev`]"
        >
          <arrow-left-icon />
        </div>
      </div>
    </div>
    <div class="global-slider__swiper-wrapper">
      <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <slot name="slides" />
        </div>
      </div>
      <div
        v-if="title === null"
        class="swiper-button-next global-slider__navigation global-slider__navigation-next"
        :class="[`${sliderKey}-navigation-next`]"
      >
        <arrow-left-icon />
      </div>
      <div
        v-if="title === null"
        class="swiper-button-prev global-slider__navigation global-slider__navigation-prev"
        :class="[`${sliderKey}-navigation-prev`]"
      >
        <arrow-left-icon />
      </div>
    </div>
    <div
      v-show="paginationShouldBeShown"
      :class="['global-slider__pagination', 'g-pagination', `${sliderKey}-pagination`]"
    >
      <div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-bullets-dynamic" />
    </div>
  </div>
</template>

<script>
export default {
  name: "GlobalSlider",

  components: {
    ArrowLeftIcon: () => import('~/assets/icons/arrow-left.svg?inline')
  },

  props: {
    light: {
      type: Boolean,
      default: false
    },
    slidesPerView: {
      type: [Number, String],
      default: 1
    },
    spaceBetween: {
      type: [Number, String],
      default: 1
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    additionalSwiperOptions: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: null
    },
    lazy: {
      type: [Boolean, Object],
      default: false
    },
    breakpoints: {
      type: Object,
      default: () => {}
    },
    sliderKey: {
      type: [Number, String],
      default: () => {
        if (process.client) {
            if (window.globalSliderKey) {
              return window.globalSliderKey = `global-slider-${parseInt(window.globalSliderKey.split('-')[2]) + 1 || 0}`
            } else
              return window.globalSliderKey = 'global-slider-0'
        } else return 'global-slider'
      }
    }
  },

  data () {
    return {
      swiperOption: {
        slidesPerView: this.slidesPerView,
        spaceBetween: this.spaceBetween,
        breakpoints: this.breakpoints,
        pagination: this.showPagination && {
          el: `.${this.sliderKey}-pagination .swiper-pagination`,
          dynamicBullets: true,
          clickable: true
        },
        navigation: {
          nextEl: `.${this.sliderKey}-navigation-next`,
          prevEl: `.${this.sliderKey}-navigation-prev`
        },
        ...this.additionalSwiperOptions
      }
    }
  },

  mounted () {
    this.mySwiper.on('slideChange', () => {
      this.$emit('change-active-index', this.mySwiper.activeIndex)
    })
  },

  computed: {
    paginationShouldBeShown () {
      return this.showPagination && this.slidesPerView !== this.mySwiper?.slides?.length
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/global-slider';
</style>
