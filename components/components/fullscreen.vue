<template>
  <button
    @click="toggleFullscreen"
    :class="{ 'fullscreen--isFullscreen': isFullscreen }"
    class="fullscreen"
  >
    <div class="fullscreen__corner fullscreen__corner--tl" />
    <div class="fullscreen__corner fullscreen__corner--tr" />
    <div class="fullscreen__corner fullscreen__corner--br" />
    <div class="fullscreen__corner fullscreen__corner--bl" />
  </button>
</template>

<script>
export default {
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.onFullScreenChange()
    document.addEventListener('fullscreenchange', this.onFullScreenChange)
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.onFullScreenChange)
  },
  methods: {
    onFullScreenChange() {
      this.isFullscreen = document.fullscreen
    },
    toggleFullscreen() {
      !this.isFullscreen ? this.requestFullscreen() : this.closeFullscreen()
    },
    requestFullscreen() {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen()
      } else if (document.body.mozRequestFullScreen) {
        /* Firefox */
        document.body.mozRequestFullScreen()
      } else if (document.body.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        document.body.webkitRequestFullscreen()
      } else if (document.body.msRequestFullscreen) {
        /* IE/Edge */
        document.msRequestFullscreen()
      }
    },
    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen()
      }
    }
  }
}
</script>

<style lang="scss">
.fullscreen {
  --bw: 2px;
  height: 22px;
  position: relative;
  width: 32px;

  &--isFullscreen {
    .fullscreen__corner {
      transform: scale(-1);
    }
  }

  &__corner {
    border-color: var(--color-green);
    border-style: solid;
    height: 6px;
    position: absolute;
    width: 8px;

    &--tl {
      border-left-width: var(--bw);
      border-top-width: var(--bw);
      left: 0;
      top: 0;
    }

    &--tr {
      border-right-width: var(--bw);
      border-top-width: var(--bw);
      right: 0;
      top: 0;
    }

    &--br {
      border-bottom-width: var(--bw);
      border-right-width: var(--bw);
      bottom: 0;
      right: 0;
    }

    &--bl {
      border-bottom-width: var(--bw);
      border-left-width: var(--bw);
      bottom: 0;
      left: 0;
    }
  }
}
</style>
