<template>
  <div class="appGame">
    <!-- <game-clock class="appGame__clock" /> -->
    <div class="appGame__router">
      <span @click="goTerminal">Terminal</span>
      <router-link :to="'level1'">level1</router-link>
    </div>
  </div>
</template>

<script>
import useGame from '@/hooks/use-game'

// TODO DELETE Game clock component

export default {
  components: {
    // GameClock: () => '@/components/game/game-clock'
  },
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
