<template>
  <nav
    class="g-header-mobile-categories"
    :class="{'g-header-mobile-categories--active': mobileMenuActive}"
  >
    <div
      v-body-scroll-lock="mobileMenuActive && !level1Shown && !level2Shown"
      class="g-header-mobile-categories__level g-header-mobile-categories__level--cards"
      :class="[
        mobileMenuActive
          ? 'g-header-mobile-categories__level--active'
          : 'g-header-mobile-categories__level--gone'
      ]"
    >
      <ul class="container">
        <li
          class="g-header-mobile-categories__item"
          v-for="(item, index) in (cascaderCategories || [])"
          :key="index"
          @click="onLevelSelect(1, item)"
        >
          <button class="content">
            <PhoneIcon v-if="item.slug === 'telefony'" />
            <NotebookIcon v-if="item.slug === 'noutbuki'" />
            <HeadPhoneIcon v-if="item.slug === 'audio'" />
            <AdaptIcon v-if="item.slug === 'aksessuary'" />
            <LoadIcon v-if="item.slug === 'bytovaya-tehnika'" />
            <PhotoIcon v-if="item.slug === 'foto-i-video'" />
            <SkuterIcon v-if="item.slug === 'raznoe'" />
            <span>{{ item[`name__${$i18n.locale}`] || item.name }}</span>
          </button>
        </li>
        <li
          class="g-header-mobile-categories__item"
        >
          <clink to="/catalog?discat=1" class="content">
            <SaleIcon />
            <span v-t="'Скидки'" />
          </clink>
        </li>
      </ul>
      <LangSelectButtons />
    </div>

    <HeaderMobileCategoriesList
      :level="1"
      :product-count="productCount"
      :level-select="level1Select"
      :level-shown="level1Shown"
      @level-select="onLevelSelect($event.level, $event.item)"
      @level-select-remove="onLevelSelectRemove($event)"
      @show-all="onShowAll"
    />

    <HeaderMobileCategoriesList
      :level="2"
      :product-count="productCount"
      :parent-level-select="level1Select"
      :level-select="level2Select"
      :level-shown="level2Shown"
      @level-select="onLevelSelect(null, $event)"
      @level-select-remove="onLevelSelectRemove($event)"
      @show-all="onShowAll"
    />
  </nav>
</template>

<script>
import {mapState} from "vuex";

const countProducts = cat => {
  let count = 0
  if (cat?.children) {
    cat.children.forEach(c => {
      count += countProducts(c)
    })
  }
  count += cat.productCount
  return count
}

export default {
  name: "HeaderMobileCategories",

  components: {
    PhoneIcon: () => import('~/assets/icons/categories-phone.svg?inline'),
    NotebookIcon: () => import('~/assets/icons/categories-notebook.svg?inline'),
    HeadPhoneIcon: () => import('~/assets/icons/categories-headphones.svg?inline'),
    AdaptIcon: () => import('~/assets/icons/categories-adapt.svg?inline'),
    LoadIcon: () => import('~/assets/icons/categories-load.svg?inline'),
    PhotoIcon: () => import('~/assets/icons/categories-photo.svg?inline'),
    SkuterIcon: () => import('~/assets/icons/categories-skuter.svg?inline'),
    SaleIcon: () => import('~/assets/icons/categories-sale.svg?inline'),
    LangSelectButtons: () => import('~/components/global/header/LangSelectButtons'),
    HeaderMobileCategoriesList: () => import('~/components/global/header/HeaderMobileCategoriesList')
  },

  props: {
    mobileMenuActive: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      level1Select: null,
      level2Select: null,

      level1Shown: false,
      level2Shown: false
    }
  },

  watch: {
    mobileMenuActive () {
      if (!this.mobileMenuActive) {
        this.onLevelSelectRemove(2)
        this.onLevelSelectRemove(1)
      }
    },

    '$route.path' () {
      this.$emit('set-mobile-menu-active', false)
    }
  },

  computed: {
    ...mapState('categories', ['cascaderCategories']),

    productCount () {
      let productCount = 0
      if (this.level2Select) {
        productCount = countProducts(this.level2Select)
      } else if (this.level1Select) {
        productCount = countProducts(this.level1Select)
      }
      return productCount
    }
  },

  methods: {
    onLevelSelect (level, item) {
      if (level) {
        this[`level${level}Select`] = item
        this[`level${level}Shown`] = true
      } else {
        this.onShowAll(item?.item)
      }
    },

    onLevelSelectRemove (level) {
      this[`level${level}Shown`] = false
      setTimeout(() => {
        this.$nextTick(() => {
          this[`level${level}Select`] = null
        })
      }, 210)
    },

    onShowAll (item) {
      this.$router.push({
        path: '/catalog',
        query: {
          cat: item?.id
        }
      })
      this.$emit('set-mobile-menu-active', false)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/header/header-mobile-categories';
</style>
