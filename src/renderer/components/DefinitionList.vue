<template>
  <div class="definition-list">
    <scroller class="definition-list__scroller">
      <definition v-for="definition in definitions" :key="definition.word" :value="definition.value" :definition="definition"></definition>
    </scroller>
  </div>
</template>

<script>
  import Definition from '@/components/Definition.vue';
  import Scroller from '@/components/Scroller.vue';

  export default {
    components: {
      Scroller,
      Definition,
    },
    props: {
      definitions: {
        type: Array,
        default: [],
      },
    },
  };
</script>

<style lang="scss">
  .definition-list {
    & {
      padding: 0 20px;
    }
  }
</style>
