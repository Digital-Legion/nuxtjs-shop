<template>
  <ModalForm
    v-body-scroll-lock="true"
    openCondition="preorder"
    title="Предзаказ"
    @submit="onSubmit"
    :success-shown="successShown"
    @set-success-shown="successShown = $event"
    :loading="loading"
    :inputs="[
        {
          name: 'name',
          placeholder: 'Имя'
        },
        {
          type: 'phone',
          name: 'phone',
          placeholder: '+994 00 000 00 00',
          isPhone: true
        }
      ]"
  />
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "PreorderModal",

  components: {
    ModalForm: () => import('~/containers/elements/ModalForm'),
  },

  props: {
    count: {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      successShown: false,
      loading: false
    }
  },

  computed: {
    ...mapState(['preorderModalProduct', 'preorderModalColorId'])
  },

  methods: {
    ...mapActions('orders', ['placeOrder']),

    async onSubmit ({ inputs }) {
      if (!this.loading) {
        const name = inputs.find(i => i.name === 'name').value,
          phone = inputs.find(i => i.name === 'phone').value

        this.loading = true
        await this.placeOrder({
          name,
          phone,
          order_type: 'pre-order',
          products: [
            {
              id: this.preorderModalProduct.id,
              count: this.count,
              colors: this.preorderModalColorId
            }
          ]
        })
          .then(() => {
            this.successShown = true
          })
          .catch(() => {
            this.$toasted.error(this.$t('Произошла ошибка при попытке предзаказа').toString())
          })
        this.loading = false
      }
    }
  }
}
</script>
