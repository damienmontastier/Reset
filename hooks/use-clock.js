import useRAF from '@/hooks/use-raf'

// TODO FUNCTION HEURE VIRTUELLE

class Clock {
  constructor() {
    const RAF = useRAF()
    RAF.add('use-clock', this.loop.bind(this))

    this.elapsedTime = 0
    this.elapsedTimeCountdown = 0
    this.additionalTime = 0
    this.countdownDisabled = true

    this.getTime()
  }

  getTime() {
    this.date = new Date()

    setInterval(this.getTime.bind(this), 1000)
  }

  get time() {
    // const h = this.date.getHours()
    // const m = this.date.getMinutes()
    const h = this.date.getHours()
    const m = Number(String(this.date.getMinutes()).padStart(2, '0'))

    // console.log(h, m)

    return { h, m }
  }

  get virtualTime() {
    const hVirtual = this.time.h * 5

    return hVirtual
  }

  get countdown() {
    return Math.max(
      0,
      this.timeCountdown - this.elapsedTimeCountdown - this.additionalTime
    )
  }

  startCountdown(val) {
    this.timeCountdown = val
    this.elapsedTimeCountdown = 0
    this.countdownDisabled = false
  }

  loop(clock) {
    if (!this.paused) {
      if (!this.countdownDisabled) this.elapsedTimeCountdown += clock.deltaTime
      this.elapsedTime += clock.deltaTime
    }
  }

  add(time) {
    this.additionalTime += 50
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
