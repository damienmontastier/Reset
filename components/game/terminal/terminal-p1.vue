<template>
  <div class="terminalP1">
    <div class="terminalP1__inner">
      <terminal-fieldset type="info" class="terminal__block">
        <div>
          Ce terminal vous permet de réguler les flux de vos différents réseaux
          sociaux. Faites le tri, et ne gardez que l’essentiel…
        </div>
      </terminal-fieldset>

      <terminal-fieldset type="cross" class="terminal__block">
        <div class="input">
          <input
            id="notAccept"
            v-model="inputChecked"
            @change="checkHandler"
            type="checkbox"
            name="notAccept"
          />
          <label for="notAccept">
            Je n’accepte pas les
            <a class="terminal__a"> Conditions Générales </a>
            d’utilisation</label
          >
        </div>

        <div slot="error" v-if="displayError" class="terminalFieldset__error">
          <span
            >N’oubliez PAS d’accepter nos conditions générales
            d’utilisation</span
          >
        </div>
      </terminal-fieldset>

      <div class="terminal__submit">
        <ui-button
          @click.native="restartLevel"
          style="--color: var(--color-black);
          --bg-color: var(--color-green);
          --border-color: var(--color-green);"
          >recommencer</ui-button
        >
        <ui-button
          @click.native="closeTerminal"
          style="--color: var(--color-green);
          --bg-color: var(--color-black);
          --border-color: var(--color-green);"
          >fermer</ui-button
        >
        <div class="terminal__submit__continue">
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
export default {
  components: {
    UiButton: () => import('@/components/components/ui-button'),
    TerminalFieldset: () =>
      import('@/components/game/terminal/terminal-fieldset')
  },
  data() {
    return {
      inputChecked: true,
      displayError: false
    }
  },
  methods: {
    closeTerminal() {
      this.$parent.closeTerminal()
    },

    restartLevel() {
      this.$events.emit('level:restart', 'start')
      this.closeTerminal()
    },

    checkHandler(e) {
      if (!e.target.checked) this.displayError = false
    },

    nextPart() {
      if (this.inputChecked) {
        this.displayError = true
      } else {
        this.displayError = false
        console.log('ok next page terminal')
        this.$emit('increment')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
