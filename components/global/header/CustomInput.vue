<template>
  <div
    class="custom-input-h"
    :class="{'custom-input-h--focus': focused || inputFocused}"
    v-click-outside="onElBlur"
    @mouseenter="onElFocus"
    @mouseleave="onElBlur"
  >
    <div class="custom-input-h__input">
      <input
        :type="type"
        :placeholder="placeholder"
        :value="value"
        :name="name"
        @input="$emit('input', $event.target.value)"
        @focus="onInputElFocus"
        @blur="onInputElBlur"
      />
      <slot />
    </div>
    <slot name="bottom" />
  </div>
</template>

<script>
export default {
  name: "CustomInput",

  props: {
    value: {
      default: '',
      type: String
    },
    type: {
      default: 'text',
      type: String
    },
    name: String,
    placeholder: String
  },

  data () {
    return {
      focused: false,
      inputFocused: false
    }
  },

  mounted () {
    this.$watch(vm => [
      vm.focused,
      vm.inputFocused
    ], () => {
      this.$emit(this.focused || this.inputFocused ? 'focus' : 'blur')
    })
  },

  methods: {
    onElFocus () {
      this.focused = true
    },

    onInputElFocus () {
      this.inputFocused = true
    },

    onElBlur () {
      this.focused = false
    },

    onInputElBlur () {
      this.inputFocused = false
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/elements/header/custom-input";
</style>
