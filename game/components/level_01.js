import Treadmill from './treadmill'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'
import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'

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

    // zones
    this.zones = this.model.getObjectByName('zones')

    // spawn point
    this.spawnPoint = new THREE.Vector3(0.5, 1, 18.5)

    this.initTreadmills()

    // instances
    await this.replaceInstances()

    // debug materials
    this.zones.traverse((zone) => {
      const name = zone.name
      if (name.includes('floor')) {
        zone.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      }

      if (name.includes('treadmill')) {
        zone.material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          visible: false
        })
      }

      if (name.includes('terminal')) {
        zone.material = new THREE.MeshBasicMaterial({
          color: 0x0000ff
        })
      }

      if (name.includes('zone_spawn')) {
        // console.log('spawn', zone.position)
        // this.spawnPoint = zone.position.clone()
        // console.log('spawn', zone.position)
        // zone.material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
      }
    })

    const { raf } = useGame()
    raf.add('level_01', this.update.bind(this), 0)
  }

  initTreadmills() {
    this.treadmills = []

    const { intersections } = useGame()

    const box = new THREE.Mesh(BoxGeometry, new THREE.MeshBasicMaterial())
    box.scale.set(1, 1, 30)

    // up stream
    this.outHitboxUpstreamMesh = box.clone()
    this.outHitboxUpstreamMesh.position.copy(new THREE.Vector3(-5.3, 1, -4))

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
    this.outHitboxDownstreamMesh.position.copy(new THREE.Vector3(5, 1, -4))

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
    this.treadmills.forEach((treadmill) => {
      treadmill.update(clock)
    })
  }
}
