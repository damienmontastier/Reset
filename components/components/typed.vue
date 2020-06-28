<template>
  <div class="typed">
    <div ref="typed" class="typed__content" />
  </div>
</template>

<script>
import Typed from 'typed.js'
export default {
  props: {
    strings: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.typed = new Typed(this.$refs.typed, {
      strings: this.strings,
      typeSpeed: 0,
      backSpeed: 0,
      loop: false,
      showCursor: false,
      onComplete: () => {
        this.$emit('typedCompleted')
      }
    })
  },

  beforeDestroy() {
    this.typed.destroy()
  }
}
</script>
