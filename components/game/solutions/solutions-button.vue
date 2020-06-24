<template>
  <div @click="$store.commit('solutions/toggleOpened')" class="solutionsButton">
    <div ref="icon" />
  </div>
</template>

<script>
import lottie from 'lottie-web'
import hardDriveLottieData from '@/assets/lottie/hard-drive.json'

export default {
  computed: {
    stages() {
      return this.$store.state.stages.list
    },
    solutions() {
      return Object.values(this.$store.state.solutions.list)
    },
    isUnopenedSolutions() {
      return this.solutions
        .map((solution) => {
          solution.stage = this.stages[solution.stage_id]
          solution.unlocked = solution.required_score > solution.stage.score
          return solution
        })
        .filter((solution) => solution.unlocked)
        .some((solution) => !solution.opened)
    }
  },
  watch: {
    isUnopenedSolutions() {
      // console.log(this.isUnopenedSolutions)

      if (this.isUnopenedSolutions) {
        this.iconAnimation.setDirection(1)
        this.iconAnimation.play()
      } else {
        this.iconAnimation.setDirection(-1)
        this.iconAnimation.play()
      }
    }
  },
  mounted() {
    this.iconAnimation = lottie.loadAnimation({
      container: this.$refs.icon,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: hardDriveLottieData
    })
  }
}
</script>

<style lang="scss">
.solutionsButton {
  background-color: var(--color-black);
  cursor: pointer;
  display: flex;
  height: 60px;
  width: 60px;

  > * {
    margin: auto;
    padding: 8px;
  }
}
</style>
