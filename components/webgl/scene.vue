<template>
  <div id="appScene">
    <Info v-if="infoVisible" />
  </div>
</template>

<script>
import useWebGL from '@/hooks/use-webgl'
import GLOBAL_CONFIG from '@/config/global'

export default {
  data() {
    return {
      infoVisible: false
    }
  },
  components: {
    Info: () => import('@/components/webgl/info')
  },
  mounted() {
    const { canvas } = useWebGL()
    this.$el.appendChild(canvas)

    this.infoVisible = GLOBAL_CONFIG.GUI

    this.$events.on('TOGGLE_GUI', (value) => {
      this.infoVisible = value
    })
  },
  beforeDestroy() {
    useWebGL().destroy()
  }
}
</script>

<style lang="scss">
#appScene {
  height: 100% !important;
  left: 0;
  // pointer-events: none;
  position: fixed;
  top: 0;
  width: 100% !important;
  // z-index: -1;

  canvas {
    height: 100% !important;
    width: 100% !important;
  }
}
</style>
