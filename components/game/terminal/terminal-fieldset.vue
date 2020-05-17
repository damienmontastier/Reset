<template>
  <fieldset
    :class="{
      'terminalFieldset--info': type === 'info',
      'terminalFieldset--cross': type === 'cross'
    }"
    class="terminalFieldset"
  >
    <div
      class="terminalFieldset__inner"
      :class="{
        clipped: clipped
      }"
    >
      <slot />
    </div>

    <slot name="error"> </slot>
  </fieldset>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: undefined
    },
    clipped: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.terminalFieldset {
  position: relative;

  &__inner {
    padding: 16px 24px;

    &.clipped {
      display: flex;
      height: 150px;
      padding: 0;
    }

    input {
      display: none;
    }

    input[type='checkbox']:checked + label::before {
      background-color: var(--color-green);
      background-image: url('/img/icons/check.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: auto;
    }

    label {
      align-items: center;
      display: flex;
      font-size: 10px;

      &::before {
        background: var(--color-grey-lighten);
        border-radius: 2px;
        content: '';
        display: inline-block;
        height: 12px;
        margin-right: 10px;
        width: 12px;
      }
    }
  }

  &__error {
    border: 1px solid;
    color: var(--color-green);
    font-size: 8px;
    padding: 8px 24px;
  }

  &--cross {
    &::after,
    &::before {
      background-image: url('/img/icons/cross-horizontal.svg');
      background-repeat: no-repeat;
      background-size: 100%;
      content: '';
      height: 10px;
      left: -10px;
      position: absolute;
      width: calc(100% + 20px);
    }

    &::after {
      bottom: -10px;
    }

    &::before {
      top: -10px;
    }
  }

  &--info {
    &::after {
      background-image: url('/img/icons/dashed.svg');
      bottom: -3px;
      content: '';
      height: 3px;
      left: 0;
      position: absolute;
      width: 100%;
    }

    &::before {
      background-image: url('/img/icons/i.svg');
      background-size: contain;
      content: '';
      height: 16px;
      left: -8px;
      position: absolute;
      top: calc(50% - 8px);
      width: 16px;

      z-index: 2;
    }
  }
}
</style>
