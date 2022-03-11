<template>
  <div class="g-pagination">
    <div class="g-pagination__content" v-if="totalElems > perPage">
      <button class="g-pagination__button-left" @click="changePage(value-1)" :disabled="value === 1">
        <arrow-icon v-show="value >= 1" style="transform: scaleX(-1);" />
      </button>
      <button class="g-pagination__button" @click="changePage(1)" :class="{ 'current': value === 1 }" :disabled="value === 1">
        <span>1</span>
      </button>
      <button
        class="g-pagination__button"
        v-for="(button,i) in buttons" :key="`g-pagination-${i}`"
        @click="changePage(button.content)"
        :class="{
          'three-dots': button.disabled,
          'current': button.content === value,
          'hide-s': button.toHideS,
          'hide-xs': button.toHideXs
        }"
        :disabled="button.disabled || button.content === value"
      >
        <span>{{ button.content }}</span>
      </button>
      <button class="g-pagination__button" @click="changePage(lastPage)" :class="{ 'current': value === lastPage }" :disabled="value === lastPage">
        <span>{{ lastPage }}</span>
      </button>
      <button class="g-pagination__button-right" @click="changePage(value+1)" :disabled="value === lastPage">
        <arrow-icon v-show="value <= lastPage" />
      </button>
    </div>
    <div v-if="totalElems === 0 && showEmptyText">
      <span class="g-pagination__empty" v-if="emptyText">{{ emptyText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",

  components: {
    ArrowIcon: () => import('~/assets/icons/arrow-right.svg?inline')
  },

  props: {
    perPage: {
      type: Number,
      default: 12
    },
    totalElems: {
      type: Number,
      default: 12
    },
    value: {
      type: Number,
      default: 1
    },
    emptyText: {
      type: String,
      default: 'No results'
    },
    showEmptyText: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      buttons: [] // only consists of the middle numbers and ...
    }
  },

  mounted () {
    this.generatePagination(this.value)
  },

  watch: {
    value (n) {
      this.generatePagination(n)
    },

    totalElems () {
      this.generatePagination(this.value)
    }
  },

  computed: {
    lastPage () {
      return Math.ceil(this.totalElems / this.perPage)
    }
  },

  methods: {
    init () {
      this.generatePagination(this.value)
    },

    changePage (p) {
      if (p > 0 && p < this.lastPage + 1) {
        this.$emit('input', p)
      }
    },

    generatePagination (p) {
      this.buttons = []
      if (this.lastPage === 2) return

      if (p === 1) p = 2
      else if (p === this.lastPage) p = this.lastPage - 1

      if (p - 2 > 1)
        this.buttons.push({content: '...', disabled: true})
      if (p - 1 > 1)
        this.buttons.push({content: p - 1, toHideS: true})
      if (p !== 1 && p !== this.lastPage)
        this.buttons.push({content: p})
      if (p + 1 < this.lastPage)
        this.buttons.push({content: p + 1, toHideS: true})
      if (p + 2 < this.lastPage)
        this.buttons.push({content: '...', disabled: true})
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/elements/pagination";
</style>
