import Treadmill from './treadmill'
import ToonMaterial from '@/webgl/materials/toon.js'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'
import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'
import useGUI from '@/hooks/use-gui'
import useRAF from '@/hooks/use-raf'
import useKeyboard from '@/hooks/use-keyboard'

import BoxGeometry from '@/webgl/geometries/box'

export default class Level01 extends THREE.Object3D {
  async load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'level_01',
      base: '/',
      files: [
        {
          name: 'model',
          path: 'obj/level_01/level_01.glb'
        }
      ]
    })

    this.files = await assetsManager.get('level_01')

    this.model = this.files.model.scene
    this.add(this.model)

    const background = this.model.getObjectByName('model_background')
    const gui = useGUI()
    gui.addObject3D('background', background)
    background.material.side = THREE.DoubleSide
    background.rotation.x = Math.PI * 1.5

    // zones
    this.zones = this.model.getObjectByName('zones')

    // spawn point
    this.spawnPoint = new THREE.Vector3(0.5, 1, 18.5)

    this.init()
  }

  async init() {
    const keyboard = useKeyboard()
    keyboard.events.on('keydown', (e) => {
      // SHIFT+P to stop
      if (e.keyCode === 80 && e.shiftKey) {
        this.paused = !this.paused
        console.log('paused')
      }
    })
    this.paused = false
    this.initTreadmills()
    this.initZones()

    // instances
    await this.replaceInstances()

    const RAF = useRAF()
    RAF.add('level_01', this.update.bind(this), 0)
  }

  initZones() {
    // debug materials
    this.zones.traverse((zone) => {
      const name = zone.name
      if (name.includes('floor')) {
        // zone.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

        const material = new ToonMaterial({
          color: 0x757575,
          emissive: 0x757575
        })

        zone.material = material

        const gui = useGUI()
        gui.addMaterial(zone.uuid.substring(0, 10), material)
      }

      if (name.includes('treadmill')) {
        zone.material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          visible: false
        })
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

  initTreadmills() {
    this.treadmills = []

    const { intersections } = useGame()

    const box = new THREE.Mesh(BoxGeometry, new THREE.MeshBasicMaterial())
    box.scale.set(10, 1, 30)

    // up stream
    this.outHitboxUpstreamMesh = box.clone()
    this.outHitboxUpstreamMesh.position.copy(new THREE.Vector3(-10, 1, -4))

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
    this.outHitboxDownstreamMesh.position.copy(new THREE.Vector3(10, 1, -4))

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
          path: 'obj/treadmill/treadmill.glb'
        }
      ]
    })

    const files = await assetsManager.get('instances')
    const treadmillModel = files.treadmill.scene

    this.instances = this.model.getObjectByName('instances')

    let i = 0
    this.instances.children.forEach((child) => {
      const instanceName = child.userData.instance
      if (instanceName === 'treadmill') {
        const treadmill = new Treadmill(treadmillModel.clone(), i)
        child.add(treadmill)
        this.treadmills.push(treadmill)
      }
      i++
    })
  }

  update(clock) {
    if (this.paused) return
    this.treadmills.forEach((treadmill) => {
      treadmill.update(clock)
    })
  }
}
