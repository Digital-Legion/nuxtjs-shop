import {mapActions} from "vuex";
import debounce from "lodash.debounce";

export default {
  data() {
    return {
      searchQuery: '',
      searchLoading: false,
      searchFocused: false,
      searchResults: null
    }
  },

  watch: {
    searchQuery () {
      this.beforeDebouncedSearch()
    }
  },

  methods: {
    ...mapActions('search', ['search']),

    async onSearch () {
      if (this.searchQuery.trim()) {
        await this.search(this.searchQuery)
          .then(res => {
            this.$set(this, 'searchResults', res.data?.map(p => ({
              name: p.name,
              name__az: p.name__az,
              slug: p.slug,
              slug__az: p.slug__az
            })))
          })
          .catch(e => {
            console.error(e)
          })
      }
      this.searchLoading = false
    },

    beforeDebouncedSearch () {
      this.searchResults = null
      this.searchLoading = true
      this.debouncedSearch()
    },

    debouncedSearch: debounce (async function() {
      await this.onSearch()
    }, 1000)
  }
}
