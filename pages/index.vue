<template>
  <h1>nuxt-three</h1>
</template>

<script>
import MapIntroduction from '@/game/components/intro'
import useIntro from '@/hooks/use-intro'
// import useCamera from '@/hooks/use-camera'

export default {
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.map = new MapIntroduction()
      await this.map.load()

      const { scene } = useIntro()

      const light = new THREE.AmbientLight(0x404040) // soft white light
      scene.add(light)

      scene.add(this.map)

      console.log(this.map)
    }
  }
}
</script>

<style lang="scss">
h1 {
  color: var(--color-white);
  font-size: var(--font-size-xl);
  opacity: 0;
  text-align: center;
}
</style>
