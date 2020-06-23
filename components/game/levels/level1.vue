<template>
  <div class="gameLevel01">
    <game-notifications ref="notifications" />
    <terminal v-if="terminalOpened" class="gameLevel01__terminal" />
    <!-- <solutions class="gameLevel01__solutions" /> -->
    <mission-report class="gameLevel01__missionReport" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import gsap from 'gsap'

import useGUI from '@/hooks/use-gui'
import useCamera from '@/hooks/use-camera'
import useGame from '@/hooks/use-game'
import useClock from '@/hooks/use-clock'
import useRAF from '@/hooks/use-raf'
import useAudio from '@/hooks/use-audio'
import score from '@/hooks/use-score'

import Player from '@/game/components/player'
import MapLevel01 from '@/game/components/level_01'
import GridTerrain from '@/game/features/grid-terrain'

import Spline from '@/webgl/components/spline'

import Countdown from '@/assets/js/countdown'

import treadmillConfig from '@/config/treadmills'
import LEVEL01_CONFIG from '@/config/level01'

export default {
  components: {
    Terminal: () => import('@/components/game/terminal/terminal'),
    gameNotifications: () => import('@/components/elements/game-notifications'),
    // Solutions: () => import('@/components/game/solutions/solutions'),
    MissionReport: () =>
      import('@/components/game/mission-report/mission-report')
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
      terminalOpened: (state) => state.terminalOpened,
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
    terminalOpened(bool) {
      // const keyboard = useKeyboard()
      // keyboard.disabled = bool
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
        this.setTerminalOpened(true)
      } else if (this.playerIsOnTerminal === false && oldVal !== undefined) {
        console.log('here')
        this.setTerminalOpened(false)
      }
    }
  },
  mounted() {
    this.init()

    // TO DELETE
    // this.$events.on('teleportToTerminal', this.teleportToTerminal)
    // TO DELETE

    // this.$events.on('level:restart', this.doRespawn.bind(this))
  },
  beforeDestroy() {
    this.player.hitbox.events.off('intersection', this.onPlayerIntersects)

    this.$controller.events.off('keyup', this.onKeydown)

    const RAF = useRAF()
    RAF.remove('level1', this.loop.bind(this))
  },
  methods: {
    ...mapMutations({
      setTerminalOpened: 'setTerminalOpened'
    }),
    async load() {
      this.$store.commit('loading/setVisible', true)
      this.$store.commit('loading/setToLoad', 5)

      console.log('20%')

      this.$store.commit('loading/incrementLoaded')

      this.map = new MapLevel01()
      await this.map.load()

      this.$store.commit('loading/incrementLoaded')

      console.log('40%')

      this.player = new Player()
      await this.player.init()

      this.$store.commit('loading/incrementLoaded')
      console.log('60%')

      this.introRail = await new Spline().load('obj/splines/level01_01.obj')
      this.map.add(this.introRail)

      this.$store.commit('loading/incrementLoaded')
      console.log('80%')

      const audioManager = useAudio()
      await audioManager.add([
        { path: '/sounds/RESET_LEVEL01.mp3', id: 'level01' },
        { path: '/sounds/RESET_AMBIANCE_FACTORY.mp3', id: 'factory_ambiance' }
      ])

      this.$store.commit('loading/incrementLoaded')
      console.log('100%')
    },
    async init() {
      this.cameraPosition = 'follow player'
      this.countdown = new Countdown(120)
      score.type = 'countdown'

      await this.load()

      this.countdown.paused = false

      const audioManager = useAudio()
      audioManager
        .play('level01')
        .volume(0.65)
        .loop(true)
      audioManager
        .play('factory_ambiance')
        .volume(1)
        .loop(true)

      // const {
      //   OrbitControls
      // } = require('three/examples/jsm/controls/OrbitControls.js')

      // const { camera } = useCamera()
      // const cameraControls = new OrbitControls(
      //   camera,
      //   document.querySelector('#__nuxt')
      // )
      // cameraControls.enableKeys = false
      // cameraControls.enabled = false

      const { scene: gameScene } = useGame()

      this.levelGroup = new THREE.Group()

      gameScene.add(this.levelGroup)

      this.levelGroup.add(this.map)

      this.terrain = new GridTerrain(this.map.zones)

      this.initIntersections()

      this.spawnPoint = this.map.spawnPoint.clone()
      this.player.position.copy(this.spawnPoint)

      this.levelGroup.add(this.player)

      const camera = useCamera()
      camera._position.copy(
        this.player.worldPosition.clone().add(camera._angle)
      )

      camera.camera.lookAt(
        camera._position
          .clone()
          .sub(camera._angle)
          .sub(camera._shake)
          .add(new THREE.Vector3(0, 0.75, 0))
      )

      this.$controller.events.on('keyup', this.onKeydown)

      this.initGUI()

      const RAF = useRAF()
      RAF.add('level1', this.loop.bind(this))
    },

    teleportToTerminal() {
      this.player.position.copy(
        new THREE.Vector3(-0.5, 1.1000051240667137, -31.5)
      )
    },

    doRespawn(e) {
      if (e === 'start') {
        this.player.position.copy(this.map.spawnPoint)
      } else {
        this.player.position.copy(this.spawnPoint)
      }

      // TODO - Restart chronometre du niveau
    },

    onKeydown(e) {
      // const clock = useClock()

      // if (clock.countdownDisabled) {
      //   clock.events.emit('clock:toggleCountdown', false)
      // }

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
        // if intersects = can walk on next zone

        const intersect = intersects[0]
        const zoneName = intersect.object.name

        const position = intersect.point

        const m = new THREE.Matrix4().getInverse(gameScene.matrixWorld)
        position.applyMatrix4(m)

        const intersectZones = intersects.map(
          (intersect) => intersect.object.name
        )

        this.currentZones = intersectZones

        if (this.currentZones.includes('zone_goal')) {
          console.log('goal')
          this.countdown.paused = true
          this.$store.commit('stages/setScore', {
            stage: 'level1',
            score: this.countdown.time
          })

          console.log(this.countdown.time)
        }

        // if (intersectZones.includes('zone_tuto')) {
        //   this.$events.emit('tuto')
        // }

        // if (intersectZones.includes('zone_endgame')) {
        //   const clock = useClock()
        //   clock.pause()

        //   this.$events.emit('endgame')
        // }

        // checkpoints
        const checkpointIndex = intersects.findIndex((intersect) =>
          intersect.object.name.includes('zone_chekpoint')
        )
        const checkpoint = intersects[checkpointIndex]
        if (checkpoint) {
          checkpoint.object.component.trigger()
          this.spawnPoint = checkpoint.object.position
            .clone()
            .add(new THREE.Vector3(-0.5, 0, 0))
          this.spawnPoint.y = this.player.position.y

          position.y = this.player.position.y
        }

        // treadmills
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
      if (this.countdown.time <= 0) {
        console.log('loooose')
      }

      score.value = this.countdown.time

      this.map.update(clock)

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
        // camera.position.copy(nextPosition.clone())
      }
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

    async onPlayerIntersectsWithParcelPost() {
      this.$refs.notifications.addNotification(
        this.posts[Math.floor(Math.random() * this.posts.length)]
      )

      const clock = useClock()
      clock.add(10)

      // if (this.player.positionTween) {
      //   this.player.positionTween.kill()
      //   this.player.positionTween = null
      // }
      // // TODO checkpoint
      // this.doRespawn()

      const camera = useCamera()
      camera.shake()

      await this.player.fall()
      if (this.hookingTreadmill) {
        this.hookingTreadmill.unHook(this.player)
      }

      this.player.setInitialState()

      this.doRespawn()
    },

    cameraAnimation(config) {
      const camera = useCamera()

      const { x, y, z } = config.normalized_angle
      const distance = config.distance

      const tl = new gsap.timeline()
      tl.to(
        camera._normalizedAngle,
        {
          duration: 1,
          ease: 'power4.out',
          x,
          y,
          z
        },
        0
      )

      tl.to(
        camera,
        {
          duration: 1,
          ease: 'power4.out',
          _distance: distance
        },
        0
      )
    },

    introCameraTraveling() {
      this.cameraPosition = 'intro travelling'

      const camera = useCamera()

      this.progress = 0
      gsap.to(this, {
        duration: 10,
        ease: 'none',
        progress: 1,
        onUpdate: () => {
          const postion = this.introRail.curvedPath.getPoint(this.progress)
          camera.camera.lookAt(this.player.position)
          camera._position.copy(postion)
        },
        onComplete: () => {
          this.cameraPosition = 'follow player'
        }
      })
    },

    initGUI() {
      const GUI = useGUI()

      // const { camera } = useCamera()

      // const params = {
      //   lookAtPlayer: () => {
      //     camera.lookAt(this.player.position)
      //   }
      // }

      // GUI.camera.addVector('origin position', camera.originPosition)
      // GUI.camera.add(params, 'lookAtPlayer')
      // GUI.camera.add(camera, 'distance')

      GUI.camera.add(this, 'introCameraTraveling')
      // GUI.camera.add(this, 'cameraCloseUp').name('close up')
      // GUI.camera.add(this, 'cameraDefault').name('default')

      const cameraParams = {
        current: 'default'
      }
      GUI.camera
        .add(cameraParams, 'current', ['default', 'close up'])
        .name('pov')
        .onChange(() => {
          let config
          switch (cameraParams.current) {
            case 'close up':
              config = LEVEL01_CONFIG.cameras.close_up
              break
            case 'default':
              config = LEVEL01_CONFIG.cameras.default
              break
            default:
              break
          }
          this.cameraAnimation(config)
        })

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

<style lang="scss">
.gameLevel01 {
  height: 100vh;
  width: 100vw;

  &__solutions,
  &__terminal,
  &__missionReport {
    pointer-events: all;
  }

  &__solutions {
    display: none;
    left: 64px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  &__missionReport {
    display: none;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
