<template>
  <div class="gameLevel">
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component :is="currentLevel.slug" />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */

export default {
  validate({ params, store }) {
    return store.state.levels.find((level) => level.slug === params.slug)
  },
  asyncData({ store, params }) {
    const index = store.state.levels.findIndex(
      (level) => level.slug === params.slug
    )
    return { currentLevel: store.state.levels[index], currentIndex: index }
  },

  components: {
    level1: () => import('@/components/game/levels/level1.vue'),
    level2: () => import('@/components/game/levels/level2.vue')
  },
  mounted() {}
}
</script>
