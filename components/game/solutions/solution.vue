<template>
  <div :class="{ 'solution--unlocked': unlocked }" class="solution">
    <div class="solution__icon">
      <!-- eslint-disable-next-line vue/require-component-is -->
      <!-- <component :is="unlocked ? 'folder-svg' : 'lock-svg'" /> -->
    </div>
    <div class="solution__caption">
      <!-- <div v-if="unlocked && !solution.opened" class="solution__new">new !</div>

      <template v-if="unlocked">
        <h4 class="solution__caption__subtitle">Tip #{{ solution.id }}</h4>
        <h3 class="solution__caption__title">{{ solution.title }}</h3>
      </template>

      <template v-else>
        <h4 class="solution__caption__subtitle">Unlocked at :</h4>
        <h3 class="solution__caption__title">
          <span class="solution__caption__title__score">
            {{ solution.required_score }}
          </span>
          or less in
          <span class="solution__caption__title__stage">
            {{ solution.stage.title }}
          </span>
        </h3>
      </template> -->
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
  transition: border 0.4s _ease('quint', 'out');

  &:hover {
    --b-color: var(--color);
  }

  &--unlocked {
    --color: var(--color-green);
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

  &__new {
    background-color: var(--color-green);
    color: var(--color-black);
    font-size: 14px;
    line-height: 17px;
    padding: 4px;
    position: absolute;
    right: 0;
    text-transform: uppercase;
    top: 0;
    transform: translate(25%, -50%);
  }

  &__caption {
    background-color: var(--color-black);
    border-top: 1px solid var(--b-color);
    padding: 17px;
    position: relative;
    transition: border 0.4s _ease('quint', 'out');

    &__subtitle {
      font-size: 11px;
      line-height: 14px;
      margin-bottom: 4px;

      @media screen and (min-width: 1200px) {
        font-size: 14px;
        line-height: 17px;
      }
    }

    &__title {
      font-size: 15px;
      line-height: 19px;

      @media screen and (min-width: 1200px) {
        font-size: 18px;
        line-height: 22px;
      }

      &__score {
        color: var(--color-grey-lighten);
      }

      &__stage {
        text-transform: uppercase;
      }
    }
  }
}
</style>
