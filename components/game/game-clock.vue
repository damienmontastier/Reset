<template>
  <div class="gameClock">
    {{ sec2time(time) }}
  </div>
</template>

<script>
import useClock from '@/hooks/use-clock'
export default {
  data() {
    return {
      clock: undefined,
      time: 0
    }
  },
  watch: {
    'clock.time'() {
      this.time = this.clock.time
    }
  },
  mounted() {
    this.clock = useClock()
  },
  methods: {
    sec2time(timeInSeconds) {
      const pad = function(num, size) {
        return ('000' + num).slice(size * -1)
      }
      const time = parseFloat(timeInSeconds).toFixed(3)
      const minutes = Math.floor(time / 60) % 60
      const seconds = Math.floor(time - minutes * 60)
      const milliseconds = time.slice(-3)

      return (
        pad(minutes, 2) + ':' + pad(seconds, 2) + ':' + pad(milliseconds, 3)
      )
    }
  }
}
</script>
