import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import assetsManager from '@/services/assets/manager'

import viewport from '@/plugins/viewport'
import gui from '@/plugins/gui'

import Renderer from '@/webgl/renderer/renderer'
import raycaster from '@/webgl/raycaster'
import rendererStats from '@/webgl/renderer-stats'

import getStore from '@/store'
const store = getStore()

export class WebGL {
  constructor(canvas) {
    // canvas
    this.canvas = canvas

    // scene
    this.scene = new THREE.Scene()

    // camera
    this.camera = new THREE.OrthographicCamera(
      viewport.width / -2,
      viewport.width / 2,
      viewport.height / 2,
      viewport.height / -2,
      -10000,
      10000
    )
    this.camera.position.set(500, 500, 500)
    this.camera.lookAt(this.scene.position)

    // controls
    this.cameraControls = new OrbitControls(
      this.camera,
      document.getElementById('__nuxt')
    )

    // renderer
    this.renderer = new Renderer({
      canvas: this.canvas,
      camera: this.camera,
      scene: this.scene
    })
    store.commit('webgl/setRenderer', this.renderer)

    this.addCube()

    this.addFactory()
  }

  init() {
    this.initEvents()
    this.initGUI()
  }

  initEvents() {
    viewport.events.on('resize', this.onWindowResize.bind(this))
    this.renderer.events.on('render', (renderer) => {
      rendererStats.update(renderer.info)
    })
  }

  initGUI() {
    gui.camera.add(this.cameraControls, 'enabled').name('controls')
  }

  addCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshNormalMaterial()
    this.cube = new THREE.Mesh(geometry, material)
    this.cube.scale.setScalar(200)

    this.scene.add(this.cube)

    raycaster.addTarget(this.cube)

    raycaster.events.on('intersection', (intersections) => {
      const cubeIntersection = intersections.find(
        (intersection) => intersection.object.uuid === this.cube.uuid
      )

      if (cubeIntersection) {
        this.cube.scale.setScalar(250)
      } else {
        this.cube.scale.setScalar(200)
      }
    })
  }

  loadFactoryModel() {
    assetsManager.loader.addGroup({
      name: 'factory',
      base: '/',
      files: [
        {
          name: 'factory',
          path: 'obj/factory.glb'
        }
      ]
    })
    // assetsManager.loader.loadGroup('factory')

    return assetsManager.get('factory')
  }

  async addFactory() {
    const { factory } = await this.loadFactoryModel()

    factory.scene.scale.setScalar(100)
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

  onWindowResize() {
    this.camera.left = viewport.width / -2
    this.camera.right = viewport.width / 2
    this.camera.top = viewport.height / 2
    this.camera.bottom = viewport.height / -2
    this.camera.updateProjectionMatrix()
  }
}

export default ({ app }, inject) => {
  inject('getWebGL', () => {
    return app.$webgl
  })

  inject('createWebGL', (canvas) => {
    app.$webgl = new WebGL(canvas)
    return app.$webgl
  })

  inject('destroyWebGL', () => {
    app.$webgl = null
  })
}
