<template>
  <form class="cart-order-form" @submit.prevent="onOrder">
    <Loading v-if="loading" />

    <h2 class="g-title-medium" v-t="'Оформление заказа'" />
    <custom-input
      class="mb-10"
      v-model="name"
      name="name"
      :error="showErrors && formErrors.name"
      :placeholder="$t('Введите имя')"
    />
    <custom-input
      class="mb-10"
      v-model="phone"
      name="phone"
      :error="showErrors && formErrors.phone"
      :is-phone="true"
      :placeholder="$t('+994 00 000 00 00')"
    />
    <custom-input
      class="mb-10"
      v-model="address"
      name="address"
      :error="showErrors && formErrors.address"
      :placeholder="$t('Адрес')"
    />
    <div class="cart-order-form__input-group mb-20">
      <custom-input
        class="cart-order-form__input-group-item mr-10"
        v-model="entrance"
        name="entrance"
        :error="showErrors && formErrors.entrance"
        :placeholder="$t('Подъезд')"
      />
      <custom-input
        class="cart-order-form__input-group-item"
        v-model="floor"
        name="floor"
        :error="showErrors && formErrors.floor"
        :placeholder="$t('Этаж')"
      />
    </div>
    <h3 class="g-title--small mb-10" v-t="'Способ оплаты'" />
    <div class="cart-order-form__input-group mb-30">
      <checkbox
        class="cart-order-form__input-group-item"
        v-for="(item, index) in paymentMethods"
        :key="index"
        :is-radio="true"
        :label="$t(item.label)"
        :selected="paymentMethod.slug === item.slug"
        @clicked="paymentMethod = item"
      />
    </div>
    <LinesIcon class="mb-20 w-100" />
    <div class="cart-order-form__double cart-order-form__double--large mb-20">
      <span class="cart-order-form__double-item" v-t="'Итого'" />
      <span class="cart-order-form__double-item">{{ orderInfo.totalAmount }} AZN</span>
    </div>
    <div class="cart-order-form__double mb-20">
      <span class="cart-order-form__double-item">{{ $t('Товары') }}, {{ orderInfo.itemCount }} {{ $t('шт.') }}</span>
      <span class="cart-order-form__double-item">{{ orderInfo.totalBeforeDiscount }} AZN</span>
    </div>
    <div class="cart-order-form__double mb-30">
      <span class="cart-order-form__double-item" v-t="'Скидка'" />
      <span class="cart-order-form__double-item">{{ orderInfo.discountAmount }} AZN</span>
    </div>
    <checkbox
      class="mb-30"
      :label="
        $t('Согласен с условиями <a href=\'/rules\' target=\'_blank\'>Правил пользования торговой площадкой</a>')
      "
      :selected="agreedWithTerms"
      :error="showErrors && formErrors.agreedWithTerms"
      @clicked="agreedWithTerms = !agreedWithTerms"
    />
    <button class="cart-order-form__btn" v-t="'Оформить заказ'" />
  </form>
</template>

<script>
import {mapActions, mapMutations} from "vuex";

export default {
  name: "OrderForm",

  components: {
    Checkbox: () => import('~/components/elements/Checkbox'),
    Loading: () => import('~/components/elements/Loading'),
    CustomInput: () => import('~/components/elements/CustomInput'),
    LinesIcon: () => import('~/assets/icons/cart-order-lines.svg?inline')
  },

  props: {
    products: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    const paymentMethods = [
      {
        slug: 'card',
        label: 'Банковская карта'
      },
      {
        slug: 'cash',
        label: 'Наличные'
      }
    ]

    return {
      paymentMethods,

      showErrors: false,
      loading: false,

      name: '',
      phone: '',
      address: '',
      entrance: '',
      floor: '',
      paymentMethod: paymentMethods[0],
      agreedWithTerms: true
    }
  },

  computed: {
    orderInfo () {
      const products = Object.values(this.products).filter(p => p.stock > 0 && p.orderInfo.count && (p.devices?.length ? p.devices.findIndex(d => d.id === p.orderInfo.variantId) !== -1 : true)),
        totalBeforeDiscount = products.map(p => p.orderInfo.count * parseInt(p.price)).reduce((a, b) => a + b, 0),
        discountAmount = products
          .map(p => p.orderInfo.count * Math.round(parseInt(p.price) - parseInt(p.price) * (100 - p.discount) / 100))
          .reduce((a, b) => a + b, 0)

      return {
        totalAmount: totalBeforeDiscount - discountAmount,
        totalBeforeDiscount,
        itemCount: products.map(p => p.orderInfo.count).reduce((a, b) => a + b, 0),
        discountAmount
      }
    },

    formErrors () {
      return {
        name: this.name.trim() === '',
        phone: this.phone.trim().length < 17,
        address: this.address.trim() === '',
        entrance: this.entrance.trim() === '',
        floor: this.floor.trim() === '',
        agreedWithTerms: !this.agreedWithTerms
      }
    }
  },

  methods: {
    ...mapActions('orders', ['placeOrder']),
    ...mapMutations(['emptyCart']),

    async onOrder () {
      if (!this.loading) {
        if (Object.values(this.formErrors).some(e => e === true)) {
          this.showErrors = true
          return
        }

        this.loading = true
        await this.placeOrder({
          name: this.name,
          phone: this.phone,
          address: this.address,
          entrance: this.entrance,
          floor: this.floor,
          order_type: 'order',
          by_with: this.paymentMethod.slug,
          products: Object.values(this.products).map(p => ({
            id: p.id,
            count: p.orderInfo.count,
            color_title: p.colors?.find(c => c.color?.id === p.orderInfo.colorId)?.color?.name,
            devices: p.devices?.find(d => d.id === p.orderInfo.variantId)?.name
          }))
        })
          .then(() => {
            // this.$toasted.success(this.$i18n.t('Ваш заказ был успешно оформлен').toString())
            this.$emit('show-success')
            this.emptyCart()
          })
          .catch(() => {
            this.$toasted.error(this.$i18n.t('Произошла ошибка при попытке оформить заказ').toString())
          })
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/cart/order-form';
</style>
