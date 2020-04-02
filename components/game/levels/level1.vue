<template>
  <div>level1</div>
</template>

<script>
// import gsap from 'gsap'
import useWebGL from '@/hooks/use-webgl'
import useGame from '@/hooks/use-game'

import Player from '@/game/components/player'
import Factory from '@/game/components/factory'
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

      this.factory = new Factory()
      await this.factory.load()

      this.levelGroup.add(this.factory)

      this.gridTerrain = new GridTerrain(this.factory.floor.scene)
      const { scene: webglScene } = useWebGL()
      webglScene.add(this.gridTerrain.debug)

      this.player = new Player({ gridTerrain: this.gridTerrain })

      this.levelGroup.add(this.player)
    }
  }
}
</script>
