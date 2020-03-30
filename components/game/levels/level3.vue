<template>
  <div>level3</div>
</template>

<script>
import gsap from 'gsap'
import useGame from '@/hooks/use-game'

export default {
  mounted() {
    const { cube } = useGame()

    gsap.to(cube.rotation, {
      duration: 1,
      x: Math.random() * Math.PI,
      y: Math.random() * Math.PI,
      z: Math.random() * Math.PI
    })
  }
}
</script>
