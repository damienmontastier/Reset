<template>
  <div class="gameControls">
    <volume class="gameControls__volume" />
    <fullscreen class="gameControls__fullscreen" />
  </div>
</template>

<script>
export default {
  components: {
    Volume: () => import('@/components/components/volume'),
    Fullscreen: () => import('@/components/components/fullscreen')
  }
}
</script>

<style lang="scss">
.gameControls {
  display: flex;

  &__volume {
    margin-right: 24px;
  }
}
</style>
