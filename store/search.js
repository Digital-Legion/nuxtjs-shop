export const actions = {
  async search (_, query) {
    return await this.$axios.get(`/search?searchQuery=${query}`)
  }
}
