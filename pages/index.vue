<template>
  <introduction @startMission="start"></introduction>
</template>

<script>
// import gsap from 'gsap'

import useGame from '@/hooks/use-game'
import useCamera from '@/hooks/use-camera'
import useClock from '@/hooks/use-clock'
import useWebGL from '@/hooks/use-webgl'
import useRAF from '@/hooks/use-raf'

import Player from '@/game/components/player'
import MapIntroduction from '@/game/components/intro'
import GridTerrain from '@/game/features/grid-terrain'
import DotsPlane from '@/webgl/components/dots-plane'

import INTRODUCTION_CONFIG from '@/config/introduction'

export default {
  components: {
    Introduction: () => import('@/components/elements/introduction')
  },
  data() {
    return {
      currentZones: [],
      playerIsInteract: undefined,
      movementEnabled: false
    }
  },
  watch: {
    currentZones() {
      this.playerIsInteract = this.currentZones.includes('zone_interact')
    },
    playerIsInteract(val, oldVal) {
      if (val) {
        console.log('Interaction with smartphone')
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
      const { camera } = useCamera()

      webglScene.background = new THREE.Color(0xffffff)

      const {
        OrbitControls
      } = require('three/examples/jsm/controls/OrbitControls.js')

      const cameraControls = new OrbitControls(
        camera,
        document.querySelector('#__nuxt')
      )
      cameraControls.enableKeys = false
      camera.position.set(2.64, 3.189, 13.647)
      camera.rotation.set(0, 70.6, 0)

      this.introGroup = new THREE.Group()
      scene.add(this.introGroup)

      this.map = new MapIntroduction()
      await this.map.load()
      this.introGroup.add(this.map)

      this.terrain = new GridTerrain(this.map.zones)

      this.player = new Player()
      await this.player.init()
      this.spawnPoint = this.map.spawnPoint.clone()
      this.player.modelSkinMaterial2.emissive = new THREE.Color(0x00ff00)
      this.player.position.copy(this.spawnPoint)
      this.player.addSkeleton()
      this.introGroup.add(this.player)

      this.$controller.events.on('keyup', this.onKeydown)

      this.dotsPlane = new DotsPlane(INTRODUCTION_CONFIG.dots)

      scene.add(this.dotsPlane)
      this.dotsPlane.scale.setScalar(50)
      this.dotsPlane.rotation.x = -Math.PI / 2
      this.dotsPlane.position.y = -2

      const RAF = useRAF()
      RAF.add('introduction', this.loop.bind(this))
    },

    loop(clock) {
      this.dotsPlane.update(clock)
    },

    start() {
      console.log('do movement camera to player')
      console.log('appear player')
      console.log('show controls keys')
      console.log('enabled movement player')
      this.movementEnabled = true
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
