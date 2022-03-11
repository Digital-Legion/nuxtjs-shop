<template>
  <div class="credit-calculator">
    <div class="credit-calculator__slider">
      <div class="slider" ref="barEl">
        <div class="bar" ref="barGreenEl" />
        <div class="thumb" ref="thumbEl" />
        <div class="value" ref="valueEl" />
      </div>
      <div class="months">
        <div class="months-item" v-for="month in months" :key="month">{{ month }}</div>
      </div>
    </div>
    <div class="credit-calculator__inputs-action">
      <div class="inputs">
        <custom-input
          :label="$t('Первоначальный взнос')"
          :value="initialDeposit"
          :compact="true"
          :disabled="true"
        />
        <custom-input
          :label="$t('Ежемесячная оплата')"
          :value="monthlyPay"
          :compact="true"
          :disabled="true"
        />
      </div>
      <button class="credit-calculator__btn" @submit="onSubmit">
        <MainShopCartIcon />
        <span>{{ $t('Оформить') }}!</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreditCalculator",

  components: {
    CustomInput: () => import('~/components/elements/CustomInput'),
    MainShopCartIcon: () => import('~/assets/icons/shopping-cart-main.svg?inline')
  },

  props: {
    chosenMonth: {
      type: Number,
      default: 12
    },
    months: {
      type: Array,
      default: () => [ 6, 9, 12, 15, 18, 24 ]
    },
    month: {
      type: Number,
      default: null
    },
    initialDeposit: {
      type: Number,
      default: null
    },
    monthlyPay: {
      type: Number,
      default: null
    }
  },

  data () {
    return {
      barGreen: null,
      bar: null,
      thumb: null,
      valueEl: null,
      monthItems: null,
      thumbWidth: 12
    }
  },

  mounted() {
    this.barGreen = this.$refs.barGreenEl
    this.thumb = this.$refs.thumbEl
    this.bar = this.$refs.barEl
    this.valueEl = this.$refs.valueEl
    this.monthItems = this.$el.querySelectorAll('.months-item')

    let
      curLoc = 0,
      drag = false,
      dragee = null,
      closestValue = this.chosenMonth

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

        if (curLoc < -this.thumbWidth / 3)
          curLoc = -this.thumbWidth / 3;
        else if (curLoc > this.bar.offsetWidth - this.thumbWidth)
          curLoc = this.bar.offsetWidth - this.thumbWidth;

        dragee.style.transform = `translateX(${curLoc}px)`;
        this.updateBarGreenTransform()
        this.updateValueElTransform()

        closestValue = this.getClosestValue()
        this.updateSliderValue(closestValue)
      }
    };

    let onMouseUp = () => {
      if (!this.$el) {
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchend', onMouseUp);
        return;
      }

      if (!drag) return;

      this.$emit('set-month', closestValue)
      this.onBarResize(closestValue)

      drag = false;
      dragee = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);

    this.thumb.addEventListener('mousedown', e => {
      e.preventDefault();
      dragee = this.thumb;
      drag = true;
    });
    this.thumb.addEventListener('touchstart', e => {
      e.preventDefault();
      dragee = this.thumb;
      drag = true;
    });

    window.addEventListener('resize', this.onBarResize);
    this.onBarResize(closestValue)
    this.updateSliderValue(closestValue)
  },

  watch: {
    '$i18n.locale' () {
      this.updateSliderValue()
    }
  },

  methods: {
    onSubmit () {

    },

    getClosestValue () {
      const currentPosPercentage = (this.thumb.getBoundingClientRect().x - this.bar.getBoundingClientRect().x) / this.bar.offsetWidth * 100
      return (this.months[Math.round((currentPosPercentage / 100) * (this.months.length - 1))]);
    },

    updateSliderValue (value) {
      this.valueEl.innerHTML = `${value || this.chosenMonth} ${this.$t('мес.')}`
    },

    updateThumbTransform (value) {
      let itemIndex = this.months.findIndex(m => m === (value || this.chosenMonth))
      if (itemIndex === -1) itemIndex = 0
      const offsetX = itemIndex === this.months.length - 1 ? 0 : (itemIndex === 0 ? this.thumbWidth / 3 : this.thumbWidth / 2 - this.monthItems[itemIndex].offsetWidth / 2)
      this.thumb.style.transform = `
        translateX(${this.monthItems[itemIndex].getBoundingClientRect().x - this.bar.getBoundingClientRect().x - offsetX}px)
      `
    },

    updateBarGreenTransform () {
      this.barGreen.style.transform = `
        scaleX(${(this.thumb.getBoundingClientRect().x - this.bar.getBoundingClientRect().x) / this.bar.offsetWidth})
      `
    },

    updateValueElTransform () {
      this.valueEl.style.transform = `
        translateX(${this.thumb.getBoundingClientRect().x - this.bar.getBoundingClientRect().x - this.valueEl.offsetWidth / 2 + this.thumb.offsetWidth / 2}px)
      `
    },

    onBarResize (value) {
      this.updateThumbTransform(isNaN(value) ? null : value)
      setTimeout(() => {
        this.updateBarGreenTransform()
        this.updateValueElTransform()
      }, 1)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/credit-calculator';
</style>
