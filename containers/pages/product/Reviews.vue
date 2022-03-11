<template>
  <div class="reviews">
    <div class="container">
      <div class="reviews__header">
        <div class="reviews-title">Отзывы</div>
        <div class="reviews-counter">128</div>
     </div>
      <clink to="" class="reviews__button">
        <Message />
        <span>Написать отзыв</span>
      </clink>
      <div class="reviews-subtitle">Фотографии покупателей</div>
      <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide reviews__slide" :key="banner" v-for="banner in banners">
            <img :src="banner">
          </div>
        </div>
        <div class="swiper-button-next reviews__button--next"></div>
        <div class="swiper-button-prev reviews__button--prev"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Reviews",
  components: {
    Message: () => import('@/assets/icons/message-circle.svg?inline')
  },

  data() {
    return {
      banners: [
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
        '/images/reviews/review1.png',
      ],
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 30,
        navigation: {
          nextEl: ".swiper-button-next.reviews__button--next",
          prevEl: ".swiper-button-prev.reviews__button--prev",
        },
      }
    }
  },
  mounted() {
    console.log('Current Swiper instance object', this.mySwiper)
    this.mySwiper.slideTo(1, 1000, false)
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/containers/reviews";
</style>
