<template>
  <main class="cart-page">
    <div class="container">
      <breadcrumbs :breadcrumbs="breadcrumbs" />
      <template v-if="showSuccess">
        <EmptyLayout
          :title="$t('Ваш заказ успешно оплачен!')"
          :description="$t('Оператор свяжется с вами в ближайшее время для обсуждения деталей доставки')"
          :go-to-text="'Продолжить покупки'"
          go-to-link="/"
        >
          <template v-slot:image-side>
            <SuccessIcon class="empty-layout__image" />
          </template>
        </EmptyLayout>
      </template>
      <template v-else-if="!formattedProductValues.length">
        <EmptyLayout
          :title="$t('В корзине пока ничего нет')"
          :description="$t('Начните с главной страницы или воспользуйтесь поиском, чтобы найти что-то конкретное')"
          :go-to-text="'Перейти в каталог!'"
        >
          <template v-slot:image-side>
            <EmptyIcon class="empty-layout__image" />
          </template>
        </EmptyLayout>
      </template>
      <template v-else>
        <h1 class="g-title" v-t="'Корзина'" />
        <div class="cart-page__content">
          <div
            class="cart-page__content-side"
            :class="[mobileOrderFormShown ? 'cart-page__content-side--past' : 'cart-page__content-side--active']"
            id="order-products-side"
          >
            <product-increment-card
              v-for="item in Object.values(formattedProducts)"
              :key="item.slug"
              :product="item"
              @remove="onRemove(item)"
              @change-count="onChangeCount(item, $event)"
            />
            <button class="cart-order-form__btn cart-page__go-to-order" @click="onGoToForm">
              <span>{{ $t('Перейти к офорлению') }}</span>
              <ArrowIcon />
            </button>
          </div>
          <div class="cart-page__content-side" :class="{'cart-page__content-side--active' : mobileOrderFormShown}" id="order-form-side">
            <client-only>
              <order-form :products="formattedProducts" @show-success="showSuccess = true" />
              <button class="cart-page__go-back" @click="onGoBack">
                <ArrowIcon />
                <span>{{ $t('Назад') }}</span>
              </button>
            </client-only>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "cart",

  components: {
    EmptyLayout: () => import('~/containers/elements/EmptyLayout'),
    EmptyIcon: () => import('~/assets/icons/two-carts.svg?inline'),
    SuccessIcon: () => import('~/assets/icons/two-ticks.svg?inline'),
    ArrowIcon: () => import('~/assets/icons/arrow-left.svg?inline'),
    OrderForm: () => import('~/components/pages/cart/OrderForm'),
    Breadcrumbs: () => import('~/components/elements/Breadcrumbs'),
    ProductIncrementCard: () => import('~/components/pages/cart/ProductIncrementCard')
  },

  data() {
    return {
      formattedProducts: {},

      mobileOrderFormShown: false,
      showSuccess: false
    }
  },

  asyncData ({ store }) {
    return {
      formattedProducts: JSON.parse(JSON.stringify(store.state.cartProducts))
    }
  },

  computed: {
    formattedProductValues () {
      return Object.values(this.formattedProducts)
    },

    breadcrumbs() {
      return [
        {
          title: this.$t('Главная'),
          path: '/'
        },
        {
          title: this.$t('Корзина')
        }
      ]
    }
  },

  methods: {
    ...mapMutations(['onCartRemove', 'onCartOrderInfoUpdate']),

    onGoToForm () {
      this.mobileOrderFormShown = true
      setTimeout(() => {
        this.$scrollTo('#order-form-side', { offset: -160 })
      }, 200)
    },

    onGoBack () {
      this.mobileOrderFormShown = false
      setTimeout(() => {
        this.$scrollTo('#order-products-side', { offset: -160 })
      }, 200)
    },

    onRemove (product) {
      const formattedProducts = Object.assign({}, this.formattedProducts)
      delete formattedProducts[product.slug]
      this.$set(this, 'formattedProducts', formattedProducts)
      this.onCartRemove(product)
    },

    onChangeCount (item, count) {
      this.$set(this.formattedProducts[item.slug].orderInfo, 'count', count)
      this.onCartOrderInfoUpdate({
        product: item,
        orderInfo: JSON.parse(JSON.stringify(this.formattedProducts[item.slug].orderInfo))
      })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/cart/index';
</style>
