<template>
  <div
    :class="{
      transition__fadeIn: true,
      'transition--on': mounted
    }"
    :style="{ 'transition-delay': `0.1s` }"
    class="keyboard-arrow"
  >
    <div class="arrows">
      <div
        ref="up"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.1s` }"
        class="key up"
      >
        <span />
      </div>
      <br />
      <div
        ref="left"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.2s` }"
        class="key left"
      >
        <span />
      </div>
      <div
        ref="down"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.3s` }"
        class="key down"
      >
        <span />
      </div>
      <div
        ref="right"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.4s` }"
        class="key right"
      >
        <span />
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
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
  beforeDestroy() {},
  methods: {}
}
</script>

<style lang="scss">
.keyboard-arrow {
  background: var(--color-grey-introduction);
  border: 1px solid var(--color-black);

  padding: 15px;

  .arrows {
    margin-bottom: 10px;
    margin-top: -100px;
    text-align: center;

    .key {
      span {
        display: block;
      }

      &.up span {
        border-bottom: 8px solid var(--color-black);
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        height: 0;
        width: 0;
      }

      &.down span {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 8px solid var(--color-black);
        height: 0;
        width: 0;
      }

      &.right span {
        border-bottom: 4px solid transparent;
        border-left: 8px solid var(--color-black);
        border-top: 4px solid transparent;
        height: 0;
        width: 0;
      }

      &.left span {
        border-bottom: 4px solid transparent;
        border-right: 8px solid var(--color-black);
        border-top: 4px solid transparent;
        height: 0;
        width: 0;
      }

      &:first-child {
        margin-bottom: 6px;
      }
    }
  }
}
</style>
