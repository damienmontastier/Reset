<template>
  <div class="appGame">
    <game-clock class="appGame__clock" />
    <div class="appGame__router">
      <router-link :to="'level1'">level1</router-link>
      <router-link :to="'level2'">level2</router-link>
      <router-link :to="'level3'">level3</router-link>
    </div>
  </div>
</template>

<script>
import useGame from '@/hooks/use-game'
import GameClock from '@/components/game/game-clock'

export default {
  components: {
    GameClock
  },
  mounted() {
    useGame()
  }
}
</script>

<style lang="scss">
.appGame {
  &__router {
    bottom: 0;
    color: #fff;
    padding: 8px;
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
