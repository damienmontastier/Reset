<template>
  <div class="terminalP3">
    <div class="terminalP3__inner">
      <terminal-fieldset
        :type="'info'"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.1s` }"
        class="terminal__block"
      >
        <div>
          By confirming your choices, you will see fewer posts. <br />
          Are you SURE you want to continue ?
        </div>
      </terminal-fieldset>

      <terminal-fieldset
        v-for="(p, index) in sliders"
        :key="index"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `${0.2 + index * 0.1}s` }"
        :type="'cross'"
        class="terminal__block"
      >
        <slider-range
          @finish="sliderIsCompleted"
          :quotient="p.quotient"
          :letter="p.letter"
          :index="index"
        ></slider-range>
        <div
          slot="error"
          v-if="
            !slidersIsCompleted && displayError && index === sliders.length - 1
          "
          class="terminalFieldset__error"
        >
          <!-- <span>Faites glisser les lettres pour valider votre réponse </span> -->
          <span>Slide the letters to validate your answer </span>
        </div>
      </terminal-fieldset>

      <div class="terminalP3__submit">
        <ui-button
          @click.native="proceed"
          :class="{
            transition__fadeIn: true,
            'transition--on': mounted
          }"
          :style="{ 'transition-delay': '0.5s' }"
          style="--color: var(--color-black);
          --bg-color: var(--color-green);
          --border-color: var(--color-green);"
        >
          Confirm
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/components/ui-button'
import SliderRange from '@/components/components/slider-range'
import TerminalFieldset from '@/components/game/terminal/terminal-fieldset'

export default {
  components: {
    UiButton,
    SliderRange,
    TerminalFieldset
  },
  data() {
    return {
      displayError: false,
      sliders: [
        { quotient: 1, letter: 'Y', finish: false },
        { quotient: 0.6, letter: 'E', finish: false },
        { quotient: 0.3, letter: 'S', finish: false }
      ],
      slidersIsCompleted: false,
      mounted: false
    }
  },

  watch: {
    sliders: {
      deep: true,
      handler(val) {
        const a = val.every((v) => {
          return v.finish
        })
        if (a) this.slidersIsCompleted = true
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true
    }, 0)
  },

  methods: {
    sliderIsCompleted(index) {
      this.sliders[index].finish = true
    },

    proceed() {
      if (!this.slidersIsCompleted) this.displayError = true
      else {
        this.$emit('increment')
      }
    }
  }
}
</script>
