import gsap from 'gsap'

import useAssetsManager from '@/hooks/use-assets-manager'
import useGUI from '@/hooks/use-gui'
import useRAF from '@/hooks/use-raf'
import useGame from '@/hooks/use-game'

import standardMaterial from '@/webgl/materials/standard'
import GreenMaterial from '@/webgl/materials/green'
import BlackMaterial from '@/webgl/materials/black'

import INTRODUCTION_CONFIG from '@/config/introduction'

export default class Introduction extends THREE.Object3D {
  async load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'introduction',
      base: '/',
      files: [
        {
          name: 'model',
          path: 'obj/intro/intro.glb'
        },
        {
          name: 'wireframe',
          path: 'obj/intro/intro_wireframe.obj'
        }
      ]
    })

    this.files = await assetsManager.get('introduction')

    this.model = this.files.model.scene
    this.wireframe = this.files.wireframe

    this.wireframe.traverse((child) => {
      child.material = BlackMaterial.clone()
    })

    this.zones = this.model.getObjectByName('zones')
    this.models = this.model.getObjectByName('models')
    this.smartphone = this.model.getObjectByName('model_smartphone')
    this.smartphoneWireframe = this.wireframe.getObjectByName(
      'model_smartphone_wireframe'
    )

    this.models.traverse((child) => {
      if (
        child.name.includes('model_pipes_vert') ||
        child.name.includes('model_spawn')
      ) {
        child.material = GreenMaterial.clone()
      } else if (
        child.name.includes('model_floor') ||
        child.name.includes('model_interact')
      ) {
        child.material = standardMaterial.clone()
        child.material.emissive = new THREE.Color(0xeeeeee)
      }
    })

    this.smartphone.traverse((child) => {
      if (
        child.name.includes('model_smartphone_coque') ||
        child.name.includes('model_smartphone_cam')
      ) {
        child.material = standardMaterial.clone()
        child.material.emissive = new THREE.Color(0xeeeeee)
      }
    })

    this.interactZonePoint = this.model
      .getObjectByName('zone_interact')
      .position.clone()

    const spawnPoint = this.model.getObjectByName('zone_spawn').position.clone()

    this.spawnPoint = new THREE.Vector3(
      spawnPoint.x - 0.5,
      spawnPoint.y + 0.05,
      spawnPoint.z
    )

    this.add(this.model)
    this.add(this.wireframe)

    this.init()
  }

  init() {
    this.paused = false
    this.initZones()
    this.initLights()

    const RAF = useRAF()
    RAF.add('intro', this.update.bind(this), 0)
  }

  initLights() {
    const { scene } = useGame()

    this.ambientLight = new THREE.AmbientLight(0x383838, 0)
    scene.add(this.ambientLight)

    this.directionalLight = new THREE.DirectionalLight(
      INTRODUCTION_CONFIG.lights.color,
      INTRODUCTION_CONFIG.lights.intensity
    )
    this.directionalLight.position.copy(INTRODUCTION_CONFIG.lights.position)
    this.directionalLight.lookAt(scene.position)
    scene.add(this.directionalLight)

    const GUI = useGUI()

    GUI.addLight('light', this.directionalLight)
  }

  initZones() {
    this.zones.traverse((zone) => {
      const name = zone.name

      if (name.includes('zone_floor')) {
        zone.material = standardMaterial.clone()
        zone.material.emissive = new THREE.Color(0xeeeeee)

        const gui = useGUI()
        gui.addMaterial(zone.uuid.substring(0, 10), zone.material)
      }

      zone.visible = false
    })
  }

  update(clock) {
    if (this.paused) return

    const sin = (Math.sin(clock.time) / 2 + 0.5) * 0.25

    gsap.to([this.smartphone.position, this.smartphoneWireframe.position], {
      y: sin
    })
  }
}
