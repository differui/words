<template>
  <div class="scroller">
    <slot></slot>
  </div>
</template>

<script>
  export default {
  };
</script>

<style lang="scss">
  .scroller {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
        display: none;
    }
  }
</style>
