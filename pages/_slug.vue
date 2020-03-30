<template>
  <div class="gameLevel">
    <!-- eslint-disable-next-line vue/require-component-is -->
    <component :is="$route.params.slug" />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */

export default {
  components: {
    level1: () => import('@/components/game/levels/level1.vue'),
    level2: () => import('@/components/game/levels/level2.vue'),
    level3: () => import('@/components/game/levels/level3.vue')
  },
  validate({ route, store }) {
    // TODO Object.keys(this.$options.components)

    return true
  },
  mounted() {}
}
</script>
