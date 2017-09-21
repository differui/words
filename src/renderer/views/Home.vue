<template>
  <div class="home">
    <header class="home__toolbar toolbar toolbar-header">
      <h1 class="title">Words</h1>
      <div class="home__actions toolbar-actions">
        <div class="home__indicator" v-if="indicatorVisible"></div>
        <div class="home__search">
          <div class="home__input form-control" ref="input" autofocus="true" contenteditable="true" @keydown="handleSearchInputKeyDown" @keyup="handleSearchInputKeyUp" @blur="handleSearchInputBlur"></div>
          <div class="home__placeholder">
            <span class="home__placeholder-icon icon icon-search"></span>
            <span class="home__placeholder-text">Search</span>
          </div>
        </div>
      </div>
    </header>
    <section class="home__content">
      <welcome class="home__welcome" v-if="!query"></welcome>
      <word-list class="home__word-list" :words="words" v-if="query" @change="handleWordListChange"></word-list>
      <definition-list class="home__definition-list" :definitions="definitions" v-if="query"></definition-list>
    </section>
  </div>
</template>

<script>
  import Welcome from '@/components/Welcome.vue';
  import WordList from '@/components/WordList.vue';
  import DefinitionList from '@/components/DefinitionList.vue';
  import * as data from '@/data';
  import * as helpers from '@/helpers';

  export default {
    components: {
      Welcome,
      WordList,
      DefinitionList,
    },
    data() {
      return {
        query: '',
        definitions: [],
        memoryWords: [],
        suggestionWords: [],
        indicatorVisible: false,
      };
    },
    computed: {
      words() {
        return this.suggestionWords;
      },
    },
    watch: {
      query(newQuery) {
        if (newQuery) {
          this.getSuggestionWords(newQuery);
        }
      },
    },
    methods: {
      getSuggestionWords: helpers.debounce(300, async function getSuggestionWords(query) {
        this.indicatorVisible = true;
        this.suggestionWords.length = 0;

        try {
          (await data.getSuggestion(query)).data.forEach((r, i) => {
            this.suggestionWords.push({
              text: r,
              selected: i === 0,
            });
          });
        } finally {
          this.indicatorVisible = false;
        }
      }, true),
      getDefinitions: helpers.debounce(300, async function getDefinitions(word) {
        const youdaoTask = data.getYoudaoDefinition(word);
        const icibaTask = data.getIcibaDefinition(word);

        this.indicatorVisible = true;
        this.definitions.length = 0;
        youdaoTask.then(({ data }) => this.definitions.push(helpers.formatYoudaoDefinition(data)));
        icibaTask.then(({ data }) => this.definitions.push(helpers.formatIcibaDefinition(data)));
        try {
          await Promise.all([youdaoTask, icibaTask]);
        } finally {
          this.indicatorVisible = false;
        }
      }, true),
      selectAndFocusSearchInput() {
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(this.$refs.input);
        selection.removeAllRanges();
        selection.addRange(range);
      },
      handleWordListChange(newWord) {
        this.getDefinitions(newWord);
      },
      handleSearchInputKeyUp(ev) {
        this.query = ev.currentTarget.textContent.trim();
      },
      handleSearchInputBlur() {
        window.getSelection().removeAllRanges();
      },
      handleSearchInputKeyDown(ev) {
        const { keyCode } = ev;

        if (keyCode === 13) {
          this.selectAndFocusSearchInput();
          ev.preventDefault();
        }
      },
      handleGlobalKeyDown(ev) {
        const { key } = ev;

        if (document.activeElement === this.$refs.input) {
          return;
        }
        if (key && key.length === 1) {
          this.selectAndFocusSearchInput();
        }
      },
    },
    mounted() {
      this.$refs.input.focus();
      document.addEventListener('keydown', this.handleGlobalKeyDown);
    },
    destroyed() {
      document.removeEventListener('keydown', this.handleGlobalKeyDown);
    },
  };
</script>

<style lang="scss">
  .home {
    & {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    &__content {
      flex: 1;
      display: flex;
    }

    &__welcome {
      flex: 1;
    }

    &__word-list {
      border-right: solid 1px #E5E5E5;
    }

    &__definition-list {
      flex: 1;
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      margin-right: 5px;
    }

    &__indicator {
      width: 22px;
      height: 22px;
      margin-right: 0.5rem;
      background-color: #fff;
    }

    &__search {
      width: 36.8%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    &__input {
      height: 22px;
      line-height: 22px;
      min-height: auto;
      width: 100%;
      padding: 0 5px;
      border:none;
      white-space: nowrap;
      overflow: hidden;
    }

    &__input br {
      display: none;
    }

    &__input * {
      display: inline;
      white-space: nowrap;
    }

    &__placeholder {
      font-weight: 300;
      color: #CBCBCB;
      visibility: hidden;
      pointer-events: none;
      text-align: center;
      line-height: 15px;
      position: absolute;
    }

    &__placeholder-icon,
    &__placeholder-text {
      vertical-align: middle;
    }

    // state
    // =====
    &__input:empty + &__placeholder {
      visibility: visible;
    }
  }
</style>

