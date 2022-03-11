<template>
  <transition name="fade" mode="out-in">
    <modal class="modal-form" v-if="modalFormOpen" @close="onClose">
      <flip-card :flipped="successShown">
        <template v-slot:front>
          <div class="modal-form__card">
            <Loading v-if="loading" />

            <div class="modal-form__top">
              <button @click="onClose">
                <CloseIcon />
                <span v-t="'Отмена'" />
              </button>
            </div>
            <h2 v-t="title" />
            <custom-input
              v-for="(input, index) in dataInputs"
              :key="index"
              :name="input.name"
              :error="!isFirstSubmit && formErrors[input.name]"
              :type="input.type || 'text'"
              :is-phone="input.isPhone || false"
              v-model="input.value"
              :placeholder="$t(input.placeholder)"
            />
            <button class="modal-form__send" @click="onSubmit" v-t="'Отправить'" />
          </div>
        </template>
        <template v-slot:back>
          <div class="modal-form__card modal-form__thanks">
            <div class="modal-form__top">
              <button @click="backToIndex">
                <ArrowLeftIcon />
                <span v-t="'На главную'" />
              </button>
            </div>
            <OperatorIcon />
            <span class="modal-form__thanks-text" v-html="$t('Спасибо, мы вам перезвоним!')" />
          </div>
        </template>
      </flip-card>
    </modal>
  </transition>
</template>

<script>
export default {
  name: "ModalForm",

  components: {
    FlipCard: () => import('./FlipCard'),
    Modal: () => import('./Modal'),
    CustomInput: () => import('~/components/elements/CustomInput'),
    Loading: () => import('~/components/elements/Loading'),
    OperatorIcon: () => import('~/assets/icons/operator.svg?inline'),
    CloseIcon: () => import('~/assets/icons/close.svg?inline'),
    ArrowLeftIcon: () => import('~/assets/icons/arrow-left.svg?inline')
  },

  props: {
    title: {
      type: String,
      required: true
    },
    inputs: {
      type: Array,
      required: true
    },
    openCondition: {
      type: String,
      required: true
    },
    successShown: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      showErrors: false,
      isFirstSubmit: true,

      dataInputs: this.inputs.map(input => ({
        ...input,
        value: ''
      }))
    }
  },

  computed: {
    modalFormOpen () {
      return this.$store.state[`${this.openCondition}ModalShown`]
    },

    openConditionU () {
      return this.openCondition[0].toUpperCase() + this.openCondition.slice(1)
    },

    formErrors () {
      const errors = {}

      this.dataInputs.forEach(input => {
        if (input.name === 'name') errors.name = input.value.trim() === ''
        if (input.isPhone === true) errors.phone = input.value.length < 17
      })

      return errors
    }
  },

  methods: {
    onSubmit () {
      this.isFirstSubmit = false

      if (Object.values(this.formErrors).some(e => e === true)) {
        this.showErrors = true
        return
      }

      this.$emit('submit', { inputs: this.dataInputs })
    },

    onClose () {
      if (!this.loading) {
        this.isFirstSubmit = true
        this.$store.commit(`hide${this.openConditionU}Modal`)
        this.$emit('set-success-shown', false)
        const inputs = this.dataInputs.slice()
        inputs.forEach(i => i.value = '')
        this.$set(this, 'dataInputs', inputs)
      }
    },

    backToIndex () {
      this.$router.push('/')?.catch(() => {})
      this.onClose()
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/styles/containers/modal-form';
</style>
