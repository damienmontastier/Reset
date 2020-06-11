<template>
  <div
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    class="volume"
  >
    <div
      v-for="i in 6"
      :key="i"
      :style="`height:${(i / 6) * 100}%;`"
      :class="{ 'volume__bar--fill': volume > (i - 1) / 6 }"
      class="volume__bar"
    />
  </div>
</template>

<script>
import { Howler } from 'howler'
import useAudio from '@/hooks/use-audio'

export default {
  data() {
    return {
      isMouseDown: false,
      volume: 0
    }
  },
  watch: {
    volume() {
      Howler.volume(this.volume)
    }
  },
  mounted() {
    useAudio()
    this.volume = Howler.volume()
  },
  methods: {
    onMouseDown() {
      this.isMouseDown = true
    },
    onMouseMove(e) {
      if (!this.isMouseDown) return

      this.volume = e.offsetX / 35
    },
    onMouseUp(e) {
      this.isMouseDown = false

      this.volume = e.offsetX / 35
    }
  }
}
</script>

<style lang="scss">
.volume {
  align-items: flex-end;
  cursor: pointer;
  display: flex;
  height: 22px;

  &__bar {
    background-color: var(--color-black);
    margin-right: 2px;
    pointer-events: none;
    width: 4px;

    &--fill {
      background-color: var(--color-green);
    }
  }
}
</style>
