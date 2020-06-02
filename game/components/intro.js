import useAssetsManager from '@/hooks/use-assets-manager'
import useGUI from '@/hooks/use-gui'
import useRAF from '@/hooks/use-raf'

import standardMaterial from '@/webgl/materials/standard'
import GreenMaterial from '@/webgl/materials/green'

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
        }
      ]
    })

    this.files = await assetsManager.get('introduction')

    this.model = this.files.model.scene

    this.zones = this.model.getObjectByName('zones')

    this.models = this.model.getObjectByName('models')

    this.models.traverse((child) => {
      if (child.name.includes('model_pipes_vert')) {
        child.material = GreenMaterial.clone()
      } else if (child.name.includes('model_smartphone_screen')) {
        child.material = standardMaterial.clone()
        child.material.side = THREE.DoubleSide
      } else if (
        child.name.includes('model_smartphone') ||
        child.name.includes('model_smartphone_cam')
      ) {
        child.material = standardMaterial.clone()
        child.material.emissive = new THREE.Color(0xeeeeee)
      }
    })

    this.spawnPoint = this.model.getObjectByName('zone_spawn').position.clone()

    this.add(this.model)

    this.init()
  }

  init() {
    this.paused = false
    this.initZones()

    const RAF = useRAF()
    RAF.add('intro', this.update.bind(this), 0)
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

      if (name.includes('zone_spawn')) {
        zone.visible = false
      }
    })
  }

  update(clock) {
    // if (this.paused) return
  }
}
