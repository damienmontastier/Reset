<template>
  <div class="introduction">
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component @increment="index++" :is="component"></component>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import IntroductionP1 from '@/components/game/introduction/introduction-p1'
import IntroductionP2 from '@/components/game/introduction/introduction-p2'

export default {
  components: {
    IntroductionP1,
    IntroductionP2
  },
  data() {
    return {
      introductionComponents: [IntroductionP1, IntroductionP2],
      index: 0
    }
  },
  computed: {
    component() {
      return this.introductionComponents[this.index]
    }
  },
  watch: {
    index(val) {
      if (val % this.introductionComponents.length === 0) {
        this.$emit('startMission')
      }
    }
  }
}
</script>

<style lang="scss">
.introduction {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  margin-left: 80px;
  position: relative;
  width: 32vw;
  z-index: 999;

  .border {
    border: 1px solid #161616;
  }

  .border-bottom {
    border-bottom: 1px solid #161616;
  }

  &--wrapper {
    padding: 25px 30px;
  }
}
</style>
