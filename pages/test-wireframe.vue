<template>
  <div></div>
</template>

<script>
import useGame from '@/hooks/use-game'
import useRAF from '@/hooks/use-raf'
import useGUI from '@/hooks/use-gui'
import useCamera from '@/hooks/use-camera'
// import useWebgl from '@/hooks/use-webgl'
import useAssetsManager from '@/hooks/use-assets-manager'

import ParticulesPlane from '@/webgl/components/particules-plane'

export default {
  mounted() {
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
    const material = new THREE.MeshMatcapMaterial({
      matcap: new THREE.TextureLoader().load('/images/matcap/black2.png')
    })
    this.cube = new THREE.Mesh(geometry, material)

    this.cube.position.y = -2

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
    loadTexture(src) {
      const loader = new THREE.TextureLoader()

      return new Promise((resolve, reject) => {
        loader.load(
          src,
          (texture) => {
            resolve(texture)
          },
          undefined,
          (err) => {
            console.error('An error happened.', err)
          }
        )
      })
    },
    async init() {
      await this.load()

      const { scene } = useGame()
      scene.add(this.testModel)
      // scene.add(this.solidModel)
      // scene.add(this.wireframeModel)

      const solidMaterial = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        matcap: new THREE.TextureLoader().load('/images/matcap/black.png'),
        normalMap: new THREE.TextureLoader().load(
          '/images/normal-map/smith.jpg'
        )
      })

      // new THREE.TextureLoader().loa

      // this.testModel.material = solidMaterial

      // const solidMaterial = new THREE.MeshNormalMaterial({})

      const GUI = useGUI()
      GUI.addMaterial('solidMaterial', solidMaterial)

      this.testModel.children[0].material = solidMaterial

      this.solidModel.traverse((child) => {
        child.material = solidMaterial

        // child.material = new THREE.MeshMatcapMaterial({
        //   matcap: new THREE.TextureLoader().load('/images/matcaps/black2.png')
        // })
      })

      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      })

      this.wireframeModel.traverse((child) => {
        child.material = wireframeMaterial
      })

      this.particulesPlane = new ParticulesPlane()
      // scene.add(this.particulesPlane)

      this.particulesPlane.scale.setScalar(50)
      this.particulesPlane.rotation.x = -Math.PI / 2
      this.particulesPlane.rotation.z = -Math.PI / 4

      this.particulesPlane.position.y = -2

      const RAF = useRAF()
      RAF.add('test-wireframe', this.loop)
    },
    loop(clock) {
      this.particulesPlane.update(clock)
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
          },
          {
            name: 'test',
            path: 'obj/test_wireframe/LeePerrySmith.glb'
          }
        ]
      })

      const files = await assetsManager.get('test-wireframe')
      this.testModel = files.test.scene
      this.solidModel = files.solid
      this.wireframeModel = files.wireframe

      // const params = {
      //   distance: 0,
      // }

      // const GUI = useGUI()
      // GUI.add(params, 'distance')
      //   .min(0)
      //   .max(20)
      //   .step(0.01)
      //   .onChange(() => {
      //     this.$events.emit('VISIBLE_DISTANCE', params.distance)
      //   })

      // const wireframeMaterial = new THREE.MeshBasicMaterial({
      //   color: 0x00ff00,
      //   transparent: true
      //   // side: THREE.BackSide,
      //   // depthWrite: false
      // })
      // GUI.add(wireframeMaterial, 'opacity')
      //   .min(0)
      //   .max(1)
      //   .step(0.01)

      // this.solidModel.traverse((child) => {
      // child.material = new DistanceMaterial({ uDistance: params.distance })
      // child.material = new THREE.MeshPhongMaterial({})

      // child.material = new THREE.MeshMatcapMaterial({
      //   matcap: new THREE.TextureLoader().load('/images/matcaps/black2.png')
      // })
      // })

      this.wireframeModel.traverse((child) => {
        // child.scale.setScalar(1.002)
        // child.material = wireframeMaterial
      })
    }
  }
}
</script>
