import events from '@/plugins/events'

export default class SignScreenMaterial {
  constructor() {
    this.video = document.createElement('video')
    this.video.src = '/videos/terminal_screen02.mp4'
    this.video.style.visibility = 'hidden'
    this.video.muted = true
    this.video.loop = true
    this.video.play()

    this.texture = new THREE.VideoTexture(this.video)

    events.on('TERMINAL COMPLETED', this.onTerminalCompleted.bind(this))
  }

  getMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture
    })
    return this.material
  }

  onTerminalCompleted() {
    this.video = document.createElement('video')
    this.video.src = '/videos/terminal_screen02_red.mp4'
    this.video.style.visibility = 'hidden'
    this.video.muted = true
    this.video.loop = true
    this.video.play()

    this.texture.dispose()
    this.texture = new THREE.VideoTexture(this.video)
    this.material.map = this.texture
    this.material.needsUpdate = true
  }
}
