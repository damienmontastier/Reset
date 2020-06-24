<template>
  <div class="terminalP2">
    <div class="terminalP2__inner">
      <terminal-fieldset
        :type="'info'"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.1s` }"
        class="terminal__block"
      >
        <div>
          Sélectionez 3 centres d'intéret
        </div>
      </terminal-fieldset>

      <terminal-fieldset
        :type="'cross'"
        :class="{
          transition__fadeIn: true,
          'transition--on': mounted
        }"
        :style="{ 'transition-delay': `0.2s` }"
        class="terminal__block"
      >
        <div v-for="(p, index) in items" :key="index" class="input">
          <input
            v-model="p.active"
            :id="stringToSlug(p.name)"
            :name="stringToSlug(p.name)"
            :ref="stringToSlug(p.name)"
            :checked="p.active"
            @change="checkboxBehavior"
            type="checkbox"
          />

          <label :for="stringToSlug(p.name)">{{ p.name }}</label>
        </div>

        <div slot="error" v-if="displayError" class="terminalFieldset__error">
          <span>Vous devez sélectionner 3 centres d’intérêts différents </span>
        </div>
      </terminal-fieldset>

      <div class="terminal__submit">
        <ui-button
          @click.native="closeTerminal"
          :class="{
            transition__fadeIn: true,
            'transition--on': mounted
          }"
          :style="{ 'transition-delay': `0.3s` }"
          style="--color: var(--color-black);
          --bg-color: var(--color-green);
          --border-color: var(--color-green);"
          >Annuler</ui-button
        >
        <ui-button
          @click.native="nextPage"
          :class="{
            transition__fadeIn: true,
            'transition--on': mounted
          }"
          :style="{ 'transition-delay': `0.4s` }"
          style="--color: var(--color-green);
          --bg-color: var(--color-black);
          --border-color: var(--color-green);"
          >Continuer</ui-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/components/ui-button'
import TerminalFieldset from '@/components/game/terminal/terminal-fieldset'

export default {
  components: {
    UiButton,
    TerminalFieldset
  },
  data() {
    return {
      displayError: false,
      items: [
        { name: 'Poneys', active: true, selectable: true },
        { name: 'Chats', active: true, selectable: true },
        { name: 'Dogs', active: true, selectable: true },
        { name: 'BFM TV', active: true, selectable: true },
        { name: 'Manu', active: true, selectable: true },
        { name: 'Reine Fatima', active: true, selectable: true },
        { name: 'Jul', active: true, selectable: true },
        { name: 'Cordula', active: true, selectable: true },
        { name: 'Tout selectionner', active: true, selectable: false },
        { name: 'Tout déselectionner', active: true, selectable: false }
      ],
      mounted: false
    }
  },
  computed: {
    selectedItems() {
      return this.items.filter((item) => item.active && item.selectable)
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true
    }, 0)
  },
  methods: {
    closeTerminal() {
      this.$parent.closeTerminal()
    },

    nextPage() {
      if (this.selectedItems.length === 3) {
        this.displayError = false
        this.$emit('increment')
      } else {
        this.displayError = true
      }
    },

    checkboxBehavior(e) {
      if (e.target.name === 'tout-deselectionner') {
        e.target.checked = false
        this.items.forEach((item) => (item.active = false))
      } else if (e.target.name === 'tout-selectionner') {
        e.target.checked = true
        this.items.forEach((item) => (item.active = true))
      }
    },

    stringToSlug(str) {
      str = str.replace(/^\s+|\s+$/g, '') // trim
      str = str.toLowerCase()

      const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
      const to = 'aaaaeeeeiiiioooouuuunc------'
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      }

      str = str
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

      return str
    }
  }
}
</script>

<style lang="scss">
.terminalP2 {
  .terminalFieldset.terminalFieldset--cross {
    .terminalFieldset__inner {
      display: flex;
      flex-flow: wrap;
      padding: 35px 24px;

      .input {
        align-items: center;
        display: flex;
        flex: 0 0 33%;
        margin-bottom: 10px;

        &:nth-last-child(-n + 3) {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
