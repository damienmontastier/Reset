<template>
  <div class="appGame">
    <div class="appGame__router">
      <router-link to="/">Introduction</router-link>
      <span @click="goTerminal">Terminal</span>
      <router-link :to="'level1'">level1</router-link>
      <button @click="$events.emit('TERMINAL COMPLETED')">
        complete terminal
      </button>
      <button @click="cameraShake">
        camera shake
      </button>
    </div>
    <solutions-button class="appGame__button" />
    <game-controls class="appGame__controls" />
  </div>
</template>

<script>
import useGame from '@/hooks/use-game'
import useCamera from '@/hooks/use-camera'

export default {
  components: {
    GameControls: () => import('@/components/game/game-controls'),
    SolutionsButton: () =>
      import('@/components/game/solutions/solutions-button')
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
    },
    cameraShake() {
      useCamera().shake()
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

  &__button {
    bottom: 40px;
    left: 40px;
    pointer-events: all;
    position: absolute;
  }

  &__controls {
    bottom: 40px;
    pointer-events: all;
    position: absolute;
    right: 40px;
  }
}
</style>
