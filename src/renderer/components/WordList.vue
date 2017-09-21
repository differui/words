<template>
  <div class="word-list">
    <scroller class="word-list__scroller">
      <ul class="word-list__list" ref="list">
        <li class="word-list__list-word" :class="word.selected ? 'word-list__list-word_selected' : ''" v-for="word in words" :key="word.text" @click="handleWordClick(arguments[0], word)">{{ word.text }}</li>
      </ul>
    </scroller>
  </div>
</template>

<script>
  import Scroller from '@/components/Scroller.vue';

  export default {
    components: {
      Scroller,
    },
    props: {
      words: {
        type: Array,
        default: [],
      },
    },
    computed: {
      selectedWordIndex() {
        return this.words.findIndex(w => w.selected);
      },
      selectedWord() {
        return this.words[this.selectedWordIndex];
      },
      selectedWordNode() {
        return this.$refs.list.children[this.selectedWordIndex];
      },
    },
    watch: {
      selectedWordIndex(newSelectedWordIndex, oldSelectedWordIndex) {
        this.$emit('change', this.words[newSelectedWordIndex].text, oldSelectedWordIndex > -1 ? this.words[oldSelectedWordIndex].text : '');
      },
    },
    methods: {
      handleGlobalKeyDown(ev) {
        if (!this.words.length) {
          return;
        }

        const { keyCode } = ev;
        const previousSelectedWordText = this.selectedWord.text;
        const previousWord = this.words[this.selectedWordIndex - 1];
        const nextWord = this.words[this.selectedWordIndex + 1];

        switch (keyCode) {
          case 38: // arrow up
            if (previousWord) {
              this.selectedWord.selected = false;
              previousWord.selected = true;
              ev.preventDefault();
            }
            break;
          case 40: // arrow down
            if (nextWord) {
              this.selectedWord.selected = false;
              nextWord.selected = true;
              ev.preventDefault();
            }
            break;
          default:
        }
        if (this.selectedWord.text === previousSelectedWordText) {
          return;
        }
        this.$nextTick(() => {
          if (this.selectedWordNode) {
            this.selectedWordNode.scrollIntoViewIfNeeded();
          }
        });
      },
      handleWordClick(ev, word) {
        const selectedWord = this.selectedWord;

        if (word.selected) {
          return;
        }
        this.words.forEach((otherWord) => {
          if (otherWord !== word) {
            otherWord.selected = false;
          }
        });
        word.selected = true;
        this.$emit('change', word.text, selectedWord.text);
      },
    },
    mounted() {
      document.addEventListener('keydown', this.handleGlobalKeyDown);
    },
    destroyed() {
      document.removeEventListener('keydown', this.handleGlobalKeyDown);
    },
  };
</script>

<style lang="scss">
  .word-list {
    & {
      background-color: #EBEBEB;
    }

    &__scroller {
      width: 183px;
    }

    &__list {
      padding-top: 20px;
    }

    &__list-word {
      padding: 4px 4px 4px 24px;
    }

    &__list-word_selected {
      color: #FFFFFF;
      background-color: rgb(42, 119, 230);
    }
  }
</style>
