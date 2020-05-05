<template>
  <div></div>
</template>

<script>
import useGame from '@/hooks/use-game'
import useGUI from '@/hooks/use-gui'
import useCamera from '@/hooks/use-camera'
// import useWebgl from '@/hooks/use-webgl'
import useAssetsManager from '@/hooks/use-assets-manager'

import DistanceMaterial from '@/webgl/materials/distance'

export default {
  mounted() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new DistanceMaterial()
    this.cube = new THREE.Mesh(geometry, material)

    // const { scene } = useGame()
    // scene.add(this.cube)

    const {
      OrbitControls
    } = require('three/examples/jsm/controls/OrbitControls.js')

    const { camera } = useCamera()
    // const { canvas } = useWebgl()

    // console.log(camera, canvas)
    const cameraControls = new OrbitControls(
      camera,
      document.querySelector('#__nuxt')
    )
    cameraControls.enableKeys = false
    // cameraControls.enabled = false

    this.init()
  },
  methods: {
    async init() {
      await this.load()

      const { scene } = useGame()
      scene.add(this.solidModel)
      scene.add(this.wireframeModel)
    },
    async load() {
      const assetsManager = useAssetsManager()

      assetsManager.loader.addGroup({
        name: 'test-wireframe',
        base: '/',
        files: [
          {
            name: 'solid',
            path: 'obj/test_wireframe/solid.obj'
          },
          {
            name: 'wireframe',
            path: 'obj/test_wireframe/wireframe.obj'
          }
        ]
      })

      const files = await assetsManager.get('test-wireframe')
      this.solidModel = files.solid

      // const params = {
      //   distance: 0,
      // }

      const GUI = useGUI()
      // GUI.add(params, 'distance')
      //   .min(0)
      //   .max(20)
      //   .step(0.01)
      //   .onChange(() => {
      //     this.$events.emit('VISIBLE_DISTANCE', params.distance)
      //   })

      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true
        // side: THREE.BackSide,
        // depthWrite: false
      })
      GUI.add(wireframeMaterial, 'opacity')
        .min(0)
        .max(1)
        .step(0.01)

      this.solidModel.traverse((child) => {
        // child.material = new DistanceMaterial({ uDistance: params.distance })
        child.material = new THREE.MeshPhongMaterial({})
      })

      this.wireframeModel = files.wireframe

      this.wireframeModel.traverse((child) => {
        child.scale.setScalar(1.0025)
        child.material = wireframeMaterial
      })
    }
  }
}
</script>
