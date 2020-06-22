<template>
  <div id="app">
    <game-loader v-if="$store.state.loading.visible" id="gameLoader" />
    <app-header id="appHeader" />
    <nuxt id="appView" />
    <app-scene id="appScene" />
    <app-game id="appGame" />
    <div id="appOverlay" v-if="overlayOpened" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import useGUI from '@/hooks/use-gui'

export default {
  components: {
    appScene: () => import('@/components/webgl/scene'),
    appGame: () => import('@/components/game/game'),
    appHeader: () => import('@/components/elements/header'),
    gameLoader: () => import('@/components/game/game-loader')
  },
  data() {
    return {
      clicked: false,
      keyDowned: false,
      tuto: undefined,
      endgame: false
    }
  },
  computed: {
    ...mapState({
      overlayOpened: (state) => state.overlayOpened,
      appearHeader: (state) => state.appearHeader
    })
  },

  fetch() {
    this.$store.commit('stages/setScore', {
      stage: 'level1',
      score: 150
    })

    this.$store.commit('stages/setScore', {
      stage: 'level2',
      score: 300
    })
  },

  beforeDestroy() {
    const GUI = useGUI()
    GUI.destroy()
  },

  mounted() {
    const GUI = useGUI()
    const params = {
      level1: 150,
      level2: 300
    }

    const stagesGUI = GUI.addFolder('Stages')
    stagesGUI
      .add(params, 'level1')
      .min(0)
      .max(300)
      .step(1)
      .onChange(() => {
        this.$store.commit('stages/setScore', {
          stage: 'level1',
          score: params.level1
        })
      })

    stagesGUI
      .add(params, 'level2')
      .min(0)
      .max(300)
      .step(1)
      .onChange(() => {
        this.$store.commit('stages/setScore', {
          stage: 'level2',
          score: params.level2
        })
      })
  }
}
</script>

<style lang="scss">
#__nuxt {
  min-height: 100%;
  overflow-y: auto;
}

#__layout {
  width: 100vw;
}

#gameLoader {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 20;
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
  z-index: 12;
}

#appOverlay {
  background-color: rgba(0, 0, 0, 0.85);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

#appView {
  pointer-events: none;
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
