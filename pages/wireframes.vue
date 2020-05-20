<template>
  <div></div>
</template>

<script>
import useCamera from '@/hooks/use-camera'
import useGame from '@/hooks/use-game'
import useGUI from '@/hooks/use-gui'
import useAssetsManager from '@/hooks/use-assets-manager'

import BasicMaterial from '@/webgl/materials/basic'

export default {
  async mounted() {
    // camera
    const {
      OrbitControls
    } = require('three/examples/jsm/controls/OrbitControls.js')

    const { camera } = useCamera()
    const cameraControls = new OrbitControls(
      camera,
      document.querySelector('#__nuxt')
    )
    cameraControls.enableKeys = false

    // objects
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'level_01',
      base: '/',
      files: [
        {
          name: 'solid',
          path: 'obj/level_01/level01_07.glb'
        },
        {
          name: 'wireframe',
          path: 'obj/level_01/level01_07_wireframe.obj'
        }
      ]
    })

    const files = await assetsManager.get('level_01')
    this.solid = files.solid.scene
    this.wireframe = files.wireframe

    const { scene } = useGame()
    scene.add(this.solid)
    scene.add(this.wireframe)

    this.wireframe.scale.setScalar(1.009)

    const m = new BasicMaterial({ color: 0x1a1a1a })

    const GUI = useGUI()
    GUI.add(m.uniforms.uAlpha, 'value')
      .min(0)
      .max(1)

    this.solid.traverse((child) => {
      child.material = m
    })

    this.wireframe.traverse((child) => {
      if (child.name.includes('green')) {
        const material = new BasicMaterial({ color: 0x00ff00 })
        child.material = material

        GUI.add(material.uniforms.uAppear, 'value')
          .min(0)
          .max(1)
      }
    })
  }
}
</script>

<style></style>
