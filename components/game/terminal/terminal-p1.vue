<template>
  <div class="terminalP1">
    <div class="terminalP1__inner">
      <terminal-fieldset type="info" class="terminal__block">
        <div>
          Ce terminal vous permet de réguler les flux de vos différents réseaux
          sociaux. Faites le tri, et ne gardez que l’essentiel…
        </div>
      </terminal-fieldset>

      <terminal-fieldset
        type="cross"
        class="terminal__block"
        :error="{ displayError, errorMessage }"
      >
        <div>
          <input
            v-model="notAcceptConditions"
            @change="checkHandler"
            type="checkbox"
          />
          Je n’accepte pas les
          <a class="terminal__a">Conditions Générales</a>
          d’utilisation
        </div>
      </terminal-fieldset>

      <div class="terminalP1__submit">
        <btn @click.native="restartLevel" :inverted="true">recommencer</btn>
        <btn @click.native="closeTerminal">fermer</btn>
        <div class="terminalP1__submit__continue">
          Pour
          <a class="terminal__a">Continuer</a>, CLIQUEZ
          <a @click="nextPart" class="terminal__a not-underline" href="#">ici</a
          >.
        </div>
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
      notAcceptConditions: true,
      displayError: false,
      errorMessage:
        'N’oubliez PAS d’accepter nos conditions générales d’utilisation'
    }
  },
  methods: {
    ...mapMutations({
      setTerminalOpened: 'setTerminalOpened'
    }),

    closeTerminal() {
      this.setTerminalOpened(false)
    },

    restartLevel() {
      console.log('restart level')
    },

    checkHandler(e) {
      if (!e.target.checked) this.displayError = false
    },

    nextPart() {
      if (this.notAcceptConditions) {
        this.displayError = true
      } else {
        this.displayError = false
        console.log('ok next page terminal')
      }
    }
  }
}
</script>

<style lang="scss">
.terminalP1 {
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
