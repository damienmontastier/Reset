<template>
  <h1>nuxt-three damien test</h1>
</template>

<script>
import useGame from '@/hooks/use-game'
import FactorySpline from '@/game/components/factory-spline'
import Worker from '@/game/components/worker'
import Spline from '@/webgl/utils/splineCurve'
import AnimatedWorker from '@/game/components/animated-worker'

export default {
  async mounted() {
    const { scene, raf } = useGame()

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
      duration: 10
    })

    if (!this.animatedWorker.autoplay) {
      document.addEventListener('mousedown', () => {
        this.animatedWorker.start()
      })

      document.addEventListener('mouseup', () => {
        this.animatedWorker.stop()
      })
    }

    raf.add('test-damien', this.loop.bind(this))
  },
  methods: {
    loop(clock) {
      this.animatedWorker.render(clock)
    }
  }
}
</script>

<style lang="scss">
h1 {
  color: var(--color-white);
  font-size: var(--font-size-xl);
  text-align: center;
}
</style>
