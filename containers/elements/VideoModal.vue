<template>
  <transition name="fade" mode="out-in">
    <modal class="video-modal" v-if="videoModalShown" @close="onClose">
      <global-slider
        :slides-per-view="'auto'"
        :space-between="100"
        :show-pagination="true"
        :additional-swiper-options="{
          initialSlide: videoModalVideoInitIndex
        }"
        @change-active-index="onSlideChange"
      >
        <template v-slot:slides>
          <div
            class="swiper-slide video-modal__video"
            v-for="(video, index) in formattedVideos"
            :key="index"
          >
            <youtube
              :player-vars="{ autoplay: index === videoModalVideoInitIndex }"
              :video-id="video.youtubeId"
              @ready="onYotubePlayerReady($event, index)"
            />
          </div>
        </template>
      </global-slider>
    </modal>
  </transition>
</template>

<script>
function youtube_parser (url){
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11)? match[7] : false;
}

import {mapMutations, mapState} from "vuex";
export default {
  name: "VideoModal",

  components: {
    GlobalSlider: () => import('./GlobalSlider'),
    Modal: () => import('./Modal')
  },

  data () {
    return {
      youtubePlayers: {}
    }
  },

  watch: {
    videoModalShown () {
      if (!this.videoModalShown) {
        this.$set(this, 'youtubePlayers', {})
      }
    }
  },

  computed: {
    ...mapState(['videoModalShown', 'videoModalVideos', 'videoModalVideoInitIndex']),

    formattedVideos () {
      return this.videoModalVideos?.map(v => ({
        ...v,
        youtubeId: v.url ? youtube_parser(v.url) : null
      })).filter(v => v.youtubeId) || []
    }
  },

  methods: {
    ...mapMutations(['setVideoModalData', 'hideVideoModal']),

    onYotubePlayerReady (event, index) {
      const youtubePlayers = Object.assign({}, this.youtubePlayers)
      youtubePlayers[index.toString()] = event.target
      this.$set(this, 'youtubePlayers', youtubePlayers)
    },

    onSlideChange () {
      Object.values(this.youtubePlayers).forEach(yp => yp.stopVideo())
    },

    onClose () {
      this.hideVideoModal()
      setTimeout(() => {
        this.setVideoModalData({ videos: null, videoIndex: null })
      }, 310)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/video-modal';
</style>
