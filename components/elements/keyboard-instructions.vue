<template>
  <div class="keyboard-instructions">
    <!-- eslint-disable-next-line vue/require-component-is -->
    <keyboard-arrow>Use the keyboard arrows to move around.</keyboard-arrow>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import keyboardArrow from '@/components/game/keyboard-instructions/arrow'

export default {
  components: {
    keyboardArrow
  },
  data() {
    return {
      keyboardInstructionsComponents: [keyboardArrow],
      index: 0
    }
  },
  computed: {
    component() {
      return this.keyboardInstructionsComponents[this.index]
    }
  },
  watch: {
    index(val) {
      if (val % this.keyboardInstructionsComponents.length === 0) {
      }
    }
  }
}
</script>

<style lang="scss">
.keyboard-instructions {
  bottom: 100px;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);

  .key {
    background: #0f0;
    padding: 20px;
  }
}
</style>
