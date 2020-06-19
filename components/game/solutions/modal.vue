<template>
  <section class="solutionModal">
    <header class="solutionModal__header">
      <folder-svg
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.1s` }"
        class="solutionModal__header__icon"
      />
      <h4
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.2s` }"
        class="solutionModal__header__title"
      >
        Tip #{{ solution.id }} / {{ solution.title }}
      </h4>
      <div
        @click="$emit('close')"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.3s` }"
        class="solutionModal__close"
      >
        <cross-svg />
      </div>
    </header>
    <div class="solutionModal__content">
      <scroller ref="scroller">
        <div class="solutionModal__content__inner">
          <h4
            :class="{
              transition__fadeIn: true,
              'transition--on': mounted
            }"
            :style="{ 'transition-delay': `0.4s` }"
            class="solutionModal__title"
          >
            {{ solution.title }}
          </h4>
          <div
            ref="injected"
            v-html="$md.render(solution.content)"
            :class="{
              transition__fadeIn: true,
              'transition--on': mounted
            }"
            :style="{ 'transition-delay': `0.5s` }"
            class="solutionModal__content__injected"
          />
        </div>
      </scroller>
    </div>
  </section>
</template>

<script>
import imgLoader from '@/assets/js/imgLoader'
import Scroller from '@/components/components/scroller'
import CrossSvg from '@/components/svg/cross'
import FolderSvg from '@/components/svg/folder'

export default {
  components: {
    Scroller,
    CrossSvg,
    FolderSvg
  },
  props: {
    opened: {
      type: Boolean,
      default: false
    },
    solution: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mounted: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true

      const imgs = this.$refs.injected.querySelectorAll('img')
      imgLoader(imgs).then(() => {
        this.onLoaded()
      })
    }, 0)
  },
  methods: {
    onLoaded() {
      if (this.$refs.scroller) {
        this.$refs.scroller.onWindowResize()
      }
    }
  }
}
</script>

<style lang="scss">
.solutionModal {
  background-color: #f00;
  background-color: var(--color-black);
  border: 1px solid var(--color-green);
  font-family: var(--font-violet);
  height: 100%;

  &__title {
    color: var(--color-grey-lighten);
    font-size: 36px;
    line-height: 43px;
    padding-bottom: 40px;
  }

  &__close {
    align-items: center;
    box-sizing: content-box;
    cursor: pointer;
    display: flex;
    height: 20px;
    justify-content: center;
    padding: 16px;
    width: 20px;
  }

  &__header {
    align-items: center;
    background-color: var(--color-grey);
    border-bottom: 1px solid var(--color-green);
    color: var(--color-green);
    display: flex;

    font-size: 18px;
    justify-content: space-between;
    line-height: 22px;
    padding-left: 16px;

    &__title {
      padding: 16px 12px;
      width: 100%;
    }

    &__icon {
      height: 22px;
      width: 24px;
    }
  }

  &__content {
    height: calc(100% - 55px);

    &__inner {
      padding: 24px 48px;
    }

    &__injected {
      color: var(--color-grey-light);
      font-size: 16px;
      line-height: 22px;

      p,
      ul {
        margin-bottom: 16px;
      }

      ul {
        list-style: inside;
      }

      h2,
      h3,
      h4,
      h5,
      h6 {
        color: var(--color-grey-lighten);
        font-size: 24px;
        line-height: 29px;
        margin-bottom: 16px;
      }

      img {
        padding: 16px 0;
        width: 100%;
      }

      > * {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
