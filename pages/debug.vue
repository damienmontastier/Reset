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
            name: 'debug_solid',
            path: 'obj/debug/debug_solid.glb'
          },
          {
            name: 'debug_wireframe',
            path: 'obj/debug/debug_wireframe.obj'
          },
          {
            name: 'level01_solid',
            path: 'obj/level_01/level01_14.glb'
          },
          {
            name: 'level01_wireframe',
            path: 'obj/level_01/level01_07_wireframe.obj'
          }
        ]
      })

      this.files = await assetsManager.get('debug')

      this.debug_solid = this.files.debug_solid.scene
      this.debug_wireframe = this.files.debug_wireframe

      this.level01_solid = this.files.level01_solid.scene
      this.level01_wireframe = this.files.level01_wireframe
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

      scene.add(this.debug_solid)
      scene.add(this.debug_wireframe)

      scene.add(this.level01_solid)
      scene.add(this.level01_wireframe)

      this.level01_solid.position.y = 5
      this.level01_wireframe.position.y = 5

      this.standardMaterial = standardMaterial.clone()

      this.debug_solid.traverse((child) => {
        child.material = this.standardMaterial
      })

      this.level01_solid.traverse((child) => {
        child.material = this.standardMaterial
      })

      const GUI = useGUI()

      GUI.addMaterial('standard material', this.standardMaterial)

      this.greenMaterial = new BasicMaterial({ color: 0x00ff00 })

      GUI.add(this.greenMaterial.uniforms.uAppear, 'value')
        .min(0)
        .max(1)
        .step(0.01)
        .name('green appear')

      this.debug_wireframe.scale.setScalar(1.01)
      this.debug_wireframe.traverse((child) => {
        child.material = this.greenMaterial
      })
      this.level01_wireframe.traverse((child) => {
        child.material = this.greenMaterial
      })
    }
  }
}
</script>

<style></style>
