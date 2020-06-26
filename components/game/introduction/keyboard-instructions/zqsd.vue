<template>
  <div
    :class="{
      transition__fadeIn: true,
      'transition--on': mounted
    }"
    :style="{ 'transition-delay': `0.1s` }"
    class="keyboard-letter"
  >
    <slot name="before"></slot>
    <div class="letters">
      <div
        ref="up"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.2s` }"
        class="key up"
      >
        <span>Z</span>
      </div>
      <div
        ref="left"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.3s` }"
        class="key left"
      >
        <span>Q</span>
      </div>
      <div
        ref="down"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.4s` }"
        class="key down"
      >
        <span>S</span>
      </div>
      <div
        ref="right"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.5s` }"
        class="key right"
      >
        <span>D</span>
      </div>
    </div>
    <slot name="after"></slot>
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
.keyboard-letter {
  align-items: center;
  background: var(--color-grey-introduction);
  border: 1px solid var(--color-black);
  display: flex;
  justify-content: center;
  padding: 8px 15px;

  p.before {
    margin-right: 15px;
  }

  p.after {
    margin-left: 15px;
  }

  .letters {
    margin-bottom: -60px;
    margin-top: -60px;
    text-align: center;

    .key {
      align-items: center;
      display: inline-flex;
      justify-content: center;
      padding: 0;

      span {
        font-family: var(--font-cindie-c);
        font-size: 16px;
      }
    }
  }
}
</style>
