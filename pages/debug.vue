<template>
  <div></div>
</template>

<script>
import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'
import useGUI from '@/hooks/use-gui'
import useCamera from '@/hooks/use-camera'

import standardMaterial from '@/webgl/materials/standard'
import BasicMaterial from '@/webgl/materials/basic'

import LIGHT_CONFIG from '@/config/light'

export default {
  mounted() {
    this.init()
  },
  methods: {
    async load() {
      const assetsManager = useAssetsManager()

      assetsManager.loader.addGroup({
        name: 'debug',
        base: '/',
        files: [
          {
            name: 'solid',
            path: 'obj/debug/debug_solid.glb'
          },
          {
            name: 'wireframe',
            path: 'obj/debug/debug_wireframe.obj'
          }
        ]
      })

      this.files = await assetsManager.get('debug')

      this.model = this.files.solid.scene
      this.wireframe = this.files.wireframe
    },
    async init() {
      await this.load()

      const {
        OrbitControls
      } = require('three/examples/jsm/controls/OrbitControls.js')

      const { camera } = useCamera()
      const cameraControls = new OrbitControls(
        camera,
        document.querySelector('#__nuxt')
      )
      cameraControls.enableKeys = false

      const { scene } = useGame()

      this.ambientLight = new THREE.AmbientLight(0x383838, 0)
      scene.add(this.ambientLight)

      this.directionalLight = new THREE.DirectionalLight(
        LIGHT_CONFIG.color,
        LIGHT_CONFIG.intensity
      )
      // this.directionalLight.position.set(0, 512, 0)
      this.directionalLight.position.copy(LIGHT_CONFIG.position)
      this.directionalLight.lookAt(scene.position)
      scene.add(this.directionalLight)

      scene.add(this.model)
      scene.add(this.wireframe)

      this.standardMaterial = standardMaterial.clone()

      this.model.getObjectByName('model_floor').material = this.standardMaterial

      const GUI = useGUI()

      GUI.addMaterial('standard material', this.standardMaterial)

      this.greenMaterial = new BasicMaterial({ color: 0x00ff00 })

      GUI.add(this.greenMaterial.uniforms.uAppear, 'value')
        .min(0)
        .max(1)
        .step(0.01)
        .name('green appear')

      this.wireframe.scale.setScalar(1.01)
      this.wireframe.traverse((child) => {
        child.material = this.greenMaterial
      })
    }
  }
}
</script>

<style></style>
