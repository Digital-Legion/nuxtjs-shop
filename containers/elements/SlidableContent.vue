<template>
  <div class="slidable-content" v-swiper:mySwiper="swiperOption">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SlidableContent",

  props: {
    additionalSwiperOptions: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        freeMode: true,
        resistanceRatio: 0,
        ...this.additionalSwiperOptions
      }
    }
  },

  mounted () {
    this.mySwiper.on('transitionEnd', () => this.onSliderAction())
    this.mySwiper.on('toEdge', () => this.onSliderAction)
    this.onSliderAction()
  },

  methods: {
    onSliderAction () {
      this.$emit('on-action', {
        isBeginning: this.mySwiper.isBeginning,
        isEnd: this.mySwiper.isEnd
      })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/slidable-content';
</style>
