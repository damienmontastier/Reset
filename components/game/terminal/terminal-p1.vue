<template>
  <div class="terminalP1">
    <div class="terminalP1__inner">
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
          Ce terminal vous permet de réguler les flux de vos différents réseaux
          sociaux. Faites le tri, et ne gardez que l’essentiel…
        </div>
      </terminal-fieldset>

      <terminal-fieldset
        :type="'cross'"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.2s` }"
        class="terminal__block"
      >
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
          :class="{
            transition__fadeIn: true,
            'transition--on': mounted
          }"
          :style="{ 'transition-delay': `0.3s` }"
          style="--color: var(--color-black);
          --bg-color: var(--color-green);
          --border-color: var(--color-green);"
        >
          recommencer
        </ui-button>
        <ui-button
          @click.native="closeTerminal"
          :class="{
            transition__fadeIn: true,
            'transition--on': mounted
          }"
          :style="{ 'transition-delay': `0.4s` }"
          style="--color: var(--color-green);
          --bg-color: var(--color-black);
          --border-color: var(--color-green);"
        >
          fermer
        </ui-button>
        <div
          :class="{
            transition__fadeIn: true,
            'transition--on': mounted
          }"
          :style="{ 'transition-delay': `0.5s` }"
          class="terminal__submit__continue"
        >
          Pour
          <a class="terminal__a">Continuer</a>, CLIQUEZ
          <a @click="nextPart" class="terminal__a not-underline">ici</a>.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/components/ui-button'
import TerminalFieldset from '@/components/game/terminal/terminal-fieldset'

export default {
  components: {
    UiButton,
    TerminalFieldset
  },
  data() {
    return {
      inputChecked: true,
      displayError: false,
      mounted: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true
    }, 0)
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

<style lang="scss"></style>
