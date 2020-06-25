import useCamera from '@/hooks/use-camera'

import viewport from '@/plugins/viewport'

export default class UIOverlay extends THREE.Object3D {
  constructor({ color = 0x000000 } = {}) {
    super()

    this.geometry = new THREE.PlaneBufferGeometry(1, 1)
    this.material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      depthWrite: false,
      depthTest: false
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.add(this.mesh)

    this.position.z = -2

    this.onWindowResize()

    viewport.events.on('resize', this.onWindowResize.bind(this))
  }

  onWindowResize() {
    this.scale.set(this.size.x, this.size.y, 1)
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
