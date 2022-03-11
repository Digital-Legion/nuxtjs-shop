<template>
  <div class="wrapper">
    <template v-if="is404">
      <div class="container">
        <EmptyLayout
          class="not-found-page"
          :title="$t('Упс')"
          :description="$t('Эта страница потерялась.') + ' ' + $t('Начните с главной страницы или воспользуйтесь поиском, чтобы найти что-то конкретное')"
          :go-to-text="'Перейти в каталог!'"
          go-to-link="/catalog"
        >
          <template v-slot:image-side>
            <EmptyIcon class="empty-layout__image" />
          </template>
        </EmptyLayout>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  layout: 'error',

  components: {
    EmptyLayout: () => import('~/containers/elements/EmptyLayout'),
    EmptyIcon: () => import('~/assets/icons/two-404.svg?inline')
  },

  props: ['error'],

  computed: {
    is404 () {
      return this.error.statusCode === 404
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/404';
</style>
