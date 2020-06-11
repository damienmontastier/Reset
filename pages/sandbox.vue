<template>
  <div>
    <quality-selection />
  </div>
</template>

<script>
export default {
  components: {
    QualitySelection: () => import('@/components/game/quality-selection')
  }
}
</script>
