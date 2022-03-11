<template>
  <header class="g-header">
    <template v-if="watchResizeInitSizeDetermined">
      <template v-if="!watchResizeValues.mobile">
        <HeaderFixed />
        <HeaderNav />
        <HeaderMain />
      </template>
      <template v-else>
        <HeaderMobile
          :mobile-menu-active="mobileMenuActive"
          @set-mobile-menu-active="onSetMobileMenuActive"
          :show-lang-select="!watchResizeValues.mobileLangSelect"
        />
      </template>

      <HeaderCategories v-if="!watchResizeValues.mobileCategories" />
      <HeaderMobileCategories
        v-else
        :mobile-menu-active="mobileMenuActive"
        @set-mobile-menu-active="onSetMobileMenuActive"
      />
    </template>
  </header>
</template>

<script>
import watchResize from "~/mixins/watchResize";

export default {
  name: "Header",

  mixins: [watchResize],

  components: {
    // desktop
    HeaderNav: () => import('~/components/global/header/HeaderNav'),
    HeaderMain: () => import('~/components/global/header/HeaderMain'),
    HeaderCategories: () => import('~/components/global/header/HeaderCategories'),
    HeaderFixed: () => import('~/components/global/header/HeaderFixed'),

    // mobile
    HeaderMobile: () => import('~/components/global/header/HeaderMobile'),
    HeaderMobileCategories: () => import('~/components/global/header/HeaderMobileCategories')
  },

  data () {
    return {
      mobileMenuActive: false,
      watchResizeThresholds: {
        mobile: 1220,
        mobileCategories: 600,
        mobileLangSelect: 450
      }
    }
  },

  methods: {
    onSetMobileMenuActive (value) {
      this.mobileMenuActive = value
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/header/header';
</style>
