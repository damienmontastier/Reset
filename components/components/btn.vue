<template>
  <div :class="{ 'btn--inverted': inverted }" class="btn">
    <div class="btn__inner">
      <slot />
      <arrow-icon />
    </div>
  </div>
</template>

<script>
import ArrowIcon from '@/components/svg/arrow'
export default {
  components: {
    ArrowIcon
  },
  props: {
    inverted: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.btn {
  border: solid 1px var(--color-green);
  color: var(--color-green);
  cursor: pointer;
  font-family: var(--font-cindie-d);
  font-size: 11px;
  line-height: 14px;
  padding: 12px 24px;
  text-transform: uppercase;

  &--inverted {
    background-color: var(--color-green);
    color: var(--color-black);

    svg {
      polygon {
        fill: var(--color-black) !important;
      }
    }
  }

  &__inner {
    display: flex;
    justify-content: space-between;
  }

  svg {
    polygon {
      fill: var(--color-green);
    }
  }

  // &__arrow {
  //   background-color: url('/img/icons/arrow.svg');
  //   height: 12px;
  //   width: 16px;
  // }
}
</style>
