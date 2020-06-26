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
      <logo></logo>
    </div>
    <div class="mission-statement-P1__intro border">
      <p>Will you help us fight the world's addiction to Smartphones ?</p>

      <btn @click.native="$emit('increment')" :inverted="true">PLAY</btn>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Logo: () => import('@/components/svg/logo-big'),
    Btn: () => import('@/components/components/btn-introduction')
  },
  data() {
    return {
      mounted: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true
    }, 0)
  }
}
</script>

<style lang="scss">
.mission-statement-P1 {
  position: relative;
  width: 23vw;

  &__logo {
    position: relative;

    svg {
      height: auto;
      width: 100%;
    }
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
