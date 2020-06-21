<template>
  <div class="solutionsButton">
    <div ref="icon" />
  </div>
</template>

<script>
import lottie from 'lottie-web'
import hardDriveLottieData from '@/assets/lottie/hard-drive.json'

export default {
  mounted() {
    this.iconAnimation = lottie.loadAnimation({
      container: this.$refs.icon,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: hardDriveLottieData
    })
  }
}
</script>

<style lang="scss">
.solutionsButton {
  height: 60px;
  width: 60px;
}
</style>
