<template>
  <div class="catalog-filter" :class="{active: isOpen}" v-bsl="watchResizeValues.mobile && isOpen">
    <header class="catalog-filter__header">
      <div class="catalog-filter__header-title-wrapper">
        <button class="catalog-filter__header-close" @click="$emit('close')">
          <close-icon />
        </button>
        <span class="catalog-filter__header-title" v-t="'Фильтры'" />
      </div>
      <button class="catalog-filter__header-reset" @click="resetAll" v-t="'Сбросить'" />
    </header>
    <range-input
      label="Цена"
      :value="price"
      @set-value="onSetPrice"
      :min="priceLimits.min"
      :max="priceLimits.max"
      class="mb-30"
    />
    <div class="relative mb-24">
      <Loading v-if="parameterValuesLoading" />

      <scroll-select
        :scroll-lock="watchResizeValues.mobile && isOpen"
        label="Параметры"
        :show-search="true"
        :show-fade="true"
        :value="parameter"
        @input="onSetParameter"
        :options="formattedParameters"
        v-if="formattedParameters && formattedParameters.length"
      />
    </div>
    <template v-if="selectedParameters && selectedParameters.length">
      <template v-for="select in (selectedParameters || [])">
        <scroll-select
          v-if="select.options && select.options.length"
          :reset-only-options="true"
          :key="select.id"
          :scroll-lock="watchResizeValues.mobile && isOpen"
          :label="select.label"
          :show-search="true"
          :show-fade="true"
          :value="parameterValue"
          :show-select-all="true"
          @input="onSetParameterValue"
          @add="onAddParameterValues"
          :options="select.options"
          class="mb-24"
        />
      </template>
    </template>
    <scroll-select
      label="Скидка"
      :is-radio="true"
      :value="discount"
      @input="onSetDiscount"
      :options="discounts"
      class="catalog-filter__discount-filter mb-24"
    />
    <color-select
      :value="color"
      @input="onSetColor"
      :options="colors"
    />
    <button
      v-if="watchResizeValues.mobile"
      class="catalog-filter__apply"
      v-t="'Применить'"
      @click="onApply"
    />
  </div>
</template>

<script>
import watchResize from "~/mixins/watchResize";
import {mapState} from "vuex";

export default {
  name: "CatalogFilter",

  mixins: [watchResize],

  components: {
    Loading: () => import('~/components/elements/Loading'),
    ColorSelect: () => import('~/components/elements/ColorSelect'),
    RangeInput: () => import('~/components/elements/RangeInput'),
    ScrollSelect: () => import('~/components/elements/ScrollSelect'),
    CloseIcon: () => import('~/assets/icons/close-2.svg?inline')
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    colors: {
      type: Array,
      default: null
    },
    parameters: {
      type: Array,
      default: null
    },
    parameter: {
      type: Array,
      default: null
    },
    parameterValues: {
      type: Array,
      default: null
    },
    parameterValue: {
      type: Array,
      default: null
    },
    color: {
      type: Array,
      default: null
    },
    discount: {
      type: Number,
      default: null
    },
    priceLimits: {
      type: Object,
      default: () => ({ min: 0, max: 10000 })
    },
    price: {
      type: Object,
      default: () => ({ min: 0, max: 10000 })
    },
    parameterValuesLoading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      watchResizeThresholds: {
        mobile: 900
      }
    }
  },

  computed: {
    ...mapState('catalog', ['defaultDiscounts']),

    formattedParameters () {
      return this.parameters?.map(p => ({
        id: p.id,
        label: p[`name__${this.$i18n.locale}`] || p.name
      })) || null
    },

    selectedParameters () {
      return this.formattedParameters
        ?.filter(fp => this.parameter?.map(p => p.toString()).includes(fp.id?.toString()))
        .map(fp => ({
          ...fp,
          options: this.parameterValues
            ?.find(pv => pv.id?.toString() === fp.id?.toString())
            ?.value
            ?.reduce((acc, cur) => {
              if ((this.parameterValue?.length && this.parameterValue?.findIndex(v => v.toString() === cur?.id?.toString()) !== -1)
                || acc?.findIndex(v => v.value?.toString().toLowerCase().replace(/ /g, '')
                  === cur?.value?.toString().toLowerCase().replace(/ /g, '')) === -1)
                acc?.push(cur)
              return acc
            }, [])
            ?.map(p => ({
              id: p.id,
              label: p[`value__${this.$i18n.locale}`] || p.value
            })) || []
        }))
        || null
    },

    discounts () {
      return this.defaultDiscounts.map(d => ({
        ...d,
        label: this.$t(d.label)
      }))
    }
  },

  methods: {
    onSetPrice (price) {
      this.$emit('set-price', price)
    },

    onSetParameter (value) {
      this.$emit('set-parameter', value)
    },

    onSetParameterValue (value) {
      this.$emit('set-parameter-value', value)
    },

    onSetDiscount (value) {
      this.$emit('set-discount', value)
    },

    onSetColor (value) {
      this.$emit('set-color', value)
    },

    resetAll () {
      this.$emit('set-parameter', null)
      this.$emit('set-discount', null)
      this.$emit('set-color', null)
      this.$emit('set-price', {
        min: this.priceLimits.min,
        max: this.priceLimits.max
      })
    },

    onAddParameterValues (ids) {
      this.onSetParameterValue((this.parameterValue?.slice() || []).concat(ids))
    },

    onApply () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/pages/catalog/filter';
</style>
