<template>
  <main class="favorites-page">
    <div class="container">
      <breadcrumbs :breadcrumbs="breadcrumbs"/>
      <template v-if="!formattedProducts.length">
        <EmptyLayout
          :title="$t('В избранном пока ничего нет')"
          :description="$t('Начните с главной страницы или воспользуйтесь поиском, чтобы найти что-то конкретное')"
          :go-to-text="'Перейти в каталог!'"
        >
          <template v-slot:image-side>
            <EmptyIcon class="empty-layout__image" />
          </template>
        </EmptyLayout>
      </template>
      <ProductGrid
        v-else
        :products="formattedProducts"
        :title="$t('Избранное')"
        :useH1Title="true"
        @on-dislike="onDislike($event)"
      />
    </div>

    <ProductModal/>
    <QuickBuyModal/>
  </main>
</template>

<script>
export default {
  name: "Favorite",

  components: {
    EmptyLayout: () => import('~/containers/elements/EmptyLayout'),
    EmptyIcon: () => import('~/assets/icons/two-hearts.svg?inline'),
    Breadcrumbs: () => import('~/components/elements/Breadcrumbs'),
    ProductGrid: () => import('~/containers/elements/ProductGrid'),
    QuickBuyModal: () => import('~/containers/elements/QuickBuyModal'),
    ProductModal: () => import('~/containers/elements/ProductModal')
  },

  data() {
    return {
      formattedProducts: []
    }
  },

  asyncData ({ store }) {
    return {
      formattedProducts: store.state.likedProducts ? Object.values(store.state.likedProducts) : []
    }
  },

  computed: {
    breadcrumbs() {
      return [
        {
          title: this.$t('Главная'),
          path: '/'
        },
        {
          title: this.$t('Избранное')
        }
      ]
    }
  },

  methods: {
    onDislike (product) {
      this.formattedProducts.splice(this.formattedProducts.findIndex(p => p.id === product.id), 1)
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/pages/favorites";
</style>
