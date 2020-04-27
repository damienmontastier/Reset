<template>
  <div v-if="rendererInfos && intersectionsInfos" class="rendererInfo">
    <div>intersections: {{ intersectionsInfos.intersections }}</div>
    <div>calls: {{ rendererInfos.render.calls }}</div>
    <div>triangles: {{ rendererInfos.render.triangles }}</div>
    <div>geometries: {{ rendererInfos.memory.geometries }}</div>
    <div>textures: {{ rendererInfos.memory.textures }}</div>
    <div>programs: {{ rendererInfos.programs.length }}</div>
  </div>
</template>

<script>
import useWebGL from '@/hooks/use-webgl'
import useGame from '@/hooks/use-game'

export default {
  data() {
    return {
      rendererInfos: null,
      intersectionsInfos: null
    }
  },
  // watch: {
  //   'renderer.info.render.frame'() {
  //     this.info = this.renderer.info
  //     console.log(this.info)
  //   }
  // },
  mounted() {
    const { renderer } = useWebGL()
    this.rendererInfos = renderer.info

    const { intersections } = useGame()
    this.intersectionsInfos = intersections.infos
  }
}
</script>

<style lang="scss">
.rendererInfo {
  background: #000;
  bottom: 0;
  color: #fff;
  left: 0;
  opacity: 0.9;
  padding: 8px;
  position: fixed;
  z-index: 10000;
}
</style>
