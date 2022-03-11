<template>
  <div class="incrementer">
    <button class="incrementer__cell incrementer__minus" @click="onDecrease" />
    <input type="number" class="incrementer__cell" readonly :value="value" @input="onSetValue($event.target.value)">
    <button class="incrementer__cell incrementer__plus" @click="onIncrease" />
  </div>
</template>

<script>
export default {
  name: "Incrementer",

  props: {
    value: {
      type: Number || String,
      default: '?'
    },
    minValue: {
      type: Number,
      default: 1
    },
    maxValue: {
      type: Number,
      default: 100
    }
  },

  methods: {
    onDecrease () {
      if (typeof this.minValue !== 'number' || this.value - 1 >= this.minValue) {
        this.$emit('input', this.value - 1)
      }
    },

    onSetValue (value) {
      if (!isNaN(value))
        value = parseInt(value)

      if (!isNaN(value) && typeof this.maxValue === 'number' && value >= this.maxValue) {
        this.$emit('input', this.maxValue)
      } else if (!isNaN(value) && typeof this.minValue === 'number' && value <= this.minValue) {
        this.$emit('input', this.minValue)
      } else
        this.$emit('input', value)
    },

    onIncrease () {
      if (typeof this.maxValue !== 'number' || this.value + 1 <= this.maxValue)
        this.$emit('input', this.value + 1)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/incrementer';
</style>
