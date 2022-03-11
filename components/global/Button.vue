<template>
  <a class="btn" href="#" @click.prevent>
    <MainShopCartIcon />
    <span>В корзину!</span>
  </a>
</template>

<script>
export default {
  name: "Button",

  props:["btn"],

  components: {
    MainShopCartIcon: () => import('~/assets/icons/shopping-cart-main.svg?inline'),
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/elements/button";
</style>
