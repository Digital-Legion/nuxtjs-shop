<template>
  <div class="video-card" @click="$emit('play-video')">
    <div class="video-card__thumb">
      <div class="video-card__play">
        <PlayIcon />
      </div>
      <img :src="video.poster" :alt="video[`title__${$i18n.locale}`] || video.title">
    </div>
    <span class="video-card__title">{{ video[`title__${$i18n.locale}`] || video.title }}</span>
  </div>
</template>

<script>
export default {
  name: "VideoCard",

  components: {
    PlayIcon: () => import('~/assets/icons/play.svg?inline')
  },

  props: {
    video: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/video-card';
</style>
