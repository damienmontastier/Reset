import useAssetsManager from '@/hooks/use-assets-manager'

class PostsInstances {
  async load() {
    const assetsManager = useAssetsManager()
    assetsManager.loader.addGroup({
      name: 'posts',
      base: '/',
      files: [
        {
          name: 'youtube_obj',
          path: 'obj/colis/youtube.obj'
        },
        {
          name: 'youtube_map',
          path: 'img/materials/youtube.png'
        },
        {
          name: 'instagram_obj',
          path: 'obj/colis/instagram.obj'
        },
        {
          name: 'instagram_map',
          path: 'img/materials/instagram.png'
        },
        {
          name: 'twitter_obj',
          path: 'obj/colis/twitter.obj'
        },
        {
          name: 'twitter_map',
          path: 'img/materials/twitter.png'
        },
        {
          name: 'whatsapp_obj',
          path: 'obj/colis/whatsapp.obj'
        },
        {
          name: 'whatsapp_map',
          path: 'img/materials/whatsapp.png'
        },
        {
          name: 'facebook_obj',
          path: 'obj/colis/facebook.obj'
        },
        {
          name: 'facebook_map',
          path: 'img/materials/facebook.png'
        },
        {
          name: 'snapchat_obj',
          path: 'obj/colis/snapchat.obj'
        },
        {
          name: 'snapchat_map',
          path: 'img/materials/snapchat.png'
        }
      ]
    })

    const files = await assetsManager.get('posts')

    this.youtube = files.youtube_obj.clone()
    this.youtube.getObjectByName(
      'model_solid'
    ).material = new THREE.MeshBasicMaterial({
      map: files.youtube_map
    })

    this.instagram = files.instagram_obj.clone()
    this.instagram.getObjectByName(
      'model_solid'
    ).material = new THREE.MeshBasicMaterial({
      map: files.instagram_map
    })

    this.twitter = files.twitter_obj.clone()
    this.twitter.getObjectByName(
      'model_solid'
    ).material = new THREE.MeshBasicMaterial({
      map: files.twitter_map
    })

    this.whatsapp = files.whatsapp_obj.clone()
    this.whatsapp.getObjectByName(
      'model_solid'
    ).material = new THREE.MeshBasicMaterial({
      map: files.whatsapp_map
    })

    this.facebook = files.facebook_obj.clone()
    this.facebook.getObjectByName(
      'model_solid'
    ).material = new THREE.MeshBasicMaterial({
      map: files.facebook_map
    })

    this.snapchat = files.snapchat_obj.clone()
    this.snapchat.getObjectByName(
      'model_solid'
    ).material = new THREE.MeshBasicMaterial({
      map: files.snapchat_map
    })
  }
}

export default new PostsInstances()
