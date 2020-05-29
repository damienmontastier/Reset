<template>
  <div></div>
</template>

<script>
import useGame from '@/hooks/use-game'
import useCamera from '@/hooks/use-camera'
import useGUI from '@/hooks/use-gui'

import CheckpointMaterial from '@/webgl/materials/checkpoint'

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

    const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const material = new CheckpointMaterial()
    const cube = new THREE.Mesh(geometry, material)

    const { scene } = useGame()
    scene.add(cube)

    const GUI = useGUI()
    GUI.addObject3D('box', cube)
  }
}
</script>

<style></style>
