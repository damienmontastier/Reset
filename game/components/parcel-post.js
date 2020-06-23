import useGame from '@/hooks/use-game'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

import PostsInstances from '@/game/components/posts-instances'

export default class ParcelPost extends THREE.Object3D {
  constructor(type) {
    super()

    let model

    this._type = type

    switch (type) {
      case 'youtube':
        model = PostsInstances.youtube.clone()
        break
      case 'instagram':
        model = PostsInstances.instagram.clone()
        break
      case 'twitter':
        model = PostsInstances.twitter.clone()
        break
      case 'whatsapp':
        model = PostsInstances.whatsapp.clone()
        break
      case 'facebook':
        model = PostsInstances.facebook.clone()
        break
      case 'snapchat':
        model = PostsInstances.snapchat.clone()
        break
      default:
        break
    }

    // if (type === 'youtube') {
    //   model = PostsInstances.youtube.clone()
    // } else if (type === 'instagram') {
    //   model = PostsInstances.instagram.clone()
    // } else if (type === 'twitter') {
    //   model = PostsInstances.twitter.clone()
    // } else if (type === 'whatsapp') {
    //   model = PostsInstances.whatsapp.clone()
    // } else if (type === 'facebook') {
    //   model = PostsInstances.facebook.clone()
    // } else if (type === 'snapchat') {
    //   model = PostsInstances.snapchat.clone()
    // }

    this.model = model
    this.add(this.model)
    this.initHitbox()
  }

  initHitbox() {
    this.hitboxMesh = this.model.getObjectByName('model_hitbox')
    this.add(this.hitboxMesh)
    this.hitboxMesh.visible = false

    this.hitbox = new INTERSECTIONS.Hitbox(this.hitboxMesh, {
      layers: ['parcel_post'],
      filters: []
    })

    const { intersections: intersectionsWorld } = useGame()
    intersectionsWorld.addHitbox(this.hitbox)

    // this.onIntersectingHandler = this.onIntersecting.bind(this)
    // this.hitbox.events.on('intersecting', this.onIntersectingHandler)
  }

  // onIntersecting(intersections) {
  //   const outHitboxesIntersections = intersections.filter(
  //     (intersection) =>
  //       intersection.target._layers.includes('treadmill_edge') &&
  //       intersection.intersecting === true &&
  //       intersection.lastIntersecting !== undefined
  //   )

  //   if (outHitboxesIntersections.length > 0) {
  //     this.destroy()
  //   }
  // }

  destroy() {
    const { intersections: intersectionsWorld } = useGame()

    this.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose()
      }

      if (child.material) {
        child.material.dispose()
      }
    })

    this.parent.remove(this)

    this.hitboxMesh.geometry.dispose()
    this.hitboxMesh.material.dispose()

    intersectionsWorld.removeHitbox(this.hitbox)

    // this.hitbox.events.off('intersecting', this.onIntersectingHandler)
  }
}
