<template>
  <custom-select
    class="contact-select"
    :showDropdownIcon="false"
    :openOnHover="true"
  >
    <template v-slot:top-value>
      <a href="tel:+994516600060">
        <MenuPhoneIcon />
        <span>(51) 660 00 60 </span>
      </a>
    </template>
    <template v-slot:dropdown-list>
      <li>
        <a href="tel:+994516600060">
          <TGIcon />
          <span v-t="'Телеграм'" />
        </a>
      </li>
      <li>
        <a href="tel:+994516600060">
          <WPIcon />
          <span v-t="'Вотсап'" />
        </a>
      </li>
    </template>
  </custom-select>
</template>

<script>
export default {
  name: "ContactSelect",

  components: {
    CustomSelect: () => import('~/components/elements/CustomSelect'),
    MenuPhoneIcon: () => import('~/assets/icons/phone-menu.svg?inline'),
    TGIcon: () => import('~/assets/icons/tg.svg?inline'),
    WPIcon: () => import('~/assets/icons/wp.svg?inline')
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/elements/header/contact-select';
</style>
