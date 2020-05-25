import useGame from '@/hooks/use-game'
// import useGUI from '@/hooks/use-gui'
// import ToonMaterial from '@/webgl/materials/toon.js'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

// import BoxGeometry from '@/webgl/geometries/box'

import useAssetsManager from '@/hooks/use-assets-manager'

export default class ParcelPost extends THREE.Object3D {
  constructor(type) {
    super()

    const assetsManager = useAssetsManager()

    const colis = assetsManager.get('colis', true)

    let model
    let map

    if (type === 'youtube') {
      model = colis.youtube_obj.clone()
      map = colis.youtube_map
    } else if (type === 'instagram') {
      model = colis.instagram_obj.clone()
      map = colis.instagram_map
    } else if (type === 'twitter') {
      model = colis.twitter_obj.clone()
      map = colis.twitter_map
    } else if (type === 'whatsapp') {
      model = colis.whatsapp_obj.clone()
      map = colis.whatsapp_map
    } else if (type === 'facebook') {
      model = colis.facebook_obj.clone()
      map = colis.facebook_map
    }

    this.model = model
    this.model.getObjectByName(
      'model_solid'
    ).material = new THREE.MeshBasicMaterial({
      map
    })
    this.add(this.model)

    // this.initMaterial()
    this.initHitbox()
  }

  initMaterial() {
    // const material = new ToonMaterial({
    //   color: Math.floor(Math.random() * 16777215),
    //   emissive: Math.floor(Math.random() * 16777215)
    // })
    // this.model.material = material
    // const gui = useGUI()
    // gui.addMaterial(this.model.uuid.substring(0, 10), material)
  }

  initHitbox() {
    // this.hitboxMesh = new THREE.Mesh(
    //   new THREE.BoxBufferGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial()
    // )

    this.hitboxMesh = this.model.getObjectByName('model_hitbox')
    // console.
    // this.hitboxMesh.scale.setScalar(1.1)

    // this.hitboxMesh.position.copy(new THREE.Vector3(-0.5, 0.5, -0.5))
    // this.hitboxMesh.scale.setScalar(0.6)
    this.add(this.hitboxMesh)
    this.hitboxMesh.visible = false
    this.hitbox = new INTERSECTIONS.Hitbox(this.hitboxMesh, {
      layers: ['parcel_post'],
      filters: ['treadmill_edge']
    })

    const { intersections: intersectionsWorld } = useGame()
    intersectionsWorld.addHitbox(this.hitbox)

    this.onIntersectingHandler = this.onIntersecting.bind(this)
    this.hitbox.events.on('intersecting', this.onIntersectingHandler)
  }

  onIntersecting(intersections) {
    const outHitboxesIntersections = intersections.filter(
      (intersection) =>
        intersection.target._layers.includes('treadmill_edge') &&
        intersection.intersecting === true &&
        intersection.lastIntersecting !== undefined
    )

    if (outHitboxesIntersections.length > 0) {
      this.destroy()
    }
  }

  destroy() {
    const { intersections: intersectionsWorld } = useGame()
    // intersectionsWorld.addHitbox(this.hitbox)

    // this.model.geometry.dispose()
    // this.model.material.dispose()
    this.parent.remove(this)

    this.hitboxMesh.geometry.dispose()
    this.hitboxMesh.material.dispose()

    intersectionsWorld.removeHitbox(this.hitbox)

    this.hitbox.events.off('intersecting', this.onIntersectingHandler)
  }
}
