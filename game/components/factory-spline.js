import useAssetsManager from '@/hooks/use-assets-manager'

export default class Factory extends THREE.Object3D {
  constructor() {
    super()

    this.scale.setScalar(0.5)
  }

  load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'splines',
      base: '/',
      files: [
        {
          name: 'splines',
          path: 'obj/factory-spline.obj'
        }
      ]
    })

    // const { skeleton } = files
    // console.log(skeleton)

    // skeleton.scene.traverse((child) => {
    //   console.log(child)
    // })

    return new Promise((resolve, reject) => {
      assetsManager.get('splines').then((models) => {
        resolve(models.splines)
      })
    })
  }
}
