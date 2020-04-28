<template>
  <div id="app">
    <img class="intro" src="/img/intro.png" alt v-if="!clicked" />
    <div class="gameplay" v-if="clicked && !keyDowned" />
    <div class="tuto" v-if="tuto" />
    <img class="endgame" src="/img/endgame.png" alt v-if="endgame" />
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
import useAudioManager from '@/hooks/use-audio-manager'

import introSound from '~/static/sounds/intro_son_01.mp3'
import level01 from '~/static/sounds/level01_son_01.mp3'

export default {
  components: {
    appScene,
    appGame
  },
  data() {
    return {
      clicked: false,
      keyDowned: false,
      tuto: undefined,
      endgame: false
    }
  },
  async mounted() {
    const audioManager = useAudioManager()

    await audioManager.add(introSound)
    await audioManager.add(level01)
    audioManager.play(introSound)

    const keyboard = useKeyboard()
    keyboard.events.on('keydown', () => {
      this.keyDowned = true
      if (this.tuto === true) {
        this.tuto = false
      }
    })
    window.addEventListener('click', () => {
      this.clicked = true

      if (!this.keyDowned) {
        audioManager.stop(introSound)
        audioManager.play(level01)
      }

      this.keyDowned = true

      if (this.endgame) return
      const clock = useClock()
      clock.resume()
    })
    this.$events.on('tuto', () => {
      requestAnimationFrame(() => {
        this.tuto = true
      })
    })

    this.$events.on('endgame', () => {
      this.endgame = true
      audioManager.stop(level01)
      audioManager.play(introSound)
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
  position: absolute;
  z-index: 6;
}

#appView {
  z-index: 3;
}

.intro,
.endgame {
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
