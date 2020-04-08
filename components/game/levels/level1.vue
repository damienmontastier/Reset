<template>
  <div>hello level1</div>
</template>

<script>
// import gsap from 'gsap'
// import useWebGL from '@/hooks/use-webgl'
import useGame from '@/hooks/use-game'
// import useCamera from '@/hooks/use-camera'

import Player from '@/game/components/player'
import CameraMouvement from '@/game/components/camera-mouvement'
import MapLevel01 from '@/game/components/level_01'
import GridTerrain from '@/game/features/grid-terrain'

export default {
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { scene: gameScene, raf } = useGame()
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
      await this.player.load()
      this.initIntersections()
      this.player.position.copy(this.map.spawnPoint)

      this.levelGroup.add(this.player)

      this.cameraAnimation = new CameraMouvement({
        mesh: this.player,
        duration: 1
      })

      raf.add('level1', this.loop.bind(this))
    },

    loop() {},

    initIntersections() {
      // this.player.hitbox
      // console.log(this.player.hitbox)
      this.player.hitbox.events.on('intersection', (intersections) => {
        // parcel posts
        const parcelPostsIntersections = intersections.filter(
          (intersection) =>
            intersection.target._layers.includes('parcel_post') &&
            intersection.lastIntersecting !== undefined &&
            intersection.intersecting === true
        )

        if (parcelPostsIntersections.length > 0) {
          console.log('PLAYER INTERSECTS WITH BOX')
        }

        const treadmillsIntersections = intersections.filter(
          (intersection) =>
            intersection.target._layers.includes('treadmill') &&
            intersection.lastIntersecting !== undefined &&
            intersection.intersecting === true
        )

        if (treadmillsIntersections.length > 0) {
          console.log('PLAYER INTERSECTS WITH TREADMILL')

          const treadmillIntersection = treadmillsIntersections[0].target
          if (this.treadmill) {
            this.treadmill.unHook(this.player)
          }
          this.treadmill = treadmillIntersection.userData.parentInstance
          this.treadmill.hook(this.player)
        }
      })
    }
  }
}
</script>
