<template>
  <div :class="{ 'solution--unlocked': unlocked }" class="solution">
    <div class="solution__icon">
      <!-- eslint-disable-next-line vue/require-component-is -->
      <component :is="unlocked ? 'folder-svg' : 'lock-svg'" />
    </div>
    <div class="solution__caption">
      <template v-if="unlocked">
        <h4 class="solution__caption__subtitle">Tips #{{ solution.id }}</h4>
        <h3 class="solution__caption__title">{{ solution.title }}</h3>
      </template>

      <template v-else>
        <h4 class="solution__caption__subtitle">Unlocked at :</h4>
        <h3 class="solution__caption__title">
          <span>{{ solution.required_score }}</span>
          {{ solution.locked_wording }}
        </h3>
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */

export default {
  components: {
    FolderSvg: () => import('@/components/svg/folder'),
    LockSvg: () => import('@/components/svg/lock')
  },
  props: {
    solution: {
      type: Object,
      required: true
    },
    unlocked: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    console.log(this.unlocked)
  }
}
</script>

<style lang="scss">
.solution {
  --color: var(--color-grey-light);
  --b-color: var(--color-transparent);
  background-color: var(--color-grey);
  border: 1px solid var(--b-color);
  color: var(--color);
  display: flex;
  flex-direction: column;
  font-family: var(--font-violet);
  // height: 150px;
  // width: 150px;
  transition: border 0.4s ease-out;

  &:hover {
    --b-color: var(--color);
  }

  &--unlocked {
    --color: var(--color-green);

    // &:hover {
    //   --b-color: var(--color-green);
    // }
  }

  &__icon {
    display: flex;
    height: 100%;

    > * {
      height: 50%;
      margin: auto;
      max-height: 80px;
      width: 50%;
    }
  }

  &__caption {
    background-color: var(--color-black);
    // border-top: 1px solid var(--color);
    padding: 17px;

    &__subtitle {
      font-size: 14px;
      line-height: 17px;
      margin-bottom: 4px;
    }

    &__title {
      font-size: 18px;
      line-height: 22px;

      span {
        color: var(--color-grey-lighten);
      }
    }
  }
}
</style>
