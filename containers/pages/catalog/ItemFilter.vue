<template>
  <div class="catalog-item-filter"
    :class="{
      'catalog-item-filter--left-fade': showLeftArrow,
      'catalog-item-filter--right-fade': showRightArrow
    }"
  >
    <div
      class="catalog-item-filter__arrow catalog-item-filter__arrow--left"
      :class="{hidden: !showLeftArrow}"
    >
      <arrow-icon />
    </div>
    <div
      class="catalog-item-filter__arrow catalog-item-filter__arrow--right"
      :class="{hidden: !showRightArrow}"
    >
      <arrow-icon />
    </div>

    <slidable-content
      @on-action="onSliderAction"
      :additional-swiper-options="{
        navigation: {
          nextEl: '.catalog-item-filter__arrow--right',
          prevEl: '.catalog-item-filter__arrow--left'
        }
      }"
    >
      <ul>
        <li
          v-for="(item, index) in (options || [])"
          :key="index"
          :class="{active: selectedIds[item.id]}"
          @click="onSelect(item.id)"
        >
          {{ item.name }}
        </li>
      </ul>
    </slidable-content>
  </div>
</template>

<script>
export default {
  name: "ItemFilter",

  components: {
    SlidableContent: () => import('~/containers/elements/SlidableContent'),
    ArrowIcon: () => import('~/assets/icons/arrow-left.svg?inline')
  },

  props: {
    value: {
      type: Array,
      default: null
    },
    options: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      showLeftArrow: false,
      showRightArrow: true
    }
  },

  computed: {
    selectedIds () {
      const ids = {}
      if (this.value?.length) {
        this.value.forEach(id => {
          ids[id] = true
        })
      }
      return ids
    }
  },

  methods: {
    onSelect (itemId) {
      const newValue = this.value?.slice() || []
      if (this.selectedIds[itemId]) {
        newValue.splice(this.value.findIndex(id => id === itemId), 1)
      } else {
        newValue.push(itemId)
      }
      this.$emit('input', newValue)
    },

    onSliderAction (sliderParams) {
      this.showLeftArrow = !sliderParams.isBeginning
      this.showRightArrow = !sliderParams.isEnd
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/catalog/item-filter';
</style>
