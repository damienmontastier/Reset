<template>
  <div class="terminalP3">
    <div class="terminalP3__inner">
      <terminal-fieldset type="info" class="terminal__block">
        <div>
          En confirmant vos choix, vous verrez moins de posts. <br />
          Etes-vous CERTAIN de vouloir continuer ?
        </div>
      </terminal-fieldset>

      <terminal-fieldset
        v-for="(p, index) in sliders"
        :key="index"
        type="cross"
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
          <span>Faites glisser les lettres pour valider votre réponse </span>
        </div>
      </terminal-fieldset>

      <div class="terminalP3__submit">
        <ui-button
          @click.native="proceed"
          style="--color: var(--color-black);
          --bg-color: var(--color-green);
          --border-color: var(--color-green);"
        >
          Confirmer
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    UiButton: () => import('@/components/components/ui-button'),
    SliderRange: () => import('@/components/components/slider-range'),
    TerminalFieldset: () =>
      import('@/components/game/terminal/terminal-fieldset')
  },
  data() {
    return {
      displayError: false,
      sliders: [
        { quotient: 1, letter: 'O', finish: false },
        { quotient: 0.6, letter: 'U', finish: false },
        { quotient: 0.3, letter: 'I', finish: false }
      ],
      slidersIsCompleted: false
    }
  },
  computed: {},

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
  created() {},

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

<style lang="scss" scoped></style>
