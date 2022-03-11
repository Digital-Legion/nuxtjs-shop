<template>
  <div class="scroll-select">
    <title-reset
      :title="label"
      :show-reset="isResetVisible"
      class="mb-10"
      @reset="onReset"
      @select-all="onSelectAll"
      :show-select-all="showSelectAll && !isResetVisible"
    />
    <custom-input
      :compact="true"
      v-model="searchValue"
      v-if="isSearchVisible"
      name="search"
      :placeholder="$t('Поиск')"
      class="mb-16"
    />
    <div
      class="scroll-select__list-wrapper"
      :class="{
        'scroll-select__list-wrapper--top-fade': showFade && showTopFade,
        'scroll-select__list-wrapper--bottom-fade': showFade && showBottomFade
      }"
    >
      <ul ref="scrollEl" v-bsl="scrollLock">
        <li v-for="(item, index) in filteredOptions" :key="index">
          <checkbox
            :is-radio="isRadio"
            :label="item.label"
            :selected="selectedIds[item.id]"
            @clicked="onSelect(item.id)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScrollSelect",

  components: {
    TitleReset: () => import('./TitleReset'),
    CustomInput: () => import('./CustomInput'),
    Checkbox: () => import('./Checkbox')
  },

  props: {
    scrollLock: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String, Array],
      default: null
    },
    showFade: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Label'
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    resetOnlyOptions: {
      type: Boolean,
      default: false
    },
    showSelectAll: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      searchValue: '',
      showTopFade: false,
      showBottomFade: false
    }
  },

  mounted () {
    this.$refs.scrollEl.addEventListener('scroll', this.onScroll)
    this.onScroll()
  },

  watch: {
    options () {
      this.$nextTick(() => this.onScroll())
    }
  },

  computed: {
    filteredOptions () {
      if (this.searchValue.trim() !== '')
        return this.options.filter(i => i.label?.includes(this.searchValue))
      return this.options
    },

    isSearchVisible () {
      return this.showSearch && this.options?.length > 1
    },

    isResetVisible () {
      if (!this.options?.length) return false

      if (this.isRadio) {
        return this.value !== null
      }

      if (this.value?.length) {
        return this.options.some(o => this.value.map(v => v.toString()).includes(o.id?.toString()))
      }

      return false
    },

    selectedIds () {
      if (!this.isRadio) {
        const ids = {}
        if (this.value?.length) {
          this.value.forEach(id => {
            ids[id] = true
          })
        }
        return ids
      }
      return {[this.value]: true}
    }
  },

  methods: {
    onSelect (itemId) {
      if (this.isRadio)
        this.$emit('input', itemId)
      else {
        const newValue = this.value?.slice() || []
        if (this.selectedIds[itemId]) {
          newValue.splice(this.value.findIndex(id => id === itemId), 1)
        } else {
          newValue.push(itemId)
        }
        this.$emit('input', newValue)
      }
    },

    onSelectAll () {
      if (!this.isRadio) {
        this.$emit('add', this.filteredOptions.map(o => o.id))
      }
    },

    onReset () {
      if (this.resetOnlyOptions && !this.isRadio && this.value?.length && this.options?.length) {
        const optionIds = this.options?.map(o => o.id),
          itemIdsToRemove = this.value.filter(v => optionIds?.includes(v)),
          newValue = JSON.parse(JSON.stringify(this.value))
        itemIdsToRemove.forEach(id => {
          newValue.splice(newValue.findIndex(v => v === id), 1)
        })
        this.$emit('input', newValue)
      } else
        this.$emit('input', null)
    },

    onScroll () {
      this.showTopFade = this.$refs.scrollEl.scrollTop !== 0
      this.showBottomFade = this.$refs.scrollEl.scrollTop !== this.$refs.scrollEl.scrollHeight - this.$refs.scrollEl.offsetHeight
    }
  },

  beforeDestroy() {
    this.$refs.scrollEl.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/scroll-select';
</style>
