<template>
  <section class="qualitySelection">
    <div class="qualitySelection__inner">
      <h2 class="qualitySelection__title u-uppercase">Select the quality</h2>
      <ul class="qualitySelection__list">
        <li class="qualitySelection__item u-uppercase u-link-hover">
          <button @click="setQuality('low')">low</button>
        </li>
        <li class="qualitySelection__item u-uppercase u-link-hover">
          <button @click="setQuality('medium')">medium</button>
        </li>
        <li class="qualitySelection__item u-uppercase u-link-hover">
          <button @click="setQuality('high')">high</button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    setQuality(quality) {
      console.log(quality)
    }
  }
}
</script>

<style lang="scss">
.qualitySelection {
  // background-color: #f2f2f2;
  background-color: var(--color-black);
  display: flex;
  height: 100vh;
  height: calc(100 * var(--vh, 1vh));
  left: 0;
  pointer-events: all;
  position: absolute;
  top: 0;
  width: 100%;

  &__inner {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: auto;
    position: relative;
    top: -55px;
  }

  &__title {
    color: var(--color-grey-light);
    font-family: var(--font-violet);
    font-size: 16px;
    left: -18px;
    letter-spacing: 0.5px;
    line-height: 19px;
    margin-bottom: 110px;
    position: relative;
    text-transform: uppercase;
  }

  &__list {
    color: var(--color-green);
    display: flex;
    font-family: var(--font-cindie-d);
    font-size: 24px;
    justify-content: space-between;
    line-height: 30px;
    max-width: 740px;
    width: 100vw;
  }

  @mixin hover {
    @media (hover: hover) {
      &:hover {
        @content;
      }
    }
  }

  &__item {
    opacity: 0.4;
    position: relative;
    transition: opacity 0.4s _ease('quint', 'out');

    @include hover {
      opacity: 1;

      &::after {
        transform: scaleX(1);
        transform-origin: center left;
      }
    }

    &::after {
      background-color: color('green');
      bottom: -2px;
      content: '';
      display: block;
      height: 5px;
      left: 0;
      position: absolute;
      transform: scaleX(0);
      transform-origin: center right;
      transition: transform 0.4s _ease('quint', 'out');
      width: 100%;
    }
  }
}
</style>
