<template>
  <div class="header-nav">
    <div class="container">
      <div class="header-nav__wrapper">
        <div class="header-nav__nav">
          <clink class="header-nav__nav-item" :to="{name: 'index'}">{{ $t('menu.main') }}</clink>
          <clink class="header-nav__nav-item" to="/catalog">{{ $t('menu.category') }}</clink>
          <clink class="header-nav__nav-item" to="/about">{{ $t('menu.about') }}</clink>
          <clink class="header-nav__nav-item" to="/blog">{{ $t('menu.blog') }}</clink>
          <clink class="header-nav__nav-item" to="/contacts">{{ $t('menu.contact') }}</clink>
        </div>
        <div class="header-nav__inner">
          <contact-select class="header-nav__phone" />
          <clink class="header-nav__order" to="/">
            <span>Заказать звонок</span>
          </clink>
          <lang-select />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderNav",

  components: {
    LangSelect: () => import('~/components/global/header/LangSelect'),
    ContactSelect: () => import('~/components/global/header/ContactSelect')
  }
}
</script>

<style lang="scss">
  @import "~/assets/styles/elements/header/header-nav";
</style>
