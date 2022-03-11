<template>
  <main class="empty-layout">
    <div class="empty-layout__side">
      <h1 class="empty-layout__title g-title" v-if="title">{{ title }}</h1>
      <p class="empty-layout__description" v-if="description">{{ description }}</p>
      <clink class="empty-layout__btn" :to="goToLink">
        <span v-t="goToText" />
      </clink>
    </div>
    <div class="empty-layout__side">
      <slot name="image-side" />
    </div>
  </main>
</template>

<script>
export default {
  name: "EmptyLayout",

  props: {
    title: {
      type: String
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    imageAlt: {
      type: String
    },
    goToLink: {
      type: String,
      default: '/catalog'
    },
    goToText: {
      type: String,
      default: 'Перейти в каталог!'
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/empty-layout';
</style>
