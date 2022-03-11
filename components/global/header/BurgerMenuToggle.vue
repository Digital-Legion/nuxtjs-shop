<template>
  <div
    class="burger-menu-toggle"
    :class="{'burger-menu-toggle--active': value}"
    @click="$emit('input', !value)"
  >
    <div class="burger-menu-toggle__line" />
    <div class="burger-menu-toggle__line" />
    <div class="burger-menu-toggle__line" />
  </div>
</template>

<script>
export default {
  name: "BurgerMenuToggle",

  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/header/burger-menu-toggle';
</style>
