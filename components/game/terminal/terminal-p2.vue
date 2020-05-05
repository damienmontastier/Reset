<template>
  <div class="terminalP2">
    <div class="terminalP2__inner">
      <terminal-fieldset type="info" class="terminal__block">
        <div>
          Sélectionez 3 centres d'intéret
        </div>
      </terminal-fieldset>

      <terminal-fieldset
        :error="{ displayError, errorMessage }"
        type="cross"
        class="terminal__block"
      >
        <div class="input" v-for="(c, index) in pointsOfInterest" :key="index">
          <input
            v-model="pointsOfInterestSelected"
            type="checkbox"
            :id="stringToSlug(c)"
            :name="stringToSlug(c)"
            :ref="stringToSlug(c)"
            :value="c"
            @change="checkboxHandler"
          />
          <label :for="stringToSlug(c)">{{ c }}</label>
        </div>
      </terminal-fieldset>

      <div class="terminalP2__submit">
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
    TerminalFieldset: () =>
      import('@/components/game/terminal/terminal-fieldset')
  },
  data() {
    return {
      checkbox: true,
      displayError: false,
      errorMessage: 'Vous devez sélectionner 3 centres d’intérêts différents',
      pointsOfInterest: [
        'Poneys',
        'Chats',
        'Dogs',
        'BFM TV',
        'Manu',
        'Reine Fatima',
        'Jul',
        'Cordula',
        'Tout selectionner',
        'Tout déselectionner'
      ],
      pointsOfInterestSelected: []
    }
  },
  created() {
    this.pointsOfInterestSelected = this.pointsOfInterest
  },
  computed: {
    elements() {
      return this.pointsOfInterestSelected.filter(
        (point) =>
          point !== 'Tout selectionner' && point !== 'Tout déselectionner'
      )
    }
  },
  watch: {
    pointsOfInterestSelected(value) {
      if (!Object.keys(this.$refs).length) return

      if (
        this.pointsOfInterestSelected !== this.pointsOfInterest &&
        this.$refs['tout-selectionner'][0].checked
      ) {
        this.$refs['tout-selectionner'][0].checked = false
      } else if (this.pointsOfInterestSelected.length === 1) {
        this.$refs['tout-deselectionner'][0].checked = true
      }
    }
  },
  methods: {
    ...mapMutations({
      setTerminalOpened: 'setTerminalOpened'
    }),

    closeTerminal() {
      this.setTerminalOpened(false)
    },

    nextPage() {
      if (this.elements.length === 3) {
        this.displayError = false
      } else {
        this.displayError = true
      }
    },

    checkboxHandler(e) {
      if (e.target.name === 'tout-selectionner' && e.target.checked) {
        this.pointsOfInterestSelected = this.pointsOfInterest
      } else if (e.target.name === 'tout-deselectionner' && !e.target.checked) {
        this.pointsOfInterestSelected = []
      } else if (this.elements.length === 3) {
        this.displayError = false
      }
    },

    stringToSlug(str) {
      str = str.replace(/^\s+|\s+$/g, '') // trim
      str = str.toLowerCase()

      const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
      const to = 'aaaaeeeeiiiioooouuuunc------'
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      }

      str = str
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

      return str
    }
  }
}
</script>

<style lang="scss">
.terminalP2 {
  .terminalFieldset {
    &.terminalFieldset--cross {
      .terminalFieldset__inner {
        display: flex;
        flex-flow: wrap;
        padding: 25px 24px;

        .input {
          align-items: center;
          display: flex;
          flex: 0 0 33%;
          margin-bottom: 10px;
        }
      }
    }
  }

  &__submit {
    font-size: 8px;
    line-height: 10px;

    > * {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
