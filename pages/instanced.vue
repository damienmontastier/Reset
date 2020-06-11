<template>
  <div></div>
</template>

<script>
import useGame from '@/hooks/use-game'
import useCamera from '@/hooks/use-camera'

export default {
  mounted() {
    const {
      OrbitControls
    } = require('three/examples/jsm/controls/OrbitControls.js')

    const { camera } = useCamera()
    const cameraControls = new OrbitControls(
      camera,
      document.querySelector('#__nuxt')
    )
    cameraControls.enableKeys = false
    // cameraControls.enabled = false

    // const { scene } = useGame()

    // const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshBasicMaterial({ color: 0x2ff000 })
    // const cube = new THREE.Mesh(geometry, material)
    // scene.add(cube)

    this.initInstanced()
  },
  methods: {
    initInstanced() {
      const amount = 10
      const count = amount ** 3
      const geometry = new THREE.SphereBufferGeometry(0.5)
      const material = new THREE.MeshNormalMaterial()

      this.mesh = new THREE.InstancedMesh(geometry, material, count)

      const transform = new THREE.Object3D()

      let i = 0
      const offset = (amount - 1) / 2
      for (let x = 0; x < amount; x++) {
        for (let y = 0; y < amount; y++) {
          for (let z = 0; z < amount; z++) {
            transform.position.set(offset - x, offset - y, offset - z)
            transform.updateMatrix()

            this.mesh.setMatrixAt(i++, transform.matrix)
          }
        }
      }

      console.log(this.mesh)

      const { scene } = useGame()
      scene.add(this.mesh)
    }
  }
}
</script>
