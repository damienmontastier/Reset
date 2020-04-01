import useAssetsManager from '@/hooks/use-assets-manager'

export default class Factory extends THREE.Object3D {
  constructor() {
    super()

    this.scale.setScalar(0.5)
  }

  load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'factory',
      base: '/',
      files: [
        {
          name: 'skeleton',
          path: 'obj/factory/skeleton.glb'
        },
        {
          name: 'lib',
          path: 'obj/factory/lib.glb'
        },
        {
          name: 'floor',
          path: 'obj/factory/floor.glb'
        }
      ]
    })

    // const { skeleton } = files
    // console.log(skeleton)

    // skeleton.scene.traverse((child) => {
    //   console.log(child)
    // })

    return new Promise((resolve, reject) => {
      assetsManager.get('factory').then((files) => {
        const { floor } = files
        this.floor = floor
        this.add(this.floor.scene)
        resolve(files)
      })
    })
  }
}
