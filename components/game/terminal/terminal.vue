<template>
  <div class="gameTerminal">
    <div class="gameTerminal__inner">
      <div class="gameTerminal__title">
        <terminal-title />
      </div>
      <!-- eslint-disable-next-line vue/require-component-is -->
      <component @increment="index++" v-bind:is="terminal" />
    </div>
    <div class="gameTerminal__paginations">
      <div
        v-for="(item, i) in terminals.length"
        :key="i"
        :class="{ 'is-active': i == index }"
        class="pagination"
      >
        <span v-html="i + 1"></span>
      </div>
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

  computed: {
    terminal() {
      return this.terminals[this.index]
    }
  },

  watch: {
    index(value, oldValue) {
      if (value % this.terminals.length === 0) {
        this.terminalCompleted()
      }
    }
  },

  methods: {
    ...mapMutations({
      setTerminalOpened: 'setTerminalOpened'
    }),
    terminalCompleted() {
      this.closeTerminal()
      console.log('finish, close terminal, apply modification')
    },
    closeTerminal() {
      this.setTerminalOpened(false)
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
  position: relative;
  width: 595px;

  &__inner {
    padding: 75px;
  }

  &__title {
    margin-bottom: 48px;
  }

  &__paginations {
    bottom: 0;
    position: absolute;
    right: -40px;

    .pagination {
      align-items: center;
      background-color: var(--color-black);
      display: flex;
      height: 40px;
      justify-content: center;
      margin-bottom: 5px;
      position: relative;
      width: 40px;

      span {
        color: var(--color-grey);
        display: inline-block;
        font-family: var(--font-cindie-f);
        font-size: 8px;
        transform: rotate(90deg);
      }

      &.is-active {
        background-color: var(--color-grey);

        &::after {
          background-color: var(--color-green);
          content: '';
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 2px;
        }

        span {
          color: var(--color-green);
        }
      }
    }
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
