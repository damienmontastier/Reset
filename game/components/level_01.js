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
    this.zones = this.model.getObjectByName('zone')

    // spawn point
    this.spawnPoint = new THREE.Vector3(0, 1, 18)

    // debug materials
    this.zones.traverse((zone) => {
      const name = zone.name
      if (name.includes('floor')) {
        zone.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      }

      if (name.includes('treadmill')) {
        zone.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      }

      if (name.includes('terminal')) {
        zone.material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
      }
    })
  }
}
