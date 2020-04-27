<template>
  <div id="app">
    <img class="intro" src="/img/intro.png" alt="" v-if="!clicked" />
    <nuxt id="appView" />
    <appScene id="appScene" />
    <appGame id="appGame" />
  </div>
</template>

<script>
import appScene from '@/components/webgl/scene'
import appGame from '@/components/game/game'

export default {
  components: {
    appScene,
    appGame
  },
  data() {
    return {
      clicked: false
    }
  },
  mounted() {
    window.addEventListener('click', () => {
      this.clicked = true
    })
  }
}
</script>

<style lang="scss">
#__nuxt {
  min-height: 100%;
  overflow-y: auto;
}

#app {
  min-height: 100vh;
}

#appGame {
  z-index: 2;
}

#appView {
  z-index: 3;
}

.intro {
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 5;
}
</style>
