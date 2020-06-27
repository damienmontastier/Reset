<template>
  <div class="gridBackground"></div>
</template>

<script>
import useGame from '@/hooks/use-game'

export default {
  mounted() {
    const { UIGrid } = useGame()
    UIGrid.visible = true
  },
  beforeDestroy() {
    const { UIGrid } = useGame()
    UIGrid.visible = false
  }
}
</script>
