<template>
  <section class="solutions">
    <div class="solutions__inner">
      <aside class="solutions__aside">
        <h2 v-kinesis="{ depth: 2 }" class="solutions__title">
          <hard-drive-svg />
        </h2>
        <div v-kinesis="{ depth: 4 }" class="solutions__modal">
          <div
            :class="{
              transition__fadeIn: true,
              'transition--on': mounted
            }"
            v-kinesis="{ depth: 2 }"
            class="solutions__modal__background"
          />
          <div
            :class="{
              transition__fadeIn: true,
              'transition--on': mounted
            }"
            :style="{ 'transition-delay': `0.1s` }"
            v-kinesis="{ depth: 4 }"
            class="solutions__modal__close"
          >
            <cross-svg />
          </div>
          <h3
            :class="{
              transition__fadeIn: true,
              'transition--on': mounted
            }"
            :style="{ 'transition-delay': `0.2s` }"
            class="solutions__modal__title"
          >
            The Hard Drive compiles all the precious data you collected.
          </h3>
          <p
            :class="{
              transition__fadeIn: true,
              'transition--on': mounted
            }"
            :style="{ 'transition-delay': `0.3s` }"
            class="solutions__modal__subtitle"
          >
            Discover efficient ways to free yourself from the Smartphone grasp.
          </p>
          <div
            :class="{
              transition__fadeIn: true,
              'transition--on': mounted
            }"
            :style="{ 'transition-delay': `0.4s` }"
            class="solutions__modal__progress"
          >
            <div
              :style="{
                width: `${mounted ? progress * 100 : 0}%`,
                'transition-delay': `0.4s`
              }"
              class="solutions__modal__progress__fill"
            />
          </div>
          <p
            :class="{
              transition__fadeIn: true,
              'transition--on': mounted
            }"
            :style="{ 'transition-delay': `0.5s` }"
            class="solutions__modal__stats"
          >
            You unlocked
            <span>
              {{ stats }}
            </span>
            data.
          </p>
        </div>
      </aside>
      <div class="solutions__main">
        <div v-kinesis="{ depth: 2 }" class="solutions__list">
          <scroller
            :scrollable="!modalOpened"
            :draggable="!modalOpened"
            class="solutions__main__scroller"
          >
            <div class="solutions__main__grid">
              <div
                v-for="(solution, i) in orderedSolutions"
                :key="i"
                :class="{
                  transition__fadeIn: true,
                  'transition--on': mounted
                }"
                :style="{ 'transition-delay': `${i * 0.1}s` }"
              >
                <solution
                  @click.native="selectSolution(solution)"
                  :solution="solution"
                  :unlocked="solution.unlocked"
                  :class="{
                    'solutions__solution--unlocked': solution.unlocked
                  }"
                  class="solutions__solution"
                />
              </div>
            </div>
          </scroller>
        </div>
        <div v-if="modalOpened" class="solutions__opened">
          <modal
            v-kinesis="{ depth: 8 }"
            :solution="selectedSolution"
            @close="
              modalOpened = false
              selectedSolution = false
            "
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Solution from './solution'
import Modal from './modal'
import CrossSvg from '@/components/svg/cross'

export default {
  components: {
    Modal,
    Solution,
    HardDriveSvg: () => import('@/components/svg/hard-drive'),
    CrossSvg,
    Scroller: () => import('@/components/components/scroller')
  },
  data() {
    return {
      modalOpened: false,
      selectedSolution: undefined,
      mounted: false
    }
  },
  computed: {
    stages() {
      return this.$store.state.stages.list
    },
    solutions() {
      return Object.values(this.$store.state.solutions.list)

      // return this.$store.getters['solutions/getSolutions']
    },
    orderedSolutions() {
      return this.solutions
        .map((solution) => {
          // solution.unlocked = solution.required_score > solution.stage.score
          solution.stage = this.stages[solution.stage_id]
          solution.unlocked = solution.required_score > solution.stage.score
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
  },
  methods: {
    selectSolution(solution) {
      if (solution.unlocked && !this.selectedSolution) {
        this.selectedSolution = solution
        this.modalOpened = true

        this.$store.commit('solutions/setSolutionOpened', {
          solution,
          opened: true
        })
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true
    }, 0)
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

  &__list {
    height: 100%;
  }

  &__main {
    height: 100%;
    overflow: hidden;
    position: relative;

    &__grid {
      column-gap: 24px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      // padding-bottom: calc(120px + 48px);
      padding-bottom: 48px;
      padding-left: 32px;
      padding-right: 32px;
      padding-top: 48px;
      row-gap: 24px;

      > * {
        &:nth-child(2n) {
          position: relative;
          top: calc(120px + 12px);
        }
      }
    }

    @media screen and(max-width: 1600px) {
      margin-right: 84px;
    }
  }

  &__solution {
    cursor: not-allowed;
    height: 200px;
    width: 240px;

    &--unlocked {
      cursor: pointer;
    }

    @media screen and(min-width: 1200px) {
      height: 240px;
      width: 280px;
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
    padding: 24px;
    position: relative;
    width: 315px;

    &__background {
      background-color: var(--color-black);
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: -1;
    }

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
        transition: width 1s _ease('quint', 'out');
      }
    }
  }

  &__opened {
    height: 80vh;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 32px);
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
