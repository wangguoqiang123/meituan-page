<template>
  <div>
    <Header/>
    <nuxt />
    <Footer/>
  </div>
</template>
<script>
import Footer from '@/components/public/footer/index'
import Header from '@/components/public/header/index'

export default {
  components: {
    Footer,
    Header
  }
}
</script>
<style>

</style>
