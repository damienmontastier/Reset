import Events from 'events'

let keyboard

class Keyboard {
  constructor() {
    this.events = new Events()
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyDown(e) {
    if (!e.repeat) this.events.emit('keypress', e)
    this.events.emit('keydown', e)
  }

  onKeyUp(e) {
    this.events.emit('keyup', e)
  }
}

const useKeyboard = () => {
  return keyboard || (keyboard = new Keyboard())
}

export default useKeyboard
