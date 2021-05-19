const { APIKey } = require('../config.json');
const fetch = require('node-fetch');

class Util {
  constructor() {
    this.key =  APIKey;
  }
  async requestAPI(address, port, time, method) {
    await fetch(`https://api.astrostress.com/api.php?key=${this.key}&host=${address}&port=${port}&method=${method}&time=${time}`);
  }
}
exports.default = Util;