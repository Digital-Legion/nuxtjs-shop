<template>
  <div class="g-fancybox" :class="{'g-fancybox--hidden': !visible}" v-body-scroll-lock="visible">
    <button class="g-fancybox__close" @click="$emit('close')">
      <CloseIcon />
    </button>

    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, i) in images" :key="i">
          <template v-if="initialLoaded">
            <img
              :style="{'opacity': imagesLoaded[`fancybox-${i}`] ? '' : 0 }"
              @load="$set(imagesLoaded, `fancybox-${i}`, true)"
              :src="item.src"
              :alt="item.alt"
              v-lazy-load
            />
          </template>
          <div v-if="!imagesLoaded[`fancybox-${i}`]" class="loading-spinner">
            <div class="spinner">
              <div />
            </div>
          </div>
        </div>
      </div>
      <div class="g-pagination g-fancybox__pagination swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-bullets-dynamic" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Fancybox",

  components: {
    CloseIcon: () => import('~/assets/icons/close.svg?inline')
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => []
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      activeIndex: this.initialIndex,
      initialLoaded: false,
      imagesLoaded: {},

      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 100,
        pagination: {
          el: '.g-fancybox__pagination',
          dynamicBullets: true,
          clickable: true
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        },
        mousewheel: {
          forceToAxis: true
        }
      }
    }
  },

  mounted () {
    this.mySwiper.on('slideChange', () => {
      this.activeIndex = this.mySwiper.activeIndex
    })
  },

  watch: {
    visible (n, o) {
      if (n === true && o === false) {
        this.initialLoaded = true
        this.slideToInitial()
      }
    }
  },

  methods: {
    slideToInitial() {
      if (this.mySwiper && this.visible) {
        this.mySwiper.slideTo(this.initialIndex)
        this.activeIndex = this.initialIndex
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/fancybox';
</style>
