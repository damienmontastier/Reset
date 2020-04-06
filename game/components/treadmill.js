import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'
// import raf from '@/plugins/raf'

// import ToonMaterial from '@/webgl/materials/toon'

export default class Treadmill extends THREE.Object3D {
  // constructor() {
  //   super()
  // }

  async load() {
    const assetsManager = useAssetsManager()

    // TODO : avoid this
    // ex: TreadmillModel.js that load group and can be cloned
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

    this.model = this.files.model.scene.clone()
    this.add(this.model)

    this.initHitbox()
  }

  initHitbox() {
    this.hitboxMesh = this.model.getObjectByName('hitbox')
    this.hitboxMesh.visible = false

    this.hitbox = new INTERSECTIONS.Hitbox(this.hitboxMesh)
    const { intersections } = useGame()

    intersections.addHitbox(this.hitbox)
  }
}
