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
      Object.entries(controls).forEach(([command, keys]) => {
        if (keys.includes(e.code)) {
          commands.push(command)
        }
      })

      this.events.emit('keyup', commands)
    }
  }
})

Vue.prototype.$controller = controller

export default controller
