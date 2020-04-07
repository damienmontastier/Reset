export default class Raf {
  constructor() {
    this.rafs = {}
    this.isRunning = false

    this.clock = new THREE.Clock()
  }

  loop() {
    this.isRunning = true

    // clock
    const deltaTime = this.clock.getDelta()

    // callbacks
    Object.values(this.rafs)
      .sort((a, b) => {
        return a.priority - b.priority
      })
      .forEach((raf) => {
        raf.callback(deltaTime)
      })

    // this.stats.end()

    this.rafId = requestAnimationFrame(this.loop.bind(this))
  }

  add(id, callback, priority = 0) {
    if (this.rafs[id]) {
      console.log(`raf.add(): ${id} already added`)
      return
    }
    this.rafs[id] = { id, callback, priority }

    if (!this.isRunning) {
      this.loop()
    }
  }

  remove(id) {
    if (!this.rafs[id]) {
      console.warn(`raf.remove(): ${id} callback doesn't exist`)
    }
    delete this.rafs[id]

    if (Object.keys(this.rafs).length === 0) {
      this.isRunning = false
      cancelAnimationFrame(this.rafId)
    }
  }
}
