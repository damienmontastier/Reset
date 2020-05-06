import Events from 'events'

let keyboard

class Keyboard {
  constructor() {
    this.events = new Events()
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyDown(e) {
    this.events.emit('keydown', e)
  }

  onKeyUp(e) {
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
