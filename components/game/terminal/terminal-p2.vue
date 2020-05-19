<template>
  <div class="terminalP2">
    <div class="terminalP2__inner">
      <terminal-fieldset type="info" class="terminal__block">
        <div>
          Sélectionez 3 centres d'intéret
        </div>
      </terminal-fieldset>

      <terminal-fieldset type="cross" class="terminal__block">
        <div class="input" v-for="(p, index) in pointsOfInterest" :key="index">
          <input
            v-model="pointsOfInterestSelected"
            type="checkbox"
            :id="stringToSlug(p)"
            :name="stringToSlug(p)"
            :ref="stringToSlug(p)"
            :value="p"
            @change="checkboxHandler"
          />
          <label :for="stringToSlug(p)">{{ p }}</label>
        </div>

        <div class="terminalFieldset__error" v-if="displayError" slot="error">
          <span>Vous devez sélectionner 3 centres d’intérêts différents </span>
        </div>
      </terminal-fieldset>

      <div class="terminal__submit">
        <btn @click.native="closeTerminal" :inverted="true">Annuler</btn>
        <btn @click.native="nextPage">Continuer</btn>
      </div>
    </div>
  </div>
</template>

<script>
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
  computed: {
    elements() {
      return this.pointsOfInterestSelected.filter(
        (point) =>
          point !== 'Tout selectionner' && point !== 'Tout déselectionner'
      )
    }
  },
  watch: {
    // pointsOfInterestSelected(value) {
    //   // if (!Object.keys(this.$refs).length) return
    //   // if (
    //   //   this.pointsOfInterestSelected !== this.pointsOfInterest &&
    //   //   this.$refs['tout-selectionner'][0].checked
    //   // ) {
    //   //   this.$refs['tout-selectionner'][0].checked = false
    //   // } else if (this.pointsOfInterestSelected.length === 1) {
    //   //   this.$refs['tout-deselectionner'][0].checked = true
    //   // }
    // }
  },
  created() {
    this.pointsOfInterestSelected = this.pointsOfInterest
  },
  methods: {
    closeTerminal() {
      this.$parent.closeTerminal()
    },

    nextPage() {
      if (this.elements.length === 3) {
        this.displayError = false
        this.$emit('increment')
      } else {
        this.displayError = true
      }
    },

    checkboxHandler(e) {
      if (e.target.name === 'tout-selectionner' && e.target.checked) {
        e.target.checked = true
        this.pointsOfInterestSelected = this.pointsOfInterest
      } else if (e.target.name === 'tout-deselectionner') {
        this.pointsOfInterestSelected = []
        e.target.checked = false
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
  .terminalFieldset.terminalFieldset--cross {
    .terminalFieldset__inner {
      display: flex;
      flex-flow: wrap;
      padding: 35px 24px;

      .input {
        align-items: center;
        display: flex;
        flex: 0 0 33%;
        margin-bottom: 10px;

        &:nth-last-child(-n + 3) {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
