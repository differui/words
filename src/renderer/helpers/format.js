import * as cfgs from '../configs';

export function formatIcibaDefinition(definition) {
  const { key, ps, acceptation = [], pos, sent = [] } = definition.dict;

  return {
    type: cfgs.DICTIONARY_ICIBA,
    text: key[0],
    phonetic: {
      uk: ps[0],
      us: ps[1],
    },
    explains: acceptation.map((a, i) => `${pos[i]} ${a}`),
    examples: sent.map(s => ({
      key: s.orig[0],
      value: [
        s.trans[0],
      ],
    })),
  };
}

export function formatYoudaoDefinition(definition) {
  const { basic, query } = definition;

  return {
    type: cfgs.DICTIONARY_YOUDAO,
    text: query,
    phonetic: {
      uk: basic['uk-phonetic'],
      us: basic['us-phonetic'],
    },
    explains: definition.basic.explains,
    examples: definition.web,
  };
}
