<template>
  <div class="g-accordion" :class="{ 'g-accordion--cut': cut && !noBtn }">
    <div class="g-accordion__content" ref="contentWrapper">
      <div ref="content">
        <slot/>
      </div>
    </div>
    <button
      class="g-accordion__btn"
      :class="{active: !cut}"
      @click="toggle"
      v-if="showButton && !noBtn"
    >
      <span>{{ cut ? $t('Развернуть') : $t('Свернуть') }}</span>
      <ArrowDownIcon />
    </button>
  </div>
</template>

<script>
export default {
  name: "Accordion",

  components: {
    ArrowDownIcon: () => import('~/assets/icons/arrow-down.svg?inline')
  },

  props: {
    maxHeight: {
      type: Number,
      default: 180
    },
    showButton: {
      type: Boolean,
      default: true
    },
    initCheck: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      cut: false,
      noBtn: false
    }
  },

  mounted() {
    if (this.$refs.content.scrollHeight > this.maxHeight || !this.initCheck)
      this.toggle()
    else this.noBtn = true

    this.$emit('set-no-btn', this.noBtn)

    if (process.client) {
      window.addEventListener('resize', this.onResize)
      setTimeout(() => {
        this.onResize()
      }, 1000)
    }
  },

  methods: {
    onResize () {
      this.noBtn = !(this.$refs.content.scrollHeight > this.maxHeight)
      this.$emit('set-no-btn', this.noBtn)
      if (this.noBtn === true) {
        this.$refs.contentWrapper.style.height = ''
      } else {
        this.$refs.contentWrapper.style.height = this.cut ? `${this.maxHeight}px` : `${this.$refs.content.scrollHeight}px`
      }
    },

    toggle() {
      if (this.$refs.contentWrapper) {
        if (this.cut) {
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.contentWrapper.style.height = `${this.$refs.content.scrollHeight}px`
              this.$nextTick(() => {
                setTimeout(() => {
                  if (!this.cut && this.$refs.contentWrapper) {
                    this.$refs.contentWrapper.style.height = ''
                    this.$refs.contentWrapper.style.overflow = ''
                  }
                }, 210)
              })
            })
          }, 1)
        } else {
          this.$refs.contentWrapper.style.height = `${this.$refs.content.scrollHeight}px`
          this.$refs.contentWrapper.style.overflow = 'hidden'
          this.$nextTick(() => {
            setTimeout(() => {
              if (this.$refs.contentWrapper)
                this.$refs.contentWrapper.style.height = `${this.maxHeight}px`
            }, 1)
          })
        }

        this.cut = !this.cut
        this.$emit('set-hidden', this.cut)
      }
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/accordion';
</style>
