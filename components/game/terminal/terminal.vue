<template>
  <div class="gameTerminal">
    <div class="gameTerminal__inner">
      <div class="gameTerminal__title">
        <terminal-title />
      </div>
      <terminal-p1 />
    </div>
  </div>
</template>

<script>
import TerminalTitle from '@/components/game/terminal/terminal-title'
import TerminalP1 from '@/components/game/terminal/terminal-p1'

export default {
  components: {
    TerminalTitle,
    TerminalP1
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
    padding: 16px 24px;
    position: relative;
  }
}
</style>
