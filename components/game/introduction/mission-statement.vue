<template>
  <div class="mission-statement">
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component @increment="index++" :is="component"></component>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import missionStatementP1 from '@/components/game/introduction/mission-statement/mission-statement-p1'
import missionStatementP2 from '@/components/game/introduction/mission-statement/mission-statement-p2'

export default {
  components: {
    missionStatementP1,
    missionStatementP2
  },
  data() {
    return {
      introductionComponents: [missionStatementP1, missionStatementP2],
      index: 0,
      mounted: false
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
.mission-statement {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  margin-left: 80px;
  pointer-events: all;
  position: relative;
  width: 480px;

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
