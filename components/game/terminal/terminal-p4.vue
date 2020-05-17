<template>
  <div class="terminalP4">
    <div class="terminalP4__inner">
      <terminal-fieldset type="info" class="terminal__block">
        <div>
          Vous avez régulé vos flux avec succès !
        </div>
      </terminal-fieldset>

      <terminal-fieldset type="cross" clipped="true" class="terminal__block">
        <div class="block block--left"></div>
        <div class="block block--right"></div>
      </terminal-fieldset>

      <div class="terminalP4__submit">
        <btn :inverted="true">Commencer</btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    TerminalFieldset: () =>
      import('@/components/game/terminal/terminal-fieldset'),
    Btn: () => import('@/components/components/btn')
  },
  data() {
    return {}
  },
  created() {},
  computed: {},

  methods: {}
}
</script>

<style lang="scss">
.terminalFieldset {
  &--cross {
    .terminalFieldset__inner {
      display: flex;
      height: 150px;
      padding: 0;

      .block {
        height: 100%;
        padding: 16px 24px;

        &--left {
          background: var(--color-black);
          border-right: 8px solid var(--color-grey);
          width: calc(35% + 8px);

          &::after {
            background-image: url('/img/icons/cross-horizontal.svg');
            background-repeat: no-repeat;
            background-size: 100%;
            content: '';
            height: 10px;
            left: -10px;
            position: absolute;
            width: calc(100% + 20px);
          }
        }

        &--right {
          background: var(--color-black);
          width: calc(65% - 8px);
        }
      }
    }
  }
}
</style>
