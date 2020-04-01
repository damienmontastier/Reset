import useWebGL from '@/hooks/use-webgl'
import useGUI from '@/hooks/use-gui'
import useAssetsManager from '@/hooks/use-assets-manager'

let game

class Game {
  constructor() {
    const { scene } = useWebGL()

    this.scene = new THREE.Group()
    this.scene.scale.setScalar(100)

    scene.add(this.scene)

    this.init()
  }

  init() {
    this.initCamera()
    this.initLights()

    this.addBox()
    // this.addFactory()
  }

  initCamera() {
    const { scene, camera } = useWebGL()

    camera.position.set(500, 500, 500)
    camera.lookAt(scene.position)
  }

  initLights() {
    const { scene } = useWebGL()

    scene.background = new THREE.Color(0x000000)

    this.ambientLight = new THREE.AmbientLight(0x383838, 0)
    scene.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    this.directionalLight.position.set(512, 512, 512)
    scene.add(this.directionalLight)
    this.directionalLight.lookAt(new THREE.Vector3())

    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.width = 4096
    this.directionalLight.shadow.mapSize.height = 4096
    this.directionalLight.shadow.camera.near = 0.5
    this.directionalLight.shadow.camera.far = 2048
    this.directionalLight.shadow.camera.left = -2048
    this.directionalLight.shadow.camera.top = 2048
    this.directionalLight.shadow.camera.right = 2048
    this.directionalLight.shadow.camera.bottom = -2048
    this.directionalLight.shadow.bias = 0.005

    this.directionalLightHelper = new THREE.DirectionalLightHelper(
      this.directionalLight,
      100
    )
    scene.add(this.directionalLightHelper)

    const shadowHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    )
    scene.add(shadowHelper)
  }

  async addBox() {
    const { boxSpline } = await this.loadBoxModel()
    boxSpline.name = 'spline'

    // this.scene.add(boxSpline)
  }

  loadBoxModel() {
    const manager = useAssetsManager()

    manager.loader.addGroup({
      name: 'boxSpline',
      base: '/',
      files: [
        {
          name: 'boxSpline',
          path: 'obj/factory-spline.obj'
        }
      ]
    })
    return manager.get('boxSpline')
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
