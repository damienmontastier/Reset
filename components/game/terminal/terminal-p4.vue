<template>
  <div class="terminalP4">
    <div class="terminalP4__inner">
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
          You have successfully regulated your feeds !
        </div>
      </terminal-fieldset>

      <terminal-fieldset
        :clipped="true"
        :type="'cross'"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.2s` }"
        class="terminal__block"
      >
        <div class="block block--left">
          <checkBig></checkBig>
        </div>
        <!-- <div class="block block--right">
          <span
            >Illustration/Motion schématique qui montre qu’ily a moins de posts
          </span>
        </div> -->
      </terminal-fieldset>

      <div class="terminalP4__submit">
        <ui-button
          @click.native="triggerCompleted"
          :class="{
            transition__fadeIn: true,
            'transition--on': mounted
          }"
          :style="{ 'transition-delay': `0.3s` }"
          style="--color: var(--color-black);
          --bg-color: var(--color-green);
          --border-color: var(--color-green);"
        >
          close
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
import TerminalFieldset from '@/components/game/terminal/terminal-fieldset'
import UiButton from '@/components/components/ui-button'
import CheckBig from '@/components/svg/checkBig'

export default {
  components: {
    TerminalFieldset,
    UiButton,
    CheckBig
  },
  data() {
    return {
      mounted: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true
    }, 0)
  },
  methods: {
    triggerCompleted() {
      this.$emit('increment')
    }
  }
}
</script>

<style lang="scss">
.terminalP4 {
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
            // width: calc(35% + 8px);
            width: 100%;

            svg {
              height: 64px;
              width: 64px;
            }

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
}
</style>
