<template>
  <accordion @set-hidden="onAccordion">
    <div class="parameters" :id="id">
      <ul class="parameters__list">
        <template v-for="(item, i) in parameters">
          <li :key="i" class="parameters__item" v-if="item.key && item.value">
            <div class="parameters__key">
              <span>{{ item.key }}</span>
            </div>
            <div class="parameters__value">{{ item.value }}</div>
          </li>
        </template>
      </ul>
    </div>
  </accordion>
</template>

<script>
export default {
  name: "Parameters",

  components: {
    Accordion: () => import('~/components/elements/Accordion')
  },

  props: {
    data: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      initialAccordionClose: true
    }
  },

  computed: {
    parameters () {
      return this.data?.reduce((acc, cur) => {
        if (acc?.findIndex(v => v?.parameter?.name?.toString().toLowerCase().replace(/ /g, '')
          === cur?.parameter?.name?.toString().toLowerCase().replace(/ /g, '')) === -1)
          acc?.push(cur)
        return acc
      }, [])?.map(p => ({
        key: p.parameter?.[`name__${this.$i18n.locale}`] || p.parameter?.name || '',
        value: p[`value__${this.$i18n.locale}`] || p.value || ''
      }))
    }
  },

  methods: {
    onAccordion (isHidden) {
      if (this.initialAccordionClose) {
        return this.initialAccordionClose = false
      }

      if (isHidden && window.innerWidth <= 600) {
        setTimeout(() => {
          this.$scrollTo(`#${this.id}`, { offset: -160 })
        }, 200)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/parameters';
</style>
