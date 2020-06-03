import Events from 'events'
import Vue from 'vue'

/*  eslint-disable */

const keyboard = new Vue({
  created() {
    if (!process.client) return
    this.events = new Events()

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  },
  methods: {
    onKeyDown(e) {
      this.events.emit('keydown', e)
    },

    onKeyUp(e) {
      this.events.emit('keyup', e)
    }
  }
})

Vue.prototype.$keyboard = keyboard

export default keyboard
