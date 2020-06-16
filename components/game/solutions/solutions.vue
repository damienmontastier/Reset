<template>
  <section class="solutions">
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
          <div class="solutions__modal__progress__fill"></div>
        </div>
        <p class="solutions__modal__stats">
          You unlocked <span>02/09</span> data.
        </p>
      </div>
    </aside>
    <div class="solutions__main">
      <solution
        v-for="(solution, i) in solutions"
        :key="i"
        :solution="solution"
        :unlocked="190 < solution.required_score"
        class="solutions__solution"
      />
    </div>
  </section>
</template>

<script>
import Solution from './solution'
export default {
  components: {
    Solution,
    HardDriveSvg: () => import('@/components/svg/hard-drive'),
    CrossSvg: () => import('@/components/svg/cross')
  },
  computed: {
    solutions() {
      return this.$store.state.solutions.list
    }
  }
}
</script>

<style lang="scss">
.solutions {
  display: flex;
  height: 100vh;
  pointer-events: all;
  width: 100vw;

  &__solution {
    height: 240px;
    margin-bottom: 24px;
    width: 280px;
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
        // prettier-ignore
        background: repeating-linear-gradient(-55deg,
        var(--color-green),
        var(--color-green) 1px,
        var(--color-transparent) 1px,
        var(--color-transparent) 4px);
        border-right: 1px solid var(--color-green);
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 33%;
      }
    }
  }
}
</style>
