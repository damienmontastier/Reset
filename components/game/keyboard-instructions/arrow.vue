<template>
  <div class="keyboard-arrow">
    <div class="arrow">
      <div class="key">k</div>
      <br />
      <div class="key">k</div>
      <div class="key">k</div>
      <div class="key">k</div>
    </div>
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.keyboard-arrow {
  background: #f00;
  padding: 15px;

  .arrow {
    margin-bottom: 10px;
    margin-top: -100px;
    text-align: center;

    .key {
      display: inline-block;
    }
  }
}
</style>
