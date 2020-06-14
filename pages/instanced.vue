<template>
  <div></div>
</template>

<script>
import gsap from 'gsap'

import useGame from '@/hooks/use-game'
import useCamera from '@/hooks/use-camera'

import Spline from '@/webgl/components/spline'

export default {
  mounted() {
    this.addCube()
    this.initCameraRail()
  },
  methods: {
    addCube() {
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      this.cube = new THREE.Mesh(geometry, material)
      this.cube.scale.setScalar(10)

      const { scene } = useGame()
      scene.add(this.cube)
    },
    async initCameraRail() {
      this.cameraRail = new Spline('obj/splines/spline_test.obj')
      await this.cameraRail.init()

      const { scene } = useGame()
      scene.add(this.cameraRail)

      this.startTraveling()

      const {
        OrbitControls
      } = require('three/examples/jsm/controls/OrbitControls.js')

      const { camera } = useCamera()
      const cameraControls = new OrbitControls(
        camera,
        document.querySelector('#__nuxt')
      )
      cameraControls.enableKeys = false

      // camera.position.set(150, 150, 150)
    },
    startTraveling() {
      // const { camera } = useCamera()

      this.progress = 0
      gsap.to(this, {
        duration: 10,
        ease: 'none',
        progress: 1,
        onComplete: () => {
          this.startTraveling()
        },
        onUpdate: () => {
          // camera.lookAt(new THREE.Vector3(0, 0, 0))
          // camera.position.copy(
          //   this.cameraRail.curvedPath.getPoint(this.progress)
          // )

          const postion = this.cameraRail.curvedPath.getPoint(this.progress)
          // console.log(postion)

          this.cube.position.copy(postion)
        }
      })
    }
  }
}
</script>
