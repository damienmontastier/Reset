import windowFocus from '@/plugins/window-focus'

export default class Raf {
  constructor(clock = new THREE.Clock()) {
    this.subscribers = {}
    this.isRunning = false
    this.clock = clock
    this.paused = false

    this.fps = 60
    this.latest = 0
    this.delta = 0
    this.optimumDeltaTime = this.frameDuration / 1000

    this.loop()
  }

  get frameDuration() {
    return 1000 / this.fps
  }

  dispatch() {
    // clock
    const deltaTime = this.clock.getDelta()
    const time = this.clock.getElapsedTime()
    const lagSmoothing = windowFocus.visible
      ? deltaTime / (1000 / 60 / 1000)
      : 1

    // callbacks
    Object.values(this.subscribers)
      .sort((a, b) => {
        return a.priority - b.priority
      })
      .forEach((raf) => {
        raf.callback({ time, deltaTime, lagSmoothing })
      })
  }

  loop() {
    const now = performance.now()

    this.delta = now - this.latest

    if (this.delta > this.frameDuration) {
      this.dispatch()
    }

    this.latest = now - (this.delta % this.frameDuration)

    requestAnimationFrame(this.loop.bind(this))
  }

  add(id, callback, priority = 0) {
    if (this.subscribers[id]) {
      console.log(`raf.add(): ${id} already added`)
      return
    }
    this.subscribers[id] = { id, callback, priority }
  }

  // set pause(bool) {
  //   this.paused = bool
  //   this.isRunning = !bool

  //   if (bool) {
  //     this.clock.stop()
  //     cancelAnimationFrame(this.rafId)
  //   } else {
  //     this.clock.start()
  //     this.loop()
  //   }
  // }

  remove(id) {
    if (!this.subscribers[id]) {
      console.warn(`raf.remove(): ${id} callback doesn't exist`)
    }
    delete this.subscribers[id]
  }
}
