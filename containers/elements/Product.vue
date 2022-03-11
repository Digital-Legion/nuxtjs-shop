<template>
  <div class="g-product">
    <h1 class="g-product__title" id="breadcrumbs">
      <span class="g-product__title-text">{{ formattedProduct.title }}</span>
      <span v-if="formattedProduct.hit" class="g-product__title-badge g-product__title-badge--hit" v-t="'Хит продаж'"/>
      <span v-if="formattedProduct.discount" class="g-product__title-badge" :class="[`g-badge--${discountColor}`]">{{
          formattedProduct.discount
        }}%</span>
    </h1>
    <div class="g-product__content">
      <client-only>
        <product-slider
          @open-fancy="onOpenFancy"
          :zoom-disabled="watchResizeValues.mobile"
          :show-small-slider="!watchResizeValues.mobile"
          :images="formattedProduct.images && currentColor.hex ? formattedProduct.images[currentColor.hex] : []"
          :color="currentColor ? currentColor.hex : ''"
          class="g-product__content-block g-product__content-block--left g-product__content-block--1 g-product__slider"
        />
      </client-only>
      <div class="g-product__content-block g-product__content-block--left">
        <template v-if="formattedProduct.description">
          <div class="g-product__subtitle-wrapper">
            <h2 class="g-product__subtitle">{{ $t('Описание') }}</h2>
            <div class="g-product__sizes">
              <TTIcon class="tt-icon" />
              <button @click="onChangeTextSize(false)">
                <MinusIcon />
              </button>
              <button @click="onChangeTextSize(true)">
                <PlusIcon />
              </button>
            </div>
          </div>
          <text-accordion
            id="product-description"
            :scroll-to-top-on-hide="true"
            :button-text-size="textSize"
            :accordion-max-height="300"
            class="g-product__description"
            :style="{fontSize: `${textSize}px`}"
          >
            {{ formattedProduct.description }}
          </text-accordion>
        </template>
      </div>
      <slot name="left-content"/>
      <div
        class="g-product__content-block g-product__content-block--right g-product__content-block--stretch g-product__content-block--2 g-product__content-block--one">
        <div class="g-product__price-row">
          <div class="g-product__price-wrapper" @click="infoShown = true" @mouseleave="infoShown = false">
            <div class="g-product__price">
              {{ price }} AZN
            </div>
            <div class="g-product__price-stroke-through" v-if="formattedProduct.discount">{{ formattedProduct.price }} AZN</div>
            <popover v-if="formattedProduct.discount" class="g-product__info-wrapper" :show="infoShown">
              <template #hover-content>
                <div class="g-product__info-icon"/>
              </template>

              <div class="g-product__info-item g-product__info-item--success">
                <span class="key" v-t="'Экономия'"/>
                <span class="value">{{ (formattedProduct.price - (formattedProduct.price * (100 - formattedProduct.discount) / 100)).toFixed(0) }} AZN</span>
              </div>
              <div class="g-product__info-item">
                <span class="key">{{ $t('Скидка') }} {{ formattedProduct.discount }}%</span>
                <span class="value">{{ (formattedProduct.price * (100 - formattedProduct.discount) / 100).toFixed(0) }} AZN</span>
              </div>
  <!--            <div class="g-product__info-item">-->
  <!--              <span class="key" v-t="'Промокод 40%'"/>-->
  <!--              <span class="value">$23</span>-->
  <!--            </div>-->
            </popover>
          </div>
          <incrementer v-model="itemCount" @input="$emit('set-count', $event)" :min-value="formattedProduct.stock ? 1 : 0" :max-value="formattedProduct.stock" />
        </div>
        <div class="g-product__btn-row">
          <template v-if="formattedProduct.stock > 0">
<!--            <Popover :no-hover="true" :show="showBuyErrors" class="g-product__buy-error-popover">-->
<!--              <template v-slot:hover-content>-->
                <button class="g-product__btn g-product__buy" @click="onCart">
                  <BuyIcon/>
                  <span>{{ inCart ? $t('Убрать с корзины') : $t('В корзину!') }}</span>
                </button>
