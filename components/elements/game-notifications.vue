<template>
  <div class="notifications">
    <div class="notifications__inner">
      <transition-group name="notification" tag="p">
        <notification v-for="post in posts" :post="post" :key="post.id" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import useClock from '@/hooks/use-clock'

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
  mounted() {
    this.clock = useClock()
  },

  methods: {
    addNotification(post) {
      const id = Math.random()
        .toString(36)
        .substr(2, 9)

      const hour = this.clock.virtualTime

      this.posts.push({ id, content: post, hour })

      setTimeout(() => {
        const index = this.posts.findIndex((x) => {
          return x.id === id
        })
        this.posts.splice(index, 1)
      }, 5000)
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
  transition: all 0.5s;
}

.notification-move {
  transition-delay: 0.5s !important;
}

.notifications {
  position: absolute;
  right: 10px;
  top: 70px;
  width: 15vw;

  &__inner {
    display: block;
    height: 100%;
    position: relative;
    width: 100%;
  }
}
</style>
