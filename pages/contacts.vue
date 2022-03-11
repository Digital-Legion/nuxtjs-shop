<template>
  <div class="contacts-page">
    <div class="contacts-page-container container">
      <breadcrumbs :breadcrumbs="breadcrumbs"/>
      <div class="contacts-page-title g-title">{{$t('Контакты')}}</div>
      <div class="contacts-page__inner">
        <div class="contacts-page__box">
          <div class="contacts-page-subtitle">{{$t('contact.subtitle')}}</div>
          <custom-input
            :placeholder="$t('contact.placeholder.name')"
            type="text"
            v-model="name"
            class="contacts-page-input"
            :error="showInputErrors && inputErrors.name"
            :disabled="formLoading"
          />
          <custom-input
            :placeholder="$t('contact.placeholder.email')"
            type="email"
            v-model="email"
            class="contacts-page-input"
            :error="showInputErrors && inputErrors.email"
            :disabled="formLoading"
          />
          <custom-input
            :isTextarea="true"
            :textarea-rows="5"
            :placeholder="$t('contact.placeholder.commit')"
            class="contacts-page-textarea"
            :disabled="formLoading"
          />
          <button
            class="contacts-page__btn"
            @click="onFormSubmit"
            v-t="'contact.btn.submit'"
            :disabled="formLoading"
          />
        </div>
        <div class="contacts-page__box">
          <a href="tel:+994774600000" class="contacts-page__item">
            <div class="contacts-page__col">
              <Phone />
              <span>(077) 460 00 00</span>
            </div>
          </a>
          <a href="mailto:mail@proximart.az" target="_blank" class="contacts-page__item">
            <div class="contacts-page__col">
              <Mail />
              <span>mail@proximart.az</span>
            </div>
          </a>
          <a :href="$t('gmap-location')" target="_blank" class="contacts-page__item">
            <div class="contacts-page__col">
              <MapPin />
              <span v-t="'Dilara Aliyev 188. Ağır Cinayətlər məhkəməsinin yanı.'" />
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "Contact",
  components: {
    Breadcrumbs: () => import('~/components/elements/Breadcrumbs'),
    MapPin: () => import('~/assets/icons/map-pin-green.svg?inline'),
    Mail: () => import('~/assets/icons/mail-green.svg?inline'),
    Phone: () => import('~/assets/icons/phone-green.svg?inline'),
    CustomInput: () => import('~/components/elements/CustomInput')
  },

  data() {
    return {
      breadcrumbs: [
        {
          title: 'Главная',
          path: '/'
        },
        {
          title: 'Контакты'
        }
      ],

      name: "",
      email: "",
      comment: '',

      formLoading: false,
      showInputErrors: false
    }
  },

  computed: {
    inputErrors () {
      return {
        name: this.name.trim().length === 0,
        email: !(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
          .test(this.email.toLowerCase()))
      }
    }
  },

  methods: {
    ...mapActions('contact', ['subscribe']),

    async onFormSubmit () {
      if (Object.values(this.inputErrors).some(v => v === true)) {
        this.showInputErrors = true
      } else if (!this.formLoading) {
        this.formLoading = true
        await this.subscribe({
          name: this.name,
          email: this.email,
          text: this.comment
        })
          .then(() => {
            this.$toasted.success(this.$t('Ваши данные успешно отправлены, мы скоро с вами свяжемся!').toString())
          })
          .catch(e => {
            console.error(e)
            this.$toasted.error(this.$t('Произошла при попытке отправки ваших данных').toString())
          })
        this.formLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/pages/contact";
</style>
