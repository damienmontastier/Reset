<template>
  <div
    :class="{
      transition__fadeIn: true,
      'transition--on': mounted
    }"
    :style="{ 'transition-delay': `0.1s` }"
    class="mission-statement-P2 border"
  >
    <div class="mission-statement-P2__title border-bottom">
      MISSION Statement
    </div>
    <div
      :class="{
        transition__fadeIn: true,
        'transition--on': mounted
      }"
      :style="{ 'transition-delay': `0.2s` }"
      class="mission-statement-P2__header mission-statement--wrapper border-bottom"
    >
      <p>
        <span>From : "YouKnowWho"</span>
        <span>29/06/2020</span>
      </p>
      <p>
        <span>To : "Agent X"</span>
        <span>Contrat #257468</span>
      </p>
    </div>
    <div
      :class="{
        transition__fadeIn: true,
        'transition--on': mounted
      }"
      :style="{ 'transition-delay': `0.3s` }"
      class="mission-statement-P2__body mission-statement--wrapper border-bottom"
    >
      <typed
        @typedCompleted="appearSignature = true"
        :strings="[
          `The hour is serious, Agent X.
        <br />
        <br />The world's population is in the grip of a mysterious device, the
        Smartphone.
        <br />
        <br />Infiltrate the device, avoid the time-consuming traps and bring us
        back the solutions we need to defeat it.
        <br />
        <br />You have 5min. Good luck.`
        ]"
      />
    </div>
    <div
      :class="{
        transition__fadeIn: true,
        'transition--on': appearSignature
      }"
      :style="{ 'transition-delay': `0.1s` }"
      class="mission-statement-P2__signature mission-statement--wrapper"
    >
      <span>Signature :</span>
      <div
        ref="signature"
        @click="triggerSignature"
        :class="{
          'is-signed': startSignature
        }"
        class="signature_insert"
      >
        <span v-if="!startSignature">Click to sign</span>
      </div>
    </div>
    <btn
      @click.native="isSigned ? $emit('increment') : null"
      :inverted="isSigned"
      >START THE MISSION</btn
    >
  </div>
</template>

<script>
import lottie from 'lottie-web'
import missionSign from '@/assets/lottie/mission-sign.json'
import Typed from '@/components/components/typed'
import Btn from '@/components/components/btn-introduction'

export default {
  components: {
    Btn,
    Typed
  },
  data() {
    return {
      isSigned: false,
      startSignature: false,
      mounted: false,
      appearSignature: false
    }
  },
  mounted() {
    this.signAnimation = lottie.loadAnimation({
      container: this.$refs.signature,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: missionSign
    })
    this.signAnimation.addEventListener('complete', this.signAnimationCompleted)

    setTimeout(() => {
      this.mounted = true
    }, 0)
  },
  methods: {
    triggerSignature() {
      this.signAnimation.play()
      this.startSignature = true
    },
    signAnimationCompleted() {
      this.isSigned = true
    }
  }
}
</script>

<style lang="scss">
.mission-statement-P2 {
  background: var(--color-grey-introduction);
  font-family: var(--font-violet);
  width: 100%;

  &__title {
    background: var(--color-green);
    font-family: var(--font-cindie-c);
    font-size: 16px;
    line-height: 20px;
    padding: 25px 0;
    text-align: center;
    text-transform: uppercase;
  }

  &__header {
    color: var(--color-grey-light);
    font-size: 14px;
    line-height: 17px;

    p {
      display: flex;
      justify-content: space-between;
    }
  }

  &__body {
    font-size: 16px;
    height: 240px;
    line-height: 21px;
  }

  &__signature {
    display: flex;

    span {
      font-size: 16px;
    }

    .signature_insert {
      align-items: center;
      background: var(--color-grey-lighten);
      border: 1px solid var(--color-green);
      display: flex;
      height: 80px;
      justify-content: center;
      margin-left: auto;
      margin-right: 50px;
      position: relative;
      width: 50%;

      svg {
        left: 0;
        position: absolute;
        top: 0;
      }

      span {
        color: var(--color-grey-light);
      }

      &.is-signed {
        background-color: transparent;
        border: transparent;
      }
    }
  }
}
</style>
