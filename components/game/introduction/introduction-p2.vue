<template>
  <div class="introductionP2 border">
    <div class="introductionP2__title border-bottom">
      MISSION Statement
    </div>
    <div class="introductionP2__header introduction--wrapper border-bottom">
      <p><span>From : "YouKnowWho"</span> <span>29/06/2020</span></p>
      <p><span>To : "Agent X"</span> <span>Contrat #257468</span></p>
    </div>
    <div class="introductionP2__body introduction--wrapper border-bottom">
      <p>
        The hour is serious, Agent X. <br /><br />
        The world's population is in the grip of a mysterious device, the
        Smartphone. <br /><br />
        Infiltrate the device, avoid the time-consuming traps and bring us back
        the solutions we need to defeat it. <br /><br />
        You have 5min. Good luck.
      </p>
    </div>
    <div class="introductionP2__signature introduction--wrapper">
      <span>Signature :</span>
      <div
        @click="triggerSignature"
        class="signature_insert"
        :class="{ 'is-signed': isSigned }"
      >
        {{ isSigned ? 'Signé' : ' Click for sign, Pas signé' }}
      </div>
    </div>
    <btn
      @click.native="isSigned ? $emit('increment') : null"
      :inverted="isSigned"
      >START THE MISSION
    </btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSigned: false
    }
  },
  components: {
    Btn: () => import('@/components/components/btn-introduction')
  },
  methods: {
    triggerSignature() {
      this.isSigned = true
    }
  }
}
</script>

<style lang="scss">
.introductionP2 {
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
    line-height: 21px;
  }

  &__signature {
    display: flex;

    span {
      font-size: 16px;
    }

    .signature_insert {
      background: var(--color-grey-lighten);
      border: 1px solid var(--color-green);
      height: 80px;
      margin-left: auto;
      margin-right: 50px;
      width: 50%;

      &.is-signed {
        background-color: transparent;
        border: transparent;
      }
    }
  }
}
</style>
