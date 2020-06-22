<template>
  <div class="gameLevel">
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component :is="stage.slug" />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */

export default {
  validate({ params, store }) {
    return store.getters['stages/getStageBySlug'](params.slug)
  },

  components: {
    level1: () => import('@/components/game/levels/level1.vue'),
    level2: () => import('@/components/game/levels/level2.vue')
  },
  asyncData({ store, params }) {
    return { stage: store.getters['stages/getStageBySlug'](params.slug) }
  }
}
</script>
