<template>
  <div
    :class="{
      transition__fadeIn: true,
      'transition--on': mounted
    }"
    :style="{ 'transition-delay': `0.1s` }"
    class="mission-statement-P1"
  >
    <div class="mission-statement-P1__logo">
      <!-- <logo ref="logo"></logo> -->
      <div ref="logo"></div>
    </div>
    <div class="mission-statement-P1__intro border">
      <p>Will you help us fight the world's addiction to Smartphones ?</p>

      <btn @click.native="$emit('increment')" :inverted="true">PLAY</btn>
    </div>
  </div>
</template>

<script>
import lottie from 'lottie-web'
import resetLogo from '@/assets/lottie/reset-logo.json'

export default {
  components: {
    Btn: () => import('@/components/components/btn-introduction')
  },
  data() {
    return {
      mounted: false
    }
  },
  mounted() {
    this.logoAnimation = lottie.loadAnimation({
      container: this.$refs.logo,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: resetLogo
    })
    setTimeout(() => {
      this.mounted = true
    }, 0)
  }
}
</script>

<style lang="scss">
.mission-statement-P1 {
  position: relative;
  width: 70%;

  &__logo {
    position: relative;
  }

  &__intro {
    background: var(--color-grey-introduction);
    margin-top: 65px;

    p {
      font-family: var(--font-violet);
      font-size: 18px;
      line-height: 22px;
      padding: 15px 28px;
    }
  }
}
</style>
