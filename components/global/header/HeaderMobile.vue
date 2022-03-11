<template>
  <div class="g-header-mobile">
    <div
      class="g-header-mobile-main container"
      :class="{
        'g-header-mobile-main--fixed': mobileMenuActive,
        'g-header-mobile-main--shadow': scrolled
      }"
    >
      <div class="g-header-mobile-main__left">
        <BurgerMenuToggle
          @input="$emit('set-mobile-menu-active', $event)"
          :value="mobileMenuActive"
        />
        <clink :to="{name: 'index'}" class="g-header-mobile__logo">
<!--          <img src="/images/header/Proximart.svg" alt="Proximart">-->
          <ProximartIcon />
        </clink>
      </div>

      <custom-input
        :placeholder="$t('header.placeholder.search')"
        type="text"
        v-model="searchQuery"
        class="g-header-mobile__search g-header-mobile__search--top"
        @focus="searchFocused = true"
        @blur="searchFocused = false"
      >
        <button>
          <MainSearchIcon />
        </button>

        <template v-slot:bottom>
          <ul
            class="g-header-mobile__search-dropdown"
            :class="{
                'g-header-mobile__search-dropdown--active': searchQuery.length > 0 && searchFocused,
                'g-header-mobile__search-dropdown--loading': searchLoading
              }"
          >
            <li v-if="searchLoading">
              <Loading />
            </li>
            <template v-else>
              <li v-for="(item, index) in searchResults" :key="index" @click="searchQuery = ''">
                <clink :to="`/product/${item[`slug__${$i18n.locale}`] || item.slug}`">
                  <span>{{ item[`name__${$i18n.locale}`] || item.name }}</span>
                </clink>
              </li>
            </template>
          </ul>
        </template>
      </custom-input>

      <div class="g-header-mobile-main__right">
        <clink to="/favorites" class="g-header-mobile__btn g-header-mobile__btn--like">
          <div class="g-header-mobile__btn-count" v-if="likedProductsCount">
            <span>{{ likedProductsCount }}</span>
          </div>
          <MainLikeIcon />
        </clink>
        <clink to="/cart" class="g-header-mobile__btn g-header-mobile__btn--cart">
          <div class="g-header-mobile__btn-count" v-if="cartProductsCount">
            <span>{{ cartProductsCount }}</span>
          </div>
          <MainShopCartIcon />
        </clink>
        <LangSelect v-if="showLangSelect" />
      </div>
    </div>

    <custom-input
      :placeholder="$t('header.placeholder.search')"
      type="text"
      v-model="searchQuery"
      class="g-header-mobile__search g-header-mobile__search--bottom"
      @focus="searchFocused = true"
      @blur="searchFocused = false"
      :class="{ 'g-header-mobile__search--fixed': mobileMenuActive }"
    >
      <button>
        <MainSearchIcon />
      </button>

      <template v-slot:bottom>
        <ul
          class="g-header-mobile__search-dropdown"
          :class="{
                'g-header-mobile__search-dropdown--active': searchQuery.length > 0 && searchFocused,
                'g-header-mobile__search-dropdown--loading': searchLoading
              }"
        >
          <li v-if="searchLoading">
            <Loading />
          </li>
          <template v-else>
            <li v-for="(item, index) in searchResults" :key="index" @click="searchQuery = ''">
              <clink :to="`/product/${item[`slug__${$i18n.locale}`] || item.slug}`">
                <span>{{ item[`name__${$i18n.locale}`] || item.name }}</span>
              </clink>
            </li>
          </template>
        </ul>
      </template>
    </custom-input>
  </div>
</template>

<script>
import {mapState} from "vuex";
import searchApi from "~/mixins/searchApi";

export default {
  name: "HeaderMobile",

  mixins: [searchApi],

  components: {
    Loading: () => import('~/components/elements/Loading'),
    BurgerMenuToggle: () => import('~/components/global/header/BurgerMenuToggle'),
    CustomInput: () => import('./CustomInput'),
    MainShopCartIcon: () => import('~/assets/icons/shopping-cart-main.svg?inline'),
    MainLikeIcon: () => import('~/assets/icons/heart-main.svg?inline'),
    MainSearchIcon: () => import('~/assets/icons/search.svg?inline'),
    ProximartIcon: () => import('~/assets/icons/proximart.svg?inline'),
    LangSelect: () => import('~/components/global/header/LangSelect')
  },

  props: {
    mobileMenuActive: {
      type: Boolean,
      default: false
    },
    showLangSelect: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      prevScrollY: 0,
      scrolled: false
    }
  },

  mounted () {
    if (process.client) {
      window.addEventListener('scroll', this.onScroll)
    }
  },

  computed: {
    ...mapState(['likedProductsCount', 'cartProductsCount'])
  },

  methods: {
    onScroll () {
      if (process.client) {
        this.scrolled = window.scrollY !== 0;
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
@import '~/assets/styles/elements/header/header-mobile';
</style>
