<template>
    <div class="color-select">
      <title-reset
        :title="'Цвет'"
        :show-reset="value !== null"
        class="mb-10"
        @reset="onReset"
      />
      <slidable-content>
        <div class="color-select__list-wrapper">
          <ul class="g-colors">
            <li
              v-for="(item, index) in (options || [])"
              :key="index"
              class="g-colors-item"
              :style="{background: `#${item.hex}`}"
              :class="{ 'g-colors-item--active': selectedIds[item.id] }"
              @click="onSelect(item.id)"
            />
          </ul>
        </div>
      </slidable-content>
    </div>
</template>

<script>
export default {
  name: "ColorSelect",

  components: {
    TitleReset: () => import('./TitleReset'),
    SlidableContent: () => import('~/containers/elements/SlidableContent')
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

  computed: {
    selectedIds () {
      const ids = {}
      if (this.value?.length) {
        this.value.forEach(id => ids[id] = true)
      }
      return ids
    }
  },

  methods: {
    onReset () {
      this.$emit('input', null)
    },

    onSelect (itemId) {
      const newValue = this.value?.slice() || []
      if (this.selectedIds[itemId]) {
        newValue.splice(this.value.findIndex(id => id === itemId), 1)
      } else {
        newValue.push(itemId)
      }
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/color-select';
</style>
