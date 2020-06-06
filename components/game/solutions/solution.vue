<template>
  <div :class="{ 'solution--unlocked': unlocked }" class="solution">
    <div class="solution__icon">
      <folder-svg />
    </div>
    <div class="solution__caption">
      <template v-if="unlocked">
        <h4 class="solution__caption__subtitle">Tips #{{ solution.id }}</h4>
        <h3 class="solution__caption__title">{{ solution.title }}</h3>
      </template>

      <template v-else>
        <h4 class="solution__caption__subtitle">Unlocked at :</h4>
        <h3 class="solution__caption__title">
          {{ solution.required_time }} or less
        </h3>
      </template>
    </div>
  </div>
</template>

<script>
import FolderSvg from '@/components/svg/folder'

export default {
  components: {
    FolderSvg
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
  background-color: var(--color-grey);
  border: 1px solid var(--color);
  color: var(--color);
  display: flex;
  flex-direction: column;
  font-family: var(--font-violet);
  height: 150px;
  width: 150px;

  &--unlocked {
    --color: var(--color-green);
  }

  &__icon {
    display: flex;
    height: 100%;

    > * {
      margin: auto;
    }
  }

  &__caption {
    background-color: var(--color-black);
    border-top: 1px solid var(--color);
    padding: 8px;

    &__subtitle {
      font-size: 12px;
      line-height: 14px;
      margin-bottom: 4px;
    }

    &__title {
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>
