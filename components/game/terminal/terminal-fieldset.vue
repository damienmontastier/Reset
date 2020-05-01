<template>
  <fieldset
    :class="{
      'terminalFieldset--info': type === 'info',
      'terminalFieldset--cross': type === 'cross'
    }"
    class="terminalFieldset"
  >
    <div class="terminalFieldset__inner">
      <slot />
    </div>
  </fieldset>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: undefined
    }
  }
}
</script>

<style lang="scss">
.terminalFieldset {
  position: relative;

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
