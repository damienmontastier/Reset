<template>
  <h1>nuxt-three drone test</h1>
</template>

<script>
import useGame from '@/hooks/use-game'
import FactorySpline from '@/game/components/factory-spline'
import Drone from '@/game/components/drone'
import Spline from '@/webgl/utils/spline'
import AnimatedSpline from '@/game/components/animated-spline'

export default {
  async mounted() {
    const { raf, scene } = useGame()

    this.factory = new FactorySpline()
    const { drone } = await this.factory.load()
    const model = {
      model: drone.getObjectByName('Drone'),
      circle: drone.getObjectByName('Circle')
    }
    const spline = drone.getObjectByName('SplineAngle_SplineAngle.001')

    this.drone = new Drone(model)

    scene.add(this.drone)

    this.spline = new Spline({
      spline,
      scale: 1
    })

    scene.add(this.spline.object)

    this.animatedSpline = new AnimatedSpline({
      worker: this.drone,
      spline: this.spline,
      loop: true,
      autoplay: true,
      duration: 10
    })

    // if (!this.animatedWorker.autoplay) {
    //   document.addEventListener('mousedown', () => {
    //     this.animatedWorker.start()
    //   })

    //   document.addEventListener('mouseup', () => {
    //     this.animatedWorker.stop()
    //   })
    // }

    raf.add('test-drone', this.loop.bind(this))
  },
  methods: {
    loop(clock) {
      this.animatedSpline.render(clock)
    }
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
