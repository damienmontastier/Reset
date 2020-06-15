<template>
  <div v-sounds="{ mouseenter: '/sounds/dash_01.mp3' }" class="btn">
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
export default {
  components: {
    ArrowIcon: () => import('@/components/svg/arrow')
  }
}
</script>

<style lang="scss">
.btn {
  background-color: var(--bg-color);
  border: solid 1px var(--border-color);
  color: var(--color);
  cursor: pointer;
  font-family: var(--font-cindie-d);
  font-size: 11px;
  line-height: 14px;
  padding: 12px 24px;
  text-transform: uppercase;

  &:hover {
    .btn__inner {
      margin-left: 8px;

      .btn__arrows {
        margin-left: 8px;

        .arrows__inner {
          transform: translateX(0%);
        }
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
      fill: var(--color);
    }
  }

  // &__arrow {
  //   background-color: url('/img/icons/arrow.svg');
  //   height: 12px;
  //   width: 16px;
  // }
}
</style>