<!--              </template>-->
<!--              <template>-->
<!--                {{ $t('Не выбран') }} {{ Object.values(buyErrors).map(e => $t(e.toString())).join(', ') }}-->
<!--              </template>-->
<!--            </Popover>-->
            <button class="g-product__btn g-product__buy-now" @click="onQuickBuy">
              <BuyNowIcon/>
              <span>{{ $t('Купить в 1 клик') }}</span>
            </button>
          </template>
          <template v-else>
            <button class="g-product__btn g-product__buy" @click="onPreorder">
              <BuyIcon/>
              <span>{{ $t('Предзаказ') }}</span>
            </button>
          </template>
          <button class="g-product__btn g-product__like" :class="{active: isLiked}" @click="onLike">
            <LikeIcon/>
          </button>
        </div>
        <div class="g-product__stock">
          <div class="g-product__stock-color"
               :class="{'g-product__stock-color--in-stock': formattedProduct.stock > 0, 'g-product__stock-color--not-in-stock': formattedProduct.stock <= 0}"/>
          <span v-if="formattedProduct.stock > 0">{{ $t('Есть на складе') }} ({{ formattedProduct.stock }})</span>
          <span v-else>{{ $t('Нет на складе :(') }}</span>
        </div>
        <template v-if="formattedProduct.credit">
          <h2 class="g-product__subsubtitle mb-10i">{{ $t('Кредитный калькулятор') }}</h2>
          <credit-calculator
            class="mb-40"
            @set-month="creditMonth = $event"
            :chosen-month="creditMonth"
            :initial-deposit="0"
            :monthly-pay="monthlyPay"
          />
        </template>
        <template v-if="formattedProduct.variants">
          <h2 class="g-product__subsubtitle">{{ $t('Варианты') }}</h2>
          <slidable-content class="g-product__variants-wrapper">
            <div class="g-product__variants">
              <div
                class="g-product__variants-item"
                :class="{
                  'g-product__variants-item--active': variant === item.id,
                  // 'g-product__variants-item--error': showBuyErrors && showBuyErrors.variant
                }"
                v-for="(item, i) in formattedProduct.variants"
                :key="i"
                @click="onClickVariant(item.id)"
              >
                {{ item.name }}
              </div>
            </div>
          </slidable-content>
        </template>
        <h2 class="g-product__subsubtitle">{{ $t('Цвет') }}</h2>
        <slidable-content class="g-product__colors-wrapper">
          <div class="g-colors">
            <div
              class="g-colors-item"
              :class="{
                'g-colors-item--active': color ? color.id === item.id : false,
              }"
              v-for="(item, i) in formattedProduct.colors"
              :key="i"
              :style="{ background: `#${item.hex}` }"
              @click="onClickColor(item)"
            />
          </div>
        </slidable-content>
        <div class="g-product__infos">
          <div class="g-product__square-info">
            <div class="g-product__square-info-item">
              <DeliveryVanIcon />
              <span v-t="'Бесплатная доставка'" />
            </div>
            <div class="g-product__square-info-item">
              <VisaOutlinedIcon />
              <span>-5% {{ $t('с Visa') }}</span>
            </div>
          </div>
          <div class="g-product__bottom-info">
            <div class="g-product__bottom-info-item">
              <CardsIcon />
              <span v-t="'Оплата картами'" />
            </div>
            <div class="g-product__bottom-info-item">
              <MacProductPageIcon />
              <span v-t="'Онлайн оплата'" />
            </div>
            <div class="g-product__bottom-info-item">
              <DoorDeliveryIcon />
              <span v-html="$t('Оплата у двери').toString().replace(' ', '<br>')" />
            </div>
            <div class="g-product__bottom-info-item">
              <TamCardIcon />
              <span v-t="'Оплата TamKart-ой'" />
            </div>
          </div>
        </div>
      </div>
      <slot name="right-content"/>
    </div>
    <slot name="bottom-content"/>

    <fancybox
      @close="fancyOpenInitialIndex = false"
      :visible="fancyOpenInitialIndex !== false"
      :initial-index="fancyOpenInitialIndex || 0"
      :images="formattedProduct.images && currentColor.hex ? formattedProduct.images[currentColor.hex] : []"
    />
  </div>
</template>

<script>
import watchResize from "~/mixins/watchResize";
import {mapMutations, mapState} from "vuex";

