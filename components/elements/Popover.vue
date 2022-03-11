<template>
  <div
    class="g-popover"
    :class="{'g-popover--active': isActive && !noHover || show}"
    @mouseenter="isActive = true"
    @mouseleave="isActive = false"
  >
    <slot
      name="hover-content"
    >
      Hover on me
    </slot>
    <div class="g-popover__content">
      <div class="g-popover__content-inner">
        <slot>Popover Content</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popover",

  props: {
    noHover: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isActive: false
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/popover';
</style>
