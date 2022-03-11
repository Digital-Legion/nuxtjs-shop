<template>
  <div
    class="g-select"
    v-click-outside="() => isOpen = false"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="g-select__top" @click="isOpen = !isOpen" :class="{active: isActive}">
      <slot name="top-prefix" />
      <slot name="top-value">
        <span>{{ value[optionLabel] }}</span>
      </slot>
      <DropdownIcon class="dropdown-icon" v-if="showDropdownIcon" />
    </div>
    <ul class="g-select__dropdown" :class="{active: isActive}">
      <slot name="dropdown-list">
        <template v-for="(item, index) in options">
          <li v-if="item[optionSlug] !== value[optionSlug]" :key="index" @click="onSelect(item)">
            <slot :name="`dropdown-prefix-${index}`" />
            <span>{{ item[optionLabel] }}</span>
          </li>
        </template>
      </slot>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "CustomSelect",

    components: {
      DropdownIcon: () => import('~/assets/icons/lang-dropdown.svg?inline')
    },

    props: {
      value: {
        type: Object,
        default: null
      },
      options: {
        type: Array,
        default: () => []
      },
      optionSlug: {
        type: String,
        default: 'id'
      },
      optionLabel: {
        type: String,
        default: 'id'
      },
      showDropdownIcon: {
        type: Boolean,
        default: true
      },
      closeOnSelect: {
        type: Boolean,
        default: true
      },
      openOnHover: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        isOpen: false,
        isHovered: false
      }
    },

    computed: {
      isActive () {
        return (
          this.isOpen || this.openOnHover ? this.isHovered : false
        )
      }
    },

    methods: {
      onSelect (value) {
        this.$emit('select', value)
        if (this.closeOnSelect) this.isOpen = false
      }
    }
  }
</script>


<style lang="scss">
@import '~/assets/styles/elements/custom-select';
</style>
