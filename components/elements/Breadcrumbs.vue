<template>
  <slidable-content class="g-breadcrumbs-wrapper">
    <div class="g-breadcrumbs">
      <template v-for="(item, i) in breadcrumbs">
        <clink
          v-if="item.path"
          :to="item.path"
          :key="`breadcrumb-${i}`"
          class="g-breadcrumbs__item"
          :class="{ 'g-breadcrumbs__item--active': i === breadcrumbs.length - 1 }"
        >
          {{ item.title }}
        </clink>
        <span
          v-else
          :key="`breadcrumb-${i}`"
          class="g-breadcrumbs__item"
          :class="{ 'g-breadcrumbs__item--active': i === breadcrumbs.length - 1 }"
        >
          {{ item.title || item }}
        </span>
        <span
          v-if="i !== breadcrumbs.length - 1"
          :key="`breadcrumb-separator-${i}`"
          class="g-breadcrumbs__item g-breadcrumbs__item--separator"
        >/</span>
      </template>
    </div>
  </slidable-content>
</template>

<script>
export default {
  name: "Breadcrumbs",

  components: {
    SlidableContent: () => import('~/containers/elements/SlidableContent')
  },

  props: {
    breadcrumbs: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/breadcrumbs';
</style>
