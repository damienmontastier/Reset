import useRAF from '@/hooks/use-raf'
import windowFocus from '@/plugins/window-focus'

import uuidv4 from '@/assets/js/uuidv4'

export default class Countdown {
  constructor() {
    this.uuid = uuidv4()

    this.elapsedTime = 0

    this.paused = true

    const RAF = useRAF()
    RAF.add('countdown' + this.uuid, this.loop.bind(this))
  }

  get time() {
    return this.elapsedTime
  }

  loop(clock) {
    if (!windowFocus.visible) return

    if (!this.paused) {
      this.elapsedTime += clock.deltaTime
    }
  }

  destroy() {
    RAF.remove('countdown' + this.uuid, this.loop.bind(this))
  }
}
