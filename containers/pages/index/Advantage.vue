<template>
  <div class="index-advantage container">
    <div class="index-advantage__wrapper">
      <div class="index-advantage__item">
        <div class="index-advantage__svg">
          <DeliveryIcon />
        </div>
        <span>{{ $t('main.advantage.bet') }}</span>
      </div>
      <div class="index-advantage__item">
        <div class="index-advantage__svg">
          <LikeIconAdvantage />
        </div>
        <span>{{ $t('main.advantage.quality') }}</span>
      </div>
      <div class="index-advantage__item">
        <div class="index-advantage__svg">
          <ChatIcon />
        </div>
        <span>{{ $t('main.advantage.answer') }}</span>
      </div>
      <div class="index-advantage__item">
        <div class="index-advantage__svg">
          <MoneyIcon />
        </div>
        <span>{{ $t('main.advantage.price') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Advantage",
  components: {
    ChatIcon: () => import('@/assets/icons/chat-advantage.svg?inline'),
    LikeIconAdvantage: () => import('@/assets/icons/like-advantage.svg?inline'),
    DeliveryIcon: () => import('@/assets/icons/delivery-advantage.svg?inline'),
    MoneyIcon: () => import('@/assets/icons/money-advantage.svg?inline'),
  }
}
</script>

<style lang="scss">
@import "~/assets/styles/containers/pages/index/advantage";
</style>
