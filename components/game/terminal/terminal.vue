<template>
  <div class="gameTerminal">
    <div class="gameTerminal__inner">
      <div class="gameTerminal__title">
        <terminal-title />
      </div>
      <!-- eslint-disable-next-line vue/require-component-is -->
      <component @increment="index++" v-bind:is="terminal" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

/* eslint-disable vue/no-unused-components */

import TerminalP1 from '@/components/game/terminal/terminal-p1'
import TerminalP2 from '@/components/game/terminal/terminal-p2'
import TerminalP3 from '@/components/game/terminal/terminal-p3'
import TerminalP4 from '@/components/game/terminal/terminal-p4'

export default {
  components: {
    TerminalTitle: () => import('@/components/game/terminal/terminal-title'),
    TerminalP1,
    TerminalP2,
    TerminalP3,
    TerminalP4
  },
  data() {
    return {
      terminals: [TerminalP1, TerminalP2, TerminalP3, TerminalP4],
      index: 0
    }
  },
  methods: {
    ...mapMutations({
      setTerminalOpened: 'setTerminalOpened'
    }),
    terminalCompleted() {
      console.log('finish, close terminal')
      this.closeTerminal()
    },
    closeTerminal() {
      this.setTerminalOpened(false)
    }
  },
  watch: {
    index(value, oldValue) {
      if (value % this.terminals.length === 0) {
        this.terminalCompleted()
      }
    }
  },

  computed: {
    terminal() {
      return this.terminals[this.index]
    }
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

  .terminal__submit {
    font-size: 8px;
    line-height: 10px;

    > * {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
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
