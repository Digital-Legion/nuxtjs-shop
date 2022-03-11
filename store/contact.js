export const actions = {
  async subscribe (_, data) { // { email, name, text } or just { email }
    return await this.$axios.post('/checkout/lead', data)
  }
}
