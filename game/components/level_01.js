import Treadmill from './treadmill'
import useAssetsManager from '@/hooks/use-assets-manager'

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
    this.spawnPoint = new THREE.Vector3(0, 1, 18)

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
        console.log('treadmill', zone)
      }

      if (name.includes('terminal')) {
        zone.material = new THREE.MeshBasicMaterial({
          color: 0x0000ff
        })
      }

      if (name.includes('zone_spawn')) {
        console.log('spawn', zone.position)
        // this.spawnPoint = zone.position.clone()
        // console.log('spawn', zone.position)
        // zone.material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
      }
    })
  }

  async replaceInstances() {
    const treadmill = new Treadmill()
    await treadmill.load()
    this.instances = this.model.getObjectByName('instances')

    this.instances.children.forEach((child) => {
      //   console.log(child)
      const instanceName = child.userData.instance
      if (instanceName === 'treadmill') {
        // console.log(instanceName, child.position)
        // const treadmill = new Treadmill
        child.add(treadmill.clone())
      }
    })
  }
}
