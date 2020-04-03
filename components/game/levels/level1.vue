<template>
  <div>level1</div>
</template>

<script>
// import gsap from 'gsap'
// import useWebGL from '@/hooks/use-webgl'
import useGame from '@/hooks/use-game'

import Player from '@/game/components/player'
import MapLevel01 from '@/game/components/level_01'
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

      this.map = new MapLevel01()
      await this.map.load()

      // console.log(this.map.model)

      this.levelGroup.add(this.map)

      this.terrain = new GridTerrain(this.map.zones)
      // const { scene: webglScene } = useWebGL()
      // webglScene.add(this.terrain.debug)

      this.player = new Player({ terrain: this.terrain })
      this.player.position.copy(this.map.spawnPoint)

      this.levelGroup.add(this.player)
    }
  }
}
</script>
