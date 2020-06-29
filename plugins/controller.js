import Events from 'events'
import Vue from 'vue'

import keyboard from './keyboard'

import controls from '@/config/controls'

/*  eslint-disable */

const controller = new Vue({
  created() {
    if (!process.client) return
    this.events = new Events()

    keyboard.events.on('keyup', this.onKeyUp.bind(this))
  },
  methods: {
    onKeyUp(e) {
      const commands = []
      let key = ''
      key += e.shiftKey ? 'SHIFT+' : ''
      key += e.code
      Object.entries(controls).forEach(([command, keys]) => {
        if (keys.includes(e.code) || keys.includes(key)) {
          commands.push(command)
        }
      })

      if (commands[0]) this.events.emit('keyup', commands)
    }
  }
})

Vue.prototype.$controller = controller

export default controller
