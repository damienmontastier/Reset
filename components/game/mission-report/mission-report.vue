<template>
  <section class="missionReport">
    <header class="missionReport__header">
      <h2
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        class="missionReport__title"
      >
        mission report
      </h2>
    </header>
    <div
      :class="{
        transition__fadeIn: true,
        'transition--on': mounted
      }"
      :style="{ 'transition-delay': `0.1s` }"
      class="missionReport__head"
    >
      <div class="missionReport__head__left">
        <p>From : &#x3C;YouKnowWho&#x3E;</p>
        <p>To : &#x3C;Agent X&#x3E;</p>
      </div>
      <div class="missionReport__head__right">
        <p>29/06/2020</p>
        <p>Contrat #257468</p>
      </div>
    </div>
    <div
      :class="{
        transition__fadeIn: true,
        'transition--on': mounted
      }"
      :style="{ 'transition-delay': `0.2s` }"
      class="missionReport__body"
    >
      Congratulations, Agent X.<br /><br />
      You've made your way through the <i>infinite scroll</i>. Thanks to the
      crucial information you collected, we made the first step towards a
      brighter future.<br /><br />
      Good job !
    </div>
    <div
      :class="{
        transition__fadeIn: true,
        'transition--on': mounted
      }"
      :style="{ 'transition-delay': `0.3s` }"
      class="missionReport__stats"
    >
      <div class="missionReport__stats__row">
        <p>Elapsed time</p>
        <div class="missionReport__stats__row__hr" />
        <p>01:48:210</p>
      </div>
      <div class="missionReport__stats__row">
        <p>Posts dodged</p>
        <div class="missionReport__stats__row__hr" />
        <p>152</p>
      </div>
      <div class="missionReport__stats__row">
        <p>Posts hit</p>
        <div class="missionReport__stats__row__hr" />
        <p>09</p>
      </div>
    </div>
    <ui-button
      @click.native="
        $store.commit('ui/setMissionReportVisible', false)
        $store.commit('solutions/setOpened', true)
      "
      :class="{
        transition__fadeIn: true,
        'transition--on': mounted
      }"
      :style="{ 'transition-delay': `0.4s` }"
      class="missionReport__btn"
      style="--color: var(--color-black);
          --bg-color: var(--color-green);
          --border-color: var(--color-green);"
    >
      end game
    </ui-button>
  </section>
</template>

<script>
import UiButton from '@/components/components/ui-button'

export default {
  components: {
    UiButton
  },
  data() {
    return {
      mounted: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true
    }, 0)
  }
}
</script>

<style lang="scss">
.missionReport {
  background-color: var(--color-grey);
  border: 1px solid var(--color-grey-light);
  font-family: var(--font-violet);
  padding-bottom: 24px;
  width: 480px;

  &__header {
    background-color: var(--color-green);
    display: flex;
  }

  &__title {
    color: var(--color-black);
    font-family: var(--font-cindie-c);
    margin: auto;
    text-transform: uppercase;
  }

  &__header,
  &__head,
  &__body,
  &__stats {
    padding: 25px 32px;
  }

  &__head {
    border-top: 1px solid var(--color-grey-light);
    color: var(--color-grey-light);
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    line-height: 17px;

    &__right {
      text-align: right;
    }
  }

  &__body {
    border-bottom: 1px solid var(--color-grey-light);
    border-top: 1px solid var(--color-grey-light);
    color: var(--color-grey-lighten);
    font-size: 16px;
    line-height: 21px;

    i {
      color: var(--color-green);
    }
  }

  &__stats {
    color: var(--color-grey-light);
    font-size: 16px;
    line-height: 21px;

    &__row {
      display: flex;
      justify-content: space-between;

      > p {
        white-space: nowrap;

        &:last-child {
          color: var(--color-grey-lighten);
        }
      }

      &__hr {
        border-bottom: 1px dashed var(--color-grey-light);
        margin: 0 4px;
        position: relative;
        top: -5px;
        width: 100%;
      }
    }
  }

  &__btn {
    left: -10px;
    position: relative;
    width: calc(100% + 20px);
  }
}
</style>
