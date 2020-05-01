import useRAF from '@/hooks/use-raf'

class Clock {
  constructor() {
    this.pause()

    const RAF = useRAF()
    RAF.add('use-clock', this.loop.bind(this))

    this.elapsedTime = 0
    this.addionalTime = 0
  }

  get time() {
    return 120 - this.elapsedTime - this.addionalTime
  }

  loop(clock) {
    if (!this.paused) {
      this.elapsedTime += clock.deltaTime
    }
  }

  add(time) {
    this.addionalTime += time
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
  }

  destroy() {
    const RAF = useRAF()
    RAF.remove('use-clock')
  }
}

let clock

const useClock = () => {
  return clock || (clock = new Clock())
}

export default useClock
