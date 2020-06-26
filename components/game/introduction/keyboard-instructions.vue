<template>
  <div class="keyboard-instructions">
    <keyboard-arrow
      ><p>Use the keyboard arrows to move around.</p></keyboard-arrow
    >
    <keyboard-key>
      <p slot="before" class="before">Use</p>
      <p slot="after" class="after">to move around.</p>
    </keyboard-key>
  </div>
</template>

<script>
import keyboardArrow from '@/components/game/introduction/keyboard-instructions/arrow'
import keyboardKey from '@/components/game/introduction/keyboard-instructions/zqsd'

export default {
  components: {
    keyboardArrow,
    keyboardKey
  },
  data() {
    return {
      showFirstControls: true,
      showControls: true,
      displayDurationControls: 4500
    }
  },
  mounted() {
    setTimeout(() => {
      this.showFirstControls = false
      setTimeout(() => {
        // this.showControls = false
      }, this.displayDurationControls)
    }, this.displayDurationControls)
  },
  methods: {}
}
</script>

<style lang="scss">
.keyboard-instructions {
  bottom: 50px;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);

  .key {
    background: #0f0;
    border: 1px solid var(--color-black);
    display: inline-block;
    height: 50px;
    padding: 20px;
    width: 50px;

    &.pressed {
      transform: scale(1.1);
    }
  }

  p {
    color: var(--color-black);
    font-family: var(--font-violet);
    font-size: 16px;
    text-align: center;
  }
}
</style>
