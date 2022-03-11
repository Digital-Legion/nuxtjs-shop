<template>
  <div class="text-accordion" :id="id">
    <h2 class="g-title mb-16" v-if="title" v-t="title" />
    <accordion
      :show-button="false"
      :max-height="accordionMaxHeight"
      :init-check="false"
      @set-hidden="onSetHidden"
      @set-no-btn="onSetNoBtn"
      ref="accordion"
    >
      <slot />
      <button
        class="g-accordion__btn text-accordion__btn"
        :class="{active: !isHidden, floating: isHidden}"
        @click="toggle"
        :style="{fontSize: `${buttonTextSize}px`}"
        v-if="!noBtn"
      >
        <span>{{ isHidden ? $t('Развернуть') : $t('Свернуть') }}</span>
        <ArrowDownIcon />
      </button>
    </accordion>
  </div>
</template>

<script>
export default {
  name: "TextAccordion",

  components: {
    ArrowDownIcon: () => import('~/assets/icons/arrow-down.svg?inline'),
    Accordion: () => import('~/components/elements/Accordion')
  },

  props: {
    accordionMaxHeight: {
      type: Number,
      default: 112
    },
    buttonTextSize: {
      type: [String, Number],
      default: null
    },
    id: {
      type: String,
      default: 'text-accordion'
    },
    title: {
      type: String,
      default: null
    },
    scrollToTopOnHide: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isHidden: true,
      noBtn: false
    }
  },

  watch: {
    buttonTextSize () {
      this.$refs.accordion.onResize()
    }
  },

  methods: {
    onSetHidden (hidden) {
      this.isHidden = hidden;
    },

    onSetNoBtn (value) {
      this.noBtn = value
    },

    toggle () {
      this.$refs.accordion.toggle();
      if (this.isHidden && window.innerWidth <= 600) {
        setTimeout(() => {
          this.$scrollTo(`#${this.id}`, { offset: -100 })
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/text-accordion';
</style>
