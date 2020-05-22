import useRAF from '@/hooks/use-raf'

class Clock {
  constructor() {
    this.pause()

    const RAF = useRAF()
    RAF.add('use-clock', this.loop.bind(this))

    this.elapsedTime = 0
    this.addionalTime = 0

    this.refreshDate()

    setInterval(this.refreshDate, 1000)
  }

  get time() {
    return 120 - this.elapsedTime - this.addionalTime
  }

  virtualHour() {
    const h = this.date.getHours()
    const m = this.date.getMinutes()
    const s = this.date.getSeconds()
    console.log('coucou')

    return `${h} : ${m} : ${s}`
  }

  refreshDate() {
    this.date = new Date()

    // console.log(test)
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
