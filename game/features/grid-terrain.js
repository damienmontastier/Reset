// import useWebGL from '@/hooks/use-webgl'

export default class GridTerrain {
  constructor(terrain) {
    this.terrain = terrain
    this.raycaster = new THREE.Raycaster()
    this.direction = new THREE.Vector3(0, -1, 0)

    // const { scene } = useWebGL()

    this.debug = new THREE.Group()
    this.debug.scale.setScalar(100)
    // scene.add(this.debug)

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    )
    // this.cube.position.set(0.5, 0.5, 0.5)

    this.arrow = new THREE.ArrowHelper(
      this.direction,
      new THREE.Vector3(0, 0, 0),
      10,
      0x0000ff
    )

    this.debug.add(this.cube)
    this.debug.add(this.arrow)
    this.debug.visible = false
  }

  castCell(position) {
    const origin = new THREE.Vector3(position.x, 1000, position.z)

    this.raycaster.set(origin, this.direction)
    const intersects = this.raycaster.intersectObject(this.terrain, true)

    this.debug.position.copy(origin)
    this.debug.visible = true

    return intersects
  }
}
