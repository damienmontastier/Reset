<template>
  <div class="appGame">
    <div class="appGame__router">
      <router-link :to="'level1'">level1</router-link>
      <router-link :to="'level2'">level2</router-link>
      <router-link :to="'level3'">level3</router-link>
    </div>
  </div>
</template>

<script>
import useGame from '@/hooks/use-game'

export default {
  mounted() {
    useGame()
  }
}
</script>

<style lang="scss">
.appGame {
  &__router {
    bottom: 0;
    color: #fff;
    padding: 8px;
    position: absolute;
    right: 0;
  }
}
</style>
