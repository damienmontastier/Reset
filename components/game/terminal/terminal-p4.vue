<template>
  <div class="terminalP4">
    <div class="terminalP4__inner">
      <terminal-fieldset type="info" class="terminal__block">
        <div>
          Vous avez régulé vos flux avec succès !
        </div>
      </terminal-fieldset>

      <terminal-fieldset type="cross" :clipped="true" class="terminal__block">
        <div class="block block--left">
          <checkBig></checkBig>
        </div>
        <div class="block block--right">
          <span
            >Illustration/Motion schématique qui montre qu’ily a moins de posts
          </span>
        </div>
      </terminal-fieldset>

      <div class="terminalP4__submit">
        <btn @click.native="start" :inverted="true">Commencer</btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    TerminalFieldset: () =>
      import('@/components/game/terminal/terminal-fieldset'),
    Btn: () => import('@/components/components/btn'),
    checkBig: () => import('@/components/svg/checkBig')
  },

  methods: {
    start() {
      this.$emit('increment')
    }
  }
}
</script>

<style lang="scss" scoped>
.terminalFieldset {
  &--cross {
    .terminalFieldset__inner {
      display: flex;
      height: 150px;
      padding: 0;

      .block {
        height: 100%;
        padding: 16px 24px;

        &--left,
        &--right {
          align-items: center;
          display: flex;
          justify-content: center;
        }

        &--left {
          background: var(--color-black);
          border-right: 8px solid var(--color-grey);
          height: 100%;
          width: calc(35% + 8px);

          &::after {
            background-image: url('/img/icons/cross-vertical.svg');
            background-repeat: no-repeat;
            background-size: 100%;
            content: '';
            height: calc(100% + 20px);
            position: absolute;
            right: -10px;
            top: -10px;
            width: 10px;
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
