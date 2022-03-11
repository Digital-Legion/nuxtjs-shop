<template>
  <div class="header-categories">
    <div
      class="container"
      @mouseleave="onDropdownHide"
    >
      <div class="header-categories__wrapper">
        <div
          class="header-categories__category"
          :class="{'header-categories__category--active': categoryActive && categoryHoveredIndex === index}"
          @mouseenter="onCategoryMouseEnter(item, index)"
          @click.prevent
          v-for="(item, index) in (cascaderCategories || [])"
          :key="index"
        >
          <clink
            :to="`/catalog?cat=${item.id}`"
            class="header-categories__link"
          >
            <PhoneIcon v-if="item.slug === 'telefony'" />
            <NotebookIcon v-if="item.slug === 'noutbuki'" />
            <HeadPhoneIcon v-if="item.slug === 'audio'" />
            <AdaptIcon v-if="item.slug === 'aksessuary'" />
            <LoadIcon v-if="item.slug === 'bytovaya-tehnika'" />
            <PhotoIcon v-if="item.slug === 'foto-i-video'" />
            <SkuterIcon v-if="item.slug === 'raznoe'" />
            <span>{{ item[`name__${$i18n.locale}`] || item.name }}</span>
          </clink>
        </div>
        <div
          class="header-categories__category header-categories__category--no-dropdown"
          @mouseenter="hideDropdown"
        >
          <clink
            to="/catalog?discat=1"
            class="header-categories__link"
          >
            <SaleIcon />
            <span v-t="'Скидки'" />
          </clink>
        </div>
      </div>
      <div
        class="header-categories__dropdown"
        :class="{'header-categories__dropdown--active': categoriesDropdownShown}"
      >
        <div
          class="header-categories__dropdown-item"
          v-for="(catLevel1, indexLevel1)
            in (categoryActive && categoryActive.children
              ? categoryActive.children
              : [])"
          :key="indexLevel1"
        >
          <clink :to="`/catalog?cat=${catLevel1.id}`" class="category-title">{{ catLevel1[`name__${$i18n.locale}`] || catLevel1.name }}</clink>
          <ul v-if="catLevel1.children && catLevel1.children.length">
            <li
              class="category-item"
              v-for="(catLevel2, indexLevel2) in catLevel1.children"
              :key="`${indexLevel1}-${indexLevel2}`"
            >
              <clink :to="`/catalog?cat=${catLevel2.id}`">
                {{ catLevel2.name }}
              </clink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "HeaderCategories",

  components: {
    PhoneIcon: () => import('~/assets/icons/categories-phone.svg?inline'),
    NotebookIcon: () => import('~/assets/icons/categories-notebook.svg?inline'),
    HeadPhoneIcon: () => import('~/assets/icons/categories-headphones.svg?inline'),
    AdaptIcon: () => import('~/assets/icons/categories-adapt.svg?inline'),
    LoadIcon: () => import('~/assets/icons/categories-load.svg?inline'),
    PhotoIcon: () => import('~/assets/icons/categories-photo.svg?inline'),
    SkuterIcon: () => import('~/assets/icons/categories-skuter.svg?inline'),
    SaleIcon: () => import('~/assets/icons/categories-sale.svg?inline')
  },

  data () {
    return {
      categoryActive: null,
      categoryHoveredIndex: -1,
      categoriesDropdownShown: false,

      categoryHovered: false,
      currentHoveredCategoryIndex: null
    }
  },

  // async fetch () {
  //   await this.fetchCascaderCategories()
  // },

  computed: {
    ...mapState('categories', ['cascaderCategories'])
  },

  methods: {
    // ...mapActions('categories', ['fetchCascaderCategories']),

    onCategoryMouseEnter (category, index) {
      this.categoryHovered = true
      this.currentHoveredCategoryIndex = index
      setTimeout(() => {
        if (this.categoryHovered && this.currentHoveredCategoryIndex === index) {
          setTimeout(() => {
            this.categoryActive = category
            this.categoryHoveredIndex = index
            this.categoriesDropdownShown = true
          }, 1)
        }
      }, 300)
    },

    hideDropdown () {
      this.categoryHoveredIndex = -1
      this.categoriesDropdownShown = false
      this.currentHoveredCategoryIndex = null

      setTimeout(() => {
        if (!this.categoriesDropdownShown) {
          this.categoryActive = null
        }
      }, 210)
    },

    onDropdownHide () {
      this.categoryHovered = false
      setTimeout(() => {
        this.hideDropdown()
      }, 20)
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/elements/header/header-categories";

</style>
