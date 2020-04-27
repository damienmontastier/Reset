<template>
  <div class="gameClock">
    {{ time.toFixed(2) }}
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
  mounted() {
    this.clock = useClock()
  },
  watch: {
    'clock.time'() {
      this.time = this.clock.time
    }
  }
}
</script>
