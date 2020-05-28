import Events from 'events'
import useRAF from '@/hooks/use-raf'

// TODO FUNCTION HEURE VIRTUELLE

class Clock {
  constructor() {
    const RAF = useRAF()
    RAF.add('use-clock', this.loop.bind(this))

    this.events = new Events()

    this.elapsedTime = 0
    this.elapsedTimeCountdown = 0
    this.additionalTime = 0
    this.countdownDisabled = true
    this.startTime = Date.now()

    this.events.on('clock:toggleCountdown', (val) => {
      this.countdownDisabled = val
    })

    this.getTime()
  }

  getTime() {
    this.date = new Date()

    setInterval(this.getTime.bind(this), 1000)
  }

  get virtualTime() {
    this.virtualDate = new Date(
      this.startTime +
        (this.date - this.startTime) * 60 +
        this.additionalTime * 60000
    )

    const h = String(this.virtualDate.getHours()).padStart(2, '0')
    const m = String(this.virtualDate.getMinutes()).padStart(2, '0')

    return { h, m }
  }

  get time() {
    const h = String(this.date.getHours()).padStart(2, '0')
    const m = String(this.date.getMinutes()).padStart(2, '0')

    return { h, m }
  }

  get countdown() {
    return Math.min(this.timeCountdown, this.elapsedTimeCountdown)
  }

  startCountdown(val) {
    this.timeCountdown = val
    this.elapsedTimeCountdown = 0
  }

  loop(clock) {
    if (!this.paused) {
      if (!this.countdownDisabled) this.elapsedTimeCountdown += clock.deltaTime
      this.elapsedTime += clock.deltaTime
    }
  }

  add(time) {
    this.additionalTime += time
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
