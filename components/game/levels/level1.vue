<template>
  <div>hello level1</div>
</template>

<script>
// import gsap from 'gsap'
// import useWebGL from '@/hooks/use-webgl'
import useGame from '@/hooks/use-game'
import useClock from '@/hooks/use-clock'
import useKeyboard from '@/hooks/use-keyboard'
// import useCamera from '@/hooks/use-camera'
import useRAF from '@/hooks/use-raf'
// import useAudioManager from '@/hooks/use-audio-manager'

import Player from '@/game/components/player'
import CameraMouvement from '@/game/components/camera-movement'
import MapLevel01 from '@/game/components/level_01'
import GridTerrain from '@/game/features/grid-terrain'

// import introSound from '~/static/sounds/intro_son_01.mp3'

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

      this.levelGroup.add(this.map)

      this.terrain = new GridTerrain(this.map.zones)
      // const { scene: webglScene } = useWebGL()
      // webglScene.add(this.terrain.debug)

      this.player = new Player()
      await this.player.load()
      this.initIntersections()
      this.player.position.copy(this.map.spawnPoint)

      this.levelGroup.add(this.player)

      this.cameraMouvement = new CameraMouvement({
        mesh: this.player,
        duration: 1
      })

      // const audioManager = useAudioManager()

      // await audioManager.add(introSound)
      // audioManager.play(introSound)

      const { events: keyboardEvents } = useKeyboard()
      keyboardEvents.on('keydown', this.onKeydown)

      const RAF = useRAF()
      RAF.add('level1', this.loop.bind(this))
    },

    onKeydown(e) {
      const delta = new THREE.Vector3()
      switch (e.code) {
        case 'ArrowLeft':
          delta.x -= 1
          break
        case 'ArrowRight':
          delta.x += 1
          break
        case 'ArrowDown':
          delta.z += 1
          break
        case 'ArrowUp':
          delta.z -= 1
          break
        default:
          break
      }

      if (this.player.positionTween) return

      delta.add(this.player.position)

      const { scene: gameScene } = useGame()

      const nextPosition = delta.clone().applyMatrix4(gameScene.matrixWorld)

      const intersects = this.terrain.castCell(nextPosition)

      if (intersects.length > 0) {
        // if intersects = can walk on next zone
        const intersect = intersects[0]
        const zoneName = intersect.object.name

        // if player on treadmill -> unhook()

        const position = intersect.point

        const m = new THREE.Matrix4().getInverse(gameScene.matrixWorld)
        position.applyMatrix4(m)

        const intersectZones = intersects.map(
          (intersect) => intersect.object.name
        )
        // console.log(intersectZones)

        if (intersectZones.includes('zone_tuto')) {
          this.$events.emit('tuto')
        }

        if (intersectZones.includes('zone_endgame')) {
          const clock = useClock()
          clock.pause()

          this.$events.emit('endgame')
        }

        if (!zoneName.includes('treadmill')) {
          // player is not on treadmill
          if (this.hookingTreadmill) {
            this.hookingTreadmill.unHook(this.player)
          }
          position.x = Math.floor(position.x) + 0.5
          position.z = Math.floor(position.z) + 0.5
        }

        this.player.moveTo(position)
      } else {
        console.log('out')
      }
    },

    loop(clock) {
      this.cameraMouvement.loop()
    },

    initIntersections() {
      this.player.hitbox.events.on('intersection', this.onPlayerIntersects)
    },

    onPlayerIntersects(intersections) {
      // treadmills
      const treadmillsIntersections = intersections.filter(
        (intersection) =>
          intersection.target._layers.includes('treadmill') &&
          intersection.lastIntersecting !== undefined &&
          intersection.intersecting === true
      )

      if (treadmillsIntersections.length > 0) {
        console.log('PLAYER INTERSECTS WITH TREADMILL')

        const treadmillIntersection = treadmillsIntersections[0].target
        if (this.hookingTreadmill) {
          this.hookingTreadmill.unHook(this.player)
        }
        this.hookingTreadmill = treadmillIntersection.userData.parentInstance
        this.hookingTreadmill.hook(this.player)
      }

      // parcel posts
      const parcelPostsIntersections = intersections.filter(
        (intersection) =>
          intersection.target._layers.includes('parcel_post') &&
          intersection.lastIntersecting !== undefined &&
          intersection.intersecting === true
      )

      if (parcelPostsIntersections.length > 0) {
        this.onPlayerIntersectsWithParcelPost()
      }

      // treadmills edges
      const treadmillsEdgesIntersections = intersections.filter(
        (intersection) =>
          intersection.target._layers.includes('treadmill_edge') &&
          intersection.lastIntersecting !== undefined &&
          intersection.intersecting === true
      )

      if (treadmillsEdgesIntersections.length > 0) {
        this.onPlayerIntersectsWithParcelPost()
      }
    },

    onPlayerIntersectsWithParcelPost() {
      console.log('PLAYER INTERSECTS WITH BOX')
      if (this.hookingTreadmill) {
        this.hookingTreadmill.unHook(this.player)
      }
      if (this.player.positionTween) {
        this.player.positionTween.kill()
        this.player.positionTween = null
      }
      this.player.position.copy(this.map.spawnPoint)

      const clock = useClock()
      clock.add(10)
    }
  }
}
</script>
