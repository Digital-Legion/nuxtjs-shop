<template>
  <div class="about">
    <div class="container">
      <div class="about__inner">
        <div class="about-title title">{{ $t('about.title') }}</div>
        <div class="about-image">
          <img src="~/static/images/about/about1.png" alt="#">
        </div>
        <div class="about__text" v-html="$t('about.text')"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
}
</script>

<style lang="scss">
@import "~/assets/styles/pages/about";
</style>
