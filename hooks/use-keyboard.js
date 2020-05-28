import Events from 'events'

let keyboard

class Keyboard {
  constructor() {
    this.events = new Events()
    this.disabled = false

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyDown(e) {
    if (this.disabled) return

    this.events.emit('keydown', e)
  }

  onKeyUp(e) {
    if (this.disabled) return

    this.events.emit('keyup', e)
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown.bind(this))
    window.removeEventListener('keyup', this.onKeyUp.bind(this))
  }
}

const useKeyboard = () => {
  return keyboard || (keyboard = new Keyboard())
}

export default useKeyboard
