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
        :error="{ displayError, errorMessage }"
        v-for="(p, index) in sliderRangeParams"
        :key="index"
        type="cross"
        class="terminal__block"
      >
        <slider-range :quotient="p.quotient" :letter="p.letter"></slider-range>
      </terminal-fieldset>

      <div class="terminalP3__submit">
        <btn @click.native="closeTerminal" :inverted="true">Annuler</btn>
        <btn @click.native="nextPage">Continuer</btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  components: {
    Btn: () => import('@/components/components/btn'),
    SliderRange: () => import('@/components/components/slider-range'),
    TerminalFieldset: () =>
      import('@/components/game/terminal/terminal-fieldset')
  },
  data() {
    return {
      displayError: false,
      errorMessage: 'Coucou',
      sliderRangeParams: [
        { quotient: 1, letter: 'O' },
        { quotient: 0.6, letter: 'U' },
        { quotient: 0.3, letter: 'I' }
      ]
    }
  },
  created() {},
  computed: {},
  watch: {},
  methods: {
    ...mapMutations({
      setTerminalOpened: 'setTerminalOpened'
    })
  }
}
</script>

<style lang="scss">
.terminalP3 {
  display: block;
}
</style>
