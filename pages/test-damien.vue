<template>
  <h1>nuxt-three damien test</h1>
</template>

<script>
import useGame from '@/hooks/use-game'
import FactorySpline from '@/game/components/factory-spline'
import Worker from '@/game/components/worker'
import Spline from '@/webgl/utils/spline'
import AnimatedWorker from '@/game/components/animated-worker'

export default {
  async mounted() {
    const { scene } = useGame()

    this.factory = new FactorySpline()
    const splines = await this.factory.load()
    const model = splines.getObjectByName('model')
    const spline = splines.getObjectByName('spline')

    this.worker = new Worker({ model })

    scene.add(this.worker)

    this.spline = new Spline({
      spline,
      scale: 5
    })

    this.animatedWorker = new AnimatedWorker({
      worker: this.worker,
      spline: this.spline,
      loop: true,
      autoplay: true,
      duration: 2
    })

    document.addEventListener('mousedown', () => {
      this.animatedWorker.stop()
    })

    document.addEventListener('mouseup', () => {
      this.animatedWorker.start()
    })
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
