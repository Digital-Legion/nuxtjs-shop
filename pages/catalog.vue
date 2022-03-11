<template>
  <main class="catalog-page container">
    <breadcrumbs :breadcrumbs="breadcrumbs"/>
    <div class="catalog-page__title-wrapper">
      <h1 class="g-title" id="catalog-title">{{ pageTitle }}</h1>
      <span class="catalog-page__product-total">{{ titleProductTotal }}</span>
      <button class="catalog-page__filter-btn" @click="filterMobileOpen = true">
        <filter-icon />
      </button>
    </div>
    <div class="catalog-page__content">
      <div class="catalog-page__content-side">
        <catalog-filter
          :is-open="filterMobileOpen"
          @close="filterMobileOpen = false"
          :colors="colors"
          :parameters="parameters"
          :discount="selectedDiscount"
          :parameter="selectedParameters"
          :parameter-values="parameterValues"
          :parameter-value="selectedParameterValues"
          :color="selectedColors"
          :price="selectedPrice"
          :price-limits="defaultPrices"
          :parameter-values-loading="parameterValuesLoading"
          @set-discount="selectedDiscount = $event"
          @set-color="onSetData('selectedColors', $event)"
          @set-parameter="onSetData('selectedParameters', $event)"
          @set-parameter-value="onSetData('selectedParameterValues', $event)"
          @set-price="onSetData('selectedPrice', $event)"
        />
      </div>
      <div class="catalog-page__content-side">
        <item-filter
          :value="selectedBrands"
          @input="onSetData('selectedBrands', $event)"
          :options="brands"
        />
        <order-filter
          :sorts="defaultOrderFilters"
          :value="selectedSort"
          @input="onSetData('selectedSort', $event)"
        />
        <div class="catalog-page__products" :class="{'catalog-page__products--min-height': loading}">
          <Loading v-if="loading" />

          <template v-if="!loading && (!products || !products.length)">
            <catalog-empty />
          </template>
          <template v-else-if="!loading">
              <product-grid
                :products="products"
                :max-three="true"
              />
              <pagination
                v-if="totalProducts > perPage"
                :total-elems="totalProducts"
                v-model="page"
                @input="onPageChange"
                :per-page="perPage"
                :show-empty-text="false"
              />
            <text-accordion
              class="catalog-page__ceo"
              v-if="ceoText"
              title="Текст для СЕО"
            >
              {{ ceoText }}
            </text-accordion>
          </template>
        </div>
      </div>
    </div>

    <ProductModal />
    <QuickBuyModal />
    <PreorderModal />
  </main>
</template>

<script>
import {mapActions, mapState} from "vuex";
import debounce from 'lodash.debounce'

const getQueryNumber = (queryValue, fallback) => {
  if (queryValue) {
    const queryValueString = typeof queryValue === 'object' ? queryValue[0] : queryValue
    return !isNaN(queryValueString) ? parseInt(queryValueString) : fallback
  }
  return fallback
}

const getQueryIdArray = (queryValue, fallback) => {
  if (queryValue) {
    let values = typeof queryValue === 'object' ? queryValue : [queryValue]
    if (values?.length) {
      values = values.filter(v => !isNaN(v))
      if (values?.length)
        return values.map(v => parseInt(v))
    }
  }
  return fallback
}

const getQueryValue = (queryValue, fallback, possibleValuesArray) => {
  if (queryValue) {
    const queryValueString = typeof queryValue === 'object' ? queryValue[0] : queryValue
    const idInArray = possibleValuesArray.find(v => v?.value?.toString() === queryValueString.toString())?.id
    if (idInArray)
      return idInArray
  }
  return fallback
}

