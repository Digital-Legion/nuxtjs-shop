export default {
  data () {
    return {
      watchResizeThresholds: {},
      watchResizeWidth: 0,
      watchResizeInitSizeDetermined: false
    }
  },

  mounted () {
    if (process.client) {
      this.initWatchResize()
    }
  },

  watch: {
    watchResizeValues () {
      if (!this.watchResizeInitSizeDetermined)
        this.watchResizeInitSizeDetermined = true
    }
  },

  computed: {
    watchResizeValues () {
      const thresholds = Object.assign({}, this.watchResizeThresholds)
      Object.entries(this.watchResizeThresholds).forEach(e => {
        thresholds[e[0]] = e[1] > 0 && e[1] >= this.watchResizeWidth;
      })
      return thresholds
    }
  },

  methods: {
    initWatchResize () {
      window.addEventListener('resize', this.watchResize)
      this.watchResize()
    },

    watchResize () {
      this.watchResizeWidth = window.innerWidth
    }
  },

  beforeDestroy () {
    if (process.client) {
      window.removeEventListener('resize', this.watchResize)
    }
  }
}
