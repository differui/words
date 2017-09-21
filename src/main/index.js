import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import { parseString } from 'xml2js';
import * as cfgs from '../renderer/configs';
import * as helpers from '../renderer/helpers';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 563,
    minWidth: 600,
    minHeight: 300,
    frame: false,
    useContentSize: true,
    titleBarStyle: 'hidden',
  });

  mainWindow.loadURL(winURL);

  mainWindow.on(cfgs.EV_APP_CLOSED, () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on(cfgs.EV_APP_ALL_CLOSED, () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on(cfgs.EV_APP_ACTIVATE, () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(cfgs.EV_DATA_SUGGESTION, async (ev, { s, data: query }) => {
  const matchRawRe = /form.updateCall\("([^"]*)"\)/im;
  const matchRecordRe = />(\w+)<\/td>/img;

  try {
    const rtn = await helpers.get(`http://dsuggest.ydstatic.com/suggest.s?query=${query}&keyfrom=dict2.index.suggest&o=form&rn=10&h=12&le=eng`);
    const matchRawResult = rtn.toString('utf-8').match(matchRawRe);
    const raw = matchRawResult ? unescape(matchRawResult[1]) : '';
    const records = [];
    let matchRecordResult = matchRecordRe.exec(raw);

    while (raw && matchRecordResult) {
      records.push(matchRecordResult[1]);
      matchRecordResult = matchRecordRe.exec(raw);
    }
    ev.sender.send(cfgs.EV_DATA_SUGGESTION_DONE, {
      s,
      error: null,
      data: records,
    });
  } catch (error) {
    ev.sender.send(cfgs.EV_DATA_SUGGESTION_DONE, {
      s,
      error,
      data: null,
    });
  }
});

ipcMain.on(cfgs.EV_DATA_ICIBA, async (ev, { s, data: word }) => {
  try {
    const data = await helpers.get(`http://dict-co.iciba.com/api/dictionary.php?key=D191EBD014295E913574E1EAF8E06666&w=${word}`);

    parseString(data, (error, data) => {
      ev.sender.send(cfgs.EV_DATA_ICIBA_DONE, {
        s,
        error,
        data,
      });
    });
  } catch (error) {
    ev.sender.send(cfgs.EV_DATA_ICIBA_DONE, {
      s,
      error,
      data: null,
    });
  }
});

ipcMain.on(cfgs.EV_DATA_YOUDAO, async (ev, { s, data: word }) => {
  try {
    const data = await helpers.get(`http://fanyi.youdao.com/openapi.do?keyfrom=node-fanyi&key=110811608&type=data&doctype=json&version=1.1&q=${word}`);

    ev.sender.send(cfgs.EV_DATA_YOUDAO_DONE, {
      s,
      error: null,
      data: JSON.parse(data),
    });
  } catch (error) {
    ev.sender.send(cfgs.EV_DATA_YOUDAO_DONE, {
      s,
      error,
      data: null,
    });
  }
});

ipcMain.on(cfgs.EV_DATA_DICTIONARY, async (ev, { s, data: word }) => {
  try {
    const data = await helpers.get(`http://www.dictionaryapi.com/api/v1/references/collegiate/xml/${word}?key=82c5d495-ccf0-4e72-9051-5089e85c2975`);

    parseString(data, (error, result) => {
      ev.sender.send(cfgs.EV_DATA_DICTIONARY_DONE, {
        s,
        error,
        data: result,
      });
    });
  } catch (error) {
    ev.sender.send(cfgs.EV_DATA_DICTIONARY_DONE, {
      s,
      error,
      data: null,
    });
  }
});
