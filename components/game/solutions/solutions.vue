<template>
  <section class="solutions">
    <header class="solutions__header">
      <h2 class="solutions__title">hard drive</h2>
    </header>
    <p class="solutions__intro">
      The data you obtained can be found in the
      <i>Hard Drive</i>.<br /><br />Check it out and discover efficient ways to
      free yourself from the Smartphone grasp.
    </p>
    <div class="solutions__list">
      <solution
        v-for="(solution, index) in solutions"
        :solution="solution"
        :unlocked="time < solution.required_time"
        :key="index"
      />
    </div>
    <div class="solutions__buttons">
      <btn
        style="--color: var(--color-grey-lighten);
          --bg-color: var(--color-black);
          --border-color: var(--color-grey-lighten);"
      >
        hard drive
      </btn>
      <btn
        style="--color: var(--color-black);
          --bg-color: var(--color-green);
          --border-color: var(--color-green);"
      >
        continue
      </btn>
    </div>
  </section>
</template>

<script>
import Solution from './solution'
import Btn from '@/components/components/btn'

export default {
  components: {
    Solution,
    Btn
  },
  data() {
    return {
      time: 110,
      solutions: [
        { id: 12, title: 'iOS Screen Time', required_time: 180 },
        { id: 26, title: 'Facebook Timer', required_time: 120 },
        { id: 42, title: 'Screen color', required_time: 100 }
      ]
    }
  }
}
</script>

<style lang="scss">
.solutions {
  background-color: var(--color-grey);
  border: 1px solid var(--color-grey-light);
  padding-bottom: 24px;
  width: 480px;

  &__header {
    background-color: var(--color-green);
    display: flex;
    padding: 24px 0;
  }

  &__title {
    color: var(--color-black);
    font-family: var(--font-cindie-c);
    margin: auto;
    text-transform: uppercase;
  }

  &__intro {
    border-bottom: 1px solid var(--color-grey-light);
    border-top: 1px solid var(--color-grey-light);
    color: var(--color-grey-lighten);
    font-family: var(--font-violet);
    line-height: 21px;
    padding: 32px;

    i {
      color: var(--color-green);
    }
  }

  &__list {
    display: flex;
    justify-content: space-between;
    left: -10px;
    padding: 40px 0;
    position: relative;
    width: calc(100% + 20px);
  }

  &__buttons {
    left: -10px;
    position: relative;
    width: calc(100% + 20px);

    > * {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
