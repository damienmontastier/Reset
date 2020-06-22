<template>
  <div
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    :class="{ 'solution--unlocked': unlocked }"
    class="solution"
  >
    <div class="solution__icon">
      <div ref="lottie-icon"></div>
    </div>
    <div class="solution__caption">
      <div v-if="unlocked && !solution.opened" class="solution__new">
        <div v-kinesis="{ depth: 2 }">
          new !
        </div>
      </div>

      <template v-if="unlocked">
        <h4 class="solution__caption__subtitle">Tip #{{ solution.id }}</h4>
        <h3 class="solution__caption__title">{{ solution.title }}</h3>
      </template>

      <template v-else>
        <h4 class="solution__caption__subtitle">Unlocked at :</h4>
        <h3 class="solution__caption__title">
          <span class="solution__caption__title__score">
            {{ solution.required_score | minutesAndSeconds }}
          </span>
          or less in
          <span class="solution__caption__title__stage">
            {{ solution.stage.title }}
          </span>
        </h3>
      </template>
    </div>
  </div>
</template>

<script>
import lottie from 'lottie-web'
import folderLottieData from '@/assets/lottie/folder.json'
import lockLottieData from '@/assets/lottie/lock.json'

import useGame from '@/hooks/use-game'

export default {
  filters: {
    minutesAndSeconds(time) {
      let minutes = Math.floor(time / 60)
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let seconds = time - minutes * 60
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return minutes + ':' + seconds
    }
  },
  props: {
    solution: {
      type: Object,
      required: true
    },
    unlocked: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    const { UIGrid } = useGame()
    UIGrid.visible = true

    this.iconAnimation = lottie.loadAnimation({
      container: this.$refs['lottie-icon'],
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: this.unlocked ? folderLottieData : lockLottieData
    })
  },

  methods: {
    onMouseEnter() {
      this.iconAnimation.setDirection(1)
      this.iconAnimation.stop()
      this.iconAnimation.play()
    },

    onMouseLeave() {
      this.iconAnimation.setDirection(-1)
      this.iconAnimation.play()
    }
  }
}
</script>

<style lang="scss">
.solution {
  --color: var(--color-grey-light);
  --b-color: var(--color-transparent);
  background-color: var(--color-grey);
  border: 1px solid var(--b-color);
  color: var(--color);
  display: flex;
  flex-direction: column;
  font-family: var(--font-violet);
  transition: border 0.4s _ease('quint', 'out');

  &:hover {
    --b-color: var(--color);
  }

  &--unlocked {
    --color: var(--color-green);
  }

  &__icon {
    display: flex;
    height: 100%;

    > * {
      height: 50%;
      margin: auto;
      max-height: 80px;
      width: 50%;
    }
  }

  &__new {
    color: var(--color-black);
    font-size: 14px;
    line-height: 17px;

    position: absolute;
    right: 0;
    text-transform: uppercase;
    top: 0;
    transform: translate(25%, -50%);

    > * {
      background-color: var(--color-green);
      padding: 4px;
    }
  }

  &__caption {
    background-color: var(--color-black);
    border-top: 1px solid var(--b-color);
    padding: 17px;
    position: relative;
    transition: border 0.4s _ease('quint', 'out');

    &__subtitle {
      font-size: 11px;
      line-height: 14px;
      margin-bottom: 4px;

      @media screen and (min-width: 1200px) {
        font-size: 14px;
        line-height: 17px;
      }
    }

    &__title {
      font-size: 15px;
      line-height: 19px;

      @media screen and (min-width: 1200px) {
        font-size: 18px;
        line-height: 22px;
      }

      &__score {
        color: var(--color-grey-lighten);
      }

      &__stage {
        text-transform: uppercase;
      }
    }
  }
}
</style>
