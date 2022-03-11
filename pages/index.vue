<template>
  <main class="main-page">
    <Hero />
    <PopularProducts />
    <ProductSlider />
    <OtherProducts />
    <PopularBrands />
    <Advantage />
    <Ceo />

    <ProductModal />
    <QuickBuyModal />
    <PreorderModal />
  </main>
</template>

<script>
export default {
  name: 'IndexPage',

  components: {
    PreorderModal: () => import('~/containers/elements/PreorderModal'),
    QuickBuyModal: () => import('~/containers/elements/QuickBuyModal'),
    ProductModal: () => import('~/containers/elements/ProductModal'),
    Hero: () => import('~/containers/pages/index/Hero'),
    Advantage: () => import('~/containers/pages/index/Advantage'),
    Ceo: () => import('~/containers/elements/Ceo'),
    PopularProducts: () => import('~/containers/pages/index/PopularProducts'),
    OtherProducts: () => import('~/containers/pages/index/OtherProducts'),
    PopularBrands: () => import('~/containers/pages/index/PopularBrands'),
    ProductSlider: () => import('~/containers/pages/index/ProductSlider')
  }
}
</script>
<style lang="scss">
@import "~/assets/styles/pages/index";
</style>
