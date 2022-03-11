<template>
  <div class="g-checkbox" :class="[isRadio ? 'g-checkbox--radio' : 'g-checkbox--check', { 'g-checkbox--error': error }]" @click="$emit('clicked')">
    <div class="g-checkbox__box" :class="{'g-checkbox__box--active': selected}" />
    <span class="g-checkbox__label" v-if="label" v-html="label" />
  </div>
</template>

<script>
export default {
  name: "Checkbox",

  props: {
    isRadio: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Checkbox'
    },
    error: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/checkbox';
</style>
