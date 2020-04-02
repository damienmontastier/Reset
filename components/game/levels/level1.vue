<template>
  <div>level1</div>
</template>

<script>
// import gsap from 'gsap'
// import useWebGL from '@/hooks/use-webgl'
import useGame from '@/hooks/use-game'

import Player from '@/game/components/player'
import MapLevel1 from '@/game/components/level1'
import GridTerrain from '@/game/features/grid-terrain'

export default {
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { scene: gameScene } = useGame()

      this.levelGroup = new THREE.Group()
      gameScene.add(this.levelGroup)

      this.map = new MapLevel1()
      await this.map.load()

      this.levelGroup.add(this.map)

      this.gridTerrain = new GridTerrain(this.map.floor)
      // const { scene: webglScene } = useWebGL()
      // webglScene.add(this.gridTerrain.debug)

      this.player = new Player({ gridTerrain: this.gridTerrain })
      this.player.position.copy(this.map.spawnPoint)

      this.levelGroup.add(this.player)
    }
  }
}
</script>
