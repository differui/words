<template>
  <div class="definition" :class="opened ? 'definition_open' : ''">
    <div class="definition__headline" @click="handleClick">
      <span class="definition__triangle"></span>
      <span class="definition__name">{{ dictionaryName }}</span>
    </div>
    <div class="definition__content" v-if="opened">
      <h1 class="definition__word">
        <span class="definition__text">{{ definition.text }}</span>
        <span class="definition__phonetic-category" v-if="definition.phonetic.uk">BE</span>
        <span class="definition__phonetic" v-if="definition.phonetic.uk">{{ definition.phonetic.uk }}</span>
        <span class="definition__phonetic-category" v-if="definition.phonetic.us">AE</span>
        <span class="definition__phonetic" v-if="definition.phonetic.us">{{ definition.phonetic.us }}</span>
      </h1>
      <ul class="definition__explains">
        <li class="definition__explain" v-for="(explain, index) in definition.explains" :key="index">{{ explain }}</li>
      </ul>
      <ul class="definition__examples">
        <li class="definition__example" v-for="(example, index) in definition.examples" :key="index">
          <span class="definition__example-key">{{ example.key }}</span>
          <span class="definition__example-value">{{ example.value.join(',') }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import * as cfgs from '@/configs';

  export default {
    props: {
      definition: {
        type: Object,
        default: {},
      },
    },
    computed: {
      dictionaryName() {
        switch (this.definition.type) {
          case cfgs.DICTIONARY_YOUDAO: return 'fanyi.youdao.com';
          case cfgs.DICTIONARY_ICIBA: return 'iciba.com';
          case cfgs.DICTIONARY_DICIONARY: return 'dictionaryapi.com';
          default: return '';
        }
      },
    },
    data() {
      return {
        opened: true,
      };
    },
    methods: {
      handleClick() {
        this.opened = !this.opened;
      },
    },
  };
</script>

<style lang="scss">
  .definition {
    & {
      position: relative;
    }

    &__headline {
      color: #AAAAAA;
      font-size: 14px;
      font-style: italic;
      font-weight: 300;
      text-align: center;
      position: relative;
      margin-top: 10px;
      margin-bottom: 15px;
    }

    &__headline::before {
      content: '';
      height: 1px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 20px;
      margin: auto;
      position: absolute;
      background-color: #AAAAAA;
    }

    &__content {
      padding-left: 5px;
      padding-bottom: 40px;
    }

    &__triangle {
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 6px 0 6px 9px;
      border-color: transparent transparent transparent #AAAAAA;
      top: 5px;
      left: 2px;
      position: absolute;
      transform: rotate(0);
    }

    &__name {
      z-index: 1;
      position: relative;
      padding: 0 16px;
      background-color: #FFFFFF;
    }

    &__word {
      font-size: 22px;
      margin: 0 0 10px 0;
    }

    &__phonetic,
    &__phonetic-category {
      color: #AAAAAA;
      font-size: 14px;
      font-style: italic;
    }

    &__phonetic-category {
      margin-left: 3px;
      margin-right: -5px;
    }

    &__phonetic {
      font-weight: 300;
      font-family: Georgia, 'Times New Roman', Times, serif;
    }

    &__phonetic::before,
    &__phonetic::after {
      content: '|';
      padding: 0 2px;
    }

    &__explains,
    &__examples {
      margin-bottom: 15px;
    }

    &__explains {
      font-size: 14px;
    }

    &__examples {
      list-style-type: decimal;
      padding-left: 1.1em;
      font-size: 14px;
    }

    &__explain,
    &__example {
      margin-bottom: 5px;
    }

    &__example-value {
      display: block;
    }

    // state
    // ====
    &_open &__triangle {
      transform: rotate(90deg);
    }
  }
</style>
