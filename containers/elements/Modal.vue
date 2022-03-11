<template>
  <div class="g-modal">
    <div class="g-bg" @click="$emit('close')" />
    <slot name="card">
      <div class="g-modal__card" ref="card">
        <button class="g-modal__close" @click="$emit('close')">
          <CloseIcon />
        </button>
        <slot />
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "Modal",

  mounted () {
    if (process.client && this.$refs.card) {
      setTimeout(() => {
        this.$nextTick(() => {
          if (window.innerHeight < this.$refs.card.offsetHeight || this.$refs.card.offsetHeight < 100)
            this.$refs.card.style.top = `${window.scrollY + 50}px`
          else {
            this.$refs.card.style.top = `${window.scrollY + window.innerHeight / 2 - this.$refs.card.offsetHeight / 2}px`
          }
        })
      }, 10)
    }
  },

  components: {
    CloseIcon: () => import('~/assets/icons/close.svg?inline')
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/modal';
</style>
