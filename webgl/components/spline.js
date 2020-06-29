import useAssetsManager from '@/hooks/use-assets-manager'
// import useGame from '@/hooks/use-game'

export default class Spline extends THREE.Object3D {
  async load(path) {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'spline' + this.uuid,
      base: '/',
      files: [
        {
          name: 'model',
          path
        }
      ]
    })

    this.files = await assetsManager.get('spline' + this.uuid)

    this.init()

    return this
  }

  init() {
    this.model = this.files.model
    this.path = this.model.children[0]

    this.vectors = this.computeVectors()
    this.curvedPath = new THREE.CatmullRomCurve3(this.vectors)
    // this.curvedPath = new THREE.SplineCurve3(this.vectors)

    this.curvedPath.curveType = 'catmullrom'

    // const points = this.curvedPath.getPoints(50)
    // const geometry = new THREE.BufferGeometry().setFromPoints(points)

    // const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

    // // Create the final object to add to the scene
    // const { scene } = useGame()

    // const curveObject = new THREE.Line(geometry, material)

    // scene.add(curveObject)

    // const geometry = new THREE.SphereBufferGeometry(1, 1, 1)
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    // const sphere = new THREE.Mesh(geometry, material)
    // sphere.scale.setScalar(1)

    // this.vectors.forEach((vector) => {
    //   const s = sphere.clone()
    //   s.position.copy(vector)
    //   this.add(s)
    // })
  }

  computeVectors() {
    this.vectors = []

    const position = this.path.geometry.attributes.position

    for (let i = 0; i < position.count; i += 3) {
      const x = position.getX(i)
      const y = position.getY(i)
      const z = position.getZ(i)
      const v = new THREE.Vector3(x, y, z)

      this.vectors.push(v)
    }

    return this.vectors
  }
}
