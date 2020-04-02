<template>
  <h1>nuxt-three damien test</h1>
</template>

<script>
// import gsap from 'gsap'
import useGame from '@/hooks/use-game'
import FactorySpline from '@/game/components/factorySpline'
import Workers from '@/game/components/workers'

export default {
  async mounted() {
    const { scene } = useGame()

    this.factory = new FactorySpline()
    const splines = await this.factory.load()
    const model = splines.getObjectByName('model')
    const spline = splines.getObjectByName('spline')
    this.worker = new Workers({ model, spline })

    scene.add(this.worker)
  }
}
</script>

<style lang="scss">
h1 {
  color: var(--color-white);
  font-family: var(--font-tobias-heavy);
  font-size: var(--font-size-xl);
  text-align: center;
}
</style>
