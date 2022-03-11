<template>
  <custom-select
    class="lang-select"
    :value="{
      code: $i18n.locale
    }"
    :options="$i18n.locales"
    option-slug="code"
    option-label="code"
    @select="onLangSelect"
    :openOnHover="true"
  >
    <template v-slot:top-prefix>
      <component class="lang-select__top-icon" :is="`Flag${$i18n.locale.toUpperCase()}Icon`" />
    </template>
    <template v-for="(lang, index) in $i18n.locales" v-slot:[`dropdown-prefix-${index}`]>
      <component :key="lang.code" :is="`Flag${lang.code.toUpperCase()}Icon`" />
    </template>
  </custom-select>
</template>

<script>
export default {
  name: "LangSelect",

  components: {
    CustomSelect: () => import('~/components/elements/CustomSelect'),
    FlagAZIcon: () => import('~/assets/icons/flag-az.svg?inline'),
    FlagRUIcon: () => import('~/assets/icons/flag-ru.svg?inline')
  },

  methods: {
    onLangSelect (lang) {
      this.$router.push(this.switchLocalePath(lang.code))?.catch(() => {})
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/header/lang-select';
</style>
