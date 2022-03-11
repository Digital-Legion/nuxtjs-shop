<template>
  <div class="index-popular-brands">
    <div class="container">
      <h2 class="g-title">{{ $t('Популярные бренды') }}</h2>
      <CategoriesSlider :data="formattedBrands" />
    </div>
  </div>
</template>

<script>
import CategoriesSlider from "../../elements/CategoriesSlider";
import {mapActions, mapState} from "vuex";

export default {
  name: "PopularBrands",

  components: {CategoriesSlider},

  data () {
    return {
      fetchingBrands: false
    }
  },

  async fetch () {
    this.fetchingBrands = true
    await this.fetchPopularBrands()
    this.fetchingBrands = false
  },

  computed: {
    ...mapState('indexPage', ['popularBrands']),

    formattedBrands () {
      return this.popularBrands?.map(c => ({
        id: c.id,
        title: c[`name__${this.$i18n.locale}`] || c.name,
        slug: c[`slug__${this.$i18n.locale}`] || c.slug,
        items: c.brands.map(b => ({
          url: '/',
          src: b.image?.url || `/temp/${b.slug}.png`,
          alt: b.image?.alt || b.name || b.slug,
          slug: b.slug,
          id: b.id
        })).slice(0, 4)
      })) || []
    }
  },

  methods: {
    ...mapActions('indexPage', ['fetchPopularBrands'])
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/pages/index/popular-brands';
</style>