export default {
  name: "Catalog",

  components: {
    TextAccordion: () => import('~/containers/elements/TextAccordion'),
    PreorderModal: () => import('~/containers/elements/PreorderModal'),
    QuickBuyModal: () => import('~/containers/elements/QuickBuyModal'),
    ProductModal: () => import('~/containers/elements/ProductModal'),
    Loading: () => import('~/components/elements/Loading'),
    Pagination: () => import('~/components/elements/Pagination'),
    ProductGrid: () => import('~/containers/elements/ProductGrid'),
    OrderFilter: () => import('~/containers/pages/catalog/OrderFilter'),
    ItemFilter: () => import('~/containers/pages/catalog/ItemFilter'),
    Breadcrumbs: () => import('~/components/elements/Breadcrumbs'),
    CatalogFilter: () => import('~/containers/pages/catalog/Filter'),
    CatalogEmpty: () => import('~/containers/pages/catalog/Empty'),
    FilterIcon: () => import('~/assets/icons/filter.svg?inline')
  },

  head () {
    return this.meta
  },

  data() {
    // parsing the url query
    let
      page = getQueryNumber(this.$route.query.page, 1),
      categoryId = getQueryNumber(this.$route.query.cat, null),
      discountCat = getQueryNumber(this.$route.query.discat, null),
      selectedPriceMin = getQueryNumber(this.$route.query.min_price, this.$store.state.catalog.defaultPrices.min),
      selectedPriceMax = getQueryNumber(this.$route.query.max_price, this.$store.state.catalog.defaultPrices.max),
      selectedBrands = getQueryIdArray(this.$route.query.brand, null),
      selectedParameters = getQueryIdArray(this.$route.query.param, null),
      selectedParameterValues = getQueryIdArray(this.$route.query.paramval, null),
      selectedColors = getQueryIdArray(this.$route.query.color, null),
      selectedDiscount = getQueryValue(this.$route.query.discount, null, this.$store.state.catalog.defaultDiscounts),
      selectedSortBy = getQueryValue(this.$route.query.sort_by, this.$store.state.catalog.defaultOrderFilters[0].id, this.$store.state.catalog.defaultOrderFilters),
      selectedSortOrder = getQueryValue(this.$route.query.sort_order, this.$store.state.catalog.defaultSortOrders[0].id, this.$store.state.catalog.defaultSortOrders)

    return {
      page,
      perPage: this.$store.state.catalog.defaultPerPage,
      filterMobileOpen: false,
      fetchingProducts: false,
      parameterValuesLoading: false,
      skipWatchSelectedParamaterValues: false,

      totalProducts: 0,

      products: null,
      colors: null,
      brands: null,
      parameters: null,
      parameterValues: null,

      selectedPrice: {
        min: selectedPriceMin,
        max: selectedPriceMax
      },
      selectedSort: {
        by: selectedSortBy,
        order: selectedSortOrder
      },
      selectedBrands,
      selectedParameters,
      selectedParameterValues,
      selectedColors,
      selectedDiscount,
      discountCat,
      categoryId
    }
  },

  async asyncData ({ store, query }) {
    let selectedParameters = getQueryIdArray(query.param, null),
      selectedParameterValues = getQueryIdArray(query.paramval, null)
    const selectedSort = {
      by: getQueryValue(query.sort_by, store.state.catalog.defaultOrderFilters[0].id, store.state.catalog.defaultOrderFilters),
      order: getQueryValue(query.sort_order, store.state.catalog.defaultSortOrders[0].id, store.state.catalog.defaultSortOrders)
    }

    // getting filter data
    const {colors, brands, parameters, category, parameterValues} =
      await store.dispatch('catalog/fetchCatalogData',{ categoryId: query.cat || null, selectedParameters })

    // filtering selected parameter values to make sure they are in the parameter values
    if (selectedParameterValues?.length && parameterValues?.length)
      selectedParameterValues = selectedParameterValues
        .filter(spv => parameterValues?.map(pv => pv.value)?.flat().map(pv => pv.id?.toString()).includes(spv.toString()))

    let productParameters = null
    if (selectedParameterValues?.length && parameterValues?.length) {
      productParameters = parameterValues.map(pv => pv.value).flat()
        .filter(pv => selectedParameterValues.map(id => id.toString()).includes(pv.id?.toString())).map(pv => pv.value)
    }
    if (!productParameters?.length)
      productParameters = null

    // getting products
    const {products} = await store.dispatch('catalog/fetchProducts', {
      page: getQueryNumber(query.page, 1),
      limit: store.state.catalog.defaultPerPage,
      sort: store.state.catalog.defaultOrderFilters.find(o => o.id === selectedSort.by)?.apiValue,
      sortOrder: selectedSort.order.toUpperCase(),
      color: getQueryIdArray(query.color, null),
      discount: getQueryValue(query.discount, null, store.state.catalog.defaultDiscounts),
      brand: getQueryIdArray(query.brand, null),
      priceBefore: getQueryNumber(query.min_price, store.state.catalog.defaultPrices.min),
      priceAfter: getQueryNumber(query.max_price, store.state.catalog.defaultPrices.max),
      discountCat: getQueryNumber(query.discat, null),
      catId: getQueryNumber(query.cat, null),
      p: productParameters
    })

    return {
      colors,
      brands,
      parameters,
      parameterValues,
      category,
      products: products?.items || null,
      totalProducts: products?.meta?.totalItems || 0
    }
  },

  mounted () {
    this.$watch(vm => [
      vm.selectedPrice,
      vm.selectedSort,
      vm.selectedBrands,
      vm.selectedParameters,
      vm.selectedColors,
      vm.selectedDiscount
    ], () => {
      this.page = 1
    })

    this.$watch(vm => [
      vm.selectedPrice,
      vm.selectedSort,
      vm.selectedBrands,
      vm.selectedColors,
      vm.selectedDiscount
    ], () => {
      this.debouncedLoadProducts()
    })

    this.$watch(vm => [vm.selectedParameters], () => {
      this.debouncedFetchParameterValues()
    })
  },

  watch: {
    async '$route.query' () {
      let toUpdate = false
      if (this.$route.query.cat?.toString() !== this.categoryId?.toString()) {
        toUpdate = true
        this.categoryId = getQueryNumber(this.$route.query.cat, null)
        const {colors, brands, parameters, category, parameterValues} = await this.$store.dispatch('catalog/fetchCatalogData',
          { categoryId: this.$route.query.cat || null, selectedParameters: this.selectedParameters })
        this.colors = colors
        this.brands = brands
        this.parameters = parameters
        this.parameterValues = parameterValues
        this.category = category
      }
      if (this.$route.query.discat?.toString() !== this.discountCat?.toString()) {
        toUpdate = true
        this.discountCat = getQueryNumber(this.$route.query.discat, null)
      }

      if (toUpdate) {
        this.page = 1
        await this.loadProducts()
      }
    },

    selectedParameterValues (n,o) {
      if (!this.skipWatchSelectedParamaterValues && !(n?.length && o?.length && n.slice().sort().join(',') === o.slice().sort().join(','))) {
        this.debouncedLoadProducts()
      }
      this.skipWatchSelectedParamaterValues = false
    }
  },

  computed: {
    ...mapState('catalog', ['defaultPrices', 'defaultOrderFilters']),

    pageTitle () {
      return this.category?.[`name__${this.$i18n.locale}`] || this.category?.name || this.$t('Каталог')
    },

    titleProductTotal () {
      return `${this.totalProducts} ${this.$t(this.totalProducts === 1 ? 'товар' : 'товаров')}`
    },

    ceoText () {
      return (
        this.category?.meta?.[`meta_description${this.$i18n.locale === this.$i18n.fallbackLocale ? '' : `__${this.$i18n.locale}`}`]
      )
    },

    breadcrumbs () {
      const categoryBreadcrumbs = []

      const addCategories = (cat) => {
        if (cat.parent) {
          addCategories(cat.parent)
        }
        categoryBreadcrumbs.push({
          title: cat[`name__${this.$i18n.locale}`] || cat.name || '',
          path: `/catalog?cat=${cat.id}`
        })
      }

      if (this.category)
        addCategories(this.category)

      if (categoryBreadcrumbs.length)
        categoryBreadcrumbs[categoryBreadcrumbs.length - 1].path = null

      return [
        {
          title: 'Главная',
          path: '/'
        },
        {
          title: 'Каталог',
          path: this.category ? '/catalog' : null
        },
        ...categoryBreadcrumbs
      ]
    },

    loading () {
      return this.fetchingProducts || this.parameterValuesLoading
    },

    meta () {
      return {
        title: this.category?.meta?.[`meta_title__${this.$i18n.locale}`] || this.category?.meta?.meta_title || '',
        meta: [
          {property: 'og:title', content: this.category?.meta?.[`facebook_title__${this.$i18n.locale}`] || this.category?.meta?.facebook_title || ''},
          {property: 'og:description', content: this.category?.meta?.[`facebook_description__${this.$i18n.locale}`] || this.category?.meta?.facebook_description || ''},
          {property: 'og:image', content: this.category?.meta?.facebook_image?.url || this.category?.meta?.meta_image?.url || this.category?.meta?.twitter_image?.url || ''},
          {property: 'og:url', content: process.client ? window.location.href : `https://proximart.az/${this.$route.fullPath}`},
          {property: "og:type", content: "website"},
          {itemprop: "name", content: this.category?.meta?.[`meta_title__${this.$i18n.locale}`] || this.category?.meta?.meta_title || ''},
          {itemprop: "description", content: this.category?.meta?.[`meta_description__${this.$i18n.locale}`] || this.category?.meta?.meta_description || ''},
          {itemprop: "image", content: this.category?.meta?.meta_image?.url || this.category?.meta?.facebook_image?.url || this.category?.meta?.twitter_image?.url || ''},
          {name: 'description', content: this.category?.meta?.[`meta_description__${this.$i18n.locale}`] || this.category?.meta?.meta_description || ''},
          {name: 'keywords', content: this.category?.meta?.[`meta_keywords__${this.$i18n.locale}`] || this.category?.meta?.meta_keywords || ''},
          {property: 'twitter:card', content: this.category?.meta?.twitter_image?.url || this.category?.meta?.meta_image?.url || this.category?.meta?.facebook_image?.url || ''}
        ]
      }
    }
  },

  methods: {
    ...mapActions('catalog', ['fetchProducts', 'fetchParameterValues']),

    onSetData (data, value) {
      this.$set(this, data, Array.isArray(value) ? (value?.length ? value : null) : value)
    },

    onPageChange () {
      this.loadProducts()
      this.$scrollTo('#catalog-title', { offset: -160 })
    },

    async getParameterValues () {
      this.parameterValuesLoading = true

      const prevParameterValues = this.parameterValues?.slice()
      this.parameterValues = await this.fetchParameterValues({
        parameters: this.parameters,
        selectedParameters: this.selectedParameters
      })
      if (this.parameterValues?.length) {
        const prevParamaterValueIds = prevParameterValues?.map(pv => pv.id) || null
        let selectedParameterValues = this.selectedParameterValues?.slice() || []
        this.parameterValues
          .filter(pv => !prevParamaterValueIds?.includes(pv.id) && pv.category?.id === this.category?.id)
          .forEach(pv => {
            if (pv.value?.length)
              selectedParameterValues =
                selectedParameterValues.concat(
                  pv.value
                    .map(pvv => pvv.id)
                )
          })
        if (!selectedParameterValues?.length)
          this.selectedParameterValues = null
        else {
          selectedParameterValues = selectedParameterValues.filter(pv => pv !== null && pv !== undefined)
          selectedParameterValues = [...new Set(selectedParameterValues)]
        }
        this.$set(this, 'selectedParameterValues', selectedParameterValues)
      }

      this.parameterValuesLoading = false
      this.skipWatchSelectedParamaterValues = true
      await this.loadProducts()
    },

    debouncedFetchParameterValues: debounce(async function() {
      await this.getParameterValues()
    }, 1000),

    debouncedLoadProducts: debounce(async function() {
      await this.loadProducts()
    }, 1000),

    async loadProducts () {
      // update the url query
      this.updateUrlQuery()

      let selectedParameterValues = this.selectedParameterValues?.slice()

      // filtering selected parameter values to make sure they are in the parameter values
      if (selectedParameterValues?.length && this.parameterValues?.length)
        selectedParameterValues = selectedParameterValues
          .filter(spv => this.parameterValues?.map(pv => pv.value)?.flat().map(pv => pv.id?.toString()).includes(spv.toString()))

      let productParameters = null
      if (selectedParameterValues?.length && this.parameterValues?.length) {
        productParameters = this.parameterValues.map(pv => pv.value).flat()
          .filter(pv => selectedParameterValues.map(id => id.toString()).includes(pv.id?.toString())).map(pv => pv.value)
      }
      if (!productParameters?.length)
        productParameters = null

      this.fetchingProducts = true
      this.products = null
      this.totalProducts = 0
      const {products} = await this.fetchProducts({
        page: this.page,
        limit: this.perPage,
        sort: this.defaultOrderFilters.find(o => o.id === this.selectedSort.by)?.apiValue,
        sortOrder: this.selectedSort.order.toUpperCase(),
        color: this.selectedColors,
        discount: this.selectedDiscount,
        brand: this.selectedBrands,
        priceBefore: this.selectedPrice.min,
        priceAfter: this.selectedPrice.max,
        discountCat: this.discountCat,
        catId: this.categoryId,
        p: productParameters
      })
      this.products = products?.items || null
      this.totalProducts = products?.meta?.totalItems || 0
      this.fetchingProducts = false
    },

    updateUrlQuery () {
      this.$router.push({
        path: '/catalog',
        query: Object.fromEntries(Object.entries({
          page: this.page,
          cat: this.categoryId,
          discat: this.discountCat,
          color: this.selectedColors,
          param: this.selectedParameters,
          paramval: this.selectedParameterValues,
          discount: this.selectedDiscount,
          brand: this.selectedBrands,
          sort_by: this.selectedSort.by,
          sort_order: this.selectedSort.order,
          min_price: this.selectedPrice.min,
          max_price: this.selectedPrice.max
          // eslint-disable-next-line no-unused-vars
        }).filter(([_, v]) => v != null))
      })?.catch(() => {})
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/catalog/index';
</style>
