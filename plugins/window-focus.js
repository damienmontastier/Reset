import Events from 'events'
import Vue from 'vue'

/* eslint-disable nuxt/no-env-in-hooks */
/* eslint-disable nuxt/no-globals-in-created */

const focus = new Vue({
  data() {
    return {
      focused: true,
      visible: true
    }
  },
  watch: {
    visible() {
      this.events.emit('visible', this.visible)
    },
    focused() {
      this.events.emit('focus', this.focused)
    }
  },
  created() {
    if (!process.client) return

    this.events = new Events()

    window.addEventListener('focus', () => (this.focused = true), false)
    window.addEventListener('blur', () => (this.focused = false), false)
    document.addEventListener(
      'visibilitychange',
      () => {
        setTimeout(() => {
          this.visible = !document.hidden
        }, 0)
      },
      false
    )
  }
})

Vue.prototype.$focus = focus

export default focus
