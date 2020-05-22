<template>
  <div class="notifications">
    <div class="notifications__inner">
      <transition-group name="notification" tag="p">
        <notification
          v-for="post in posts"
          :post="{ id: post.id, content: post.content }"
          :key="post.id"
        />
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
  computed: {},
  mounted() {},
  methods: {
    addNotification(post) {
      const id = Math.random()
        .toString(36)
        .substr(2, 9)

      this.posts.push({ id, content: post })

      setTimeout(() => {
        const index = this.posts.findIndex((x) => {
          return x.id === id
        })

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
  min-height: 250px;
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
