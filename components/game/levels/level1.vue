<template>
  <div class="gameLevel1">
    <game-notifications ref="notifications" />
    <terminal v-if="playerIsOnTerminal" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import gsap from 'gsap'

import useGUI from '@/hooks/use-gui'
import useCamera from '@/hooks/use-camera'
import useGame from '@/hooks/use-game'
import useClock from '@/hooks/use-clock'
import useKeyboard from '@/hooks/use-keyboard'
import useRAF from '@/hooks/use-raf'

import Player from '@/game/components/player'
// import CameraMouvement from '@/game/components/camera-movement'
import MapLevel01 from '@/game/components/level_01'
import GridTerrain from '@/game/features/grid-terrain'

import ParticulesPlane from '@/webgl/components/particules-plane'

// import Terminal from '@/components/game/terminal/terminal'

import treadmillConfig from '@/config/treadmills'

export default {
  components: {
    Terminal: () => import('@/components/game/terminal/terminal'),
    gameNotifications: () => import('@/components/elements/game-notifications')
  },
  data() {
    return {
      currentZones: [],
      playerIsOnFloor: undefined,
      playerIsOnTerminal: undefined,
      playerIsOnTuto: undefined,
      playerIsOnTreadmill: undefined,
      playerIsOnEndgame: undefined
    }
  },

  computed: {
    ...mapState({
      terminalIsOpened: (state) => state.terminalIsOpened,
      posts: (state) => state.posts
    })
  },
  watch: {
    currentZones() {
      this.playerIsOnFloor = this.currentZones.includes('zone_floor')
      this.playerIsOnTerminal = this.currentZones.includes('zone_terminal')
      this.playerIsOnTuto = this.currentZones.includes('zone_tuto')
      this.playerIsOnEndgame = this.currentZones.includes('zone_endgame')
      this.playerIsOnTreadmill = this.currentZones.some((zone) =>
        zone.includes('zone_treadmill')
      )

      // console.log('floor', this.playerIsOnFloor)
      // console.log('terminal', this.playerIsOnTerminal)
      // console.log('tuto', this.playerIsOnTuto)
      // console.log('treadmill', this.playerIsOnTreadmill)
      // console.log('endgame', this.playerIsOnEndgame)
    },
    playerIsOnTuto(newVal, oldVal) {
      if (this.playerIsOnTuto === true) {
        console.log('TUTO ENTER')
      } else if (this.playerIsOnTuto === false && oldVal !== undefined) {
        console.log('TUTO LEAVE')
      }
    },
    playerIsOnTreadmill(newVal, oldVal) {
      if (this.playerIsOnTreadmill === true) {
        console.log('TREADMILL ENTER')
      } else if (this.playerIsOnTreadmill === false && oldVal !== undefined) {
        console.log('TREADMILL LEAVE')
      }
    },
    playerIsOnTerminal(newVal, oldVal) {
      if (this.playerIsOnTerminal === true) {
        console.log('TERMINAL ENTER')
      } else if (this.playerIsOnTerminal === false && oldVal !== undefined) {
        console.log('TERMINAL LEAVE')
      }
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.player.hitbox.events.off('intersection', this.onPlayerIntersects)

    const { events: keyboardEvents } = useKeyboard()
    keyboardEvents.off('keydown', this.onKeydown)
  },
  methods: {
    async init() {
      // const {
      //   OrbitControls
      // } = require('three/examples/jsm/controls/OrbitControls.js')

      // const { camera } = useCamera()
      // const cameraControls = new OrbitControls(
      //   camera,
      //   document.querySelector('#__nuxt')
      // )
      // cameraControls.enableKeys = false

      const { scene: gameScene } = useGame()

      this.particulesPlane = new ParticulesPlane()
      gameScene.add(this.particulesPlane)

      this.particulesPlane.position.z = -10

      this.particulesPlane.scale.setScalar(50)
      this.particulesPlane.rotation.x = -Math.PI / 2
      this.particulesPlane.rotation.z = -Math.PI / 4

      this.particulesPlane.position.y = -2

      // const { composer } = useWebGL()
      // const { bloomEffect } = composer

      // bloomEffect.selection.add(this.particulesPlane)

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

      this.spawnPoint = this.map.spawnPoint.clone()
      this.player.position.copy(this.spawnPoint)

      this.levelGroup.add(this.player)

      // this.cameraMouvement = new CameraMouvement({
      //   mesh: this.player,
      //   duration: 1
      // })

      // const audioManager = useAudioManager()

      // await audioManager.add(introSound)
      // audioManager.play(introSound)

      const { events: keyboardEvents } = useKeyboard()
      keyboardEvents.on('keydown', this.onKeydown)

      this.initGUI()

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

        const checkpointIndex = intersects.findIndex((intersect) =>
          intersect.object.name.includes('zone_chekpoint')
        )
        const checkpoint = intersects[checkpointIndex]
        if (checkpoint) {
          console.log(checkpoint)
          this.spawnPoint = checkpoint.object.position
            .clone()
            .add(new THREE.Vector3(-0.5, 0, 0))
        }
        const intersect = intersects[0]
        const zoneName = intersect.object.name

        // if player on treadmill -> unhook()

        const position = intersect.point

        const m = new THREE.Matrix4().getInverse(gameScene.matrixWorld)
        position.applyMatrix4(m)

        const intersectZones = intersects.map(
          (intersect) => intersect.object.name
        )

        this.currentZones = intersectZones

        // if (intersectZones.includes('zone_tuto')) {
        //   this.$events.emit('tuto')
        // }

        // if (intersectZones.includes('zone_endgame')) {
        //   const clock = useClock()
        //   clock.pause()

        //   this.$events.emit('endgame')
        // }

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
      // this.cameraMouvement.loop()
      this.particulesPlane.update(clock)

      const { camera } = useCamera()
      const nextPosition = this.player.worldPosition
        .clone()
        .add(camera.originPosition)

      // const { scene } = useWebGL()
      // camera.lookAt(scene.position)

      gsap.to(camera.position, {
        x: nextPosition.x,
        y: camera.originPosition.y,
        z: nextPosition.z,
        duration: 1,
        ease: 'power2.out'
      })
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
      this.$refs.notifications.addItem(
        this.posts[Math.floor(Math.random() * this.posts.length)]
      )

      if (this.hookingTreadmill) {
        this.hookingTreadmill.unHook(this.player)
      }
      if (this.player.positionTween) {
        this.player.positionTween.kill()
        this.player.positionTween = null
      }

      // TODO checkpoint

      this.player.position.copy(this.spawnPoint)

      const clock = useClock()
      clock.add(10)
    },

    initGUI() {
      const GUI = useGUI()

      const { camera } = useCamera()

      const params = {
        lookAtPlayer: () => {
          camera.lookAt(this.player.position)
        }
      }

      GUI.camera.addVector('position', camera.originPosition)
      GUI.camera.add(params, 'lookAtPlayer')

      const treadmillGUI = GUI.addFolder('treadmills config')
      const zoneAGUI = treadmillGUI.addFolder('a')
      zoneAGUI
        .add(treadmillConfig.zone_A, 'speedScale')
        .min(0)
        .max(0.2)
        .step(0.01)
      zoneAGUI
        .add(treadmillConfig.zone_A, 'speedMinimum')
        .min(0)
        .max(3)
        .step(0.01)
      zoneAGUI
        .add(treadmillConfig.zone_A, 'speedRandomness')
        .min(0)
        .max(3)
        .step(0.01)
      zoneAGUI
        .add(treadmillConfig.zone_A, 'appearIntervalMinimum')
        .min(0)
        .max(3)
        .step(0.01)
      zoneAGUI
        .add(treadmillConfig.zone_A, 'appearIntervalRandomness')
        .min(0)
        .max(10)
        .step(0.01)

      const zoneBGUI = treadmillGUI.addFolder('b')
      zoneBGUI
        .add(treadmillConfig.zone_B, 'speedScale')
        .min(0)
        .max(0.2)
        .step(0.01)
      zoneBGUI
        .add(treadmillConfig.zone_B, 'speedMinimum')
        .min(0)
        .max(3)
        .step(0.01)
      zoneBGUI
        .add(treadmillConfig.zone_B, 'speedRandomness')
        .min(0)
        .max(3)
        .step(0.01)
      zoneBGUI
        .add(treadmillConfig.zone_B, 'appearIntervalMinimum')
        .min(0)
        .max(3)
        .step(0.01)
      zoneBGUI
        .add(treadmillConfig.zone_B, 'appearIntervalRandomness')
        .min(0)
        .max(10)
        .step(0.01)

      const zoneCGUI = treadmillGUI.addFolder('c')
      zoneCGUI
        .add(treadmillConfig.zone_C, 'speedScale')
        .min(0)
        .max(0.2)
        .step(0.01)
      zoneCGUI
        .add(treadmillConfig.zone_C, 'speedMinimum')
        .min(0)
        .max(3)
        .step(0.01)
      zoneCGUI
        .add(treadmillConfig.zone_C, 'speedRandomness')
        .min(0)
        .max(3)
        .step(0.01)
      zoneCGUI
        .add(treadmillConfig.zone_C, 'appearIntervalMinimum')
        .min(0)
        .max(3)
        .step(0.01)
      zoneCGUI
        .add(treadmillConfig.zone_C, 'appearIntervalRandomness')
        .min(0)
        .max(10)
        .step(0.01)
    }
  }
}
</script>
