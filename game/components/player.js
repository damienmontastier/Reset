import useKeyboard from '@/hooks/use-keyboard'
import useGame from '@/hooks/use-game'

export default class Player extends THREE.Object3D {
  constructor() {
    super()
    // this.scale.setScalar(0.1)
    this.load()
    this.init()
  }

  load() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    this.model = new THREE.Mesh(geometry, material)
    this.add(this.model)
    this.model.position.set(-0.5, 0.5, -0.5)

    this.pathfinder = new THREE.Group()
    this.model.add(this.pathfinder)
  }

  init() {
    const { events } = useKeyboard()

    events.on('keydown', (e) => {
      const { gridTerrain } = useGame()

      console.log(gridTerrain)

      const delta = new THREE.Vector3()
      switch (e.code) {
        case 'ArrowLeft':
          delta.x -= 1
          break
        case 'ArrowRight':
          delta.x += 1
          break
        case 'ArrowDown':
          delta.z += 1
          break
        case 'ArrowUp':
          delta.z -= 1
          break
        default:
          break
      }

      this.pathfinder.position.add(delta)
      const intersects = gridTerrain.castCell(
        this.pathfinder.getWorldPosition(new THREE.Vector3())
      )
      if (intersects[0]) {
        const point = intersects[0].point
        const scale = new THREE.Vector3()
        this.matrixWorld.decompose(
          new THREE.Vector3(),
          new THREE.Quaternion(),
          scale
        )

        const y = point.divide(scale).y
        this.position.add(delta)
        this.position.y = y
      }
      this.pathfinder.position.copy(new THREE.Vector3())
    })
  }
}
