<template>
  <div :style="cssVars" class="notification">
    <div class="notification__inner">
      <div class="notification__top">
        <span>{{ post.content.social_network }}</span>
        <span>HEURE</span>
      </div>
      <p>{{ post.content.title }}</p>
      <picture v-if="post.content.picture">
        <img :src="post.content.picture" alt="" />
      </picture>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    cssVars() {
      return {
        '--color': `var(--color-${this.post.content.social_network.toLowerCase()})`
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.notification {
  background: var(--color-black);
  border: 1px solid var(--color-grey-light);
  color: var(--color);
  display: inline-block;
  margin-top: 5px;
  position: relative;
  transition: all 0.8s;
  width: 100%;

  &::before {
    background: var(--color);
    content: '';
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 2px;
  }

  &__inner {
    padding: 10px 15px;
  }

  &__top {
    display: flex;
    font-family: var(--font-orbitron-bold);
    font-size: 8px;
    justify-content: space-between;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  p {
    color: #fff;
    font-family: var(--font-violet);
    font-size: 9px;
    line-height: 11px;
  }

  picture {
    display: block;
    margin-top: 10px;
    position: relative;
    width: 100%;

    img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  }
}
</style>
