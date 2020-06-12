import useAssetsManager from '@/hooks/use-assets-manager'

export default class Spline extends THREE.Object3D {
  constructor(file) {
    super()
    this.file = file
  }

  async load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'spline' + this.uuid,
      base: '/',
      files: [
        {
          name: 'model',
          path: this.file
        }
      ]
    })

    this.files = await assetsManager.get('spline' + this.uuid)
  }

  async init() {
    await this.load()

    this.model = this.files.model
    this.path = this.model.children[0]

    this.vectors = this.computeVectors()
    this.curvedPath = new THREE.CatmullRomCurve3(this.vectors)
    this.curvedPath.closed = true
    this.curvedPath.curveType = 'chordal'

    const geometry = new THREE.SphereBufferGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.scale.setScalar(1)

    this.vectors.forEach((vector) => {
      const s = sphere.clone()
      s.position.copy(vector)
      this.add(s)
    })
  }

  computeVectors() {
    this.vectors = []

    // console.log(this.model)

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
