<template>
  <div class="catalog-empty">
    <empty-icon />
    <h2 class="catalog-empty__title" v-t="'Упс... Ничего не найдено'" />
    <p class="catalog-empty__text" v-t="'Попробуйте изменить параметры поиска'" />
  </div>
</template>

<script>
export default {
  name: "Empty",

  components: {
    EmptyIcon: () => import('~/assets/icons/two-searches.svg?inline')
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/catalog/empty';
</style>
