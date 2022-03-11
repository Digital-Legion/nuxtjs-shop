<template>
  <div class="lang-select-buttons">
    <button
      v-for="(locale, index) in $i18n.locales"
      :key="index"
      class="lang-select-buttons__item"
      :class="{'lang-select-buttons__item--active': locale.code === $i18n.locale}"
      @click="onLangSelect(locale.code)"
    >
      {{ locale.code }}
    </button>
  </div>
</template>

<script>
export default {
  name: "LangSelectButtons",

  methods: {
    onLangSelect (langCode) {
      this.$router.push(this.switchLocalePath(langCode))?.catch(() => {})
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/header/lang-select-buttons';
</style>
