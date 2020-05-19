<template>
  <div class="notifications">
    <div class="notifications__inner">
      <transition-group name="notification" tag="p">
        <notification :post="post" v-for="post in posts" :key="post.slug" />
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Notification: () => import('@/components/components/notification')
  },

  data() {
    return {
      posts: []
    }
  },
  mounted() {},
  computed: {},
  methods: {
    addItem(post) {
      this.posts.push(post)

      setTimeout(() => {
        const index = this.posts.indexOf(post)
        this.posts.splice(index, 1)
      }, 2500)
    }
  }
}
</script>

<style lang="scss" scoped>
.notification-enter,
.notification-leave-to {
  transform: translateX(100%);
}

.notification-leave-active {
  position: absolute !important;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s;
}

.notification-move {
  transition-delay: 1s !important;
}

.notifications {
  height: 250px;
  position: absolute;
  right: 10px;
  top: 70px;
  width: 235px;

  &__inner {
    display: block;
    height: 100%;
    position: relative;
    width: 100%;
  }
}
</style>
