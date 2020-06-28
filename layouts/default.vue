<template>
  <div id="app">
    <transition name="fade-out">
      <game-loader id="gameLoader" v-if="$store.state.loading.visible" />
    </transition>
    <app-header
      id="appHeader"
      v-if="
        !$store.state.solutions.opened &&
          !$store.state.ui.missionReportVisible &&
          $router.currentRoute.params.slug === 'infinite-scroll'
      "
    />
    <solutions id="solutions" v-if="$store.state.solutions.opened" />
    <nuxt id="appView" />
    <app-scene id="appScene" />
    <app-game id="appGame" />
    <solutions-button
      id="appGameButton"
      :style="{ 'z-index': $store.state.solutions.opened ? 15 : 4 }"
    />
    <transition name="fade">
      <div id="appOverlay" v-if="$store.state.ui.terminalVisible" />
    </transition>
  </div>
</template>

<script>
import useGUI from '@/hooks/use-gui'
import useGame from '@/hooks/use-game'

import Solutions from '@/components/game/solutions/solutions'
import AppScene from '@/components/webgl/scene'
import AppGame from '@/components/game/game'
import AppHeader from '@/components/elements/header'
import GameLoader from '@/components/game/game-loader'
import SolutionsButton from '@/components/game/solutions/solutions-button'

import GLOBAL_CONFIG from '@/config/global'

export default {
  components: {
    AppScene,
    AppGame,
    AppHeader,
    GameLoader,
    Solutions,
    SolutionsButton
  },
  computed: {
    shouldGridBeDisplayed() {
      return Boolean(
        this.$store.state.solutions.opened ||
          this.$store.state.ui.missionReportVisible
      )
    }
  },

  watch: {
    shouldGridBeDisplayed() {
      const { UIGrid, scene } = useGame()
      UIGrid.visible = this.shouldGridBeDisplayed
      scene.visible = !this.shouldGridBeDisplayed
    }
  },

  beforeDestroy() {
    const GUI = useGUI()
    GUI.destroy()
  },

  mounted() {
    this.$controller.events.on('keyup', (e) => {
      if (e.includes('TOGGLE_GUI')) {
        GLOBAL_CONFIG.GUI = !GLOBAL_CONFIG.GUI
        this.$events.emit('TOGGLE_GUI', GLOBAL_CONFIG.GUI)
      }
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

#appScene {
  z-index: 1;
}

#appGameButton {
  bottom: 40px;
  left: 40px;
  pointer-events: all;
  position: absolute;
  z-index: 4;
}

#appOverlay {
  background-color: rgba(0, 0, 0, 0.85);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 6;
}

#appView {
  // pointer-events: none;
  position: relative;
  z-index: 10;
}

#appGame {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
}

#appHeader {
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 12;
}

#solutions {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 14;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s _ease('quint', 'out');
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-out-enter-active,
.fade-out-leave-active {
  transition: opacity 1s _ease('quint', 'out');
}

.fade-out-leave-to {
  opacity: 0;
}
</style>
