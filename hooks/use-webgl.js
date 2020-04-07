import Stats from 'stats.js'
import viewport from '@/plugins/viewport'
import Raf from '@/plugins/raf.js'
import useCamera from '@/hooks/use-camera'

let webgl

class WebGL {
  constructor() {
    // clock
    this.clock = new THREE.Clock()

    // raf
    this.raf = new Raf(this.clock)

    // scene
    this.scene = new THREE.Scene()

    // camera
    const { camera } = useCamera()

    // canvas
    this.canvas = document.createElement('canvas')

    // WEBGL2
    const { WEBGL } = require('three/examples/jsm/WebGL')
    const context = this.canvas.getContext(
      WEBGL.isWebGL2Available() ? 'webgl2' : 'webgl',
      { alpha: false }
    )

    // camera controls
    const {
      OrbitControls
    } = require('three/examples/jsm/controls/OrbitControls.js')
    this.cameraControls = new OrbitControls(camera, this.canvas)
    this.cameraControls.enableKeys = false

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      context,
      scene: this.scene,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(viewport.width, viewport.height)
    this.renderer.setPixelRatio = window.devicePixelRatio || 1

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.BasicShadowMap

    // composer
    const Composer = require('@/webgl/composer').default
    this.composer = new Composer({
      camera,
      renderer: this.renderer,
      scene: this.scene
    })

    // stats
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
    this.raf.add('stats-begin', this.stats.begin, -1000)
    this.raf.add('stats-end', this.stats.end, 1000)

    // raycaster
    const Raycaster = require('@/webgl/raycaster').default
    this.raycaster = new Raycaster(camera)

    // raf
    this.raf.add('use-webgl', this.loop.bind(this), 0)
  }

  loop(clock) {
    this.composer.render(clock)
  }

  get viewsize() {
    let width, height
    const { camera } = useCamera()

    if (camera.type === 'PerspectiveCamera') {
      const distance = camera.position.z
      const vFov = (camera.fov * Math.PI) / 180
      height = 2 * Math.tan(vFov / 2) * distance
      width = height * viewport.ratio
    } else if (camera.type === 'OrthographicCamera') {
      width = viewport.width
      height = viewport.height
    }

    return { width, height }
  }

  destroy() {
    this.raf.remove('use-webgl')
  }
}

const useWebGL = () => {
  return webgl || (webgl = new WebGL())
}

export default useWebGL
