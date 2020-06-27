<template>
  <div>
    <quality-selection />
    <!-- <solutions /> -->
  </div>
</template>

<script>
export default {
  components: {
    QualitySelection: () => import('@/components/game/quality-selection')
    // Solutions: () => import('@/components/game/solutions/solutions')
  }
}
</script>
