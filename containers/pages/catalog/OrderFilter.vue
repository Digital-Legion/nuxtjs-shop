<template>
  <slidable-content>
    <div class="catalog-order-filter">
      <div class="catalog-order-filter__left" v-t="'Сортировать по:'" />
      <div class="catalog-order-filter__right">
        <div
          v-for="(item, index) in sorts"
          :key="index"
          class="catalog-order-filter__item"
          :class="{
            active: item.id === value.by,
            up: item.id === value.by && value.order === 'asc'
          }"
          @click="onSelect(item)"
        >
          <span v-t="item.title" />
          <arrow-icon />
        </div>
      </div>
    </div>
  </slidable-content>
</template>

<script>
export default {
  name: "OrderFilter",

  components: {
    SlidableContent: () => import('~/containers/elements/SlidableContent'),
    ArrowIcon: () => import('@/assets/icons/arrow-down.svg?inline')
  },

  props: {
    value: {
      type: Object,
      default: () => ({ by: 'desc', order: 'pop' })
    },
    sorts: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    onSelect (item) {
      if (item.id !== this.value.by) {
        this.$emit('input', { by: item.id, order: 'desc' })
      } else {
        this.$emit('input', { by: item.id, order: this.value.order === 'desc' ? 'asc' : 'desc' })
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/catalog/order-filter';
</style>
