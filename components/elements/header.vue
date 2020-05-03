<template>
  <div class="header">
    <div class="header__left">
      <svgNetwork />
      <svgLogo />
      <svgBattery />
      <svgWifi />
    </div>
    <div class="header__middle">
      <span>01 : 48 : 21</span>
    </div>
    <div class="header__right">
      <div class="right__penalty active">
        +
        <span class="minutes">25</span> min
      </div>
      <div class="right__time">
        <span>12 : 04</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    svgNetwork: () => import('@/components/svg/network'),
    svgLogo: () => import('@/components/svg/logo'),
    svgBattery: () => import('@/components/svg/battery'),
    svgWifi: () => import('@/components/svg/wifi')
  },

  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.header {
  align-items: center;
  background-color: var(--color-black);
  border: 1px solid var(--color-grey-light);
  display: flex;
  height: 44px;
  justify-content: space-between;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 99;

  &__left,
  &__middle,
  &__right {
    align-items: center;
    color: #fff;
    display: flex;
    height: 100%;
  }

  &__left {
    border-right: 1px solid var(--color-grey-light);
    justify-content: space-between;
    padding: 0 30px;
    width: 265px;
  }

  &__middle {
    border-left: 1px solid var(--color-grey-light);
    border-right: 1px solid var(--color-grey-light);
    justify-content: center;
    width: 220px;

    span {
      color: var(--color-green);
      font-family: var(--font-cindie-e);
      font-size: 11px;
    }
  }

  &__right {
    border-left: 1px solid var(--color-grey-light);

    .right__penalty,
    .right__time {
      align-items: center;
      display: flex;
      height: 100%;
      padding: 0 30px;
    }

    .right__penalty {
      border-right: 1px solid var(--color-grey-light);

      color: transparent;
      font-family: var(--font-cindie-b);
      font-size: 8px;

      span {
        font-family: var(--font-cindie-e);
        font-size: 11px;
      }

      &.active {
        background-color: var(--color-green);
        color: var(--color-black);
      }
    }

    .right__time {
      color: var(--color-green);
      font-family: var(--font-cindie-c);
      font-size: 9px;
    }
  }
}
</style>
