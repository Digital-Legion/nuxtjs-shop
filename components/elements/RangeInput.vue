<template>
  <div class="g-range-input">
    <span class="common__label" v-t="label" />
    <div class="g-range-input__inputs">
      <custom-input
        :compact="true"
        class="custom-input-min"
        :value="formattedMinValue"
        @input="onInputValue($event, 'min')"
        @mounted="onInputMounted($event, 'min')"
      />
      <div class="g-range-input__inputs-separator" />
      <custom-input
        :compact="true"
        class="custom-input-max"
        :value="formattedMaxValue"
        @input="onInputValue($event, 'max')"
        @mounted="onInputMounted($event, 'max')"
      />
    </div>
    <range-slider
      v-if="maxInput && minInput"
      :min-input="minInput"
      :max-input="maxInput"
      :values="value"
      :range="{ min, max }"
      @set-values="$emit('set-value', $event)"
    />
  </div>
</template>

<script>
export default {
  name: "RangeInput",

  components: {
    RangeSlider: () => import('./RangeSlider'),
    CustomInput: () => import('./CustomInput')
  },

  props: {
    label: {
      type: String,
      default: 'Label'
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    value: {
      type: Object,
      default: () => ({
        min: 0,
        max: 0
      })
    }
  },

  data () {
    return {
      minValue: this.value.min || 0,
      maxValue: this.value.max || 0,
      minInput: null,
      maxInput: null
    }
  },

  computed: {
    formattedMinValue () {
      return this.formatNumber(this.minValue)
    },

    formattedMaxValue () {
      return this.formatNumber(this.maxValue)
    }
  },

  methods: {
    onInputMounted (customInput, inputSlug) {
      this[`${inputSlug}Input`] = customInput
    },

    formatNumber (value) {
      value = value.toString().replace(/ /g, '')
      if (!isNaN(value))
        return value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ")
      return value
    },

    onInputValue (value, inputSlug = 'min') {
      let valueToSet = 0
      if (value) {
        value = value.toString().replace(/ /g, '').replace(/[^0-9]/g, '')
        if (!isNaN(value)) {
          value = parseInt(value)
          if (value > this.max) valueToSet = this.max
          else if (value < this.min) valueToSet = this.min
          else valueToSet = value
        }
      } else {
        valueToSet = 0
      }
      this[`${inputSlug}Value`] = valueToSet
      this.$emit('set-value', {
        min: this.minValue,
        max: this.maxValue
      })
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/range-input';
</style>
