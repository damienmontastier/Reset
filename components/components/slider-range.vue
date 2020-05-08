<template>
  <div class="slider-range">
    <div ref="circle" class="circle">
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <circle fill="#2FF000" cy="20" cx="20" r="20" />
        <text
          font-family="CindieMono-C, Cindie Mono"
          font-size="10"
          font-style="expanded"
          font-weight="400"
          fill="#161616"
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
        >
          {{ letter }}
        </text>
      </svg>
    </div>
    <div class="line__dash line-grey">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path
          stroke="#979797"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="0,5"
          d="M.5 24.5h329"
        />
      </svg>
    </div>
    <div class="line__dash line-green">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path
          stroke="#2FF000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="0,5"
          d="M.5 24.5h329"
        />
      </svg>
    </div>
    <div ref="circleOuter" class="circle__outer">
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle stroke="#2FF000" fill="none" cy="24" cx="24" r="23.5" />
      </svg>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
import Dragger from '@/assets/js/dragger'

export default {
  props: {
    quotient: {
      type: Number,
      default: 1
    },
    letter: {
      type: String,
      require: 'O'
    }
  },
  data() {
    return {
      pos: { x: 0, y: 0 },
      circleBounding: {},
      circleOuterBounding: {},
      goStart: false,
      goEnd: false
    }
  },
  components: {},
  mounted() {
    this.dragger = new Dragger(this.$refs.circle)

    this.dragger.events.on('drag:start', this.onDragStart)
    this.dragger.events.on('drag:move', this.onDragMove)
    this.dragger.events.on('drag:stop', this.onDragStop)

    this.circleBounding = this.$refs.circle.getBoundingClientRect()

    this.circleBounding.initalX =
      this.circleBounding.x + this.circleBounding.width / 2

    this.circleOuterBounding = this.$refs.circleOuter.getBoundingClientRect()

    this.circleOuterBounding.initialX =
      this.circleOuterBounding.x + this.circleOuterBounding.width / 2

    this.circleOuterBounding.finalX =
      this.circleOuterBounding.x + this.circleOuterBounding.width / 2

    this.circleBounding.finalX =
      this.circleOuterBounding.initialX - this.circleBounding.initalX
  },
  methods: {
    onDragStart(e) {},
    onDragMove(e) {
      if (e.event.clientX < this.circleBounding.x && this.quotient === 1) {
        this.pos.x = 0
      } else if (
        e.event.clientX > this.circleOuterBounding.finalX &&
        this.quotient === 1
      ) {
        this.pos.x = this.circleBounding.finalX
      } else {
        this.pos.x -= e.deltaX * this.quotient
        this.pos.x = Math.max(0, this.pos.x)
        this.pos.x = Math.min(this.pos.x, this.circleBounding.finalX)
      }

      gsap.to(this.$refs.circle, {
        x: `${this.pos.x}`,
        duration: 0.5
      })
    },
    onDragStop() {}
  }
}
</script>

<style lang="scss">
.slider-range {
  display: flex;
  height: 64px;
  margin: 0 auto;
  position: relative;
  width: 310px;

  .circle,
  .circle__outer {
    align-items: center;
    display: inline-flex;
    height: 100%;
    justify-content: center;
    position: absolute;
  }

  .circle {
    left: -39px;
    z-index: 9;

    span {
      color: var(--color-black);
      font-family: var(--font-cindie-c);
      font-size: 10px;
      line-height: 10px;
      position: absolute;
    }
  }

  .circle__outer {
    right: -48px;
  }

  .line__dash {
    height: 100%;
    position: absolute;
    width: 100%;

    svg {
      path {
        transform: translateY(12.5%);
      }
    }
  }
}
</style>
