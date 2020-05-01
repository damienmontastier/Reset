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
        <div>
          <input type="checkbox" /> Je n’accepte pas les
          <a class="terminal__a">Conditions Générales</a>
          d’utilisation
        </div>
      </terminal-fieldset>

      <div class="terminalP1__submit">
        <btn :inverted="true">
          recommencer
        </btn>
        <btn>
          fermer
        </btn>
        <div class="terminalP1__submit__continue">
          Pour <a class="terminal__a">Continuer</a>, CLIQUEZ ici.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TerminalFieldset from '@/components/game/terminal/terminal-fieldset'
import Btn from '@/components/components/btn'
export default {
  components: {
    Btn,
    TerminalFieldset
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
