import useAssetsManager from '@/hooks/use-assets-manager'
import raf from '@/plugins/raf'

import ToonMaterial from '@/webgl/materials/toon'

export default class Treadmill extends THREE.Object3D {
  constructor() {
    super()

    raf.add('treadmill', this.loop.bind(this), 1)
  }

  load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'treadmill',
      base: '/',
      files: [
        {
          name: 'treadmill',
          path: 'obj/treadmill/treadmill.glb'
        }
      ]
    })

    return new Promise((resolve, reject) => {
      assetsManager.get('treadmill').then((files) => {
        const { treadmill } = files
        this.treadmillGLB = treadmill
        this.treadmill = this.treadmillGLB.scene
        this.add(this.treadmill)

        // this.tapis = this.treadmill.getObjectByName('tapis')
        // console.log(this.tapis)

        // for (let index = 0; index < 10; index++) {
        //   const tapis = this.tapis.clone()
        //   this.treadmill.add(tapis)
        //   tapis.position.x += index
        // }

        // this.scale.setScalar(0.01)

        this.treadmill.traverse((child) => {
          child.material = new ToonMaterial()
        })

        this.mixer = new THREE.AnimationMixer(this.treadmill)
        this.clips = this.treadmillGLB.animations

        this.action = this.mixer.clipAction(this.clips[0])
        this.action.play()

        resolve(files)
      })
    })
  }

  loop() {
    if (this.mixer) {
      this.mixer.update(0.01)
    }
  }
}
