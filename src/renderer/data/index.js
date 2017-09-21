import Vue from 'vue';
import * as cfgs from '@/configs';

const GET_DATA_TIMESTAMP_MAP = {};

async function getData(data, successEvent, doneEvent) {
  const electron = Vue.prototype.$electron;

  return new Promise((resolve, reject) => {
    const s = Date.now();

    GET_DATA_TIMESTAMP_MAP[successEvent] = s;
    electron.ipcRenderer.send(successEvent, {
      data,
      s,
    });
    electron.ipcRenderer.once(doneEvent, (ev, result) => {
      const { error, data, s } = result;

      if (GET_DATA_TIMESTAMP_MAP[successEvent] !== s) {
        return;
      }
      if (data) {
        resolve({
          data,
          error: null,
        });
      } else {
        reject({
          data: null,
          error,
        });
      }
    });
  });
}

export async function getSuggestion(query) {
  return getData(query, cfgs.EV_DATA_SUGGESTION, cfgs.EV_DATA_SUGGESTION_DONE);
}

export async function getIcibaDefinition(word) {
  return getData(word, cfgs.EV_DATA_ICIBA, cfgs.EV_DATA_ICIBA_DONE);
}

export async function getYoudaoDefinition(word) {
  return getData(word, cfgs.EV_DATA_YOUDAO, cfgs.EV_DATA_YOUDAO_DONE);
}

export async function getDictionaryDefinition(word) {
  return getData(word, cfgs.EV_DATA_DICTIONARY, cfgs.EV_DATA_DICTIONARY_DONE);
}
