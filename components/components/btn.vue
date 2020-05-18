<template>
  <div :class="{ 'btn--inverted': inverted }" class="btn">
    <div class="btn__inner">
      <slot />
      <div class="btn__arrows">
        <div class="arrows__inner">
          <arrow-icon v-for="i in 2" :key="i" />
        </div>
      </div>
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

  &:hover {
    .btn__inner .btn__arrows {
      .arrows__inner {
        transform: translateX(0%);
      }
    }
  }

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

  &__arrows {
    overflow: hidden;
    width: 16px;

    .arrows__inner {
      display: inline-flex;
      transform: translateX(-50%);
      transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);

      svg {
        display: flex;
        flex-basis: 0;
        flex-grow: 1;
      }
    }
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
