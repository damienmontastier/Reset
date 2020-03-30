import useWebGL from '@/hooks/use-webgl'
import useGUI from '@/hooks/use-gui'
import useAssetsManager from '@/hooks/use-manager'

let game

class Game {
  constructor() {
    const { scene } = useWebGL()

    this.scene = new THREE.Scene()
    this.scene.scale.setScalar(100)

    scene.add(this.scene)

    this.init()
  }

  init() {
    this.initCamera()

    this.addBox()
    this.addFactory()
  }

  initCamera() {
    const { scene, camera } = useWebGL()

    camera.position.set(500, 500, 500)
    camera.lookAt(scene.position)
  }

  addBox() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshNormalMaterial()
    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)

    const { raycaster } = useWebGL()

    raycaster.addTarget(cube)

    raycaster.events.on('intersection', (intersections) => {
      const cubeIsIntersected = intersections.filter(
        (intersection) => intersection.object.uuid === cube.uuid
      )

      if (cubeIsIntersected[0]) {
        cube.scale.setScalar(1.1)
      } else {
        cube.scale.setScalar(1)
      }
    })
  }

  loadFactoryModel() {
    const manager = useAssetsManager()

    manager.loader.addGroup({
      name: 'factory',
      base: '/',
      files: [
        {
          name: 'factory',
          path: 'obj/factory.glb'
        }
      ]
    })
    return manager.get('factory')
  }

  async addFactory() {
    const { raycaster } = useWebGL()
    const gui = useGUI()
    const { factory } = await this.loadFactoryModel()

    // factory.scene.scale.setScalar(100)
    factory.scene.traverse((child) => {
      child.parentUUID = factory.scene.uuid
      child.material = new THREE.MeshNormalMaterial()
    })

    this.scene.add(factory.scene)

    raycaster.addTarget(factory.scene)

    raycaster.events.on('intersection', (intersections) => {
      const factoryIntersections = intersections.filter(
        (intersection) => intersection.object.parentUUID === factory.scene.uuid
      )

      if (factoryIntersections.length) {
        const selectedPart = factoryIntersections[0].object
        selectedPart.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      } else {
        factory.scene.traverse((child) => {
          child.material = new THREE.MeshNormalMaterial()
        })
      }
    })

    gui.addObject3D('factory', factory.scene)
  }

  destroy() {}
}

const useGame = () => {
  return game || (game = new Game())
}

export default useGame
