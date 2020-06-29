<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      // this.$router.push({ name: 'slug', params: { slug: 'infinite-scroll' } })

      // this.$router.push({ name: 'sandbox-2' })
      this.$router.push({ name: 'index' })
    }, 5000)
  }
}
</script>

<style></style>
