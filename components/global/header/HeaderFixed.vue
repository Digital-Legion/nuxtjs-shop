<template>
  <div class="g-header-fixed" :class="{'g-header-fixed--hidden': hidden}">
    <div class="g-header-fixed__content">
      <div class="container">
        <ul class="g-header-fixed__nav">
          <li
            class="g-header-fixed__nav-item"
            v-for="(item, index) in (cascaderCategories || [])"
            :key="index"
          >
            <clink
              :to="`/catalog?cat=${item.id}`"
            >
              {{ $i18n.locale === $i18n.fallbackLocale ? item.name : item[`name__${$i18n.locale}`] }}
            </clink>
          </li>
        </ul>
        <ul class="g-header-fixed__buttons">
          <li class="g-header-fixed__buttons-item">
            <a href="tel:+994516600060" class="phone">
              <MenuPhoneIcon />
              <span>(51) 660 00 60</span>
            </a>
          </li>
          <li class="g-header-fixed__buttons-item">
            <button
              class="button"
              :class="{active: searchOpen}"
              @click="searchOpen = !searchOpen"
            >
              <MainSearchIcon />
              <span>{{ $t('Поиск') }}</span>
            </button>
          </li>
<!--          <li class="g-header-fixed__buttons-item">-->
<!--            <button class="button">-->
<!--              <MainManIcon />-->
<!--              <span>{{ $t('Войти') }}</span>-->
<!--            </button>-->
<!--          </li>-->
          <li class="g-header-fixed__buttons-item">
            <clink to="/cart" class="button">
              <div class="button-count" v-if="cartProductsCount">
                <span>{{ cartProductsCount }}</span>
              </div>
              <MainCartIcon />
              <span>{{ $t('Корзина') }}</span>
            </clink>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="g-header-fixed__search"
      :class="{'g-header-fixed__search--active': searchOpen}"
    >
      <input type="text" v-model="searchQuery" :placeholder="$t('Поиск')">
      <div
        class="g-header-fixed__search-dropdown"
        :class="{
          'g-header-fixed__search-dropdown--loading': searchLoading,
          'g-header-fixed__search-dropdown--no-query': searchQuery.trim() === ''
        }"
      >
        <ul class="container">
          <li v-if="searchLoading">
            <Loading />
          </li>
          <li v-for="(item, index) in searchResults" :key="index" @click="searchQuery = ''; searchOpen = false">
            <clink :to="`/product/${item[`slug__${$i18n.locale}`] || item.slug}`">
              <span>{{ item[`name__${$i18n.locale}`] || item.name }}</span>
            </clink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import searchApi from "~/mixins/searchApi";

export default {
  name: "HeaderFixed",

  mixins: [searchApi],

  components: {
    Loading: () => import('~/components/elements/Loading'),
    MenuPhoneIcon: () => import('~/assets/icons/phone-menu.svg?inline'),
    MainSearchIcon: () => import('~/assets/icons/search.svg?inline'),
    // MainManIcon: () => import('~/assets/icons/man_icon-main.svg?inline'),
    MainCartIcon: () => import('~/assets/icons/shopping-cart-main.svg?inline')
  },

  data () {
    return {
      hidden: false,
      searchOpen: false,
      prevScrollY: 0
    }
  },

  mounted () {
    if (process.client) {
      window.addEventListener('scroll', this.onScroll)
    }
  },

  computed: {
    ...mapState('categories', ['cascaderCategories']),
    ...mapState(['cartProductsCount'])
  },

  methods: {
    onScroll () {
      if (process.client) {
        this.searchOpen = false;
        this.hidden = window.scrollY < this.prevScrollY;
        this.prevScrollY = window.scrollY;
      }
    }
  },

  beforeDestroy() {
    if (process.client) {
      window.removeEventListener('scroll', this.onScroll)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/header/header-fixed';
</style>
