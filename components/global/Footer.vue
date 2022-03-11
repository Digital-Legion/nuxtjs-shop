<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__icon">
          <ProximartIcon />
        </div>
        <div class="footer__row">
          <div class="footer__column">
            <div class="footer__subtitle">{{ $t('footer.nav') }}</div>
            <clink to="/" class="footer__nav">{{ $t('footer.main') }}</clink>
            <clink to="/catalog" class="footer__nav">{{ $t('footer.catalog') }}</clink>
            <clink to="/blog" class="footer__nav">{{ $t('footer.blog') }}</clink>
            <clink to="/about" class="footer__nav">{{ $t('footer.about') }}</clink>
            <clink to="/contacts" class="footer__nav">{{ $t('Контакты') }}</clink>
          </div>
          <div class="footer__column">
            <div class="footer__subtitle">{{ $t('footer.help') }}</div>
            <clink to="/payment" class="footer__nav">{{ $t('footer.payment') }}</clink>
            <clink to="/delivery" class="footer__nav">{{ $t('footer.delivery') }}</clink>
            <clink to="/confidentiality" class="footer__nav">{{ $t('footer.confidentiality') }}</clink>
            <clink to="/bonuses" class="footer__nav">{{ $t('footer.bonuses') }}</clink>
          </div>
          <div class="footer__column">
            <div class="footer__subtitle">{{ $t('Контакты') }}</div>
            <a href="tel:+994774600000" class="footer__contact">
              <PhoneIcon />
              <span>(077) 460 00 00</span>
            </a>
            <a href="mailto:mail@proximart.az" target="_blank" class="footer__contact">
              <MailIcon />
              <span>mail@proximart.az</span>
            </a>
            <a :href="$t('gmap-location')" target="_blank" class="footer__contact">
              <MapPinIcon />
              <span v-t="'Dilara Aliyeva 188. Ağır Cinayətlər məhkəməsinin yanı.'" />
            </a>
          </div>
          <div class="footer__column footer__column--discount">
            <div class="footer__subtitle footer__subtitle--last">{{ $t('footer.discount') }}</div>
            <div class="footer__text">{{ $t('footer.info') }}</div>
            <div class="footer__email" v-if="!showSubscriptionSuccess">
              <custom-input
                class="footer__input"
                v-model="subscriptionEmail"
                @input="showSubscriptionEmailError = false"
                :compact="true"
                :error="showSubscriptionEmailError && subscriptionEmailError"
                type="email"
                name="email"
                placeholder="Email"
                :disabled="subscriptionLoading"
              />
              <button class="footer__button" @click="onSubscriptionSubmit" :disabled="subscriptionLoading">
                <span v-t="'Ок'" />
              </button>
            </div>
            <div class="footer__subscription-success" v-else>
              <CheckGreenIcon />
              <span>{{ $t('Спасибо за подписку') }}!</span>
            </div>
            <div class="footer__socials">
              <clink to="/" class="footer__svg">
                <TelegramIcon />
              </clink>
              <clink to="/" class="footer__svg">
                <InstIcon />
              </clink>
              <clink to="/" class="footer__svg">
                <YoutubeIcon />
              </clink>
            </div>
          </div>
        </div>
        <div class="footer__copyright">2021 © Proximart Official Store</div>
      </div>
    </div>
  </footer>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "Footer",

  components: {
    ProximartIcon: () => import('~/assets/icons/proximart.svg?inline'),
    InstIcon: () => import('~/assets/icons/instagram.svg?inline'),
    TelegramIcon: () => import('~/assets/icons/telegram.svg?inline'),
    YoutubeIcon: () => import('~/assets/icons/youtube.svg?inline'),
    PhoneIcon: () => import('~/assets/icons/footer-phone.svg?inline'),
    MapPinIcon: () => import('~/assets/icons/footer-map-pin.svg?inline'),
    MailIcon: () => import('~/assets/icons/footer-mail.svg?inline'),
    CheckGreenIcon: () => import('~/assets/icons/check-green.svg?inline'),
    CustomInput: () => import('~/components/elements/CustomInput')
  },

  data () {
    return {
      subscriptionLoading: false,
      subscriptionEmail: '',
      showSubscriptionEmailError: false,
      showSubscriptionSuccess: false
    }
  },

  computed: {
    subscriptionEmailError () {
      return !(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
          .test(this.subscriptionEmail.toLowerCase())
      )
    }
  },

  methods: {
    ...mapActions('contact', ['subscribe']),

    async onSubscriptionSubmit () {
      if (this.subscriptionEmailError) {
        this.showSubscriptionEmailError = true
      } else if (!this.subscriptionLoading) {
        this.subscriptionLoading = true
        await this.subscribe({
          email: this.subscriptionEmail.trim()
        })
          .then(() => {
            this.$toasted.success(this.$t('Вы успешно подписались на рассылку').toString())
            this.subscriptionEmail = ''
            this.showSubscriptionSuccess = true
          })
          .catch(e => {
            console.error(e)
            this.$toasted.error(this.$t('Произошла при попытке подписаться').toString())
          })
        this.subscriptionLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/elements/footer";
</style>