export default {
  name: "Product",

  mixins: [watchResize],

  components: {
    TextAccordion: () => import('./TextAccordion'),
    Fancybox: () => import('./Fancybox'),
    Popover: () => import('~/components/elements/Popover'),
    SlidableContent: () => import('./SlidableContent'),
    Incrementer: () => import('~/components/elements/Incrementer'),
    CreditCalculator: () => import('~/components/elements/CreditCalculator'),
    ProductSlider: () => import('~/components/elements/ProductSlider'),
    BuyIcon: () => import('~/assets/icons/cart.svg?inline'),
    BuyNowIcon: () => import('~/assets/icons/cursor.svg?inline'),
    LikeIcon: () => import('~/assets/icons/heart.svg?inline'),
    TTIcon: () => import('~/assets/icons/tt.svg?inline'),
    MinusIcon: () => import('~/assets/icons/minus-outlined.svg?inline'),
    PlusIcon: () => import('~/assets/icons/plus-outlined.svg?inline'),
    DeliveryVanIcon: () => import('~/assets/icons/delivery-van.svg?inline'),
    VisaOutlinedIcon: () => import('~/assets/icons/visa-outlined.svg?inline'),
    CardsIcon: () => import('~/assets/icons/cards.svg?inline'),
    MacProductPageIcon: () => import('~/assets/icons/mac-product-page.svg?inline'),
    DoorDeliveryIcon: () => import('~/assets/icons/door-delivery.svg?inline'),
    TamCardIcon: () => import('~/assets/icons/tam-card.svg?inline')
  },

  props: {
    product: {
      type: Object,
      default: () => {
      }
    }
  },

  data() {
    return {
      itemCount: 1,
      variant: '',
      color: null,
      isLiked: false,
      inCart: false,
      textSize: null,
      minTextSize: 12,
      maxTextSize: 20,

      // showBuyErrors: false,

      fancyOpenInitialIndex: false,
      infoShown: false,

      creditMonth: 12,

      watchResizeThresholds: {
        mobile: 600
      }
    }
  },

  mounted () {
    this.isLiked = this.likedProducts?.[this.product?.slug] || false
    this.inCart = !!this.cartProducts?.[this.product?.slug] || false

    if (process.client) {
      this.textSize = localStorage.getItem('text-size') || 12
    }
  },

  computed: {
    ...mapState(['likedProducts', 'cartProducts']),

    currentColor () {
      return this.color || this.formattedProduct.colors?.[0] || {}
    },

    currentVariant () {
      return this.variant || this.formattedProduct.variants?.[0]?.id || -1
    },

    price () {
      return this.formattedProduct.price ? (this.formattedProduct.price * (100 - this.formattedProduct.discount) / 100).toFixed(0) : 0
    },

    monthlyPay () {
      return parseFloat((this.price / this.creditMonth).toFixed(2))
    },

    discountColor () {
      if (this.product?.discount <= 10) return 'yellow'
      else if (this.product?.discount <= 20) return 'orange'
      else if (this.product?.discount <= 30) return 'red-orange'
      else return 'red'
    },

    formattedProduct () {
      if (this.product) {
        const images = {}

        if (this.product.colors) {
          this.product.colors.forEach(c => {
            images[c.color?.hex] = c.images.map(i => ({
              src: i.url,
              alt: i.alt
            }))
          })
        }

        return {
          credit: this.product.credit,
          variants: this.product.devices?.length ? this.product.devices : null,
          title: this.product[`name__${this.$i18n.locale}`] || this.product.name || '',
          discount: this.product.discount || 0,
          hit: this.product.hit,
          stock: this.product.stock,
          colors: this.product.colors.map(c => ({
            id: c.color?.id,
            hex: c.color?.hex
          })),
          images,
          price: this.product.price ? parseFloat(this.product.price) : 0,
          description: this.product[`description__${this.$i18n.locale}`] || this.product.description || ''
        }
      }
      return {}
    },

    // buyErrors () {
    //   const errors = {}
    //
    //   // if (this.formattedProduct?.colors?.length && !this.color)
    //   //   errors.color = 'цвет'
    //
    //   if (this.formattedProduct?.variants?.length && !this.variant)
    //     errors.variant = 'вариант'
    //
    //   return errors
    // }
  },

  methods: {
    ...mapMutations(['onProductLike', 'onCartAdd', 'onCartRemove', 'showPreorderModal', 'showQuickBuyModal']),

    onLike() {
      this.onProductLike(this.product)
      this.isLiked = !this.isLiked
    },

    onChangeTextSize (toIncrease = true) {
      let textSize = !isNaN(this.textSize) ? parseInt(this.textSize || '12') : 12
      if ((textSize - 1 >= this.minTextSize && !toIncrease) || (toIncrease && textSize + 1 <= this.maxTextSize))
        textSize += 1 * (toIncrease ? 1 : -1)
      localStorage.setItem('text-size', textSize.toString())
      this.textSize = textSize
    },

    onCart () {
      // if (Object.values(this.buyErrors).length) {
      //   this.showBuyErrors = true
      //   return
      // }

      if (!this.cartProducts[this.product?.slug]) {
        const orderInfo = {
          count: this.itemCount,
          colorId: this.currentColor.id
        }

        if (this.formattedProduct?.variants?.length)
          orderInfo.variantId = this.currentVariant

        this.onCartAdd({
          product: this.product,
          orderInfo
        })
        this.inCart = !!this.cartProducts?.[this.product?.slug] || false
      } else {
        this.onCartRemove(this.product)
        this.inCart = !!this.cartProducts?.[this.product?.slug] || false
      }
    },

    onQuickBuy () {
      this.showQuickBuyModal({ product: this.product, colorId: this.currentColor.id })
    },

    onPreorder () {
      this.showPreorderModal({ product: this.product, colorId: this.currentColor.id })
    },

    onClickVariant (id) {
      this.showBuyErrors = false
      this.variant = id
    },

    onClickColor(color) {
      this.showBuyErrors = false
      if (window.innerWidth <= 600)
        this.$scrollTo('#breadcrumbs', {
          offset: -100
        })
      this.$set(this, 'color', color)
    },

    onOpenFancy (index) {
      this.fancyOpenInitialIndex = index
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/product';
</style>
