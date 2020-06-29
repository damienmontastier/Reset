<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$router.push({ name: 'slug', params: { slug: 'infinite-scroll' } })
    }, 5000)
  }
}
</script>

<style></style>
