import useAssetsManager from '@/hooks/use-assets-manager'

export default class Level1 extends THREE.Object3D {
  load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'level1',
      base: '/',
      files: [
        {
          name: 'map',
          path: 'obj/level1/level1.glb'
        }
      ]
    })

    return new Promise((resolve, reject) => {
      assetsManager.get('level1').then((files) => {
        const { map } = files
        this.mapGLB = map
        this.map = this.mapGLB.scene
        // this.map.scale.setScalar(0.1)
        this.add(this.map)

        this.floor = this.map.getObjectByName('floor')
        this.floor.material = new THREE.MeshNormalMaterial()

        this.spawnPoint = new THREE.Vector3(0, 1, 18)

        resolve(files)
      })
    })
  }
}
