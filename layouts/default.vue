<template>
  <div id="app">
    <!-- <img class="intro" src="/img/intro.png" alt v-if="!clicked" />
    <div class="gameplay" v-if="clicked && !keyDowned" />
    <div class="tuto" v-if="tuto" />
    <img class="endgame" src="/img/endgame.png" alt v-if="endgame" />-->
    <appHeader id="appHeader" />
    <nuxt id="appView" />
    <appScene id="appScene" />
    <appGame id="appGame" />
  </div>
</template>

<script>
// import { Howler } from 'howler'

import useAudio from '@/hooks/use-audio'
// import useClock from '@/hooks/use-clock'
// import useKeyboard from '@/hooks/use-keyboard'
import useGUI from '@/hooks/use-gui'

// import introSound from '~/static/sounds/intro_son_01.mp3'
// import level01 from '~/static/sounds/level1.mp3'

export default {
  components: {
    appScene: () => import('@/components/webgl/scene'),
    appGame: () => import('@/components/game/game'),
    appHeader: () => import('@/components/elements/header')
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
    const audioManager = useAudio()

    await audioManager.add(
      [{ path: '/sounds/level1.mp3', id: 'level1' }],
      this.soundLoaded.bind(this)
    )
  },
  beforeDestroy() {
    const GUI = useGUI()
    GUI.destroy()
  },
  methods: {
    soundLoaded() {
      const audioManager = useAudio()

      audioManager
        .play('level1')
        .volume(0.2)
        .loop(true)
    }
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
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 6;
}

#appView {
  position: relative;
  z-index: 10;
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
