import useAssetsManager from '@/hooks/use-assets-manager'
import useGUI from '@/hooks/use-gui'
import useRAF from '@/hooks/use-raf'

import standardMaterial from '@/webgl/materials/standard'

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

    this.spawnPoint = this.model
      .getObjectByName('zone_spawn')
      .position.add(new THREE.Vector3(-0.5, 0, 0))

    // this.wireframe.traverse((child) => {
    //   if (child.name.includes('green')) {
    //     child.material = GreenMaterial
    //   }

    //   if (child.name.includes('black')) {
    //     child.material = BlackMaterial
    //   }
    // })

    this.add(this.model)

    // this.model.traverse((child) => {
    //   if (child.name.includes('model_border')) {
    //     child.material = GreenMaterial
    //   }
    // })

    this.init()
  }

  init() {
    this.paused = false
    // this.initZones()

    const RAF = useRAF()
    RAF.add('intro', this.update.bind(this), 0)
  }

  initZones() {
    // debug materials
    this.zones.traverse((zone) => {
      const name = zone.name
      if (name.includes('floor')) {
        zone.material = standardMaterial.clone()

        const gui = useGUI()
        gui.addMaterial(zone.uuid.substring(0, 10), zone.material)
      }

      if (name.includes('treadmill')) {
        zone.visible = false
      }

      if (name.includes('terminal')) {
        zone.visible = false
      }

      if (name.includes('zone_spawn')) {
        zone.visible = false
      }

      if (name.includes('zone_tuto')) {
        zone.visible = false
      }

      if (name.includes('zone_endgame')) {
        zone.visible = false
      }
    })
  }

  update(clock) {
    // if (this.paused) return
  }
}
