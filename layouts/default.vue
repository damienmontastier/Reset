<template>
  <div id="app">
    <img class="intro" src="/img/intro.png" alt="" v-if="!clicked" />
    <div class="gameplay" v-if="clicked && !keyDowned" />
    <div class="tuto" v-if="tuto" />
    <nuxt id="appView" />
    <appScene id="appScene" />
    <appGame id="appGame" />
  </div>
</template>

<script>
import appScene from '@/components/webgl/scene'
import appGame from '@/components/game/game'
import useClock from '@/hooks/use-clock'
import useKeyboard from '@/hooks/use-keyboard'

export default {
  components: {
    appScene,
    appGame
  },
  data() {
    return {
      clicked: false,
      keyDowned: false,
      tuto: false
    }
  },
  mounted() {
    const keyboard = useKeyboard()
    keyboard.events.on('keydown', () => {
      this.keyDowned = true
      this.tuto = false
    })
    window.addEventListener('click', () => {
      this.clicked = true

      const clock = useClock()
      clock.resume()
    })
    this.$events.on('tuto', () => {
      this.tuto = true
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

.gameplay {
  background-image: url('/img/gameplay.png');
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  bottom: 0;
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  width: 100%;
  z-index: 5;
}

.tuto {
  background-image: url('/img/consigne.png');
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  bottom: 0;
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  width: 100%;
  z-index: 5;
}
</style>
