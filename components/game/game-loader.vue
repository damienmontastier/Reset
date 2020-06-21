<template>
  <section :class="{ 'gameLoader--loaded': progress >= 1 }" class="gameLoader">
    <ul class="gameLoader__commands">
      <template v-for="(command, i) in commands">
        <li
          v-if="i / commands.length < progress"
          :key="i"
          class="gameLoader__command"
        >
          // <span>{{ command }}</span>
        </li>
      </template>
    </ul>
    <div v-if="progress >= 1">
      <div>
        // Codename <span ref="glitch">{{ word }}</span>
      </div>
      <reset-ascii
        :style="maskProgress < 1 ? mask : {}"
        class="gameLoader__ascii"
      />
    </div>
  </section>
</template>

<script>
import gsap from 'gsap'
function randomWord(length) {
  let result = ''
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-%$#&`
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export default {
  components: {
    ResetAscii: () => import('@/components/elements/reset-ascii')
  },
  data() {
    return {
      word: '',
      maskProgress: 0,
      commands: [
        'Booting System',
        'Loading Case #257468',
        'Fetching Data',
        'Checking Mission status',
        'Status : Awaiting Signature'
      ]
    }
  },
  computed: {
    progress() {
      return this.$store.getters['loading/progress']
    },
    mask() {
      return {
        '-webkit-mask-image': `linear-gradient(180deg,rgb(0, 0, 0) ${Math.round(
          this.maskProgress * 100
        )}%,rgba(255, 255, 255, 0) ${Math.round(this.maskProgress * 100)}%)`,
        '-webkit-mask-position': 'center',
        '-webkit-mask-size': 'cover'
      }
    }
  },
  watch: {
    progress() {
      if (this.progress >= 1) {
        this.animeGlitchText()
      }
    }
  },
  mounted() {
    this.glitchText = this.$refs.glitch
  },
  methods: {
    animeGlitchText() {
      gsap.to(this, {
        delay: 1,
        duration: 2.5,
        ease: 'none',
        maskProgress: 1,
        onComplete: () => {
          this.$store.commit('loading/setVisible', false)
        }
      })
      let t = 0
      this.interval = setInterval(() => {
        if (t > 500 && t <= 1000) {
          this.word = 'R' + randomWord(4)
        } else if (t > 1000 && t <= 1500) {
          this.word = 'RE' + randomWord(3)
        } else if (t > 1500 && t <= 2000) {
          this.word = 'RES' + randomWord(2)
        } else if (t > 2000 && t <= 2500) {
          this.word = 'RESE' + randomWord(1)
        } else if (t > 2500) {
          this.word = 'RESET'
          clearInterval(this.interval)
        } else {
          this.word = randomWord(5)
        }

        t += 100
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.gameLoader {
  background-color: var(--color-grey-lighten);
  // background-color: var(--color-black);
  // color: var(--color-green);
  color: var(--color-black);
  //   height: 100%;
  //   width: 100%;
  font-family: monospace;
  font-size: 16px;
  line-height: 19px;
  padding: 20px;
  // -webkit-text-stroke: 1px #747474;
  // text-shadow: 0 0 5px rgba(100, 100, 100, 0.5);
  // text-shadow: 0 0 1px var(--color-green);

  text-transform: uppercase;

  &__ascii {
    // prettier-ignore
    -webkit-mask-image: linear-gradient(170deg,
    rgb(0, 0, 0) 100%,
    rgba(255, 255, 255, 0) 100%);
    -webkit-mask-position: center;
    -webkit-mask-size: cover;
  }

  &--loaded {
    li {
      &::after {
        display: none;
      }
    }
  }

  li {
    &:last-child {
      &::after {
        animation: pulse 0.3s infinite;
        content: '_';
      }
    }
  }

  &__commands {
    margin-bottom: 78px;
  }

  &__ascii {
    margin-top: 16px;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }
  }
}
</style>
