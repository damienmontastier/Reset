import gsap from 'gsap'

import Treadmill from './treadmill'
// import ToonMaterial from '@/webgl/materials/toon.js'

import PostsInstances from '@/game/components/posts-instances'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'
import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'
import useGUI from '@/hooks/use-gui'
import useRAF from '@/hooks/use-raf'
// import useKeyboard from '@/hooks/use-keyboard'

import keyboard from '@/plugins/keyboard'

import BoxGeometry from '@/webgl/geometries/box'
import Checkpoint from '@/webgl/components/checkpoint'

// import GreenMaterial from '@/webgl/materials/green'
// import BlackMaterial from '@/webgl/materials/black'
import SignScreenMaterial from '@/webgl/materials/sign-screen'
import TerminalScreenMaterial from '@/webgl/materials/terminal-screen'
import standardMaterial from '@/webgl/materials/standard'
// import CheckpointMaterial from '@/webgl/materials/checkpoint'

import BasicMaterial from '@/webgl/materials/basic'

import LIGHT_CONFIG from '@/config/light'

export default class Level01 extends THREE.Object3D {
  async load() {
    // materials
    this.standardMaterial = standardMaterial.clone()
    this.greenMaterial = new BasicMaterial({ color: 0x2ff000 })

    // this.solidGreenMaterial = new THREE.MeshBasicMaterial({ color: 0x2ff000 })

    this.blackMaterial = new BasicMaterial({ color: 0x000000 })

    const GUI = useGUI()
    GUI.addMaterial('solid material', this.standardMaterial)
    GUI.add(this.greenMaterial.uniforms.uAppear, 'value')
      .min(0)
      .max(1)
      .step(0.01)
      .name('green appear')

    GUI.add(this.greenMaterial, 'alphaTest')
      .min(0)
      .max(1)
      .step(0.01)
      .name('green alphatest')

    GUI.add(this.greenMaterial, 'depthFunc')
      .min(0)
      .max(10)
      .step(1)
      .name('green depthFunc')

    GUI.add(this.greenMaterial, 'blendSrc')
      .min(0)
      .max(300)
      .step(1)
      .name('green blendSrc')

    GUI.add(this.greenMaterial, 'blendSrc')
      .min(0)
      .max(300)
      .step(1)
      .name('green blendDst')

    GUI.add(this.greenMaterial, 'depthTest').name('green depthTest')

    GUI.add(this.greenMaterial, 'depthWrite').name('green depthWrite')

    GUI.add(this.greenMaterial, 'transparent').name('green transparent')

    GUI.add(this.blackMaterial.uniforms.uAppear, 'value')
      .min(0)
      .max(1)
      .step(0.01)
      .name('black appear')

    GUI.add(this, 'appear').name('trigger appear')
    // materials

    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'level_01',
      base: '/',
      files: [
        {
          name: 'solid',
          path: 'obj/level_01/level01_17.glb'
        },
        {
          name: 'wireframe',
          path: 'obj/level_01/level01_07_wireframe.obj'
        },
        {
          name: 'debug_solid',
          path: 'obj/debug/debug_solid.glb'
        },
        {
          name: 'debug_wireframe',
          path: 'obj/debug/debug_wireframe.obj'
        }
      ]
    })

    this.files = await assetsManager.get('level_01')

    this.solid = this.files.solid.scene
    // this.solid.visible = false
    this.wireframe = this.files.wireframe
    // this.wireframe.visible = false

    await PostsInstances.load()

    // instances
    await this.replaceInstances()

    this.debug_model = this.files.debug_solid.scene
    this.debug_wireframe = this.files.debug_wireframe
    this.debug_wireframe.scale.setScalar(1.01)

    this.debug_model.position.z = 9
    this.debug_wireframe.position.z = 9

    // this.debug_model.position.y = -1
    // this.debug_wireframe.position.y = -1

    this.debug_model.traverse((child) => {
      child.material = this.standardMaterial
    })

    this.debug_wireframe.traverse((child) => {
      child.material = this.greenMaterial
    })
    // this.wireframe.visible = false

    // this.wireframe.scale.setScalar(1.1)

    this.wireframe.traverse((child) => {
      if (child.name.includes('green')) {
        // child.material = GreenMaterial
        child.material = this.greenMaterial
      }

      if (child.name.includes('black')) {
        // child.material = BlackMaterial

        child.material = this.blackMaterial
      }
    })

    this.add(this.solid)
    this.add(this.wireframe)

    // this.add(this.debug_model)
    // this.add(this.debug_wireframe)

    // const GUI = useGUI()

    // zones
    this.zones = this.solid.getObjectByName('zones')
    this.zones.children.forEach((zone) => {
      zone.visible = false
    })

    console.log(this.zones)

    // this.zones.traverse((zone) => {
    //   zone.visible = false
    // })

    this.solid.traverse((child) => {
      if (child.name.includes('model_border')) {
        // child.material = GreenMaterial

        child.material = this.greenMaterial
      }

      if (child.name.includes('model_platform')) {
        child.material = this.standardMaterial
      }

      if (child.name.includes('zone_chekpoint')) {
        child.visible = true
        child.position.y += -0.035

        child.scale.setScalar(0.95)

        child.material.visible = false

        child.component = new Checkpoint()

        child.add(child.component)
      }
    })

    // spawn point
    this.spawnPoint = this.solid
      .getObjectByName('zone_spawn')
      .position.clone()
      .add(new THREE.Vector3(-0.5, 0, 0))

    // sign
    this.sign = this.solid.getObjectByName('model_sign')

    this.sign.material = this.standardMaterial

    this.signScreen = this.solid.getObjectByName('model_sign_screen')
    this.signScreen.material = new SignScreenMaterial().getMaterial()

    this.solid.getObjectByName(
      'model_terminal_black'
    ).material = this.standardMaterial
    // this.solid.getObjectByName('model_terminal_green').material = GreenMaterial

    this.solid.getObjectByName(
      'model_terminal_green'
    ).material = this.greenMaterial

    this.solid.getObjectByName(
      'model_terminal_screen'
    ).material = new TerminalScreenMaterial().getMaterial()

    this.init()
  }

  init() {
    this.initLights()
    keyboard.events.on('keydown', (e) => {
      // SHIFT+P to stop
      if (e.keyCode === 80 && e.shiftKey) {
        this.paused = !this.paused
        console.log('paused')
      }
    })
    this.paused = false

    this.initTreadmillsHitboxes()
    // this.initZones()

    // const appearTl = this.appear()
    // appearTl.pause()

    // setTimeout(() => {
    //   appearTl.play()
    // }, 3000)

    const RAF = useRAF()
    RAF.add('level_01', this.update.bind(this), 0)
  }

  initLights() {
    const { scene } = useGame()

    this.ambientLight = new THREE.AmbientLight(0x383838, 0)
    scene.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(
      LIGHT_CONFIG.color,
      LIGHT_CONFIG.intensity
    )
    // this.directionalLight.position.set(0, 512, 0)
    this.directionalLight.position.copy(LIGHT_CONFIG.position)
    this.directionalLight.lookAt(scene.position)
    scene.add(this.directionalLight)

    const GUI = useGUI()

    GUI.addLight('light', this.directionalLight)
  }

  initZones() {
    // this.zones.visible = false
    // debug materials
    // this.zones.traverse((zone) => {
    //   const name = zone.name
    //   if (name.includes('floor')) {
    //     zone.material = this.standardMaterial
    //     // zone.visible = false
    //   }
    //   if (name.includes('treadmill')) {
    //     zone.visible = false
    //   }
    //   if (name.includes('terminal')) {
    //     zone.visible = false
    //   }
    //   if (name.includes('zone_spawn')) {
    //     zone.visible = false
    //   }
    //   if (name.includes('zone_tuto')) {
    //     zone.visible = false
    //   }
    //   if (name.includes('zone_endgame')) {
    //     zone.visible = false
    //   }
    // })
  }

  initTreadmillsHitboxes() {
    const { intersections } = useGame()

    const box = new THREE.Mesh(BoxGeometry, new THREE.MeshBasicMaterial())
    box.scale.set(10, 1, 1000)

    // up stream
    this.outHitboxUpstreamMesh = box.clone()
    // this.outHitboxUpstreamMesh.position.copy(new THREE.Vector3(-13, 1, 0))
    this.outHitboxUpstreamMesh.position.copy(new THREE.Vector3(-12, 1, 0))

    this.add(this.outHitboxUpstreamMesh)
    this.outHitboxUpstreamMesh.visible = false
    this.outHitboxUpstream = new INTERSECTIONS.Hitbox(
      this.outHitboxUpstreamMesh,
      {
        layers: ['treadmill_edge'],
        sleeping: true
      }
    )

    intersections.addHitbox(this.outHitboxUpstream)

    // down stream
    this.outHitboxDownstreamMesh = box.clone()
    // this.outHitboxDownstreamMesh.position.copy(new THREE.Vector3(12, 1, 0))
    this.outHitboxDownstreamMesh.position.copy(new THREE.Vector3(11, 1, 0))

    this.add(this.outHitboxDownstreamMesh)
    this.outHitboxDownstreamMesh.visible = false
    this.outHitboxDownstreamMesh = new INTERSECTIONS.Hitbox(
      this.outHitboxDownstreamMesh,
      {
        layers: ['treadmill_edge'],
        sleeping: true
      }
    )

    intersections.addHitbox(this.outHitboxDownstreamMesh)
  }

  async replaceInstances() {
    const assetsManager = useAssetsManager()
    assetsManager.loader.addGroup({
      name: 'instances',
      base: '/',
      files: [
        {
          name: 'treadmill',
          path: 'obj/treadmill/treadmill_06.glb'
        },
        {
          name: 'wireframe',
          path: 'obj/treadmill/treadmill_06_wireframe.obj'
        }
      ]
    })

    const files = await assetsManager.get('instances')
    const treadmillModel = files.treadmill.scene
    const treadmillWireframe = files.wireframe

    treadmillModel.traverse((child) => {
      child.material = this.standardMaterial
    })

    // treadmillModel.getObjectByName('soustapis_green').material = GreenMaterial
    treadmillModel.getObjectByName(
      'soustapis_green'
    ).material = this.greenMaterial

    treadmillWireframe.traverse((child) => {
      if (child.name.includes('green')) {
        // child.material = GreenMaterial

        child.material = this.greenMaterial
      }

      if (child.name.includes('black')) {
        // child.material = BlackMaterial

        child.material = this.blackMaterial
      }
    })

    // treadmillModel.getObjectByName('machine_green').material = GreenMaterial

    treadmillModel.getObjectByName(
      'machine_green'
    ).material = this.greenMaterial

    treadmillModel.getObjectByName('spawn_downstream').visible = false
    treadmillModel.getObjectByName('spawn_upstream').visible = false

    this.instances = this.solid.getObjectByName('instances')

    this.treadmills = []
    this.instances.children.forEach((child) => {
      const instanceName = child.userData.instance
      if (instanceName === 'treadmill') {
        const treadmill = new Treadmill(
          treadmillModel.clone(),
          treadmillWireframe.clone(),
          child.userData.zone
        )
        child.add(treadmill)
        this.treadmills.push(treadmill)
      }
    })
  }

  update(clock) {
    if (this.paused) return
    this.treadmills.forEach((treadmill) => {
      treadmill.update(clock)
    })
  }

  appear() {
    const tl = new gsap.timeline()

    tl.from(
      [
        this.greenMaterial.uniforms.uAppear,
        this.blackMaterial.uniforms.uAppear
      ],
      {
        duration: 10,
        ease: 'expo.out',
        value: 0,
        stagger: 1
      },
      0
    )

    tl.from(
      this.standardMaterial,
      {
        duration: 3,
        ease: 'expo.out',
        opacity: 0
      },
      3
    )

    return tl
  }
}
