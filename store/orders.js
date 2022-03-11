export const actions = {
  async placeOrder (_, data) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/checkout', data)
        .then(res => {
          resolve(res)
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  }
}
