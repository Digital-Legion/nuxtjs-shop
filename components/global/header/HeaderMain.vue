<template>
  <div class="header-main">
    <div class="container">
      <div class="header-main__inner">
        <clink :to="{name: 'index'}" class="header-main__logo">
<!--          <img src="/images/header/Proximart.svg" alt="Proximart">-->
          <ProximartIcon />
        </clink>
        <custom-input
          :placeholder="$t('header.placeholder.search')"
          type="text"
          name="search"
          v-model="searchQuery"
          class="header-main__input"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        >
          <button>
            <MainSearchIcon />
          </button>

          <template v-slot:bottom>
            <ul
              class="header-main__input-dropdown"
              :class="{
                'header-main__input-dropdown--active': searchQuery.length > 0 && searchFocused,
                'header-main__input-dropdown--loading': searchLoading
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
        <div class="header-main__wrapper">
          <clink to="/favorites" class="header-main__button header-main__like">
            <div class="header-main__button-count" v-if="likedProductsCount">
              <span>{{ likedProductsCount }}</span>
            </div>
            <MainLikeIcon />
            <span>{{ $t('header.account.like') }}</span>
          </clink>
<!--          <a href="#" @click.prevent class="header-main__button header-main__login">-->
<!--            <MainManIcon />-->
<!--            <span>{{ $t('header.account.login') }}</span>-->
<!--          </a>-->
          <clink to="/cart" class="header-main__button header-main__bucket">
            <div class="header-main__button-count" v-if="cartProductsCount">
              <span>{{ cartProductsCount }}</span>
            </div>
            <MainShopCartIcon />
            <span>{{ $t('header.account.basket') }}</span>
          </clink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import searchApi from "~/mixins/searchApi";

export default {
  name: "HeaderMain",

  mixins: [searchApi],

  components: {
    CustomInput: () => import('./CustomInput'),
    Loading: () => import('~/components/elements/Loading'),
    ProximartIcon: () => import('~/assets/icons/proximart.svg?inline'),
    MainShopCartIcon: () => import('~/assets/icons/shopping-cart-main.svg?inline'),
    MainLikeIcon: () => import('~/assets/icons/heart-main.svg?inline'),
    MainSearchIcon: () => import('~/assets/icons/search.svg?inline'),
  },

  computed: {
    ...mapState(['likedProductsCount', 'cartProductsCount'])
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/elements/header/header-main";
</style>
