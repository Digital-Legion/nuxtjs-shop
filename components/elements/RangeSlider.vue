<template>
  <div class="g-range-slider" ref="barEl">
    <div class="min" ref="minEl" />
    <div class="max" ref="maxEl"/>
    <div class="bar" ref="barGreenEl" />
  </div>
</template>

<script>
export default {
  name: "RangeSlider",

  props: {
    minInput: {},
    maxInput: {},
    values: {
      type: Object,
      default: () => ({
        max: 100,
        min: 0
      })
    },
    range: {
      type: Object,
      default: () => ({
        max: 100,
        min: 0
      })
    }
  },

  data () {
    return {
      barGreen: null,
      thumbWidth: 11,
      roundTo: 100,
      mouseMove: false
    }
  },

  mounted () {
    let
      // eslint-disable-next-line no-unused-vars
      minInput = this.minInput.querySelector('input'),
      // eslint-disable-next-line no-unused-vars
      maxInput = this.maxInput.querySelector('input'),
      tempX,
      curLoc = 0,
      drag = false,
      dragee = null,
      drageeName = null;
    this.barGreen = this.$refs.barGreenEl
    this.min = this.$refs.minEl
    this.max = this.$refs.maxEl
    this.bar = this.$refs.barEl

    let onMouseMove = e => {
      if (!this.$el) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onMouseMove);
        return;
      }

      if (drag) {
        this.mouseMove = true

        if (e.changedTouches)
          curLoc = e.changedTouches[0].clientX - this.bar.getBoundingClientRect().x - 7;
        else
          curLoc = e.clientX - this.bar.getBoundingClientRect().x - 7;

        if (drageeName === 'min') {
          if (curLoc > (tempX = this.max.getBoundingClientRect().x - this.bar.getBoundingClientRect().x)) {
            curLoc = tempX;
          }
        } else if (drageeName === 'max') {
          if (curLoc < (tempX = this.min.getBoundingClientRect().x - this.bar.getBoundingClientRect().x)) {
            curLoc = tempX;
          }
        }

        if (curLoc < 0)
          curLoc = 0;
        else if (curLoc > this.bar.offsetWidth - this.thumbWidth)
          curLoc = this.bar.offsetWidth - this.thumbWidth;

        dragee.style.transform = `translateX(${curLoc}px)`;
        // setting input values
        const dynamicVars = { minInput, maxInput, min: this.min, max: this.max }
        if (dynamicVars[`${drageeName}`].getBoundingClientRect().x === this.bar.getBoundingClientRect().x) {
          dynamicVars[`${drageeName}Input`].value = `${this.range.min}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ")
        } else if (dynamicVars[`${drageeName}`].getBoundingClientRect().x === this.bar.getBoundingClientRect().x + this.bar.offsetWidth - this.thumbWidth) {
          dynamicVars[`${drageeName}Input`].value = `${this.range.max}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ")
        } else {
          dynamicVars[`${drageeName}Input`].value =
            (Math.round((dynamicVars[`${drageeName}`].getBoundingClientRect().x
              - (this.bar.getBoundingClientRect().x - this.thumbWidth))
            / this.bar.offsetWidth * this.range.max / this.roundTo) * this.roundTo)
              .toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ")
        }
        this.updateBarGreenTransform()
      }
    };

    let onMouseUp = () => {
      if (!this.$el) {
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchend', onMouseUp);
        return;
      }

      if (!drag) return;

      const minValue = minInput.value.replace(' ', ''),
        maxValue = maxInput.value.replace(' ', '')
      this.$emit('set-values', {
        min: !isNaN(minValue) ? parseInt(minValue) : 0,
        max: !isNaN(maxValue) ? parseInt(maxValue) : 0
      })

      drag = false;
      dragee = null;
      drageeName = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);

    this.min.addEventListener('mousedown', e => {
      e.preventDefault();
      dragee = this.min;
      drageeName = 'min';
      drag = true;
    });
    this.min.addEventListener('touchstart', e => {
      e.preventDefault();
      dragee = this.min;
      drageeName = 'min';
      drag = true;
    });

    this.max.addEventListener('mousedown', e => {
      e.preventDefault();
      dragee = this.max;
      drageeName = 'max';
      drag = true;
    });
    this.max.addEventListener('touchstart', e => {
      e.preventDefault();
      dragee = this.max;
      drageeName = 'max';
      drag = true;
    });

    window.addEventListener('resize', this.onBarResize);
    this.onBarResize()

    this.$watch(vm => [
      vm.values.min,
      vm.values.max,
      vm.range.min,
      vm.range.max
    ], () => {
      if (!this.mouseMove)
        this.onBarResize()
      else this.mouseMove = false
    })

    this.$watch(vm => [
      vm.range.max
    ], () => {
      this.updateRoundTo()
    })
    this.updateRoundTo()
  },

  methods: {
    updateRoundTo () {
      this.roundTo = Math.pow(10, Math.floor(Math.log10(this.range.max))) / 100 || 1
    },

    updateThumbTransforms () {
      this.min.style.transform = this.range.max !== 0
        ? `translateX(${(this.values.min / this.range.max) * (this.bar.offsetWidth - this.thumbWidth)}px)`
        : `translateX(0px)`
      this.max.style.transform = this.range.max !== 0
        ? `translateX(${(this.values.max / this.range.max) * (this.bar.offsetWidth - this.thumbWidth)}px)`
        : `translateX(0px)`
    },

    updateBarGreenTransform () {
      this.barGreen.style.transform = `
          translateX(${this.min.getBoundingClientRect().x - this.bar.getBoundingClientRect().x}px)
          scaleX(${(this.max.getBoundingClientRect().x - this.min.getBoundingClientRect().x) / this.bar.offsetWidth})
        `
    },

    onBarResize () {
      this.updateThumbTransforms()
      this.updateBarGreenTransform()
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onBarResize);
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/range-slider';
</style>
