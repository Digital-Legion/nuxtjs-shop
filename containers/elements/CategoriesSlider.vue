<template>
  <div class="categories-slider">
    <div
      class="swiper-button-next categories-slider__navigation-next"
    >
      <arrow-left-icon />
    </div>
    <div
      class="swiper-button-prev categories-slider__navigation-prev"
    >
      <arrow-left-icon />
    </div>
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide categories-slider__slide"
          :class="{active: hoverCategoryIndex === ci}"
          v-for="(category, ci) in data"
          :key="ci"
        >
          <clink :to="`/catalog?cat=${category.id}`" class="categories-slider__slide--category">
            <span>{{ category.title }}</span>
          </clink>
          <span
            @mouseenter="hoverCategoryIndex = ci"
            @mouseleave="hoverCategoryIndex = -1"
          >
            <clink
              class="categories-slider__slide--item"
              v-for="(item, i) in category.items"
              :key="i"
              :to="`/catalog?cat=${category.id}&brand=${item.id}`"
            >
              <img
                :style="{'opacity': imagesLoaded[`${ci}-${i}`] ? '' : 0 }"
                @load="$set(imagesLoaded, `${ci}-${i}`, true)"
                :data-src="item.src"
                :alt="item.slug"
                v-lazy-load
              >
            </clink>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoriesSlider",

  components: {
    ArrowLeftIcon: () => import('~/assets/icons/arrow-left.svg?inline')
  },

  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      hoverCategoryIndex: -1,

      imagesLoaded: {},

      swiperOption: {
        spaceBetween: 10,
        slidesPerView: 'auto',
        navigation: {
          nextEl: '.categories-slider__navigation-next',
          prevEl: '.categories-slider__navigation-prev'
        },
        breakpoints: {
          1201: {
            spaceBetween: 30,
            slidesPerView: 6
          },
          601: {
            spaceBetween: 30,
            slidesPerView: 'auto'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/categories-slider';
</style>
