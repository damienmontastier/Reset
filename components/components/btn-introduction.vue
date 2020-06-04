<template>
  <div
    :class="{ 'btn__introduction--inverted': inverted }"
    class="btn__introduction"
  >
    <div class="btn__introduction__inner">
      <slot />
      <div class="btn__introduction__arrows">
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
.btn__introduction {
  background: var(--color-grey-introduction);
  border: solid 1px var(--color-green);
  border: 1px solid #161616;
  color: var(--color-black);
  cursor: pointer;
  font-family: var(--font-cindie-d);
  font-size: 11px;
  line-height: 14px;
  margin-bottom: 20px;
  margin-left: -2.5%;
  padding: 12px 24px;
  text-transform: uppercase;
  width: 105%;

  &:hover {
    .btn__introduction__inner {
      margin-left: 8px;

      .btn__introduction__arrows {
        margin-left: 8px;

        .arrows__inner {
          transform: translateX(0%);
        }
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
    transition: margin 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
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
      fill: var(--color-black);
    }
  }
}
</style>
