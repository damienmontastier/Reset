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
        },
        {
          name: 'drone',
          path: 'obj/drone/drone-spline.obj'
        }
      ]
    })
    return new Promise((resolve, reject) => {
      assetsManager.get('splines').then((models) => {
        resolve(models)
      })
    })
  }
}
