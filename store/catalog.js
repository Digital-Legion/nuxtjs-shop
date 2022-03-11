export const state = () => ({
  defaultPrices: {
    min: 0,
    max: 10000
  },
  defaultPerPage: 12,
  defaultDiscounts: [
    {
      id: 10,
      value: 10,
      label: 'от 10% и выше'
    },
    {
      id: 30,
      value: 30,
      label: 'от 30% и выше'
    },
    {
      id: 50,
      value: 50,
      label: 'от 50% и выше'
    },
    {
      id: 70,
      value: 70,
      label: 'от 70% и выше'
    }
  ],
  defaultOrderFilters: [
    {
      id: 'pop',
      value: 'pop',
      apiValue: 'popular',
      title: 'Популярности'
    },
    {
      id: 'price',
      value: 'price',
      apiValue: 'price',
      title: 'Цене'
    },
    {
      id: 'discount',
      value: 'discount',
      apiValue: 'discount',
      title: 'Скидке'
    },
    {
      id: 'upd',
      value: 'upd',
      apiValue: 'updatedAt',
      title: 'Обновлению'
    }
  ],
  defaultSortOrders: [
    {
      id: 'desc',
      value: 'desc'
    },
    {
      id: 'asc',
      value: 'asc'
    }
  ]
})

export const actions = {
  async fetchCatalogData (_, { categoryId, selectedParameters }) {
    const hasCategoryId = ['string', 'number'].includes(typeof categoryId)

    const colors = (await this.$axios.get('/catalog/colors'))?.data || null
    const brands = (await this.$axios.get('/catalog/brands'))?.data || null
    const parameters = (await this.$axios.get(`/catalog/parameters${hasCategoryId ? `?catId=${categoryId}` : ''}`))?.data || null
    const category = hasCategoryId ? (await this.$axios.get(`/category/${categoryId}`))?.data : null
    let parameterValues = null

    if (selectedParameters?.length && parameters?.length) {
      const selectedParameterNames = parameters
        .filter(p => selectedParameters.map(sp => sp.toString()).includes(p.id?.toString()))
        .map(p => p.name)
      if (selectedParameterNames?.length) {
        parameterValues = (await this.$axios.get(encodeURI(`/catalog/params?name=${selectedParameterNames.join(',')}`)))?.data || null

        if (hasCategoryId) {
          parameterValues = parameterValues.filter(pv => pv.category?.id?.toString() === categoryId.toString())
        }
      }
    }

    return { colors, brands, parameters, category, parameterValues }
  },

  async fetchProducts (_, filters) {
    return new Promise((resolve) => {
      this.$axios.get(encodeURI(`/catalog/products${getCatalogQueryFromFilters(filters)}`))
        .then(res => {
          resolve({ products: res?.data || null })
        })
        .catch(e => {
          console.error(e)
          resolve({ products: null })
        })
    })
  },

  async fetchParameterValues (_, {parameters, selectedParameters}) {
    return new Promise((resolve) => {
      if (selectedParameters?.length) {
        const selectedParameterNames = parameters
          .filter(p => selectedParameters.map(sp => sp.toString()).includes(p.id?.toString()))
          .map(p => p.name)
        if (selectedParameterNames?.length) {
          this.$axios.get(`/catalog/params?name=${selectedParameterNames.join(',')}`)
            .then(res => {
              resolve(res?.data || null)
            })
            .catch(e => {
              console.error(e)
              resolve(null)
            })
        } else
          resolve(null)
      } else
        resolve(null)
    })
  }
}

const getCatalogQueryFromFilters = filters => {
  return `?${
    Object.entries(filters)
    .filter(e => e[1] !== null && ['string', 'number', 'object'].includes(typeof e[1]))
    .map(e => {
      if (typeof e[1] === 'object') {
        return `${e[0]}=${e[1].join(',')}`
      }
      return `${e[0]}=${e[1]}`
    })
    .join('&')
  }`
}
