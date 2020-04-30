import Events from 'events'
import Vue from 'vue'
import viewport from '@/plugins/viewport'

/* eslint-disable nuxt/no-env-in-hooks */
/* eslint-disable nuxt/no-globals-in-created */

const mouse = new Vue({
  data() {
    return {
      hasMove: false,
      position: new THREE.Vector2(-1000, -1000)
    }
  },
  computed: {
    normalized() {
      return new THREE.Vector2(
        (this.position.x / viewport.width) * 2 - 1,
        -(this.position.y / viewport.height) * 2 + 1
      )
    }
  },
  created() {
    if (!process.client) return

    this.events = new Events()

    window.addEventListener('touchstart', this.onMouseMove, false)
    window.addEventListener('touchmove', this.onMouseMove, false)
    window.addEventListener('mousemove', this.onMouseMove, false)
  },
  beforeDestroy() {
    if (!process.client) return

    window.removeEventListener('touchstart', this.onMouseMove, false)
    window.removeEventListener('touchmove', this.onMouseMove, false)
    window.removeEventListener('mousemove', this.onMouseMove, false)
  },
  methods: {
    onMouseMove(e) {
      const event = e

      this.hasMove = true

      const evt = e.targetTouches ? e.targetTouches[0] : e

      this.position.set(evt.x, evt.y)

      this.events.emit('mousemove', {
        ...this.$data,
        event
      })
    }
  }
})

Vue.prototype.$mouse = mouse

export default mouse
