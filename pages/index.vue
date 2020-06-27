<template>
  <div class="homepage">
    <mission-statement @startMission="startTraveling"></mission-statement>
    <keyboard-instructions
      @closeKeyboardInstructions="showControls = false"
      v-if="showControls"
    ></keyboard-instructions>
    <!-- <video-transition v-if="playerInteractWithSmartphone"></video-transition> -->
    <video-transition v-if="false"></video-transition>
  </div>
</template>

<script>
import gsap from 'gsap'

import useGame from '@/hooks/use-game'
import useCamera from '@/hooks/use-camera'
import useClock from '@/hooks/use-clock'
import useWebGL from '@/hooks/use-webgl'
import useRAF from '@/hooks/use-raf'
import useGUI from '@/hooks/use-gui'

import Player from '@/game/components/player'
import MapIntroduction from '@/game/components/intro'
import GridTerrain from '@/game/features/grid-terrain'
import DotsPlane from '@/webgl/components/dots-plane'
import Spline from '@/webgl/components/spline'

import INTRODUCTION_CONFIG from '@/config/introduction'
import missionStatement from '@/components/game/introduction/mission-statement'
import keyboardInstructions from '@/components/game/introduction/keyboard-instructions'
import videoTransition from '@/components/game/introduction/video-transition'

export default {
  components: {
    missionStatement,
    keyboardInstructions,
    videoTransition
  },
  data() {
    return {
      currentZones: [],
      playerIsInteract: undefined,
      playerInteractWithSmartphone: false,
      movementEnabled: false,
      showControls: false
    }
  },
  watch: {
    currentZones() {
      this.playerIsInteract = this.currentZones.includes('zone_interact')
    },
    playerIsInteract(val, oldVal) {
      if (val) {
        this.playerInteractWithSmartphone = val
        this.movementEnabled = false
      }
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.$controller.events.off('keyup', this.onKeydown)
  },
  methods: {
    async init() {
      const { scene } = useGame()
      const { scene: webglScene } = useWebGL()
      const camera = useCamera()
      const GUI = useGUI()

      this.cameraPosition = 'follow player'

      webglScene.background = new THREE.Color(0xffffff)

      this.introGroup = new THREE.Group()
      scene.add(this.introGroup)

      this.map = new MapIntroduction()
      await this.map.load()
      this.introGroup.add(this.map)

      this.introSpline = await new Spline().load(
        'obj/splines/intro_spline_03.obj'
      )
      this.map.add(this.introSpline)

      this.terrain = new GridTerrain(this.map.zones)

      this.player = new Player()
      await this.player.init()
      this.spawnPoint = this.map.spawnPoint.clone()
      this.player.position.copy(this.spawnPoint)
      this.introGroup.add(this.player)
      this.player.animations.idle.stop()
      this.player.initSkeletonVirtualization()

      camera.camera.lookAt(
        camera._position
          .clone()
          .sub(camera._angle)
          .sub(camera._shake)
          .add(new THREE.Vector3(0, 0.75, 0))
      )

      GUI.camera.addVector('origin position', camera._position)

      this.$controller.events.on('keyup', this.onKeydown)

      this.dotsPlane = new DotsPlane(INTRODUCTION_CONFIG.dots)

      scene.add(this.dotsPlane)
      this.dotsPlane.scale.setScalar(50)
      this.dotsPlane.rotation.x = -Math.PI / 2
      this.dotsPlane.position.y = -2

      const RAF = useRAF()
      RAF.add('introduction', this.loop.bind(this))
    },

    startTraveling() {
      const camera = useCamera()
      camera.disableMouseMove = true

      this.player.appearPlayer()

      this.cameraPosition = 'intro travelling'

      this.progress = 0
      gsap.to(this, {
        duration: 8,
        ease: 'none',
        progress: 1,
        onUpdate: () => {
          const postion = this.introSpline.curvedPath.getPoint(this.progress)
          camera.camera.lookAt(this.player.position)
          camera._position.copy(postion)
        },
        onComplete: () => {
          this.cameraPosition = 'follow player'
          camera.disableMouseMove = false

          this.onStartMovementPlayer()
        }
      })
    },

    onStartMovementPlayer() {
      const { scene } = useGame()

      this.player.skeletonVirtualization.traverse((child) => {
        if (child.skeleton && child.skeleton.boneTexture) {
          child.geometry.dispose()
          child.material.dispose()
          child.skeleton.boneTexture.dispose()
        }
      })

      scene.remove(this.player.skeletonVirtualization)

      this.player.animations.idle.play()

      gsap.to(this.player.animations.tPose, {
        weight: 0,
        duration: 0.5,
        onComplete: () => {
          this.showControls = true
        },
        ease: 'power3.out'
      })

      this.movementEnabled = true
    },

    loop(clock) {
      if (this.cameraPosition === 'follow player') {
        const camera = useCamera()
        const nextPosition = this.player.worldPosition
          .clone()
          .add(camera._angle)

        gsap.to(camera._position, {
          x: nextPosition.x,
          y: nextPosition.y,
          z: nextPosition.z,
          duration: 1,
          ease: 'power2.out'
        })

        camera.camera.lookAt(
          camera._position
            .clone()
            .sub(camera._angle)
            .sub(camera._shake)
            .add(new THREE.Vector3(0, 0.75, 0))
        )
      }

      this.dotsPlane.update(clock)
    },

    onStartGame() {
      this.introCameraTraveling()
    },

    onKeydown(e) {
      if (!this.movementEnabled) return
      const clock = useClock()

      if (clock.countdownDisabled) {
        clock.events.emit('clock:toggleCountdown', false)
      }

      const delta = new THREE.Vector3()

      if (e.includes('MOVE_LEFT')) {
        delta.x -= 1
      } else if (e.includes('MOVE_RIGHT')) {
        delta.x += 1
      } else if (e.includes('MOVE_FORWARD')) {
        delta.z -= 1
      } else if (e.includes('MOVE_BACKWARD')) {
        delta.z += 1
      } else {
        return
      }

      if (this.player.positionTween || this.player.isFalling) return

      delta.add(this.player.position)

      const { scene: gameScene } = useGame()

      const nextPosition = delta.clone().applyMatrix4(gameScene.matrixWorld)

      const intersects = this.terrain.castCell(nextPosition)

      if (intersects.length > 0) {
        const intersect = intersects[0]

        const position = intersect.point

        const m = new THREE.Matrix4().getInverse(gameScene.matrixWorld)
        position.applyMatrix4(m)

        const intersectZones = intersects.map(
          (intersect) => intersect.object.name
        )

        this.currentZones = intersectZones

        this.player.moveTo(position)
      }
    }
  }
}
</script>

<style lang="scss">
h1 {
  color: var(--color-white);
  font-size: var(--font-size-xl);
  opacity: 0;
  text-align: center;
}
</style>
