// export default new THREE.MeshBasicMaterial({ color: 0xffffff })

export default class SignScreenMaterial {
  constructor() {
    this.video = document.createElement('video')
    this.video.src = '/videos/screen_sign_01.mp4'
    this.video.style.visibility = 'hidden'
    this.video.muted = true
    this.video.loop = true
    this.video.play()

    this.texture = new THREE.VideoTexture(this.video)
  }

  getMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: this.texture
    })
    return this.material
  }
}
