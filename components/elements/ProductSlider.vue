<template>
  <div class="product-slider">
    <div class="product-slider__left" v-if="showSmallSlider">
      <div v-swiper:leftSwiper="leftSwiperOption">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            :class="{ 'swiper-slide--active': activeSlideIndex === i }"
            :style="{'border-color': activeSlideIndex === i && color !== 'FFFFFF' ? `#${color}` : ''}"
            v-for="(item, i) in images"
            :key="i"
            @click="rightSwiper.slideTo(i)"
          >
            <img :src="item.src" :alt="item.alt" v-lazy-load>
          </div>
        </div>
      </div>
    </div>
    <div class="product-slider__right">
      <div class="product-slider__right-slider-wrapper">
        <div v-swiper:rightSwiper="rightSwiperOption">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, i) in images" :key="i">
              <div class="product-slider__right-slide" @click="onClickImage(i)">
                <zoom-on-hover
                  v-if="activeSlideIndex === i || activeSlideIndex + 1 === i || imagesLoaded[`product-slider-image-${i}`]"
                  :style="{'opacity': imagesLoaded[`product-slider-image-${i}`] ? '' : 0 }"
                  @loaded="$set(imagesLoaded, `product-slider-image-${i}`, true)"
                  :img-normal="item.src"
                  :alt="item.alt"
                  :scale="2"
                  :disabled="zoomDisabled"
                />
                <div v-if="!imagesLoaded[`product-slider-image-${i}`]" class="loading-spinner">
                  <div class="spinner">
                    <div />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="g-pagination product-slider__pagination swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-bullets-dynamic" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProductSlider',

  props: {
    images: {
      type: Array,
      default: () => []
    },
    showSmallSlider: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: ''
    },
    zoomDisabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      activeSlideIndex: 0,
      imagesLoaded: {},

      leftSwiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
        direction: 'horizontal',
        mousewheel: {
          releaseOnEdges: false,
          forceToAxis: true
        },
        breakpoints: {
          1221: {
            direction: 'vertical',
            spaceBetween: 15
          }
        }
      },
      rightSwiperOption: {
        spaceBetween: 100,
        pagination: {
          el: '.product-slider__pagination',
          dynamicBullets: true,
          clickable: true
        }
      }
    }
  },

  mounted() {
    this.rightSwiper.on('slideChange', () => {
      try {
        this.activeSlideIndex = this.rightSwiper.activeIndex;
        this.leftSwiper.slideTo(this.rightSwiper.activeIndex);
      } catch {}
    });
  },

  methods: {
    onClickImage (index) {
      this.$emit('open-fancy', index)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/product-slider';
</style>
