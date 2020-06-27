<template>
  <div class="header">
    <div class="header__left">
      <svgNetwork />
      <svgLogo />
      <svgBattery />
      <svgWifi />
    </div>
    <div class="header__middle">
      <span v-if="score">{{ sec2time(score.value) }}</span>
    </div>
    <div class="header__right">
      <div :class="{ active: appearReduceTime }" class="right__penalty">
        <div class="penalty__inner">
          +
          <span class="minutes">{{ additionalTime }}</span> min
        </div>
      </div>
      <div class="right__time">
        <span>{{ virtualTime.h }} : {{ virtualTime.m }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// TODO METTRE UN ONLOAD ?

import useClock from '@/hooks/use-clock'
import score from '@/hooks/use-score'

export default {
  components: {
    svgNetwork: () => import('@/components/svg/network'),
    svgLogo: () => import('@/components/svg/logo'),
    svgBattery: () => import('@/components/svg/battery'),
    svgWifi: () => import('@/components/svg/wifi')
  },

  data() {
    return {
      clock: undefined,
      time: 0,
      virtualTime: 0,
      // timeLeft: 0,
      additionalTime: 0,
      appearReduceTime: false,
      score: undefined
    }
  },
  watch: {
    'clock.time'(val) {
      this.time = val
    },
    'clock.virtualTime'(val) {
      this.virtualTime = val
    },
    'clock.additionalTime'(val, old) {
      if (old === undefined) return

      this.appearReduceTime = true

      this.additionalTime = val - old

      setTimeout(() => {
        this.appearReduceTime = false
      }, 2000)
    }
  },
  mounted() {
    this.clock = useClock()
    this.score = score

    // this.clock.startCountdown(300)

    this.appearReduceTime = false
  },
  methods: {
    sec2time(timeInSeconds) {
      const pad = function(num, size) {
        return ('000' + num).slice(size * -1)
      }

      const time = parseFloat(Math.max(0, timeInSeconds)).toFixed(3)
      const minutes = Math.floor(time / 60) % 60
      const seconds = Math.floor(time - minutes * 60)
      const milliseconds = time.slice(-3)

      return (
        pad(minutes, 2) + ':' + pad(seconds, 2) + ':' + pad(milliseconds, 3)
      )
    }
  }
}
</script>

<style lang="scss">
.header {
  align-items: center;
  background-color: var(--color-black);
  border: 1px solid var(--color-grey-light);
  display: flex;
  height: 44px;
  justify-content: space-between;

  &__left,
  &__middle,
  &__right {
    align-items: center;
    color: #fff;
    display: flex;
    height: 100%;
  }

  &__left {
    border-right: 1px solid var(--color-grey-light);
    justify-content: space-between;
    padding: 0 30px;
    width: 265px;
  }

  &__middle {
    border-left: 1px solid var(--color-grey-light);
    border-right: 1px solid var(--color-grey-light);
    justify-content: center;
    width: 220px;

    span {
      color: var(--color-green);
      font-family: var(--font-cindie-e);
      font-size: 11px;
    }
  }

  &__right {
    border-left: 1px solid var(--color-grey-light);

    .right__penalty,
    .right__time {
      align-items: center;
      display: flex;
      height: 100%;
      padding: 0 30px;
    }

    .right__penalty {
      border-right: 1px solid var(--color-grey-light);

      color: transparent;
      color: var(--color-black);
      font-family: var(--font-cindie-b);
      font-size: 8px;
      min-width: 150px;

      &.active {
        background-color: var(--color-green);
      }

      .penalty__inner {
        text-align: center;
        width: 100%;

        span {
          font-family: var(--font-cindie-e);
          font-size: 11px;
        }
      }
    }

    .right__time {
      color: var(--color-green);
      font-family: var(--font-cindie-c);
      font-size: 9px;
    }
  }
}
</style>
