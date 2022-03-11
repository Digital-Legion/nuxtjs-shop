<template>
  <Section class="product-videos">
    <global-slider
      :slides-per-view="'auto'"
      :space-between="20"
      slider-key="videos-slider"
      :title="$t('Видео')"
      :additional-swiper-options="{
        breakpoints: {
          1101: {
            spaceBetween: 60,
            slidesPerView: 3
          },
          601: {
            spaceBetween: 20,
            slidesPerView: 3
          }
        }
      }"
    >
      <template v-slot:slides>
        <video-card
          class="swiper-slide"
          v-for="(item, index) in videos"
          :key="index"
          :video="item"
          @play-video="onPlayVideo(index)"
        />
      </template>
    </global-slider>
  </Section>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "Videos",

  components: {
    Section: () => import('~/containers/elements/Section'),
    GlobalSlider: () => import('~/containers/elements/GlobalSlider'),
    VideoCard: () => import('~/components/elements/VideoCard')
  },

  props: {
    videos: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    ...mapMutations(['setVideoModalData', 'showVideoModal']),

    onPlayVideo (index) {
      this.setVideoModalData({ videos: this.videos, videoIndex: index })
      this.showVideoModal()
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/pages/product/videos';
</style>
