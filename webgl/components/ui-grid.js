import useGUI from '@/hooks/use-gui'
import useCamera from '@/hooks/use-camera'

import viewport from '@/plugins/viewport'
import mouse from '@/plugins/mouse'

import fragmentShader from '@/webgl/materials/grid/fragment.glsl'
import vertexShader from '@/webgl/materials/grid/vertex.glsl'

export default class UIGrid extends THREE.Object3D {
  constructor({ color = 0x2ff000, segments = 18 } = {}) {
    super()

    this.geometry = new THREE.PlaneBufferGeometry(1, 1)
    // this.material = new THREE.MeshBasicMaterial()
    this.uniforms = {
      uColor: { value: new THREE.Color(color) },
      uRatio: {
        value: new THREE.Vector2()
      },
      uSegments: {
        value: segments
      },
      uCursor: {
        value: new THREE.Vector2(0, 0)
      }
    }

    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: this.uniforms,
      transparent: true,
      extensions: {
        derivatives: true
      }
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.add(this.mesh)

    this.position.z = -1

    this.onWindowResize()

    const GUI = useGUI()
    GUI.addObject3D('ui grid', this)
    const GUIFolder = GUI.addFolder('ui grid_')
    GUIFolder.add(this.uniforms.uSegments, 'value')
      .name('segments')
      .min(1)
      .max(25)
      .step(1)

    viewport.events.on('resize', this.onWindowResize.bind(this))
    mouse.events.on('mousemove-lerped', this.onMouseMove.bind(this))
  }

  onMouseMove(e) {
    const { x, y } = e.lerpedNormalized
    this.uniforms.uCursor.value.x = x * 0.5 + 0.5
    this.uniforms.uCursor.value.y = y * 0.5 + 0.5
  }

  onWindowResize() {
    this.scale.set(this.size.x, this.size.y, 1)

    this.uniforms.uRatio.value.y = 1
    this.uniforms.uRatio.value.x = this.size.x / this.size.y
  }

  get size() {
    const { camera } = useCamera()
    const v = new THREE.Vector2()

    const distance = Math.abs(this.position.z)
    const vFov = (camera.fov * Math.PI) / 180
    v.y = 2 * Math.tan(vFov / 2) * distance
    v.x = v.y * viewport.ratio

    return v
  }
}
