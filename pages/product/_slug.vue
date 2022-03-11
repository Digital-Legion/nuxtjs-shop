<template>
  <main class="product-page">
<!--    <loading-->
<!--      :active.sync="fetchingProduct"-->
<!--      :can-cancel="false"-->
<!--      :is-full-page="true"-->
<!--      :lock-scroll="true"-->
<!--      :opacity=".98"-->
<!--      blur="12px"-->
<!--      :z-index="9998"-->
<!--    />-->

    <div class="container">
      <breadcrumbs class="product-page__breadcrumbs" :breadcrumbs="breadcrumbs" />
      <Product :product="product" class="product-page__product" @set-count="count = $event">
        <template v-slot:left-content>
          <div class="g-product__content-block product-page__parameters g-product__content-block--left" v-if="parameters">
            <h3 class="g-product__subsubtitle">{{ $t('Дополнительная информация') }}</h3>
            <parameters :data="parameters" id="product-parameters" />
          </div>
        </template>
      </Product>
    </div>

    <videos v-if="videos" class="product-section--dark" :videos="videos" />
    <MoreProductsSlider
      v-if="similarProducts"
      :products="similarProducts"
      slider-key="similar-slider-0"
    />

    <ProductModal />
    <QuickBuyModal :count="count" />
    <VideoModal />
    <PreorderModal :count="count" />
  </main>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ProductPage",

  components: {
    QuickBuyModal: () => import('~/containers/elements/QuickBuyModal'),
    PreorderModal: () => import('~/containers/elements/PreorderModal'),
    ProductModal: () => import('~/containers/elements/ProductModal'),
    VideoModal: () => import('~/containers/elements/VideoModal'),
    MoreProductsSlider: () => import('~/containers/elements/MoreProductsSlider'),
    Videos: () => import('~/containers/pages/product/Videos'),
    Product: () => import('~/containers/elements/Product'),
    Breadcrumbs: () => import('~/components/elements/Breadcrumbs'),
    Parameters: () => import('~/components/elements/Parameters')
  },

  head () {
    return this.meta
  },

  data () {
    return {
      // fetchingProduct: true,
      product: null,
      count: 1,
      similarProducts: null
    }
  },

  async asyncData ({ store, params, redirect }) {
    let product, similarProducts
    await new Promise((resolve, reject) => {
      store.dispatch('productPage/fetchProduct', params.slug)
        .then(async res => {
          if (res.data) {
            product = res.data

            if (product.category) {
              await store.dispatch('productPage/fetchSimilarProducts', {
                  page: 1,
                  catId: product.category.id,
                  productId: product.id
                })
                .then(res => {
                  if (res.data?.items?.length) {
                    similarProducts = res.data.items
                  }
                })
                .catch(e => {
                  console.error(e)
                })
            }

            resolve()
          } else {
            reject('no-product')
          }
        })
      })
      .catch(() => {
        if (this?.$toasted)
          this.$toasted.error(this.$t('Продукт не был найден').toString())
        redirect('/')?.catch(() => {})
      })

    return {
      product,
      similarProducts
    }
  },

  computed: {
    productSlug () {
      return this.$route.params.slug || ''
    },

    parameters () {
      const param = this.$i18n.locale === this.$i18n.fallbackLocale ? 'value' : `value__${this.$i18n.locale}`
      return this.product?.parameters?.filter(p => p[param]).length ? (
        this.product?.parameters
      ) : null
    },

    videos () {
      return (
        this.product?.youtube?.filter(v => v.url && v.url.trim() !== '')?.length
          ? this.product.youtube
          : null
      )
    },

    breadcrumbs () {
      if (this.product && this.product.category) {
        const breadcrumbs = [
          {
            title: this.$t('Главная'),
            path: '/'
          },
          {
            title: this.$t('Каталог'),
            path: '/catalog'
          }
        ]

        const addCategories = (cat) => {
          if (cat.parent) {
            addCategories(cat.parent)
          }
          breadcrumbs.push({
            title: cat[`name__${this.$i18n.locale}`] || cat.name || '',
            path: `/catalog?cat=${cat.id}`
          })
        }

        addCategories(this.product.category)

        return breadcrumbs
      }
      return []
    },

    meta () {
      return {
        title: this.product?.meta?.[`meta_title__${this.$i18n.locale}`] || this.product?.meta?.meta_title || '',
        meta: [
          {property: 'og:title', content: this.product?.meta?.[`facebook_title__${this.$i18n.locale}`] || this.product?.meta?.facebook_title || ''},
          {property: 'og:description', content: this.product?.meta?.[`facebook_description__${this.$i18n.locale}`] || this.product?.meta?.facebook_description || ''},
          {property: 'og:image', content: this.product?.meta?.facebook_image?.url || this.product?.meta?.meta_image?.url || this.product?.meta?.twitter_image?.url || ''},
          {property: 'og:url', content: process.client ? window.location.href : `https://proximart.az/${this.$route.fullPath}`},
          {property: "og:type", content: "website"},
          {itemprop: "name", content: this.product?.meta?.[`meta_title__${this.$i18n.locale}`] || this.product?.meta?.meta_title || ''},
          {itemprop: "description", content: this.product?.meta?.[`meta_description__${this.$i18n.locale}`] || this.product?.meta?.meta_description || ''},
          {itemprop: "image", content: this.product?.meta?.meta_image?.url || this.product?.meta?.facebook_image?.url || this.product?.meta?.twitter_image?.url || ''},
          {name: 'description', content: this.product?.meta?.[`meta_description__${this.$i18n.locale}`] || this.product?.meta?.meta_description || ''},
          {name: 'keywords', content: this.product?.meta?.[`meta_keywords__${this.$i18n.locale}`] || this.product?.meta?.meta_keywords || ''},
          {property: 'twitter:card', content: this.product?.meta?.twitter_image?.url || this.product?.meta?.meta_image?.url || this.product?.meta?.facebook_image?.url || ''}
        ]
      }
    }
  },

  methods: {
    ...mapActions('productPage', ['fetchProduct', 'fetchSimilarProducts'])
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/product';
</style>
