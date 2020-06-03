<template>
  <h1>nuxt-three</h1>
</template>

<script>
// import gsap from 'gsap'

import useGame from '@/hooks/use-game'
import useCamera from '@/hooks/use-camera'
import useClock from '@/hooks/use-clock'
// import useKeyboard from '@/hooks/use-keyboard'
import useRAF from '@/hooks/use-raf'

import Player from '@/game/components/player'
import MapIntroduction from '@/game/components/intro'
import GridTerrain from '@/game/features/grid-terrain'

import DotsPlane from '@/webgl/components/dots-plane'

export default {
  data() {
    return {
      currentZones: [],
      playerIsInteract: undefined
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
      const { camera } = useCamera()

      const {
        OrbitControls
      } = require('three/examples/jsm/controls/OrbitControls.js')

      const cameraControls = new OrbitControls(
        camera,
        document.querySelector('#__nuxt')
      )
      cameraControls.enableKeys = false
      camera.position.set(16, 4.8, 12.89)
      camera.rotation.set(0, 1.25, 0)

      this.introGroup = new THREE.Group()
      scene.add(this.introGroup)

      this.map = new MapIntroduction()
      await this.map.load()
      this.introGroup.add(this.map)

      this.terrain = new GridTerrain(this.map.zones)

      const light = new THREE.AmbientLight(0x404040) // soft white light
      const light2 = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
      this.introGroup.add(light)
      this.introGroup.add(light2)

      this.player = new Player()
      await this.player.init()
      this.spawnPoint = this.map.spawnPoint.clone()
      this.player.position.copy(this.spawnPoint)
      this.introGroup.add(this.player)

      this.$controller.events.on('keyup', this.onKeydown)

      this.dotsPlane = new DotsPlane()
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

    onKeydown(e) {
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

      console.log(delta.x, e)

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
