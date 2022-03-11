<template>
  <div class="title-reset">
    <span class="g-title-small">{{ $t(title) }}</span>
    <button class="title-reset__btn" v-if="showReset" @click="$emit('reset')">
      <span v-t="'Сброс'" />
      <reset-icon />
    </button>
    <button class="title-reset__btn" v-if="showSelectAll" @click="$emit('select-all')">
      <span v-t="'Выбрать все'" />
    </button>
  </div>
</template>

<script>
export default {
  name: "TitleReset",

  components: {
    ResetIcon: () => import('~/assets/icons/close-2.svg?inline')
  },

  props: {
    title: {
      type: String,
      default: 'Title'
    },
    showReset: {
      type: Boolean,
      default: true
    },
    showSelectAll: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/title-reset';
</style>
