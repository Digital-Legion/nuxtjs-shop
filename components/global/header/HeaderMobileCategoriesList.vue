<template>
  <div
    class="g-header-mobile-categories__level g-header-mobile-categories__level--list"
    :class="[
        levelShown
          ? 'g-header-mobile-categories__level--active'
          : 'g-header-mobile-categories__level--gone'
      ]"
  >
    <div class="container-wrapper" v-body-scroll-lock="levelShown">
      <ul class="container">
      <li
        class="g-header-mobile-categories__item g-header-mobile-categories__item--selected"
        v-if="parentLevelSelect"
        @click="onParentLevelRemove"
      >
        <button class="content">
          <ArrowLeftIcon class="g-header-mobile-categories__back" />
          <span>{{ parentLevelSelect[`name__${$i18n.locale}`] || parentLevelSelect.name }}</span>
        </button>
      </li>
      <li
        class="g-header-mobile-categories__item g-header-mobile-categories__item--selected g-header-mobile-categories__item--active"
        v-if="levelSelect"
        @click="$emit('level-select-remove', level)"
      >
        <button class="content">
          <ArrowLeftIcon class="g-header-mobile-categories__back" />
          <span>{{ levelSelect[`name__${$i18n.locale}`] || levelSelect.name }}</span>
        </button>
      </li>
      <li
        class="g-header-mobile-categories__item"
        v-for="(item, index) in ((levelSelect && levelSelect.children) || [])"
        :key="index"
        @click="$emit('level-select', { level: level + 1, item})"
      >
        <button class="content">
          <span>{{ item[`name__${$i18n.locale}`] || item.name }}</span>
          <ArrowRightIcon class="g-header-mobile-categories__forward" v-if="item.children && item.children.length" />
        </button>
      </li>
    </ul>
    </div>
    <div class="g-header-mobile-categories__see-all-wrapper">
      <button class="g-header-mobile-categories__see-all" @click="$emit('show-all', levelSelect)">
        <span>{{ $t('Показать все') }} ({{ productCount }})</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderMobileCategoriesList",

  components: {
    ArrowLeftIcon: () => import('~/assets/icons/arrow-left.svg?inline'),
    ArrowRightIcon: () => import('~/assets/icons/arrow-right.svg?inline')
  },

  props: {
    productCount: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: null
    },
    parentLevelSelect: {
      type: Object,
      default: null
    },
    levelSelect: {
      type: Object,
      default: null
    },
    levelShown: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onParentLevelRemove () {
      this.$emit('level-select-remove', this.level)
      this.$emit('level-select-remove', this.level - 1)
    }
  }
}
</script>
