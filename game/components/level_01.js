import Treadmill from './treadmill'
// import ToonMaterial from '@/webgl/materials/toon.js'

import PostsInstances from '@/game/components/posts-instances'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'
import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'
import useGUI from '@/hooks/use-gui'
import useRAF from '@/hooks/use-raf'
import useKeyboard from '@/hooks/use-keyboard'

import BoxGeometry from '@/webgl/geometries/box'
import Checkpoint from '@/webgl/components/checkpoint'

import GreenMaterial from '@/webgl/materials/green'
import BlackMaterial from '@/webgl/materials/black'
import signScreenMaterial from '@/webgl/materials/sign-screen'
import terminalScreenMaterial from '@/webgl/materials/terminal-screen'
import standardMaterial from '@/webgl/materials/standard'
// import CheckpointMaterial from '@/webgl/materials/checkpoint'

import LIGHT_CONFIG from '@/config/light'

export default class Level01 extends THREE.Object3D {
  async load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'level_01',
      base: '/',
      files: [
        {
          name: 'model',
          path: 'obj/level_01/level01_12.glb'
        },
        {
          name: 'wireframe',
          path: 'obj/level_01/level01_07_wireframe.obj'
        }
      ]
    })

    this.files = await assetsManager.get('level_01')

    this.model = this.files.model.scene
    this.wireframe = this.files.wireframe

    // this.wireframe.scale.setScalar(1.008)

    this.wireframe.traverse((child) => {
      if (child.name.includes('green')) {
        child.material = GreenMaterial
      }

      if (child.name.includes('black')) {
        child.material = BlackMaterial
      }
    })

    this.add(this.model)
    this.add(this.wireframe)

    // const GUI = useGUI()

    this.model.traverse((child) => {
      if (child.name.includes('model_border')) {
        child.material = GreenMaterial
      }

      if (child.name.includes('zone_chekpoint')) {
        child.position.y += -0.01

        child.scale.setScalar(1, 1, 1)

        child.material.visible = false

        child.component = new Checkpoint()

        child.add(child.component)
      }
    })

    // zones
    this.zones = this.model.getObjectByName('zones')

    // spawn point
    this.spawnPoint = this.model
      .getObjectByName('zone_spawn')
      .position.clone()
      .add(new THREE.Vector3(-0.5, 0, 0))

    // sign
    this.sign = this.model.getObjectByName('model_sign')

    this.sign.material = standardMaterial.clone()

    this.signScreen = this.model.getObjectByName('model_sign_screen')
    this.signScreen.material = signScreenMaterial

    this.model.getObjectByName(
      'model_terminal_black'
    ).material = standardMaterial.clone()
    this.model.getObjectByName('model_terminal_green').material = GreenMaterial
    this.model.getObjectByName(
      'model_terminal_screen'
    ).material = terminalScreenMaterial

    await PostsInstances.load()

    this.init()
  }

  async init() {
    this.initLights()
    const keyboard = useKeyboard()
    keyboard.events.on('keydown', (e) => {
      // SHIFT+P to stop
      if (e.keyCode === 80 && e.shiftKey) {
        this.paused = !this.paused
        console.log('paused')
      }
    })
    this.paused = false
    this.initTreadmillsHitboxes()
    this.initZones()

    // instances
    await this.replaceInstances()

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
    // debug materials
    this.zones.traverse((zone) => {
      const name = zone.name
      if (name.includes('floor')) {
        zone.material = standardMaterial.clone()

        const gui = useGUI()
        gui.addMaterial(zone.uuid.substring(0, 10), zone.material)
      }

      if (name.includes('treadmill')) {
        zone.visible = false
      }

      if (name.includes('terminal')) {
        zone.visible = false
      }

      if (name.includes('zone_spawn')) {
        zone.visible = false
      }

      if (name.includes('zone_tuto')) {
        zone.visible = false
      }

      if (name.includes('zone_endgame')) {
        zone.visible = false
      }
    })
  }

  initTreadmillsHitboxes() {
    this.treadmills = []

    const { intersections } = useGame()

    const box = new THREE.Mesh(BoxGeometry, new THREE.MeshBasicMaterial())
    box.scale.set(10, 1, 1000)

    // up stream
    this.outHitboxUpstreamMesh = box.clone()
    this.outHitboxUpstreamMesh.position.copy(new THREE.Vector3(-13, 1, 0))

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
    this.outHitboxDownstreamMesh.position.copy(new THREE.Vector3(12, 1, 0))

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
      // child.material = new ToonMaterial({
      //   color: 0x0d0d0d,
      //   emissive: 0x080808
      // })

      child.material = standardMaterial.clone()
    })

    treadmillModel.getObjectByName('soustapis_green').material = GreenMaterial
    // treadmillModel.getObjectByName('bordure_black').material =

    treadmillWireframe.traverse((child) => {
      if (child.name.includes('green')) {
        child.material = GreenMaterial
      }

      if (child.name.includes('black')) {
        child.material = BlackMaterial
      }
    })

    treadmillModel.getObjectByName('machine_green').material = GreenMaterial

    treadmillModel.getObjectByName('spawn_downstream').visible = false
    treadmillModel.getObjectByName('spawn_upstream').visible = false

    this.instances = this.model.getObjectByName('instances')

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
}
