<template>
  <div class="wrapper">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
export default {
  name: "default",

  components: {
    Header: () => import('~/components/global/header/Header'),
    Footer: () => import('~/components/global/Footer')
  }
}
</script>
