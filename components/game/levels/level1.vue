<template>
  <div class="gameLevel01">
    <game-notifications ref="notifications" />
    <terminal
      v-if="$store.state.ui.terminalVisible"
      class="gameLevel01__terminal"
    />
    <!-- <solutions class="gameLevel01__solutions" /> -->
    <mission-report
      v-if="$store.state.ui.missionReportVisible"
      class="gameLevel01__missionReport"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
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

// import Spline from '@/webgl/components/spline'

import Countdown from '@/assets/js/countdown'

import treadmillConfig from '@/config/treadmills'
import LEVEL01_CONFIG from '@/config/level01'

import MissionReport from '@/components/game/mission-report/mission-report'
import Terminal from '@/components/game/terminal/terminal'
import GameNotifications from '@/components/elements/game-notifications'

export default {
  components: {
    Terminal,
    MissionReport,
    GameNotifications
  },
  data() {
    return {
      currentZones: [],
      playerIsOnFloor: undefined,
      playerIsOnTerminal: undefined,
      playerIsOnTuto: undefined,
      playerIsOnTreadmill: undefined,
      playerIsOnEndgame: undefined,
      missionIsOver: false
    }
  },

  computed: {
    ...mapState({
      posts: (state) => state.notifications.posts
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
      if (oldVal === undefined) return
      if (this.playerIsOnTerminal) {
        this.levelMusic.fade(0.8, 0.25, 1000)
      } else {
        this.levelMusic.fade(0.25, 0.8, 1000)
      }

      this.$store.commit('ui/setTerminalVisible', this.playerIsOnTerminal)
    },
    '$store.state.ui.terminalVisible'() {
      this.cameraAnimation(
        this.$store.state.ui.terminalVisible
          ? LEVEL01_CONFIG.cameras.close_up
          : LEVEL01_CONFIG.cameras.default
      )
    }
  },
  mounted() {
    this.init()

    // TO DELETE
    // this.$events.on('teleportToTerminal', this.teleportToTerminal)
    // TO DELETE

    // this.$events.on('level:restart', this.doRespawn.bind(this))

    this.$events.on('loading completed', this.onLoadingCompleted)
  },
  beforeDestroy() {
    this.player.hitbox.events.off('intersection', this.onPlayerIntersects)

    this.$controller.events.off('keyup', this.onKeydown)

    const RAF = useRAF()
    RAF.remove('level1', this.loop.bind(this))
  },
  methods: {
    async onLoadingCompleted() {
      console.log('onLoadingCompleted')

      const audioManager = useAudio()

      audioManager.play('level01_appear')

      gsap.from(this.map.greenWireframeMaterial.uniforms.uAppear, {
        duration: 8,
        ease: 'none',
        value: 0
      })
      await this.player.appearPlayer().timeScale(1)
      this.countdown.paused = false

      this.cameraAnimation(LEVEL01_CONFIG.cameras.default)

      this.levelMusic = audioManager
        .play('level01')
        .fade(0, 0.8, 1000)
        .loop(true)
    },
    async load() {
      this.$store.commit('loading/setCommands', [
        'Bypassing Firewall',
        'Initializing sequence',
        'Loading FIRST_STAGE',
        'FETCHING DATA',
        'Status : Ready'
      ])
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

      // this.introRail = await new Spline().load('obj/splines/level01_01.obj')
      // this.map.add(this.introRail)

      this.$store.commit('loading/incrementLoaded')
      console.log('80%')

      const audioManager = useAudio()
      await audioManager.add([
        { path: '/sounds/RESET_LEVEL01.mp3', id: 'level01' },
        { path: '/sounds/RESET_USB.mp3', id: 'level_goal' },
        { path: '/sounds/RESET_APPARITION_LEVEL.mp3', id: 'level01_appear' }
      ])

      this.$store.commit('loading/incrementLoaded')
      console.log('100%')
    },
    async init() {
      this.cameraPosition = 'follow player'
      this.countdown = new Countdown()
      score.type = 'countdown'

      const camera = useCamera()
      camera._normalizedAngle.copy(
        LEVEL01_CONFIG.cameras.appear.normalized_angle
      )
      camera._distance = LEVEL01_CONFIG.cameras.appear.distance

      await this.load()
      // this.player.animations.idle.stop()
      // this.player.initSkeletonVirtualization()

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

      this.player.model.rotation.y = THREE.MathUtils.degToRad(180)

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
          // GOAL REACH

          const audioManager = useAudio()
          audioManager.play('level_goal').volume(1)

          this.countdown.paused = true
          this.$store.commit('stages/setScore', {
            stage: 'level1',
            score: this.countdown.time
          })

          this.levelMusic.fade(0.8, 0, 1000)

          this.cameraAnimation(LEVEL01_CONFIG.cameras.goal)

          const { UIOverlay } = useGame()

          const tl = new gsap.timeline({
            onComplete: () => {
              // this.missionIsOver = true
              this.$store.commit('ui/setMissionReportVisible', true)
              setTimeout(() => {
                UIOverlay.material.opacity = 0
              }, 0)
            }
          })

          tl.to(
            this.map.usb.scale,
            {
              duration: 1,
              ease: 'expo.out',
              x: 0.3,
              y: 0.3,
              z: 0.3
            },
            0
          )

          tl.to(
            this.map.usb,
            {
              duration: 2,
              ease: 'expo.out',
              _deltaY: 1.5
            },
            0
          )

          tl.to(
            this.map.usb.scale,
            {
              duration: 2,
              ease: 'expo.out',
              x: 1,
              y: 1,
              z: 1
            },
            1
          )

          tl.to(
            [this.map.usbStandardMaterial, this.map.usbBasicMaterial],
            {
              duration: 2,
              ease: 'expo.out',
              opacity: 0
            },
            1
          )

          tl.to(
            UIOverlay.material,
            {
              duration: 3,
              ease: 'power4.in',
              opacity: 1
            },
            0
          )
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
        const socialNetwork =
          parcelPostsIntersections[0].target.mesh.parent._type
        this.onPlayerIntersectsWithParcelPost(socialNetwork)
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

    async onPlayerIntersectsWithParcelPost(type) {
      const posts = this.posts.filter((post) => {
        return post.social_network.toLowerCase() === type
      })

      this.$refs.notifications.addNotification(
        posts[Math.floor(Math.random() * posts.length)]
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

      // this.player.setInitialState()

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

      const treadmillGUI = GUI._addFolder('treadmills config')
      const zoneAGUI = treadmillGUI._addFolder('a')
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

      const zoneBGUI = treadmillGUI._addFolder('b')
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

      const zoneCGUI = treadmillGUI._addFolder('c')
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

  &__debug {
    pointer-events: all;
    position: absolute;
    top: 100px;
  }

  &__solutions,
  &__terminal,
  &__missionReport {
    pointer-events: all;
  }

  &__missionReport {
    // display: none;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
