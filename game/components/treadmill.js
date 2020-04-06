import useAssetsManager from '@/hooks/use-assets-manager'
// import raf from '@/plugins/raf'

// import ToonMaterial from '@/webgl/materials/toon'

export default class Treadmill extends THREE.Object3D {
  // constructor() {
  //   super()
  // }

  async load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'treadmill',
      base: '/',
      files: [
        {
          name: 'model',
          path: 'obj/treadmill/treadmill.glb'
        }
      ]
    })

    this.files = await assetsManager.get('treadmill')

    this.model = this.files.model.scene
    this.add(this.model)

    console.log(this.model)

    this.modelHitbox = this.model.getObjectByName('hitbox')
    this.modelHitbox.visible = false
  }
}
