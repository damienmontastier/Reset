<template>
  <div class="appGame">
    <div class="appGame__router">
      <router-link to="/">Introduction</router-link>
      <span @click="goTerminal">Terminal</span>
      <router-link :to="'level1'">level1</router-link>
      <button @click="$events.emit('TERMINAL COMPLETED')">
        complete terminal
      </button>
    </div>
  </div>
</template>

<script>
import useGame from '@/hooks/use-game'

export default {
  mounted() {
    useGame()
  },
  beforeDestroy() {
    useGame().destroy()
  },
  methods: {
    goTerminal() {
      this.$events.emit('teleportToTerminal')
    }
  }
}
</script>

<style lang="scss">
.appGame {
  pointer-events: none;

  &__router {
    bottom: 0;
    color: #fff;
    padding: 8px;
    pointer-events: all;
    position: absolute;
    right: 0;
  }

  &__clock {
    background: #0f0;
    color: #000;
    font-family: sans-serif;
    font-size: 20px;
    left: 64px;
    padding: 8px;
    position: absolute;
    top: 64px;
  }
}
</style>
