<template>
  <section class="solutions">
    <div class="solutions__inner">
      <aside class="solutions__aside">
        <h2 class="solutions__title">
          <hard-drive-svg />
        </h2>
        <div class="solutions__modal">
          <div class="solutions__modal__close">
            <cross-svg />
          </div>
          <h3 class="solutions__modal__title">
            The Hard Drive compiles all the precious data you collected.
          </h3>
          <p class="solutions__modal__subtitle">
            Discover efficient ways to free yourself from the Smartphone grasp.
          </p>
          <div class="solutions__modal__progress">
            <div
              :style="`width:${progress * 100}%`"
              class="solutions__modal__progress__fill"
            ></div>
          </div>
          <p class="solutions__modal__stats">
            You unlocked
            <span>
              {{ stats }}
            </span>
            data.
          </p>
        </div>
      </aside>
      <div class="solutions__main">
        <scroller>
          <div class="solutions__main__grid">
            <solution
              v-for="(solution, i) in orderedSolutions"
              :key="i"
              :solution="solution"
              :unlocked="solution.unlocked"
              class="solutions__solution"
            />
          </div>
        </scroller>
      </div>
    </div>
  </section>
</template>

<script>
import Solution from './solution'
export default {
  components: {
    Solution,
    HardDriveSvg: () => import('@/components/svg/hard-drive'),
    CrossSvg: () => import('@/components/svg/cross'),
    Scroller: () => import('@/components/components/scroller')
  },
  computed: {
    solutions() {
      return this.$store.state.solutions.list
    },
    orderedSolutions() {
      return this.solutions
        .map((solution) => {
          solution.unlocked = eval(solution.required_score + '>190')
          return solution
        })
        .sort((a, b) => b.unlocked - a.unlocked)
    },
    unlockedSolutions() {
      return this.orderedSolutions.filter((solution) => solution.unlocked)
    },
    stats() {
      let unlocked = this.unlockedSolutions.length
      if (unlocked < 10) {
        unlocked = '0' + unlocked
      }

      let total = this.solutions.length
      if (total < 10) {
        total = '0' + total
      }

      return unlocked + '/' + total
    },
    progress() {
      return this.unlockedSolutions.length / this.solutions.length
    }
  }
}
</script>

<style lang="scss">
.solutions {
  height: 100vh;
  pointer-events: all;
  width: 100vw;

  &__inner {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: space-between;
    margin: auto;
    max-width: 1200px;
    width: calc(100% - 160px);
  }

  &__main {
    height: 100%;
    overflow: hidden;

    @media screen and(max-width: 1600px) {
      padding-right: 84px;
    }

    &__grid {
      column-gap: 24px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      // padding-bottom: calc(120px + 48px);
      padding-bottom: 48px;
      padding-right: 16px;
      padding-top: 48px;
      row-gap: 24px;
    }
  }

  &__solution {
    height: 200px;
    width: 240px;

    @media screen and(min-width: 1200px) {
      height: 240px;
      width: 280px;
    }

    &:nth-child(2n) {
      position: relative;
      top: calc(120px + 12px);
    }
  }

  &__aside {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  }

  &__title {
    margin-bottom: 64px;
  }

  &__modal {
    background-color: var(--color-black);
    padding: 24px;
    position: relative;
    width: 315px;

    &__close {
      align-items: center;
      background-color: var(--color-grey);
      cursor: pointer;
      display: flex;
      height: 34px;
      justify-content: center;
      position: absolute;
      right: 17px;
      top: -17px;
      width: 34px;
    }

    &__title {
      color: var(--color-grey-lighten);
      font-family: var(--font-violet);
      font-size: 18px;
      line-height: 22px;
      margin-bottom: 16px;
    }

    &__title,
    &__subtitle,
    &__progress {
      margin-bottom: 16px;
    }

    &__subtitle,
    &__stats {
      color: var(--color-grey-light);
      font-family: var(--font-violet);
      font-size: 14px;
      line-height: 17px;

      span {
        color: var(--color-grey-lighten);
      }
    }

    &__progress {
      border: 2px solid var(--color-green);
      height: 24px;
      position: relative;

      &__fill {
        animation: progress 0.2s linear infinite;
        // prettier-ignore
        background: repeating-linear-gradient(-55deg,
        var(--color-green),
        var(--color-green) 1px,
        var(--color-transparent) 1px,
        var(--color-transparent) 4px);
        background-size: 110%;
        border-right: 1px solid var(--color-green);
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 33%;
      }
    }
  }

  @keyframes progress {
    0% {
      background-position: -4px 0;
    }

    100% {
      background-position: 0 0;
    }
  }
}
</style>
