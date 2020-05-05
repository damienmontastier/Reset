<template>
  <div class="gameTerminal">
    <div class="gameTerminal__inner">
      <div class="gameTerminal__title">
        <terminal-title />
      </div>
      <terminal-p2 />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    TerminalTitle: () => import('@/components/game/terminal/terminal-title'),
    // TerminalP1: () => import('@/components/game/terminal/terminal-p1')
    TerminalP2: () => import('@/components/game/terminal/terminal-p2')
  }
}
</script>

<style lang="scss">
.gameTerminal {
  background-color: var(--color-grey);
  color: var(--color-white);
  font-family: var(--font-violet);
  height: 100vh;
  margin-left: 64px;
  width: 595px;

  &__inner {
    padding: 64px;
  }

  &__title {
    margin-bottom: 48px;
  }

  .terminal__a {
    cursor: pointer;
    text-decoration: underline;

    &.not-underline {
      text-decoration: none;
    }

    @media (hover: hover) {
      &:hover {
        text-decoration: none;
      }
    }
  }

  .terminal__block {
    background-color: var(--color-black);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 48px;
    position: relative;
  }
}
</style>
