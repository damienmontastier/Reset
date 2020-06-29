<template>
  <div class="video-transition--container">
    <div
      :style="{ height: hypotenuse, width: hypotenuse }"
      class="video-transition"
    >
      <video
        @ended="
          $router.push({ name: 'slug', params: { slug: 'infinite-scroll' } })
        "
        :style="{
          transform: `translate(-50%, -50%) scale(calc(1 / ${params.scale}))`
        }"
        autoplay
      >
        <source src="/videos/transition_intro_level.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'

export default {
  data() {
    return {
      params: {
        scale: 0
      }
    }
  },
  computed: {
    hypotenuse() {
      if (!process.client) return
      return (
        Math.sqrt(
          this.$viewport.width * this.$viewport.width +
            this.$viewport.height * this.$viewport.height
        ) + 'px'
      )
    }
  },
  mounted() {
    gsap.to(this.params, {
      scale: 1,
      duration: 0.5
    })
  }
}
</script>

<style lang="scss">
.video-circle-enter-active {
  .video-transition {
    transition: transform 0.5s ease-out;
  }
}

.video-circle-enter {
  .video-transition {
    transform: translate(-50%, -50%) scale(0) translateZ(0);
  }
}

.video-transition--container {
  height: 100vh;
  left: 0;
  pointer-events: all;
  position: absolute;
  top: 0;
  width: 100%;
}

.video-transition {
  background: #000;
  border-radius: 50%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%) scale(1) translateZ(0);
  transition: transform 0.5s ease-out;

  video {
    height: auto;
    left: 50%;
    max-width: none;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%) scale(1.5);
    width: 100vw;
  }
}
</style>
